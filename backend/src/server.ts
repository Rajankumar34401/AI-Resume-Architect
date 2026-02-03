import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // Added for MongoDB connection
import 'dotenv/config';

// Change: Remove .js extensions for TypeScript compatibility
import aiRoutes from './controllers/aiController.js';
import resumeRoutes from './routes/resumeRoutes.js'; 
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI, {
  dbName: 'careerforge' // Explicitly naming your database
})
.then(() => console.log('☁️ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ Atlas Connection Error:', err));

// Route Modules
app.use('/api', aiRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server flying on http://localhost:${PORT}`);
});