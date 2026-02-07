import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';

// API Response Types
interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      plan: 'free' | 'pro';
    };
  };
  error?: string;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      const payload = isLogin 
        ? { email, password }
        : { name, email, password };

      const res = await axios.post<AuthResponse>(
        `${API_URL}${endpoint}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success && res.data.data) {
        // Store token in localStorage
        localStorage.setItem('token', res.data.data.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        
        // Legacy compatibility (if needed elsewhere in your app)
        localStorage.setItem('userId', res.data.data.user.id);
        localStorage.setItem('isPro', (res.data.data.user.plan === 'pro').toString());

        // Navigate to dashboard
        navigate('/');
      } else {
        setError(res.data.error || 'Authentication failed');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<AuthResponse>;
        
        if (axiosError.response?.data?.error) {
          setError(axiosError.response.data.error);
        } else if (axiosError.response?.status === 409) {
          setError('Email already registered. Please login.');
        } else if (axiosError.response?.status === 401) {
          setError('Invalid email or password.');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
        {/* Header */}
        <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tighter">
          CareerForge <span className="text-emerald-500">{isLogin ? 'Login' : 'Signup'}</span>
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (only for signup) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password field */}
         {/* Password field */}
<div className="relative">
  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
  
  <input
    // Logic: Toggle between "password" and "text" types
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    minLength={6}
    disabled={loading}
  />
          {/* {password field} */}
          {/* Toggle Button */}
          <button
            type="button" // Important: prevents form submission on click
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

          {/* Password hint for signup */}
          {!isLogin && (
            <p className="text-slate-500 text-xs">
              Password must be at least 6 characters
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {isLogin ? 'LOG IN' : 'SIGN UP'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between login/signup */}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setName('');
            setEmail('');
            setPassword('');
          }}
          className="w-full text-slate-400 text-sm mt-6 hover:text-emerald-500 transition-colors"
          disabled={loading}
        >
          {isLogin 
            ? "Need an account? Sign up" 
            : "Have an account? Login"}
        </button>

        {/* Plan info */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-slate-500 text-xs text-center">
            Free plan includes 1 resume. Upgrade to Pro for unlimited resumes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;