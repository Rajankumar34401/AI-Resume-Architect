import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useResumeStore } from '../store/useResumeStore';
import Editor from '../components/Editor';
import { Preview } from '../components/Preview';
import toast from 'react-hot-toast';
import { Save, LayoutDashboard, Loader2 } from 'lucide-react';

const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setResumeData, resetResume, resume } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Axios config
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Load resume data if editing existing
  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        try {
          setLoading(true);
          const res = await axios.get(`${API_URL}/resumes/${id}`, axiosConfig);

          if (res.data.success && res.data.data) {
            // Safe fallback to empty arrays
            const safeData = {
              ...res.data.data.resumeData,
              projects: res.data.data.resumeData.projects ?? [],
              skills: res.data.data.resumeData.skills ?? [],
              experience: res.data.data.resumeData.experience ?? [],
              education: res.data.data.resumeData.education ?? [],
              certifications: res.data.data.resumeData.certifications ?? [],
            };
            setResumeData(safeData);
          }
        } catch (err) {
          console.error('Error loading resume:', err);

          if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ error: string }>;
            if (axiosError.response?.status === 404) {
              toast.error('Resume not found');
              navigate('/');
            } else if (axiosError.response?.status === 403) {
              toast.error("You don't have permission to access this resume");
              navigate('/');
            } else {
              toast.error(axiosError.response?.data?.error || 'Failed to load resume');
            }
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Creating new resume
        resetResume();
      }
    };

    loadResume();
  }, [id, setResumeData, resetResume]);

  // Save resume
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        resumeData: resume,
        id: id || undefined, // Include id if editing existing
      };

      const res = await axios.post(`${API_URL}/resumes/save`, payload, axiosConfig);

      if (res.data.success) {
        toast.success(id ? 'Resume updated successfully!' : 'Resume created successfully!');

        // If creating new, navigate to edit page with the new ID
        if (!id && res.data.data?._id) {
          navigate(`/builder/${res.data.data._id}`);
        }
      }
    } catch (err) {
      console.error('Save error:', err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        toast.error(axiosError.response?.data?.error || 'Failed to save resume');
      }
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds for existing resumes
  useEffect(() => {
    if (!id) return;

    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [id, resume]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#020617] flex flex-col">
      {/* Navigation */}
      <nav className="p-4 border-b border-slate-800 flex justify-between items-center px-10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black">
            C
          </div>
          <h2 className="text-white font-black tracking-tighter uppercase">
            CareerForge <span className="text-emerald-500">Pro</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 px-6 py-2 rounded-lg font-black text-black flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-[40%] overflow-y-auto p-8 border-r border-slate-800 bg-slate-950">
          <Editor />
        </div>

        {/* Right: Preview */}
        <div className="w-[60%] overflow-y-auto bg-slate-900 p-10 flex justify-center">
          <div className="scale-75 origin-top shadow-2xl">
            <Preview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
