import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, LogOut, LayoutDashboard, Download, AlertTriangle, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentService } from '../services/Api';

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
  const [upgrading, setUpgrading] = useState(false);
  const [showMockCheckout, setShowMockCheckout] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/resumes/list`, axiosConfig);
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        if (axiosError.response?.status === 401) {
          handleLogout();
        } else {
          toast.error(axiosError.response?.data?.error || 'Failed to fetch resumes');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
  try {
    setUpgrading(true);
    
    // 1. Mock the "Redirecting to Bank" phase
    const paymentToast = toast.loading("Connecting to secure payment gateway...", {
      style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
    });

    // 2. Fake a delay for processing (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.loading("Verifying transaction...", { id: paymentToast });
    
    // 3. Call your backend to actually update the plan
    const res = await paymentService.upgradeToPro();
    
    if (res.data.success) {
      // 4. Update local state so the UI changes immediately
      const updatedUser = { ...user, plan: 'pro' as const };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Payment Successful! Welcome to Pro. 🎉", { 
        id: paymentToast,
        duration: 5000 
      });

      // 5. Short delay before reload to let them see the success message
      setTimeout(() => window.location.reload(), 1500);
    }
  } catch (err) {
    toast.error("Payment declined by provider. Please try again.", { id: 'paymentToast' });
  } finally {
    setUpgrading(false);
  }
};
  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const loadingToast = toast.loading("Deleting resume...");
    try {
      await axios.delete(`${API_URL}/resumes/${deleteId}`, axiosConfig);
      setResumes(resumes.filter((r) => r._id !== deleteId));
      toast.success("Deleted successfully", { id: loadingToast });
      setDeleteId(null);
    } catch (err) {
      toast.error("Delete failed", { id: loadingToast });
    }
  };

  const handleDownload = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    const downloadPromise = async () => {
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
    };

    toast.promise(downloadPromise(), {
      loading: 'Generating PDF...',
      success: 'Downloaded! 🎉',
      error: 'Download failed',
    });
  };

const handleCreateNew = () => {
  // 1. Check if user is Free and has already created 1 resume
  if (user?.plan === 'free' && resumes.length >= 1) {
    toast.error("Limit Reached! Upgrade to Pro for unlimited resumes.", {
      icon: '🚫',
      duration: 4000,
      style: {
        borderRadius: '15px',
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #334155'
      }
    });
    
    // Automatically scroll them up to the Upgrade Banner so they can click it
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // 2. If they are Pro or haven't reached the limit, let them through
  navigate('/builder');
};

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-center mb-4 text-red-500"><AlertTriangle size={48} /></div>
            <h3 className="text-xl font-bold text-center mb-2">Are you sure?</h3>
            <p className="text-slate-400 text-center text-sm mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-slate-800 font-bold hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 font-bold hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black">C</div>
            <span className="text-xl font-black tracking-tighter uppercase">CareerForge <span className="text-emerald-500">Pro</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 uppercase font-black">Welcome back</p>
              <p className="font-bold text-emerald-400">{user?.name || 'User'}</p>
            </div>
            <div className={`px-3 py-1 rounded-full border ${user?.plan === 'pro' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{user?.plan || 'Free'} Plan</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-400 font-bold text-xs transition-all"><LogOut size={16} /> LOGOUT</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Upgrade Call to Action */}
        {user?.plan === 'free' && (
          <div className="mb-10 p-8 rounded-3xl bg-linear-to-r from-emerald-600/20 to-blue-600/10 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20"><Zap fill="currentColor" /></div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">GO PRO FOR UNLIMITED DRAFTS</h2>
                <p className="text-slate-400 text-sm">Unlock AI tools, ATS optimization, and premium templates.</p>
              </div>
            </div>
            <button onClick={() => setShowMockCheckout(true)} disabled={upgrading} className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
              {upgrading ? <Loader2 className="animate-spin" /> : "ACTIVATE PRO NOW"}
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <LayoutDashboard size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">User Dashboard</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase">My <span className="text-slate-500">Drafts</span></h1>
            <p className="text-slate-500 mt-2 font-medium">{resumes.length} total resumes in cloud storage</p>
          </div>

          {/* New Resume Button */}
          {/* Updated New Resume Button */}
            <button onClick={handleCreateNew}
            className={`w-full md:w-auto p-5 px-8 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-xl 
              ${(user?.plan === 'free' && resumes.length >= 1) 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'}`}>
            {user?.plan === 'free' && resumes.length >= 1 ? (
              <Zap size={20} className="fill-yellow-500 text-yellow-500" />
            ) : (
              <Plus size={20} strokeWidth={3} />
            )}
            {user?.plan === 'free' && resumes.length >= 1 ? "UPGRADE TO CREATE" : "NEW RESUME"}
          </button>
        </div>

        {/* Usage Tracker for Free Users */}
        {user?.plan === 'free' && (
          <div className="mb-12 p-6 bg-slate-900/40 border border-slate-800/60 rounded-3xl max-w-sm shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Draft Capacity</span>
              <span className={`text-xs font-bold ${resumes.length >= 1 ? 'text-orange-500' : 'text-emerald-500'}`}>{resumes.length} / 1 Slots</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className={`h-full transition-all duration-1000 ${resumes.length >= 1 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((resumes.length / 1) * 100, 100)}%` }} />
            </div>
            {resumes.length >= 1 && (
              <div className="mt-4 flex items-center gap-2 text-orange-400 font-bold text-[10px]">
                <AlertTriangle size={14} /> LIMIT REACHED! UPGRADE TO ADD MORE.
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing with cloud...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((r) => (
              <div key={r._id} onClick={() => navigate(`/builder/${r._id}`)} className="group bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-800/50 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <FileText size={28} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => handleDownload(e, r._id, r.resumeData?.personalInfo?.name || 'Resume')} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors" title="Download PDF"><Download size={20} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(r._id); }} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-1 truncate">{r.resumeData?.personalInfo?.name || 'Untitled Resume'}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">{r.resumeData?.experience?.[0]?.position || 'Draft in Progress'}</p>

                {r.atsScore && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      <span>ATS Score</span>
                      <span className="text-emerald-400">{r.atsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${r.atsScore}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">Sync: {new Date(r.updatedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-500 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">OPEN EDITOR →</span>
                </div>
              </div>
            ))}

            {resumes.length === 0 && (
              <div className="col-span-full py-24 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-500 bg-slate-900/10">
                <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 text-slate-700"><FileText size={40} /></div>
                <p className="font-black text-xl mb-2 text-slate-400">Your cloud storage is empty</p>
                <p className="text-sm text-slate-600 mb-8">Start your career journey by creating your first resume.</p>
                <button onClick={() => navigate('/builder')} className="text-emerald-500 hover:text-emerald-400 font-black flex items-center gap-2 group transition-all">CREATE FIRST RESUME <Plus size={18} className="group-hover:rotate-90 transition-transform" /></button>
              </div>
            )}
          </div>
        )}

        {showMockCheckout && (
  <div className="fixed inset-0 z-110 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black uppercase tracking-tighter">Mock <span className="text-emerald-500">Checkout</span></h3>
        <Zap className="text-yellow-500 fill-yellow-500" size={20} />
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Plan</p>
          <p className="font-bold">CareerForge Pro - Monthly</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Due</p>
          <p className="text-2xl font-black text-emerald-400">$0.00 <span className="text-xs text-slate-500 font-normal line-through">$19.99</span></p>
        </div>
      </div>

      <button 
        onClick={() => {
          setShowMockCheckout(false);
          handleUpgrade();
        }}
        className="w-full bg-emerald-500 hover:bg-emerald-400 py-4 rounded-2xl font-black text-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
      >
        COMPLETE MOCK PAYMENT
      </button>
      
      <button 
        onClick={() => setShowMockCheckout(false)}
        className="w-full mt-3 text-slate-500 font-bold text-xs hover:text-white transition-colors"
      >
        CANCEL
      </button>
    </div>
  </div>
)}
      </main>
    </div>
  );
};

export default Dashboard;