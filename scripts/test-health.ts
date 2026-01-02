import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('Starting Health Ledger Sync...');
    const { runHealthScraper } = await import('../src/services/healthScraper');
    await runHealthScraper();
    console.log('Sync Complete.');
}

main();
