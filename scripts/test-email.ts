
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testEmail() {
    const { sendShiftChangeReport } = await import('../src/services/newsletterService');
    const { supabase } = await import('../src/lib/supabase');

    console.log("🚀 Triggering Manual Email Test...");

    // Inject test subscriber if needed, otherwise it relies on DB
    // Or we can modify sendShiftChangeReport to accept a test email, but that requires changing service.
    // Let's just create a temporary subscriber in the DB?

    const testEmail = process.env.TEST_EMAIL;
    if (testEmail && supabase) {
        console.log(`Adding test subscriber: ${testEmail}`);
        await supabase.from('subscribers').upsert({ email: testEmail, active: true }, { onConflict: 'email' });
    }

    await sendShiftChangeReport();
    console.log("✅ Test Complete.");
}

testEmail();
