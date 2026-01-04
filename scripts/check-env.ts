
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log("Checking Environment Variables...");

const keys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEWS_API_KEY',
    'GEMINI_API_KEY',
    'CRON_SECRET',
    'NEXT_PUBLIC_ADMIN_EMAIL'
];

keys.forEach(key => {
    const val = process.env[key];
    if (!val) {
        console.error(`❌ MISSING: ${key}`);
    } else if (val.startsWith('your-')) {
        console.warn(`⚠️  DEFAULT VALUE: ${key} (Value: ${val})`);
    } else {
        console.log(`✅ FOUND: ${key}`);
    }
});
