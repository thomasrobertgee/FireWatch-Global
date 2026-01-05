
import { Resend } from 'resend';
import { supabase, DBArticle } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
// React-Email imports removed in favor of raw HTML function below to ensure reliability
// import { ShiftChangeTemplate } from '../emails/ShiftChangeTemplate';
// import { render } from '@react-email/render';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function generateIntro(): Promise<string> {
    if (!genAI) return "Stay safe on your shift.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: "Write a very short (2 lines max), respectful, and professional greeting for a firefighter starting their shift. Tone: Stoic, brotherhood/sisterhood, safety-focused. Do NOT use cliches like 'Sound the alarm'." }] }]
        });
        return result.response.text().trim();
    } catch (e) {
        console.error("AI Intro Gen Failed:", e);
        return "Stay safe on your shift. Watch out for each other.";
    }
}

export async function getDailyArticles() {
    if (!supabase) return [];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 7); // 7 day window to ensure we have content for demo
    const dateStr = yesterday.toISOString();

    // Helper to fetch one article by category
    const fetchOne = async (categories: string[]) => {
        if (!supabase) return undefined;
        const { data } = await supabase
            .from('articles')
            .select('*')
            .in('category', categories)
            .gte('created_at', dateStr)
            .order('created_at', { ascending: false })
            .limit(1);
        return data?.[0] as DBArticle | undefined;
    };

    const op = await fetchOne(['Operations', 'Environment']);
    const health = await fetchOne(['Health_Research']);
    const welfare = await fetchOne(['Welfare', 'Innovation']);

    return [op, health, welfare].filter(Boolean) as DBArticle[];
}


// Raw HTML Template Generator to bypass React-Email compilation issues
export function generateEmailHtml(intro: string, articles: DBArticle[]) {
    const articleHtml = articles.map(a => `
        <div style="margin-bottom: 24px;">
            <p style="color: #9ca3af; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
                ${a.category}
            </p>
            <a href="${a.source_url}" style="color: #000000; font-size: 16px; font-weight: bold; text-decoration: none; display: block; margin-top: 4px; margin-bottom: 8px;">
                ${a.title}
            </a>
            <p style="color: #4b5563; font-size: 14px; line-height: 24px; margin: 0;">
                ${a.summary_bullets?.[0] || "No summary available."}
            </p>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>FireWatch Global Shift Report</title>
    </head>
    <body style="background-color: #ffffff; font-family: sans-serif; margin: 0 auto; padding: 40px 20px;">
        <div style="max-width: 465px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px;">
            
            <!-- Header -->
            <div style="margin-top: 32px; text-align: center;">
                <h1 style="color: #000000; font-size: 24px; font-weight: bold; margin: 30px 0; text-transform: uppercase; letter-spacing: 0.1em;">
                    FireWatch <span style="color: #D32F2F;">Global</span>
                </h1>
                <p style="color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 32px;">
                    Shift Change Report
                </p>
            </div>

            <!-- Intro -->
            <div style="margin-bottom: 32px;">
                <p style="color: #000000; font-size: 16px; line-height: 24px; font-style: italic; border-left: 4px solid #D32F2F; padding-left: 16px; margin: 0;">
                    "${intro}"
                </p>
            </div>

            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 26px 0; width: 100%;">

            <!-- Briefings -->
            <h2 style="color: #000000; font-size: 18px; font-weight: bold; margin: 30px 0; text-transform: uppercase; letter-spacing: 0.1em;">
                Top 3 Briefings
            </h2>

            ${articles.length > 0 ? articleHtml : '<p style="color: #6b7280;">No major briefings for this shift.</p>'}

            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 26px 0; width: 100%;">

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="http://localhost:3000/health-ledger" style="background-color: #10b981; border-radius: 4px; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 20px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                    View Health Ledger
                </a>
            </div>

            <div style="text-align: center; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <p style="color: #6b7280; font-size: 11px; margin-bottom: 8px;">
                    © 2026 FireWatch Global. Stay Safe.
                </p>
                <p style="font-size: 11px; color: #9ca3af;">
                    You received this email because you signed up for our daily briefing.
                    <br>
                    <a href="http://localhost:3000/api/unsubscribe/{{email_encoded}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export async function sendShiftChangeReport() {
    if (!resend) {
        console.log("No RESEND_API_KEY. Skipping email send.");
        return;
    }

    console.log("📨 Preparing Shift Change Report...");

    // 1. Get Data
    const articles = await getDailyArticles();

    console.log(`Found ${articles.length} articles for the report.`);
    articles.forEach(a => console.log(`- [${a.category}] ${a.title}`));

    if (articles.length === 0) {
        console.log("No articles new enough to report.");
    }

    const intro = await generateIntro();

    // 2. Render Email (Raw HTML)
    const emailHtml = generateEmailHtml(intro, articles);

    // 3. Get Subscribers
    if (!supabase) {
        console.error("Supabase not initialized.");
        return;
    }

    const { data: subscribers } = await supabase
        .from('subscribers')
        .select('email')
        .eq('active', true);

    if (!subscribers || subscribers.length === 0) {
        console.log("No active subscribers.");
        return;
    }

    console.log(`Sending to ${subscribers.length} subscribers...`);

    // 4. Send
    for (const sub of subscribers) {
        try {
            const data = await resend.emails.send({
                from: 'FireWatch Global <onboarding@resend.dev>',
                to: [sub.email],
                subject: `Shift Change Report: ${new Date().toLocaleDateString()}`,
                html: emailHtml.replace('{{email_encoded}}', encodeURIComponent(sub.email)),
            });
            console.log(`Sent to ${sub.email}:`, data);
        } catch (error) {
            console.error(`Failed to send to ${sub.email}:`, error);
        }
    }
}
