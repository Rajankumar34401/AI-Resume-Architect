// types/resume.ts or store/types.ts

export interface ResumeData {
  // --- MongoDB Fields ---
  _id?: string;       // MongoDB unique ID (only present after saving)
  userId?: string;    // Reference to User (handled by backend from token)
  
  // --- Personal Information ---
  personalInfo: {
    name: string;           // ✅ Changed from 'fullName' to 'name'
    email: string;
    phone: string;
    location?: string;      // ✅ Changed from 'city' to 'location' (optional)
    linkedin?: string;      // ✅ Made optional
    portfolio?: string;     // ✅ Added portfolio field
    github?: string;        // ✅ Made optional
  };

  // --- Professional Summary ---
  summary?: string;         // ✅ Made optional

  // --- Work Experience ---
  experience: {
    id: string;             // Client-side ID for rendering
    position: string;       // ✅ Changed from 'role' to 'position'
    company: string;
    location?: string;      // ✅ Added location field
    startDate: string;      // ✅ Changed from 'duration' to startDate/endDate
    endDate: string;        // ✅ Added endDate
    current: boolean;       // ✅ Added current job flag
    responsibilities: string[]; // ✅ Changed from 'desc' to 'responsibilities' array
  }[];

  // --- Education ---
  education: {
    id: string;
    degree: string;
    institution: string;    // ✅ Changed from 'school' to 'institution'
    location?: string;      // ✅ Added location
    startDate: string;      // ✅ Changed from 'year' to startDate/endDate
    endDate: string;
    gpa?: string;           // ✅ Changed from 'score' to 'gpa' (optional)
  }[];

  // --- Skills ---
  skills: Skill[];          // ✅ Changed from string[] to Skill[] with categories

  // --- Projects (Optional) ---
  projects?: {              // ✅ Made optional
    id: string;
    name: string;
    link?: string;          // ✅ Made optional
    description: string;    // ✅ Changed from 'desc' to 'description'
    technologies?: string[]; // ✅ Added technologies array
  }[];

  // --- Certifications (Optional) ---
  certifications?: {        // ✅ Changed from 'certificates' to 'certifications'
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;  // ✅ Added credential ID
  }[];

  // --- Resume Settings ---
  template?: string;        // ✅ Added template selection
  colorScheme?: string;     // ✅ Added color scheme

  // --- ATS Features ---
  jobDescription?: string;  // ✅ Added job description field
  atsScore?: number;        // ✅ Added ATS score
  extractedKeywords?: string[]; // ✅ Added extracted keywords

  // --- Timestamps ---
  createdAt?: string;       // ✅ Added creation timestamp
  updatedAt?: string;       // ✅ Added update timestamp
}

// --- Skill Interface with Categories ---
// Replace the old Skill interface with this:
export interface Skill {
  id: string;
  name: string; // Only need the skill name
}

// --- Full Resume Interface (matches backend) ---
export interface Resume {
  _id: string;
  userId: string;
  resumeData: ResumeData;
  template: string;
  colorScheme: string;
  jobDescription?: string;
  atsScore?: number;
  extractedKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}