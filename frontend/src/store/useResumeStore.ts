// store/useResumeStore.ts
import { create } from 'zustand';
import type { ResumeData, Skill } from '../types/resume';
import { aiService, resumeService } from '../services/Api';

interface ResumeStore {
  resume: ResumeData;
  isLoading: boolean;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (text: string) => void;
  addItem: (section: 'experience' | 'education' | 'projects' | 'certifications' | 'skills') => void;
  updateItem: (section: 'experience' | 'education' | 'projects' | 'certifications' | 'skills', id: string, data: any) => void;
  removeItem: (section: 'experience' | 'education' | 'projects' | 'certifications' | 'skills', id: string) => void;
  updateSkills: (skills: Skill[]) => void;
  setResumeData: (data: any) => void;
  resetResume: () => void;
  saveResume: (id: string | null) => Promise<void>;
  optimizeContent: (text: string | undefined, type: 'summary' | 'experience', id?: string) => Promise<void>;
}

const initialData: ResumeData = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: initialData,
  isLoading: false,

  setResumeData: (payload) => {
    const data = payload?.resumeData ? payload.resumeData : payload;
    set({ resume: { ...initialData, ...data } });
  },

  resetResume: () => set({ resume: initialData }),

  updatePersonalInfo: (info) =>
    set((state) => ({ resume: { ...state.resume, personalInfo: { ...state.resume.personalInfo, ...info } } })),

  updateSummary: (text) => set((state) => ({ resume: { ...state.resume, summary: text } })),

  optimizeContent: async (text, type, id) => {
    if (!text || text.length < 10) return;
    set({ isLoading: true });

    try {
      // Call the service from Api.ts
      const res = await aiService.optimizeSummary(text);
      
      // Axios puts the backend response in .data
      const optimizedText = res.data?.optimizedText;

      if (!optimizedText) {
        console.error("Backend returned success but no optimizedText field");
        return;
      }

      if (type === 'summary') {
        set((state) => ({ resume: { ...state.resume, summary: optimizedText } }));
      } else if (type === 'experience' && id) {
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id 
                ? { ...exp, responsibilities: optimizedText.split('\n').map((s: string) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean) } 
                : exp
            ),
          },
        }));
      }
    } catch (err: any) {
      // Log the actual error response from the server
      console.error('AI Optimization failed:', err.response?.data || err.message);
      alert(err.response?.data?.error || "AI Service is currently unavailable.");
    } finally {
      set({ isLoading: false });
    }
  },

  saveResume: async (id) => {
    const { resume } = get();
    try {
      await resumeService.save(resume, id ?? undefined);
    } catch (err) {
      console.error('Save Error:', err);
    }
  },

  addItem: (section) => {
    const uniqueId = crypto.randomUUID();
    const newItemDefaults: any = {
      experience: { company: '', position: '', startDate: '', endDate: '', current: false, responsibilities: [] },
      education: { institution: '', degree: '', startDate: '', endDate: '', gpa: '' },
      projects: { name: '', description: '', link: '', technologies: [] },
      certifications: { name: '', issuer: '', date: '', credentialId: '' },
      skills: { category: '', skills: [] },
    };
    const newItem = { id: uniqueId, ...newItemDefaults[section] };
    set((state) => ({
      resume: { ...state.resume, [section]: [...(state.resume[section] || []), newItem] },
    }));
  },

  updateItem: (section, id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        [section]: (state.resume[section] as any[]).map((item) => (item.id === id ? { ...item, ...data } : item)),
      },
    })),

  removeItem: (section, id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        [section]: (state.resume[section] as any[]).filter((item) => item.id !== id),
      },
    })),

  updateSkills: (skills) => set((state) => ({ resume: { ...state.resume, skills } })),
}));