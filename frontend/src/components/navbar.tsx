import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react'; // Icons for better UI

export const Navbar = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
    // 1. Clear all auth storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isPro');
    localStorage.removeItem('user');

    // 2. Navigate to login page
    navigate('/auth', { replace: true });
  };

  return (
    <nav className="bg-[#020617] border-b border-slate-800 px-8 py-4 flex justify-between items-center">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
        <span className="font-black text-white text-xl tracking-tighter">
          CAREERFORGE <span className="text-emerald-500">PRO</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors"
        >
          <Home size={16} /> DASHBOARD
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-bold transition-all"
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </div>
    </nav>
  );
};