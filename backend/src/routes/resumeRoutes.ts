import express from 'express';
import { downloadPdf } from '../controllers/pdfController.js';
// import { createCheckout } from '../controllers/paymentController.js';

const router = express.Router();

// The two paths for Week 3
router.post('/download', downloadPdf);
// router.post('/pay', createCheckout);

export default router;