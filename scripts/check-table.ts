
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTable() {
    console.log("Checking for 'scout_status' table...");
    try {
        const { error } = await supabase
            .from('scout_status')
            .select('*')
            .limit(1);

        if (error) {
            console.error("❌ Error fetching scout_status:", error.message);
        } else {
            console.log("✅ Table 'scout_status' exists and is accessible.");
        }
    } catch (e) {
        console.error("Crash:", e);
    }
}

checkTable();
