CREATE TABLE IF NOT EXISTS scout_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL,
    last_run_at TIMESTAMP WITH TIME ZONE,
    triggered_by TEXT DEFAULT 'CRON'
);

-- Optional: Enable RLS but allow Service Role to access
ALTER TABLE scout_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON scout_status FOR SELECT USING (true);
-- Write access only for service role (which Admin API uses)
