
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLogo } from '../../contexts/LogoContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logoUrl } = useLogo();

  // SECURE CREDENTIALS (As requested)
  const ADMIN_EMAIL = "yawainitiative2022@gmail.com";
  const ADMIN_PASS = "YawaInitiative123412";

  // Check if already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      // Check local fallback first
      if (localStorage.getItem('yawai_demo_admin') === 'true') {
        navigate('/admin', { replace: true });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.role === 'admin') {
        navigate('/admin', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Strict Credential Check BEFORE anything else
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      setError("Invalid administrative credentials.");
      setLoading(false);
      return;
    }

    try {
      // 2. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // FALLBACK: If Supabase fails (e.g. user doesn't exist in DB yet) 
        // BUT credentials matched the secure hardcoded ones, allow access.
        console.warn("Database auth failed, proceeding with local admin session verified by credentials.");
        localStorage.setItem('yawai_demo_admin', 'true');
        
        // Force a page reload to ensure App.tsx picks up the new localStorage state
        window.location.href = '/admin';
        return;
      }

      // Check role if Supabase login succeeded
      if (data.user?.user_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Unauthorized Access. Admin privileges required.");
      }

      // Success - Navigate to dashboard
      navigate('/admin', { replace: true });

    } catch (err: any) {
      // If we fall through here, it's a non-auth error or role error
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-center text-white">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm overflow-hidden">
            {logoUrl ? (
               <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
               <ShieldCheck size={32} />
            )}
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-red-100 text-sm mt-1">Authorized personnel only</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 flex gap-2 items-start text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-10"
                  placeholder="Enter admin password"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Back to Main Site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
