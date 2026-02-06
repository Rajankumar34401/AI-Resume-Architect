import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with token interceptor
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// Resume CRUD Services
// ==============================
export const resumeService = {
  save: (resumeData: any, id?: string) => api.post('/resumes/save', { resumeData, id }),
  getAll: () => api.get('/resumes/list'),
  getById: (id: string) => api.get(`/resumes/${id}`),
  delete: (id: string) => api.delete(`/resumes/${id}`),
  
  // downloadPDF can either send HTML (POST) or use resume ID (GET)
  downloadPDF: (htmlContent?: string, id?: string) => {
    if (id) {
      return api.get(`/resumes/download/${id}`, { responseType: 'blob' });
    } else {
      return api.post('/resumes/download', { htmlContent }, { responseType: 'blob' });
    }
  },
};

// ==============================
// AI Services
// ==============================
// services/Api.ts (Frontend)

export const aiService = {
  // Add '/ai' here to match your nested backend routes
  optimizeSummary: (text: string) => api.post('/resumes/ai/optimize-summary', { text }),
  
  getATSScore: (resumeData: any, jobDescription: string) => 
    api.post('/resumes/ai/ats-score', { resumeData, jobDescription }),
    
  generateCoverLetter: (resumeData: any, jobDescription: string) =>
    api.post('/resumes/ai/generate-cover-letter', { resumeData, jobDescription }),
};
