import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// These match the frontend calls
router.post('/signup', signup);
router.post('/login', login);

export default router;