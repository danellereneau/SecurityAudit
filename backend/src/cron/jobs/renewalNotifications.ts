import { prisma } from '../../server';
import { addDays } from 'date-fns';

export async function generateRenewalNotifications() {
  // Get all users
  const users = await prisma.user.findMany({
    include: {
      preferences: true,
      subscriptions: {
        where: {
          status: 'active',
          autoRenewal: true,
        },
      },
    },
  });

  for (const user of users) {
    const reminderDays = user.preferences?.renewalReminderDays || [7, 1];

    for (const subscription of user.subscriptions) {
      const nextBilling = new Date(subscription.nextBillingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check each reminder day
      for (const days of reminderDays) {
        const reminderDate = addDays(today, days);

        // If next billing date matches reminder date
        if (nextBilling.toDateString() === reminderDate.toDateString()) {
          // Check if notification already exists
          const existing = await prisma.notification.findFirst({
            where: {
              userId: user.id,
              subscriptionId: subscription.id,
              type: 'renewal_reminder',
              scheduledFor: {
                gte: today,
                lt: addDays(today, 1),
              },
            },
          });

          if (!existing) {
            // Create notification
            await prisma.notification.create({
              data: {
                userId: user.id,
                subscriptionId: subscription.id,
                type: 'renewal_reminder',
                title: `Upcoming renewal: ${subscription.name}`,
                message: `Your ${subscription.name} subscription will renew in ${days} day${days > 1 ? 's' : ''} for ${subscription.currency} ${subscription.price}`,
                priority: days === 1 ? 'high' : 'normal',
                scheduledFor: today,
                deliveryMethod: user.preferences?.enableEmailNotifications ? 'both' : 'in_app',
              },
            });
          }
        }
      }
    }
  }
}
