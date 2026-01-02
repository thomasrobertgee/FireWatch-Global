import cron from 'node-cron';
import { runScraper } from './newsScraper';

console.log('🔥 FireWatch Scout Agent v2.0 Scheduler Started');
console.log('Frequency: Every 4 hours');

// Schedule the task to run every 4 hours
cron.schedule('0 */4 * * *', async () => {
    console.log('⏰ Running scheduled scout mission...');
    try {
        await runScraper();
        console.log('✅ Mission Complete.');
    } catch (error) {
        console.error('❌ Mission Failed:', error);
    }
});

// Schedule Shift Change Report (Newsletter) at 07:00 AM daily
cron.schedule('0 7 * * *', async () => {
    console.log('📬 Delivering Shift Change Reports...');
    const { sendShiftChangeReport } = await import('./newsletterService');
    try {
        await sendShiftChangeReport();
        console.log('✅ Reports Delivered.');
    } catch (error) {
        console.error('❌ Delivery Failed:', error);
    }
});
