
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // In a real app, verify Supabase Admin session here.
    // For now we rely on the client-side component protecting this button,
    // OR we can pass the cron secret if we really want to simulate 'Scout Agent' trigger securely.

    const cronSecret = process.env.CRON_SECRET;
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    if (!cronSecret) {
        return NextResponse.json({ error: 'Server misconfiguration: No CRON_SECRET' }, { status: 500 });
    }

    try {
        // Call the existing scrape route with the secret
        const response = await fetch(`${baseUrl}/api/scrape`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cronSecret}`,
            },
        });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json({ error: `Scraper failed: ${text}` }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
