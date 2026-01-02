
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function resetSubscribers() {
    // Use Service Role Key to bypass RLS for deletion
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    console.log("🔥 Initialized Admin Client for cleanup...");

    console.log("🗑️ Clearing subscribers table...");
    const { error, count } = await supabase
        .from('subscribers')
        .delete()
        .neq('email', 'placeholder_that_matches_nothing'); // delete all logic usually requires a filter in Supabase client unless RLS allows otherwise, checking effectively "all"

    // Actually, Supabase client prevents "delete all" without a where clause for safety.
    // We can just use .neq('id', '00000000-0000-0000-0000-000000000000') or similar if UUID.
    // Or just .gt('created_at', '1970-01-01')

    const { error: err2 } = await supabase
        .from('subscribers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (err2) {
        console.error("Error clearing table:", err2);
    } else {
        console.log("✅ Subscribers table cleared.");
    }
}

resetSubscribers();
