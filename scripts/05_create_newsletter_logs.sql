
-- Create newsletter_logs table
CREATE TABLE IF NOT EXISTS newsletter_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipient_count INTEGER NOT NULL,
    status TEXT DEFAULT 'success',
    subjects TEXT[] -- Array of article titles or just the email subject
);

-- Enable RLS (Optional, but good practice)
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (or restrict to service role if we had a dashboard auth)
CREATE POLICY "Allow public read access" ON newsletter_logs FOR SELECT USING (true);
CREATE POLICY "Allow service role insert" ON newsletter_logs FOR INSERT WITH CHECK (true);
