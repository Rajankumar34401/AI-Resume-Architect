import mongoose, { Schema, Document } from 'mongoose';
import type { ResumeData } from '../types/index.js';

export interface IResumeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  resumeData: ResumeData;
  jobDescription?: string;
  atsScore?: number;
  extractedKeywords?: string[];
  template: string;
  colorScheme: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    extractedKeywords: [{
      type: String,
    }],
    template: {
      type: String,
      default: 'classic',
      enum: ['modern', 'classic', 'minimal', 'professional'],
    },
    colorScheme: {
      type: String,
      default: '#2563eb',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model<IResumeDocument>('Resume', resumeSchema);

export default Resume;