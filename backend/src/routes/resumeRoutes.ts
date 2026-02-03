import express from 'express';
import { 
  saveResume, 
  getUserResumes, 
  deleteResume 
} from '../controllers/resumeController.js';
import { downloadPdf } from '../controllers/pdfController.js'; // Your existing Puppeteer controller

const router = express.Router();

// --- MongoDB Persistence Routes (Week 4) ---

// POST: Save or Update a resume
router.post('/save', saveResume);

// GET: Fetch all resumes for the user dashboard
router.get('/list', getUserResumes);

// DELETE: Remove a resume by ID
router.delete('/:id', deleteResume);

// --- Existing PDF Route (Week 3) ---

// POST: Generate and download PDF via Puppeteer
router.post('/download', downloadPdf);

// This allows the dashboard to call /api/resumes/download/SOME_ID
router.get('/download/:id', downloadPdf);

export default router;