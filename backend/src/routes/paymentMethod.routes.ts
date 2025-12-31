import { Router } from 'express';
import * as paymentMethodController from '../controllers/paymentMethod.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All payment method routes require authentication
router.use(authenticate);

router.get('/', paymentMethodController.getPaymentMethods);
router.post('/', paymentMethodController.createPaymentMethod);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.delete('/:id', paymentMethodController.deletePaymentMethod);

export default router;
