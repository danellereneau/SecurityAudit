import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

// Placeholder implementations - to be fully implemented

export const getAllSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.userId },
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: { nextBillingDate: 'asc' },
    });

    res.json({ status: 'success', data: { subscriptions } });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        category: true,
        paymentMethod: true,
        priceHistory: { orderBy: { changedAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    res.json({ status: 'success', data: { subscription } });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        ...req.body,
        userId: req.userId,
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    // Create initial price history
    await prisma.priceHistory.create({
      data: {
        subscriptionId: subscription.id,
        newPrice: subscription.price,
        detectedBy: 'user',
      },
    });

    res.status(201).json({ status: 'success', data: { subscription } });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.subscription.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      throw new AppError('Subscription not found', 404);
    }

    const subscription = await prisma.subscription.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    // Track price change if price updated
    if (req.body.price && req.body.price !== existing.price) {
      await prisma.priceHistory.create({
        data: {
          subscriptionId: subscription.id,
          oldPrice: existing.price,
          newPrice: req.body.price,
          changePercentage: Number(((req.body.price - existing.price.toNumber()) / existing.price.toNumber() * 100).toFixed(2)),
          detectedBy: 'user',
        },
      });
    }

    res.json({ status: 'success', data: { subscription } });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.subscription.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      throw new AppError('Subscription not found', 404);
    }

    await prisma.subscription.delete({
      where: { id: req.params.id },
    });

    res.json({ status: 'success', message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const daysAhead = parseInt(req.query.days as string) || 30;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.userId,
        status: 'active',
        nextBillingDate: {
          gte: today,
          lte: futureDate,
        },
      },
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: { nextBillingDate: 'asc' },
    });

    res.json({ status: 'success', data: { subscriptions } });
  } catch (error) {
    next(error);
  }
};

export const getFreeTrials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.userId,
        isFreeTrial: true,
        status: 'trial',
      },
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: { trialEndDate: 'asc' },
    });

    res.json({ status: 'success', data: { subscriptions } });
  } catch (error) {
    next(error);
  }
};

export const findDuplicates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement duplicate detection algorithm
    res.json({ status: 'success', data: { duplicates: [] } });
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await prisma.subscriptionNote.create({
      data: {
        subscriptionId: req.params.id,
        content: req.body.content,
      },
    });

    res.status(201).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await prisma.subscriptionNote.update({
      where: { id: req.params.noteId },
      data: { content: req.body.content },
    });

    res.json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.subscriptionNote.delete({
      where: { id: req.params.noteId },
    });

    res.json({ status: 'success', message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
