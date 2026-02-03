import type { Request, Response } from 'express';
import Resume from '../models/resume.js';

// Save or Update
export const saveResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeData, id } = req.body;

    if (id && id !== 'undefined') {
      // FIX: Ensure userId is preserved during update
      const updated = await Resume.findByIdAndUpdate(
        id, 
        { ...resumeData, userId }, 
        { new: true }
      );
      return res.status(200).json(updated);
    } else {
      // Create new
      const newResume = new Resume({ ...resumeData, userId });
      await newResume.save();
      return res.status(201).json(newResume);
    }
  } catch (error) {
    res.status(500).json({ message: "Save failed", error });
  }
};

// FIX: Get resumes based on the REAL logged-in user
export const getUserResumes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query; // Get userId from the URL query (?userId=...)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Search for resumes matching the actual userId
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error });
  }
};

// Delete
export const deleteResume = async (req: Request, res: Response) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume", error });
  }
};