
-- Create a table to track system status and scraper runs
CREATE TABLE IF NOT EXISTS scout_status (
    id INT PRIMARY KEY DEFAULT 1,
    last_run_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'IDLE', -- IDLE, RUNNING, ERROR
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial row if not exists
INSERT INTO scout_status (id, last_run_at, status)
VALUES (1, NOW(), 'IDLE')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Public Read, Service Role Write)
ALTER TABLE scout_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read status"
ON scout_status FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- Updates only by service role (scraper)
CREATE POLICY "Allow service/admin update status"
ON scout_status FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);
