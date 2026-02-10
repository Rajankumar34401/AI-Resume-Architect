import { Router } from 'express';
import { handleMockPayment } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/auth.js'; // Ensure this matches your auth middleware filename

const router = Router();

// This matches the '/api/payment/mock-checkout' call from frontend
router.post('/mock-checkout', authenticateUser, handleMockPayment);

export default router;