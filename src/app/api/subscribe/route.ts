
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';


import { createClient } from '@supabase/supabase-js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Supabase Admin Client to bypass RLS
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Use Admin client if available, otherwise fall back to public client (which likely fails RLS)
        const db = supabaseAdmin || supabase;
        console.log(`[API] DB Client: ${supabaseAdmin ? 'Admin (Service Role)' : 'Public (Anon)'}`);

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        // 1. Insert into Supabase (Use INSERT instead of UPSERT to avoid RLS Update issues)
        const { error: dbError } = await db
            .from('subscribers')
            .insert({ email, active: true });

        if (dbError) {
            console.error('DB Insert Error:', dbError);

            // Handle unique constraint (already subscribed)
            if (dbError.code === '23505') {
                return NextResponse.json({ success: true, message: 'You are already on the list.' });
            }

            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }


        // 2. Send Welcome Email (using Raw HTML to ensure reliability)
        if (resend) {
            try {
                const welcomeHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Welcome to FireWatch Global</title>
                </head>
                <body style="background-color: #ffffff; font-family: sans-serif; margin: 0 auto; padding: 40px 20px;">
                    <div style="max-width: 465px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px;">
                        <!-- Header -->
                        <div style="margin-top: 32px; text-align: center;">
                            <h1 style="color: #000000; font-size: 24px; font-weight: bold; margin: 30px 0; text-transform: uppercase; letter-spacing: 0.1em;">
                                FireWatch <span style="color: #D32F2F;">Global</span>
                            </h1>
                        </div>

                        <!-- Welcome Message -->
                        <div style="margin-bottom: 32px;">
                            <p style="color: #000000; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                Welcome to FireWatch Global.
                            </p>
                            <p style="color: #000000; font-size: 16px; line-height: 24px;">
                                You are now part of a global network dedicated to firefighting intelligence. We monitor the world so you can stay focused on the mission.
                            </p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 26px 0; width: 100%;">

                        <!-- Pillars -->
                        <div style="margin-bottom: 32px;">
                            <h2 style="color: #000000; font-size: 16px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em;">
                                Our Pillars
                            </h2>
                            
                            <div style="margin-bottom: 16px;">
                                <p style="color: #D32F2F; font-size: 14px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">01. Global Operations</p>
                                <p style="color: #4b5563; font-size: 14px; margin-top: 4px;">Real-time incident analysis and strategic operational shifts.</p>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <p style="color: #D32F2F; font-size: 14px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">02. The Health Ledger</p>
                                <p style="color: #4b5563; font-size: 14px; margin-top: 4px;">Tracking presumptive legislation and long-term wellness data.</p>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <p style="color: #D32F2F; font-size: 14px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">03. Innovation Reports</p>
                                <p style="color: #4b5563; font-size: 14px; margin-top: 4px;">The latest in apparatus engineering and tactical software.</p>
                            </div>
                        </div>

                        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 26px 0; width: 100%;">

                        <!-- Call to Action -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="http://localhost:3000" style="background-color: #10b981; border-radius: 4px; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 20px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                                Explore the Dashboard
                            </a>
                        </div>

                        <p style="color: #666666; font-size: 12px; line-height: 24px; margin-top: 32px; text-align: center;">
                            © 2025 FireWatch Global. Stay Safe.
                        </p>
                    </div>
                </body>
                </html>
                `;

                console.log(`📨 Sending welcome email to ${email}...`);
                const { data, error } = await resend.emails.send({
                    from: 'FireWatch Global <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Welcome to FireWatch Global',
                    html: welcomeHtml,
                });

                if (error) {
                    console.error('Welcome Email Failed:', error);
                } else {
                    console.log('Welcome Email Sent:', data);
                }
            } catch (emailError) {
                console.error('Email Send Exception:', emailError);
            }
        }

        return NextResponse.json({ success: true, message: 'Welcome to the brotherhood' });

    } catch (error) {
        console.error('Subscribe Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
