import express from 'express';
import {
  saveResume,
  getUserResumes,
  deleteResume,
  getResumeById,
} from '../controllers/resumeController.js';
import { downloadPdf } from '../controllers/pdfController.js';
import { authenticateUser } from '../middleware/auth.js';
import aiRoutes from './aiRoutes.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// ------------------
// AI Routes
// ------------------
router.use('/ai', aiRoutes); // Already protected by authenticateUser

// ------------------
// Resume CRUD
// ------------------
router.post('/save', saveResume);
router.get('/list', getUserResumes);
router.get('/:id', getResumeById);
router.put('/:id', saveResume);
router.delete('/:id', deleteResume);

// ------------------
// PDF Download
// ------------------

// Download PDF by sending HTML (Preview)
router.post('/download', downloadPdf);

// Download PDF by resume ID
router.get('/download/:id', downloadPdf);

export default router;
