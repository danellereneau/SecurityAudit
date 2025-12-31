import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Dashboard metrics
router.get('/dashboard', analyticsController.getDashboardMetrics);

// Detailed analytics
router.get('/spending/trends', analyticsController.getSpendingTrends);
router.get('/spending/by-category', analyticsController.getSpendingByCategory);
router.get('/spending/by-payment-method', analyticsController.getSpendingByPaymentMethod);
router.get('/spending/calendar', analyticsController.getSpendingCalendar);

// Insights
router.get('/insights/optimization', analyticsController.getOptimizationInsights);
router.get('/insights/price-increases', analyticsController.getPriceIncreases);
router.get('/insights/potential-savings', analyticsController.getPotentialSavings);

// Export
router.get('/export/csv', analyticsController.exportToCsv);
router.get('/export/json', analyticsController.exportToJson);

export default router;
