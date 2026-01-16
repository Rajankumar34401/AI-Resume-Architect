import { create } from 'zustand';
import type { ResumeData } from '../types/resume';

interface ResumeStore {
  resume: ResumeData;
  isLoading: boolean;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (text: string) => void;
  // Naya generic function jo dono ke liye kaam karega
  optimizeContent: (text: string, type: 'summary' | 'experience', id?: string) => Promise<void>; 
  addItem: (section: 'experience' | 'education' | 'projects' | 'certificates') => void;
  updateItem: (section: 'experience' | 'education' | 'projects' | 'certificates', id: string, data: any) => void;
  removeItem: (section: 'experience' | 'education' | 'projects' | 'certificates', id: string) => void;
  updateSkills: (skills: string[]) => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: {
    personalInfo: { fullName: '', role: '', email: '', phone: '', linkedin: '', github: '', city: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
  },
  isLoading: false,

  updatePersonalInfo: (info) => set((state) => ({
    resume: { ...state.resume, personalInfo: { ...state.resume.personalInfo, ...info } }
  })),

  updateSummary: (text) => set((state) => ({
    resume: { ...state.resume, summary: text }
  })),

  // --- GENERIC AI OPTIMIZE LOGIC ---
  optimizeContent: async (text, type, id) => {
    if (!text || text.length < 10) {
      alert("Bhai, thoda text toh likho pehle!");
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:5000/api/optimize-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Yahan text aur type dono backend bhej rahe hain [cite: 2025-12-29]
        body: JSON.stringify({ text, type }), 
      });

      const data = await response.json();

      if (data.optimizedText) {
        if (type === 'summary') {
          // Summary update karein [cite: 2025-12-29]
          set((state) => ({
            resume: { ...state.resume, summary: data.optimizedText }
          }));
        } else if (type === 'experience' && id) {
          // Specific Experience item update karein [cite: 2025-12-29]
          set((state) => ({
            resume: {
              ...state.resume,
              experience: state.resume.experience.map((exp: any) =>
                exp.id === id ? { ...exp, desc: data.optimizedText } : exp
              )
            }
          }));
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI optimization fail ho gayi.");
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: (section) => set((state) => {
    const newItem = { 
      id: Date.now().toString(),
      ...(section === 'experience' && { company: '', role: '', duration: '', desc: '' }),
      ...(section === 'education' && { school: '', degree: '', year: '', score: '', scoreType: 'CGPA' }),
      ...(section === 'projects' && { name: '', link: '', desc: '' }),
      ...(section === 'certificates' && { name: '', issuer: '', date: '' }),
    };
    return {
      resume: { ...state.resume, [section]: [...state.resume[section], newItem] }
    };
  }),

  updateItem: (section, id, data) => set((state) => ({
    resume: {
      ...state.resume,
      [section]: state.resume[section].map((item: any) => 
        item.id === id ? { ...item, ...data } : item
      )
    }
  })),

  removeItem: (section, id) => set((state) => ({
    resume: { ...state.resume, [section]: state.resume[section].filter((item: any) => item.id !== id) }
  })),

  updateSkills: (skills) => set((state) => ({
    resume: { ...state.resume, skills }
  })),
}));