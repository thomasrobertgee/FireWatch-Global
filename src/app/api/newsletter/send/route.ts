
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { getDailyArticles, generateIntro, generateEmailHtml } from '@/services/newsletterService';

// Initialize Resend directly here to ensure we have access
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const maxDuration = 300; // Allow 5 minutes for AI/Sending

export async function GET(request: Request) {
    try {
        // 1. Security Check
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!resend) {
            return new NextResponse('Resend API Key Missing', { status: 500 });
        }

        // 2. Fetch Content
        const articles = await getDailyArticles();
        const intro = await generateIntro();
        const baseHtml = generateEmailHtml(intro, articles);

        const articleTitles = articles.map(a => a.title);

        // 3. Fetch Subscribers
        if (!supabase) return new NextResponse('Database Error', { status: 500 });

        const { data: subscribers, error: subError } = await supabase
            .from('subscribers')
            .select('email')
            .eq('active', true);

        if (subError || !subscribers) {
            return new NextResponse('Failed to fetch subscribers', { status: 500 });
        }

        if (subscribers.length === 0) {
            return NextResponse.json({ message: 'No active subscribers', count: 0 });
        }

        // 4. Prepare Batch Payload
        // We handle batching in chunks of 50 to be safe (Resend limit is 100)
        const BATCH_SIZE = 50;
        const recipientCount = subscribers.length;

        // Chunk the subscribers
        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const chunk = subscribers.slice(i, i + BATCH_SIZE);

            const payload = chunk.map(sub => ({
                from: 'FireWatch Global <onboarding@resend.dev>',
                to: sub.email,
                subject: `Shift Change Report: ${new Date().toLocaleDateString()}`,
                html: baseHtml.replace('{{email_encoded}}', encodeURIComponent(sub.email)),
            }));

            // 5. Send Batch
            await resend.batch.send(payload);
        }

        // 6. Log to Database
        // Note: logs table might vary, adapting to user request
        const { error: logError } = await supabase
            .from('newsletter_logs')
            .insert({
                recipient_count: recipientCount,
                subjects: articleTitles,
                status: 'success'
            });

        if (logError) {
            console.error('Failed to log newsletter send:', logError);
            // Don't fail the request if just logging failed
        }

        return NextResponse.json({
            message: 'Newsletter sent successfully',
            count: recipientCount,
            intro: intro
        });

    } catch (error) {
        console.error('Newsletter Send Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
