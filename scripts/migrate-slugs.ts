
import { createClient } from '@supabase/supabase-js';
import { generateSlug } from '../src/lib/slug';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables for Supabase (URL or Service Key).');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateSlugs() {
    console.log("Starting Slug Migration...");

    // 1. Fetch all articles
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, slug');

    if (error) {
        console.error("Error fetching articles:", error);
        return;
    }

    if (!articles || articles.length === 0) {
        console.log("No articles found.");
        return;
    }

    console.log(`Found ${articles.length} articles.`);

    // 2. Update each
    for (const article of articles) {
        // If slug exists, skip (optional, but good for re-runs)
        if (article.slug) continue;

        const newSlug = generateSlug(article.title);
        console.log(`Migrating: "${article.title.substring(0, 30)}..." -> ${newSlug}`);

        const { error: updateError } = await supabase
            .from('articles')
            .update({ slug: newSlug })
            .eq('id', article.id);

        if (updateError) {
            console.error(`Failed to update article ${article.id}:`, updateError);
        }
    }

    console.log("Migration Complete.");
}

migrateSlugs();
