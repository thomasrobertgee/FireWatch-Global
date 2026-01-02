-- Add new columns for Regional Intelligence
ALTER TABLE articles
ADD COLUMN region TEXT DEFAULT 'Global',
ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;

-- Optional: Create an index on region for faster filtering
CREATE INDEX idx_articles_region ON articles(region);
