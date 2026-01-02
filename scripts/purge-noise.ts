import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function purgeNoise() {
    const { supabase } = await import('../src/lib/supabase');

    if (!supabase) {
        console.error('ERROR: Supabase client not initialized.');
        process.exit(1);
    }

    const keywords = ['Walz', 'Trump', 'Biden', 'Political', 'under fire'];
    console.log(`Starting purge for keywords: ${keywords.join(', ')}`);

    // Fetch all articles
    const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('*');

    if (fetchError) {
        console.error('Error fetching articles:', fetchError);
        process.exit(1);
    }

    console.log(`Found ${articles?.length || 0} total articles. Filtering...`);

    const toDeleteIds: string[] = [];

    for (const article of articles || []) {
        const title = article.title || '';
        const summary = JSON.stringify(article.summary_bullets || []);

        const isNoise = keywords.some(k =>
            title.includes(k) || summary.includes(k)
        );

        if (isNoise) {
            console.log(`Marking for deletion: ${title}`);
            toDeleteIds.push(article.id);
        }
    }

    if (toDeleteIds.length === 0) {
        console.log('No noisy articles found.');
        process.exit(0);
    }

    console.log(`Deleting ${toDeleteIds.length} articles...`);

    const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .in('id', toDeleteIds);

    if (deleteError) {
        console.error('Error deleting articles (RLS policy might be missing DELETE permission):', deleteError);
        process.exit(1);
    } else {
        console.log('Purge complete.');
        process.exit(0);
    }
}

purgeNoise();
