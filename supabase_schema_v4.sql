-- Create subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- RLS for subscribers (Public can insert, but only authenticated/admin can read/delete ideally - keeping it simple for now)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
ON subscribers
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow read for everyone (dev)"
ON subscribers
FOR SELECT
TO public
USING (true);
