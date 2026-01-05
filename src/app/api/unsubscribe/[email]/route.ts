
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ email: string }> } // Correct Next.js 15+ param typing
) {
    const p = await params;
    const email = decodeURIComponent(p.email);

    if (!supabase) {
        return new NextResponse('Database Error', { status: 500 });
    }

    // Deactivate subscriber
    const { error } = await supabase
        .from('subscribers')
        .update({ active: false })
        .eq('email', email);

    if (error) {
        return new NextResponse('Failed to unsubscribe', { status: 500 });
    }

    // Return a simple HTML confirmation page
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Unsubscribed</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f9fafb; color: #111; }
                .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
                h1 { color: #dc2626; margin-bottom: 1rem; }
                a { color: #666; text-decoration: underline; font-size: 0.875rem; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Unsubscribed</h1>
                <p>You have been successfully removed from the <strong>FireWatch Global</strong> briefing list.</p>
                <p>We're sorry to see you go.</p>
                <br>
                <a href="/">Return to Home</a>
            </div>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    });
}
