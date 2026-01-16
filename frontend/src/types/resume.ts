export interface ResumeData {
  personalInfo: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string; 
    city: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    role: string;
    duration: string;
    desc: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    year: string;
    score: string;      // CGPA/Percentage value ke liye (e.g. 6.00/10.0)
    scoreType: string;  // "CGPA" ya "Percentage" store karne ke liye
  }[];
  skills: string[];
  projects: {
    id: string;
    name: string;
    link: string;
    desc: string;
  }[];
  certificates: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
}