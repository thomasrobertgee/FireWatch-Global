
-- Add new columns for enhanced summaries
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS card_summary TEXT,
ADD COLUMN IF NOT EXISTS full_summary TEXT[];

-- Optional: Comment on columns
COMMENT ON COLUMN articles.card_summary IS 'Short, punchy summary max 220 chars for grid view';
COMMENT ON COLUMN articles.full_summary IS 'Comprehensive 5-paragraph summary including quotes';
