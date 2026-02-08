-- ============================================
-- PassItOn Bidding System - Complete Setup
-- ============================================

-- Drop existing tables if needed (CAUTION: This deletes data)
-- DROP TABLE IF EXISTS bidding_messages CASCADE;
-- DROP TABLE IF EXISTS bids CASCADE;
-- DROP TABLE IF EXISTS bidding_sessions CASCADE;

-- ============================================
-- 1. Bidding Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS bidding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('item', 'service')),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  winning_bid_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(listing_id, listing_type)
);

-- ============================================
-- 2. Bids Table
-- ============================================
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES bidding_sessions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Bidding Chat Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS bidding_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES bidding_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  message_text TEXT,
  message_type VARCHAR(20) DEFAULT 'normal' CHECK (message_type IN ('normal', 'bid', 'system', 'counter_offer')),
  bid_id UUID REFERENCES bids(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. Performance Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bidding_sessions_listing ON bidding_sessions(listing_id, listing_type);
CREATE INDEX IF NOT EXISTS idx_bidding_sessions_owner ON bidding_sessions(owner_id);
CREATE INDEX IF NOT EXISTS idx_bidding_sessions_active ON bidding_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_bids_session ON bids(session_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount DESC);

CREATE INDEX IF NOT EXISTS idx_bidding_messages_session ON bidding_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_bidding_messages_created ON bidding_messages(created_at DESC);

-- ============================================
-- 5. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE bidding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidding_messages ENABLE ROW LEVEL SECURITY;

-- Bidding Sessions Policies
CREATE POLICY "Anyone can view active bidding sessions"
  ON bidding_sessions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can create bidding sessions"
  ON bidding_sessions FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their bidding sessions"
  ON bidding_sessions FOR UPDATE
  USING (auth.uid() = owner_id);

-- Bids Policies
CREATE POLICY "Anyone can view bids in active sessions"
  ON bids FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bidding_sessions 
      WHERE id = bids.session_id AND is_active = true
    )
  );

CREATE POLICY "Authenticated users can place bids"
  ON bids FOR INSERT
  WITH CHECK (
    auth.uid() = bidder_id AND
    EXISTS (
      SELECT 1 FROM bidding_sessions 
      WHERE id = bids.session_id 
      AND is_active = true 
      AND owner_id != auth.uid()
    )
  );

CREATE POLICY "Bidders can update their own bids"
  ON bids FOR UPDATE
  USING (auth.uid() = bidder_id);

-- Messages Policies
CREATE POLICY "Anyone can view messages in active sessions"
  ON bidding_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bidding_sessions 
      WHERE id = bidding_messages.session_id AND is_active = true
    )
  );

CREATE POLICY "Authenticated users can send messages"
  ON bidding_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id OR sender_id IS NULL
  );

-- ============================================
-- 6. Helpful Views
-- ============================================

-- View: Active Bidding Sessions with Stats
CREATE OR REPLACE VIEW active_bidding_sessions AS
SELECT 
  bs.*,
  COUNT(DISTINCT b.bidder_id) as total_bidders,
  COUNT(b.id) FILTER (WHERE b.status = 'active') as active_bids,
  MAX(b.amount) FILTER (WHERE b.status = 'active') as highest_bid,
  MIN(b.amount) FILTER (WHERE b.status = 'active') as lowest_bid
FROM bidding_sessions bs
LEFT JOIN bids b ON bs.id = b.session_id
WHERE bs.is_active = true
GROUP BY bs.id;

-- View: Bid Leaderboard per Session
CREATE OR REPLACE VIEW bid_leaderboard AS
SELECT 
  b.*,
  p.full_name,
  p.avatar_url,
  RANK() OVER (PARTITION BY b.session_id ORDER BY b.amount DESC) as rank
FROM bids b
JOIN profiles p ON b.bidder_id = p.id
WHERE b.status = 'active'
ORDER BY b.session_id, rank;

-- ============================================
-- 7. Utility Functions
-- ============================================

-- Function: Get highest bid for a session
CREATE OR REPLACE FUNCTION get_highest_bid(p_session_id UUID)
RETURNS DECIMAL(10,2) AS $$
  SELECT COALESCE(MAX(amount), 0)
  FROM bids
  WHERE session_id = p_session_id AND status = 'active';
$$ LANGUAGE SQL STABLE;

-- Function: Count active bidders
CREATE OR REPLACE FUNCTION count_active_bidders(p_session_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT bidder_id)
  FROM bids
  WHERE session_id = p_session_id AND status = 'active';
$$ LANGUAGE SQL STABLE;

-- Function: Auto-close expired sessions (for future timer feature)
CREATE OR REPLACE FUNCTION close_expired_sessions()
RETURNS void AS $$
  UPDATE bidding_sessions
  SET is_active = false, closed_at = NOW()
  WHERE is_active = true 
  AND created_at < NOW() - INTERVAL '24 hours';
$$ LANGUAGE SQL;

-- ============================================
-- 8. Triggers
-- ============================================

-- Trigger: Prevent owner from bidding
CREATE OR REPLACE FUNCTION prevent_owner_bidding()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bidding_sessions 
    WHERE id = NEW.session_id AND owner_id = NEW.bidder_id
  ) THEN
    RAISE EXCEPTION 'Owner cannot bid on their own listing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_owner_bidding
  BEFORE INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION prevent_owner_bidding();

-- ============================================
-- 9. Sample Data (Optional - for testing)
-- ============================================

-- Uncomment to insert test data
/*
-- Insert test bidding session
INSERT INTO bidding_sessions (listing_id, listing_type, owner_id)
VALUES (
  (SELECT id FROM items LIMIT 1),
  'item',
  (SELECT id FROM profiles WHERE email = 'owner@test.com')
);

-- Insert test bids
INSERT INTO bids (session_id, bidder_id, amount)
VALUES 
  ((SELECT id FROM bidding_sessions LIMIT 1), (SELECT id FROM profiles WHERE email = 'bidder1@test.com'), 100),
  ((SELECT id FROM bidding_sessions LIMIT 1), (SELECT id FROM profiles WHERE email = 'bidder2@test.com'), 120),
  ((SELECT id FROM bidding_sessions LIMIT 1), (SELECT id FROM profiles WHERE email = 'bidder3@test.com'), 150);
*/

-- ============================================
-- Setup Complete!
-- ============================================

SELECT 'Bidding system tables created successfully!' as status;
