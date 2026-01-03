-- Run this in your Supabase SQL Editor
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS slug text UNIQUE;
