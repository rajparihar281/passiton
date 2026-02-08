-- Disable RLS temporarily for service role operations
-- The backend uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
-- But we need proper policies for frontend direct access

-- Enable RLS
ALTER TABLE bidding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidding_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active bidding sessions" ON bidding_sessions;
DROP POLICY IF EXISTS "Owners can create bidding sessions" ON bidding_sessions;
DROP POLICY IF EXISTS "Owners can update their bidding sessions" ON bidding_sessions;
DROP POLICY IF EXISTS "Service role full access sessions" ON bidding_sessions;

DROP POLICY IF EXISTS "Anyone can view bids in active sessions" ON bids;
DROP POLICY IF EXISTS "Authenticated users can place bids" ON bids;
DROP POLICY IF EXISTS "Bidders can update their own bids" ON bids;
DROP POLICY IF EXISTS "Service role full access bids" ON bids;

DROP POLICY IF EXISTS "Anyone can view messages in active sessions" ON bidding_messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON bidding_messages;
DROP POLICY IF EXISTS "Service role full access messages" ON bidding_messages;

-- Bidding Sessions Policies (allow all for service role)
CREATE POLICY "Service role full access sessions"
  ON bidding_sessions
  USING (true)
  WITH CHECK (true);

-- Bids Policies (allow all for service role)
CREATE POLICY "Service role full access bids"
  ON bids
  USING (true)
  WITH CHECK (true);

-- Messages Policies (allow all for service role)
CREATE POLICY "Service role full access messages"
  ON bidding_messages
  USING (true)
  WITH CHECK (true);
