import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local BEFORE importing app code
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use dynamic import to ensure environment variables are loaded before the module is evaluated
async function main() {
    const { runScraper } = await import('../src/services/newsScraper');

    console.log('Starting Test Scrape...');

    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY === 'your-news-api-key') {
        console.error('ERROR: Missing NEWS_API_KEY. Please set it in .env.local');
        process.exit(1);
    }

    /* ... rest of checks ... */

    try {
        await runScraper();
        console.log('Scrape finished.');
        process.exit(0);
    } catch (err) {
        console.error('Scrape failed:', err);
        process.exit(1);
    }
}

main();
