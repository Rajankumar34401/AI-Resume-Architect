import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import aiRoutes from './controllers/aiController.js';
import resumeRoutes from './routes/resumeRoutes.js'; // The new router

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route Modules
app.use('/api', aiRoutes);           // Old AI routes
app.use('/api/resumes', resumeRoutes); // New Resume & Payment routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server flying on http://localhost:${PORT}`);
});