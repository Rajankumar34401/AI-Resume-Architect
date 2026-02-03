import type { Request, Response } from 'express';
import Resume from '../models/resume.js';

// Save a new resume or update existing one
export const saveResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeData, id } = req.body;

    if (id) {
      // Update existing resume
      const updated = await Resume.findByIdAndUpdate(id, resumeData, { new: true });
      return res.status(200).json(updated);
    } else {
      // Create new resume linked to user
      const newResume = new Resume({ ...resumeData, userId });
      await newResume.save();
      return res.status(201).json(newResume);
    }
  } catch (error) {
    res.status(500).json({ message: "Save failed", error });
  }
};

// Get all resumes for the Dashboard
export const getUserResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: "guest_user" }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error });
  }
};

// Delete a resume
export const deleteResume = async (req: Request, res: Response) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume", error });
  }
};