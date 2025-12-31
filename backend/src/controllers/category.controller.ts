import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: req.userId },
          { isDefault: true, userId: null },
        ],
      },
      orderBy: { name: 'asc' },
    });

    res.json({ status: 'success', data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.create({
      data: {
        ...req.body,
        userId: req.userId,
        isDefault: false,
      },
    });

    res.status(201).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!category) {
      throw new AppError('Category not found or access denied', 404);
    }

    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ status: 'success', data: { category: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!category) {
      throw new AppError('Category not found or access denied', 404);
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
