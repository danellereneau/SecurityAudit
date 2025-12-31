import cron from 'node-cron';
import { generateRenewalNotifications } from './jobs/renewalNotifications';
import { generateTrialEndingNotifications } from './jobs/trialNotifications';

export function setupCronJobs() {
  // Run daily at midnight (user's timezone will be handled in the job)
  // Generate renewal reminders
  cron.schedule('0 0 * * *', async () => {
    console.log('🔔 Running renewal notification job...');
    try {
      await generateRenewalNotifications();
      console.log('✅ Renewal notification job completed');
    } catch (error) {
      console.error('❌ Error in renewal notification job:', error);
    }
  });

  // Generate trial ending notifications
  cron.schedule('0 0 * * *', async () => {
    console.log('🔔 Running trial ending notification job...');
    try {
      await generateTrialEndingNotifications();
      console.log('✅ Trial ending notification job completed');
    } catch (error) {
      console.error('❌ Error in trial ending notification job:', error);
    }
  });

  // Clean up old notifications (run weekly on Sunday at 2 AM)
  cron.schedule('0 2 * * 0', async () => {
    console.log('🧹 Running notification cleanup job...');
    try {
      // TODO: Implement cleanup logic
      console.log('✅ Notification cleanup job completed');
    } catch (error) {
      console.error('❌ Error in notification cleanup job:', error);
    }
  });

  console.log('📅 Cron jobs scheduled:');
  console.log('  - Renewal notifications: Daily at midnight');
  console.log('  - Trial ending notifications: Daily at midnight');
  console.log('  - Notification cleanup: Weekly on Sunday at 2 AM');
}
