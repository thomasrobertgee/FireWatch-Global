
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testStats() {
    const { supabase } = await import('../src/lib/supabase');

    if (!supabase) {
        console.error("Supabase not initialized");
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString();

    // 1. Total Articles 24h
    const { count: total, error: err1 } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateStr);

    // 2. Health Entries 24h
    const { count: health, error: err2 } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'Health_Research')
        .gte('created_at', dateStr);

    // 3. active Zone (Most articles in 24h)
    // Supabase JS doesn't do "GroupBy" easily without writing a view or using .rpc or processing client side.
    // For 50 items, client side processing is fine for this test/demo.
    const { data: recentArticles } = await supabase
        .from('articles')
        .select('region')
        .gte('created_at', dateStr);

    let activeZone = 'Global';
    if (recentArticles && recentArticles.length > 0) {
        const counts: Record<string, number> = {};
        recentArticles.forEach(a => {
            const r = a.region || 'Global';
            counts[r] = (counts[r] || 0) + 1;
        });

        // Find max
        activeZone = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    console.log("--- Daily Intel Stats ---");
    console.log(`Total 24h: ${total}`);
    console.log(`Health 24h: ${health}`);
    console.log(`Active Zone: ${activeZone}`);
    console.log("-------------------------");
}

testStats();
