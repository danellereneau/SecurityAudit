import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export const getPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: { paymentMethods } });
  } catch (error) {
    next(error);
  }
};

export const createPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ...req.body,
        userId: req.userId,
      },
    });

    res.status(201).json({ status: 'success', data: { paymentMethod } });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.paymentMethod.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      throw new AppError('Payment method not found', 404);
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ status: 'success', data: { paymentMethod } });
  } catch (error) {
    next(error);
  }
};

export const deletePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.paymentMethod.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      throw new AppError('Payment method not found', 404);
    }

    await prisma.paymentMethod.delete({
      where: { id: req.params.id },
    });

    res.json({ status: 'success', message: 'Payment method deleted successfully' });
  } catch (error) {
    next(error);
  }
};
