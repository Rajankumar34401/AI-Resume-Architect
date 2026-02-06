import type { Request } from 'express';

// ============================================
// User Types
// ============================================
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro';
  resumeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  name?: string;
}

// ============================================
// Resume Types
// ============================================
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

// backend/types/index.ts
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string; // Change from score to gpa to match Frontend
}
// Add Project Interface
export interface Project {
  id: string;
  name: string;
  link?: string;
  description: string; // Ensure this is 'description' to match Editor
  technologies?: string[]; 
}

export interface Skill {
  id: string; // Add this
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

// Update ResumeData Interface
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];   // Changed from string[] back to Skill[]
  certifications?: Certification[];
  summary?: string;
}
export interface IResume {
  _id: string;
  userId: string;
  resumeData: ResumeData;
  jobDescription?: string;
  atsScore?: number;
  extractedKeywords?: string[];
  template: string;
  colorScheme: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Express Request Extensions
// ============================================
export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  user?: AuthUser;
}

// ============================================
// JWT Payload
// ============================================
export interface JWTPayload {
  userId?: string;
  id?: string;
  email: string;
  plan?: 'free' | 'pro';
  name?: string;
  iat?: number;
  exp?: number;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  page?: number;
  totalPages?: number;
}