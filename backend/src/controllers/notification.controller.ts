import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      include: { subscription: true },
      orderBy: { createdAt: 'desc' },
      take: parseInt(req.query.limit as string) || 50,
    });

    res.json({ status: 'success', data: { notifications } });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.userId,
        status: { in: ['pending', 'sent'] },
      },
    });

    res.json({ status: 'success', data: { count } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });

    res.json({ status: 'success', message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.userId,
        status: { in: ['pending', 'sent'] },
      },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });

    res.json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const dismissNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { status: 'dismissed' },
    });

    res.json({ status: 'success', message: 'Notification dismissed' });
  } catch (error) {
    next(error);
  }
};
