-- Create a text search function
-- We concatenate title, content, and cast JSONB summary to text for searching
CREATE OR REPLACE FUNCTION search_articles(keyword text)
RETURNS SETOF articles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM articles
  WHERE
    to_tsvector('english', 
      title || ' ' || 
      coalesce(full_text, '') || ' ' || 
      cast(summary_bullets as text) || ' ' ||
      cast(tags as text)
    )
    @@ websearch_to_tsquery('english', keyword)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;
