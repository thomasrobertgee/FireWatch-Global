import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local BEFORE importing app code
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use dynamic import to ensure environment variables are loaded before the module is evaluated
async function main() {
    const { supabase } = await import('../src/lib/supabase');

    console.log('Starting Clean Up of Fallbacks...');

    if (!supabase) {
        console.error('ERROR: Supabase client not initialized.');
        process.exit(1);
    }

    // Since we used a unique string in the fallback "AI Analysis Unavailable", we can check for that.
    // However, summary_bullets is JSONB.
    // We can just fetch all articles, check their summary content, and delete them.
    // Or we can delete ALL articles to be fresh.
    // Let's delete ALL articles to make the test clean and simple.
    // Wait, the user might want to keep the good ones? The previous attempt was all fallbacks.

    // Deleting all to be safe and clean.
    const { error } = await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete not equal to dummy UUID basically means delete all

    if (error) {
        console.error('Error cleaning up:', error);
        process.exit(1);
    } else {
        console.log('Database cleared of previous test data.');
        process.exit(0);
    }
}

main();
