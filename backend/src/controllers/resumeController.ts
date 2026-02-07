import type { Response } from 'express';
import mongoose from 'mongoose';
import Resume from '../models/resume.js';
import User from '../models/user.js'; 
import type { AuthRequest, ApiResponse, IResume } from '../types/index.js';

// ============================================
// Helper: Validate MongoDB ObjectId
// ============================================
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ============================================
// Save or Update Resume
// ============================================
export const saveResume = async (
  req: AuthRequest,
  res: Response<ApiResponse<IResume>>
): Promise<Response> => {
  try {
    const { resumeData, id } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Resume data is required',
      });
    }

    // UPDATE EXISTING RESUME
    if (id && id !== 'undefined' && id !== 'null') {
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid resume ID format',
        });
      }

      const existingResume = await Resume.findById(id);

      if (!existingResume) {
        return res.status(404).json({
          success: false,
          error: 'Resume not found',
        });
      }

      if (existingResume.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to update this resume",
        });
      }

      const updated = await Resume.findByIdAndUpdate(
        id,
        {
          ...req.body,
          userId: new mongoose.Types.ObjectId(userId),
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        data: updated as any,
      });
    }

    // CREATE NEW RESUME
    const newResume = new Resume({
      ...req.body,
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newResume.save();

    // ✅ NEW: Increment the resumeCount for this user
      await User.findByIdAndUpdate(userId, { 
        $inc: { resumeCount: 1 } 
      });

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: newResume as any,
    });

  } catch (error: any) {
    console.error('Error saving resume:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume data',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to save resume. Please try again.',
    });
  }
};

// ============================================
// Get All User Resumes
// ============================================
export const getUserResumes = async (
  req: AuthRequest,
  res: Response<ApiResponse<IResume[]>>
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .select('-__v')
      .lean();

    return res.status(200).json({
      success: true,
      data: resumes as any,
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes. Please try again.',
    });
  }
};

// ============================================
// Get Single Resume by ID
// ============================================
export const getResumeById = async (
  req: AuthRequest<{ id: string }>,
  res: Response<ApiResponse<IResume>>
): Promise<Response> => {
  try{
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // ✅ id is now GUARANTEED string
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid resume ID format',
    });
  }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    if (resume.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to access this resume",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume as any,
    });

  } catch (error) {
    console.error('Error fetching resume:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch resume. Please try again.',
    });
  }
};


// ============================================
// Delete Resume
// ============================================
export const deleteResume = async (
  req: AuthRequest<{ id: string }>,
  res: Response<ApiResponse>
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Auth check
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // ID validation
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format',
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    // Ownership check
    if (resume.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to delete this resume",
      });
    }

    await Resume.findByIdAndDelete(id);

    // ✅ NEW: Decrement the resumeCount for this user
      await User.findByIdAndUpdate(userId, { 
        $inc: { resumeCount: -1 } 
      });

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting resume:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete resume. Please try again.',
    });
  }
};