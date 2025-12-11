
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ArrowRight, Star, Heart, CheckCircle2, Loader2, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useLogo } from '../contexts/LogoContext';

const Onboarding: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [step, setStep] = useState(1); // 1: Auth Form, 2: Profile Setup (Signup only)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logoUrl } = useLogo();

  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    'Digital Skills', 'Entrepreneurship', 'Leadership', 'Volunteering', 'Health', 'Networking'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Sign Up
        // First create the auth user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // If successful, move to profile setup step
        if (data.user) {
          setStep(2);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSetup = async () => {
    setLoading(true);
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          role: role,
          interests: selectedInterests,
          volunteerHours: 0
        }
      });
      if (error) throw error;
      // Triggers auth state change in App.tsx automatically
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background with modern gradients */}
      <div className="absolute inset-0 bg-yawai-blue">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yawai-blue via-slate-900 to-yawai-blue"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-yawai-gold/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Area */}
        <div className="text-center mb-10 animate-fade-in flex flex-col items-center">
           {logoUrl ? (
             <div className="w-24 h-24 bg-white/10 rounded-2xl p-2 mb-6 shadow-glow backdrop-blur-md">
               <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
             </div>
           ) : (
             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yawai-gold to-yellow-300 rounded-2xl shadow-glow mb-6">
               <span className="text-yawai-blue text-3xl font-extrabold">Y</span>
             </div>
           )}
           <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">YAWAI</h1>
           <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Empower. Educate. Elevate.</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex gap-4 p-1 bg-black/20 rounded-xl mb-6">
                 <button 
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-yawai-gold text-yawai-blue shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   Sign Up
                 </button>
                 <button 
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'signin' ? 'bg-yawai-gold text-yawai-blue shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   Sign In
                 </button>
              </div>

              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {authMode === 'signup' ? 'Join the Movement' : 'Welcome Back'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {authMode === 'signup' ? 'Create an account to get started.' : 'Sign in to access your dashboard.'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yawai-gold transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yawai-gold focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Email Address"
                  />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yawai-gold transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yawai-gold focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button 
                onClick={handleAuth}
                disabled={loading || !email || !password}
                className="w-full group bg-gradient-to-r from-yawai-gold to-yellow-500 text-yawai-blue font-bold py-4 rounded-xl hover:shadow-glow disabled:opacity-50 disabled:hover:shadow-none transition-all mt-4 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && authMode === 'signup' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
                <p className="text-slate-400 text-sm">Tell us a bit more about yourself.</p>
              </div>

              <div className="relative group">
                 <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yawai-gold transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yawai-gold focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                   placeholder="Full Name"
                 />
              </div>

              <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">I am joining as a...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setRole('user')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group
                        ${role === 'user' 
                          ? 'bg-yawai-gold/20 border-yawai-gold text-white shadow-lg shadow-yellow-500/20' 
                          : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                      <Star size={24} className={role === 'user' ? 'text-yawai-gold' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span className="font-bold text-sm">Member</span>
                    </button>
                    <button 
                      onClick={() => setRole('volunteer')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group
                        ${role === 'volunteer' 
                          ? 'bg-blue-500/20 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                      <Heart size={24} className={role === 'volunteer' ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span className="font-bold text-sm">Volunteer</span>
                    </button>
                  </div>
              </div>

              <div>
                 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Interests</label>
                 <div className="flex flex-wrap gap-2">
                  {interests.map(int => {
                    const isSelected = selectedInterests.includes(int);
                    return (
                      <button
                        key={int}
                        onClick={() => toggleInterest(int)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border flex items-center gap-1
                          ${isSelected
                            ? 'bg-yawai-gold text-yawai-blue border-yawai-gold' 
                            : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                          }
                        `}
                      >
                        {isSelected && <CheckCircle2 size={12} />}
                        {int}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button 
                onClick={handleProfileSetup}
                disabled={loading || !fullName}
                className="w-full bg-white text-yawai-blue font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Finish Setup"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
