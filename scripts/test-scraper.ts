
import dotenv from 'dotenv';
import 'tsconfig-paths/register';
dotenv.config({ path: '.env.local' });

// We need to bypass the "process.env" checks inside initClients possibly, 
// or just rely on dotenv loading them.

async function main() {
    console.log("Testing Scraper...");

    // Dynamically import after dotenv config
    const { fetchFireNews, processAndSaveArticle } = await import('../src/services/newsScraper');

    try {
        const apiKey = process.env.NEWS_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;
        console.log("News Key present:", !!apiKey);
        console.log("Gemini Key present:", !!geminiKey);

        if (!apiKey || !geminiKey) {
            console.error("Missing API Keys");
            return;
        }

        const articles = await fetchFireNews();
        console.log(`\nFound ${articles.length} raw articles from NewsAPI.`);

        if (articles.length === 0) {
            console.log("No articles found. Check NewsAPI query or rate limits.");
            return;
        }

        // Print dates of first few articles
        console.log("\nTop 5 Articles found:");
        articles.slice(0, 5).forEach((a, i) => {
            console.log(`[${i + 1}] ${a.title} (${a.source})`);
        });

        console.log("\nRunning Dry Run of AI processing on TOP 5 articles...");

        for (const article of articles.slice(0, 5)) {
            console.log(`\n--- Processing: ${article.title} ---`);
            try {
                await processAndSaveArticle(article);
            } catch (e) {
                console.error(`Failed to process ${article.title}:`, e);
            }
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

main();
