import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, LogOut, LayoutDashboard, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface Resume {
  _id: string;
  userId: string;
  resumeData: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
    };
    experience: any[];
    education: any[];
    skills: any[];
  };
  template: string;
  colorScheme: string;
  atsScore?: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Get token and user from localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;

  // Axios config with auth header
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      // ✅ No userId query param needed - backend gets it from token
      const res = await axios.get(`${API_URL}/resumes/list`, axiosConfig);
      
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string; code?: string }>;
        
        if (axiosError.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          handleLogout();
        } else {
          toast.error(axiosError.response?.data?.error || 'Failed to fetch resumes');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('isPro');
    
    // Redirect to auth
    navigate('/auth');
  };

  // Confirm and delete resume
  const confirmDelete = async () => {
    if (!deleteId) return;

    const loadingToast = toast.loading("Deleting resume...");

    try {
      // ✅ Use token in header, no userId needed
      await axios.delete(`${API_URL}/resumes/${deleteId}`, axiosConfig);

      // Update local state
      setResumes(resumes.filter((r) => r._id !== deleteId));

      toast.success("Resume removed permanently.", { id: loadingToast });
      setDeleteId(null);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        toast.error(
          axiosError.response?.data?.error || "Could not delete. Check your connection.",
          { id: loadingToast }
        );
      }
    }
  };

  // Download PDF
  const handleDownload = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();

    const downloadPromise = async () => {
      // ✅ Use token in header
      const response = await axios.get(`${API_URL}/resumes/download/${id}`, {
        ...axiosConfig,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    };

    toast.promise(
      downloadPromise(),
      {
        loading: 'Generating your high-res PDF...',
        success: 'Downloaded successfully! 🎉',
        error: 'Failed to generate PDF. Please try again.',
      },
      {
        style: {
          borderRadius: '12px',
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #1e293b',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-center mb-4 text-red-500">
              <AlertTriangle size={48} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Are you sure?</h3>
            <p className="text-slate-400 text-center text-sm mb-8">
              This will permanently delete this resume from your cloud account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 font-bold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 font-bold hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black">
              C
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              CareerForge <span className="text-emerald-500">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-slate-400">Welcome back,</p>
              <p className="font-bold text-emerald-400">{user?.name || user?.email}</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-emerald-400 text-xs font-bold uppercase">
                {user?.plan || 'Free'} Plan
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors"
            >
              <LogOut size={18} /> LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <LayoutDashboard size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">User Panel</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              MY <span className="text-slate-500">DRAFTS</span>
            </h1>
            <p className="text-slate-500 mt-2">
              {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} in cloud storage
            </p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="bg-emerald-500 hover:bg-emerald-400 p-4 rounded-2xl font-black text-black flex items-center gap-2 transition-all active:scale-95 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]"
          >
            <Plus size={20} strokeWidth={3} /> NEW RESUME
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Resume Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/builder/${r._id}`)}
                className="group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <FileText size={24} />
                  </div>
                  <div className="flex gap-2">
                    {/* Download Button */}
                    <button
                      onClick={(e) =>
                        handleDownload(e, r._id, r.resumeData?.personalInfo?.name || 'Resume')
                      }
                      className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={20} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(r._id);
                      }}
                      className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-1">
                  {r.resumeData?.personalInfo?.name || 'Untitled Resume'}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  {r.resumeData?.experience?.[0]?.position || 'In Progress'}
                </p>

                {r.atsScore && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500">ATS Score</span>
                      <span className="text-sm font-bold text-emerald-400">{r.atsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${r.atsScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                    Last Sync: {new Date(r.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-500 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    EDIT →
                  </span>
                </div>
              </div>
            ))}

            {resumes.length === 0 && (
              <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="font-bold">No resumes found in your cloud storage.</p>
                <button
                  onClick={() => navigate('/builder')}
                  className="mt-4 text-emerald-500 hover:text-emerald-400 font-bold"
                >
                  Create your first resume →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;