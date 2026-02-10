import type { Request, Response } from 'express';
import User from '../models/user.js';
import type { AuthRequest } from '../types/index.js';

export const handleMockPayment = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is populated by your 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Update user plan to pro
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { plan: 'pro' },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully upgraded to Pro!',
      data: { plan: updatedUser.plan }
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
};