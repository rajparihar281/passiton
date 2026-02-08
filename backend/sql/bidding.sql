-- Bidding Sessions Table
CREATE TABLE bidding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('item', 'service')),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  winning_bid_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (listing_id) REFERENCES items(id) ON DELETE CASCADE,
  UNIQUE(listing_id, listing_type)
);

-- Bids Table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES bidding_sessions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidding Chat Messages Table
CREATE TABLE bidding_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES bidding_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  message_text TEXT,
  message_type VARCHAR(20) DEFAULT 'normal' CHECK (message_type IN ('normal', 'bid', 'system', 'counter_offer')),
  bid_id UUID REFERENCES bids(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_bidding_sessions_listing ON bidding_sessions(listing_id, listing_type);
CREATE INDEX idx_bids_session ON bids(session_id);
CREATE INDEX idx_bidding_messages_session ON bidding_messages(session_id);