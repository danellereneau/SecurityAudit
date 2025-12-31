import { prisma } from '../../server';
import { addDays } from 'date-fns';

export async function generateTrialEndingNotifications() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find subscriptions with trials ending in 3 days
  const trialEndingDate = addDays(today, 3);

  const trialSubscriptions = await prisma.subscription.findMany({
    where: {
      isFreeTrial: true,
      status: 'trial',
      trialEndDate: {
        gte: trialEndingDate,
        lt: addDays(trialEndingDate, 1),
      },
    },
    include: {
      user: {
        include: {
          preferences: true,
        },
      },
    },
  });

  for (const subscription of trialSubscriptions) {
    // Check if notification already exists
    const existing = await prisma.notification.findFirst({
      where: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        type: 'trial_ending',
        scheduledFor: {
          gte: today,
          lt: addDays(today, 1),
        },
      },
    });

    if (!existing && subscription.user.preferences?.notifyTrialEndings) {
      await prisma.notification.create({
        data: {
          userId: subscription.userId,
          subscriptionId: subscription.id,
          type: 'trial_ending',
          title: `Trial ending: ${subscription.name}`,
          message: `Your free trial for ${subscription.name} ends in 3 days. You'll be charged ${subscription.currency} ${subscription.price} unless you cancel.`,
          priority: 'high',
          scheduledFor: today,
          deliveryMethod: subscription.user.preferences?.enableEmailNotifications ? 'both' : 'in_app',
        },
      });
    }
  }
}
