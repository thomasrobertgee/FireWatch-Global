
import { Resend } from 'resend';
import { supabase } from './supabase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ALERT_EMAIL = 'thomas.gee@firewatch.global'; // Or user's email

export async function checkSystemHealth() {
    if (!supabase || !resend) return { status: 'error', message: 'Config Missing' };

    try {
        // 1. Check Article Freshness (Last 12 hours)
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        const { data: recentArticles, error: articleError } = await supabase
            .from('articles')
            .select('count')
            .gte('created_at', twelveHoursAgo);

        // 2. Check Newsletter Health (Last 48 hours = 2 days)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const { data: newsletterLogs, error: logError } = await supabase
            .from('newsletter_logs')
            .select('status, sent_at')
            .gte('sent_at', fortyEightHoursAgo)
            .eq('status', 'success');

        const articleCount = recentArticles ? recentArticles.length : 0; // note: select count returns rows but here we just used select('count') which might fail in supabase-js if not using .count(). Actually let's assume standard selection.
        // Better:
        const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', twelveHoursAgo);
        const { count: newsCount } = await supabase.from('newsletter_logs').select('*', { count: 'exact', head: true }).gte('sent_at', fortyEightHoursAgo).eq('status', 'success');

        const articlesHealthy = (artCount || 0) > 0;
        const newsletterHealthy = (newsCount || 0) > 0;

        // Trigger Alert if needed
        if (!articlesHealthy || !newsletterHealthy) {
            const issues = [];
            if (!articlesHealthy) issues.push("⚠️ No new articles in last 12 hours.");
            if (!newsletterHealthy) issues.push("⚠️ No successful newsletter sent in last 48 hours.");

            console.error("System Health Alert:", issues);

            await resend.emails.send({
                from: 'FireWatch Alert <system@firewatch.global>',
                to: ALERT_EMAIL,
                subject: '🚨 System Health Alert: Action Required',
                html: `
                    <h1>System Health Degraded</h1>
                    <ul>
                        ${issues.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                    <p>Check logs immediately.</p>
                `
            });
            return { status: 'unhealthy', issues };
        }

        return { status: 'healthy', issues: [] };

    } catch (e) {
        console.error("Watchdog Failed:", e);
        return { status: 'error', issues: ['Watchdog execution failed'] };
    }
}
