import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All subscription routes require authentication
router.use(authenticate);

// CRUD operations
router.get('/', subscriptionController.getAllSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.post('/', subscriptionController.createSubscription);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

// Specific queries
router.get('/upcoming/renewals', subscriptionController.getUpcomingRenewals);
router.get('/free-trials', subscriptionController.getFreeTrials);
router.get('/duplicates', subscriptionController.findDuplicates);

// Notes
router.post('/:id/notes', subscriptionController.addNote);
router.put('/:id/notes/:noteId', subscriptionController.updateNote);
router.delete('/:id/notes/:noteId', subscriptionController.deleteNote);

export default router;
