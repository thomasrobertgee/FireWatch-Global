
-- Fix RLS policies for subscribers table
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Drop potential existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert" ON subscribers;
DROP POLICY IF EXISTS "Allow read for everyone (dev)" ON subscribers;
DROP POLICY IF EXISTS "Enable insert for anon" ON subscribers;
DROP POLICY IF EXISTS "Enable read for anon" ON subscribers;
DROP POLICY IF EXISTS "Anon Insert" ON subscribers;
DROP POLICY IF EXISTS "Anon Select" ON subscribers;

-- Create permissive policies for Anon (public) users
CREATE POLICY "Anon Insert"
ON subscribers
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anon Select"
ON subscribers
FOR SELECT
TO anon
USING (true);

-- Also allow authenticated just in case, though anon covers unauthenticated
CREATE POLICY "Auth Insert"
ON subscribers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth Select"
ON subscribers
FOR SELECT
TO authenticated
USING (true);
