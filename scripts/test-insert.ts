
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testInsert() {
    const { supabase } = await import('../src/lib/supabase');

    if (!supabase) {
        console.error("Supabase not initialized");
        return;
    }

    console.log("🧪 Testing Supabase Insert...");
    const email = `test_script_${Date.now()}@example.com`;

    const { data, error } = await supabase
        .from('subscribers')
        .insert({ email, active: true })
        .select();

    if (error) {
        console.error("❌ Link failed:", error.message);
        console.error("Details:", error);
    } else {
        console.log("✅ Insert successful:", data);
    }
}

testInsert();
