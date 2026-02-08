-- Add ends_at column to bidding_sessions table
ALTER TABLE bidding_sessions 
ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;

-- Add index for ends_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_bidding_sessions_ends_at ON bidding_sessions(ends_at);

-- Update the close_expired_sessions function to use ends_at
CREATE OR REPLACE FUNCTION close_expired_sessions()
RETURNS void AS $$
  UPDATE bidding_sessions
  SET is_active = false, closed_at = NOW()
  WHERE is_active = true 
  AND ends_at IS NOT NULL
  AND ends_at <= NOW();
$$ LANGUAGE SQL;

SELECT 'ends_at column added successfully!' as status;
