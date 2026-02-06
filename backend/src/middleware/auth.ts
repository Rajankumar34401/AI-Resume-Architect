import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { AuthRequest, JWTPayload } from '../types/index.js';

// ============================================
// Main Authentication Middleware
// ============================================
export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided. Please log in.',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization format. Use Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is missing. Please log in.',
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error.',
      });
    }

  const decoded = jwt.verify(token, jwtSecret);

if (typeof decoded === 'string' || !decoded.email) {
  return res.status(401).json({
    success: false,
    error: 'Invalid token payload. Please log in again.',
  });
}
const userId = decoded.userId ?? decoded.id;

if (!userId) {
  return res.status(401).json({
    success: false,
    error: 'Invalid token payload. Please log in again.',
  });
}

    req.user = {
      id: userId,
      email: decoded.email,
      plan: decoded.plan ?? 'free',
      name: decoded.name,
    };

    next();
  } catch (error: any) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Your session has expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token. Please log in again.',
        code: 'INVALID_TOKEN',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed. Please try again.',
    });
  }
};

// ============================================
// Require Pro Plan Middleware
// ============================================
export const requireProPlan = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  if (req.user.plan !== 'pro') {
    return res.status(403).json({
      success: false,
      error: 'This feature requires a Pro subscription.',
      code: 'PRO_PLAN_REQUIRED',
      upgradeUrl: '/pricing',
    });
  }

  next();
};

// ============================================
// Helper: Generate JWT Token
// ============================================
export const generateToken = (payload: {
  userId: string;
  email: string;
  plan?: 'free' | 'pro';
  name?: string;
}): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is not configured');

  const secret: Secret = jwtSecret;

  // ✅ Use a literal string allowed by StringValue
  const options: SignOptions = {
    expiresIn: '7d', // must be a literal
  };

  return jwt.sign(
    {
      id: payload.userId,
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan ?? 'free',
      name: payload.name,
    },
    secret,
    options
  );
};
// ============================================
// Helper: Verify Token
// ============================================
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, jwtSecret) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export default authenticateUser;
