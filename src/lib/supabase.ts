import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create the client if we have a URL and an anon key, otherwise return null to prevent runtime crashes
export const supabase = (supabaseUrl && supabaseUrl !== 'your-project-url' && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type ArticleCategory = 'Operations' | 'Welfare' | 'Innovation' | 'Environment' | 'Health_Research';

export interface DBArticle {
    id: string;
    created_at: string;
    title: string;
    category: ArticleCategory;
    summary_bullets: string[]; // JSONB in DB, mapped to string[] here
    full_text?: string;
    source_url: string;
    source_name: string;
    image_url?: string;
    region?: string;
    tags?: string[];
}
