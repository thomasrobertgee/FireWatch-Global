-- Create the category enum
CREATE TYPE article_category AS ENUM ('Operations', 'Welfare', 'Innovation', 'Environment');

-- Create the articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  category article_category NOT NULL,
  summary_bullets JSONB NOT NULL, -- Array of strings
  full_text TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  image_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read articles
CREATE POLICY "Allow public read access"
ON articles
FOR SELECT
TO public
USING (true);
