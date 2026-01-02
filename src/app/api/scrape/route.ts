import { NextResponse } from 'next/server';
import { runScraper } from '@/services/newsScraper';
import { runHealthScraper } from '@/services/healthScraper';
import { createClient } from '@supabase/supabase-js';

// Re-init admin client for status updates (similar to subscribe route)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function GET(request: Request) {
    // 1. Security Check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('🤖 Scout Agent Waking Up...');

        // 2. Run Scrapers Parallel
        await Promise.all([
            runScraper(),
            runHealthScraper()
        ]);

        // 3. Update Sync Status
        if (supabaseAdmin) {
            const { error } = await supabaseAdmin
                .from('scout_status')
                .insert({
                    status: 'ACTIVE',
                    last_run_at: new Date().toISOString()
                });

            if (error) console.error('Failed to update status:', error);
        }

        return NextResponse.json({ success: true, message: 'Scrape completed' });
    } catch (err) {
        console.error('Scrape Failed:', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
