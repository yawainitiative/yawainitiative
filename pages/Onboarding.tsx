
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { ArrowRight, Star, Heart, CheckCircle2, Loader2, Mail, Lock, User as UserIcon, AlertCircle, Facebook, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useLogo } from '../contexts/LogoContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingProps {
  user?: User | null;
  initialAuthMode?: 'signin' | 'signup';
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.45H18.45C18.17 15.93 17.33 17.18 16.06 18.04V21.02H19.93C22.19 18.94 23.52 15.89 23.52 12.29Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.96 22.92 19.93 21.02L16.06 18.04C14.99 18.76 13.62 19.19 12 19.19C8.88 19.19 6.23 17.08 5.28 14.23H1.27V17.34C3.25 21.27 7.31 24 12 24Z" fill="#34A853"/>
    <path d="M5.28 14.23C5.03 13.37 4.89 12.46 4.89 11.53C4.89 10.6 5.03 9.69 5.28 8.83V5.72H1.27C0.46 7.33 0 9.14 0 11.53C0 13.92 0.46 15.73 1.27 17.34L5.28 14.23Z" fill="#FBBC05"/>
    <path d="M12 3.86C13.77 3.86 15.35 4.47 16.6 5.66L19.99 2.27C17.95 0.37 15.24 0 12 0C7.31 0 3.25 2.73 1.27 6.66L5.28 9.77C6.23 6.92 8.88 3.86 12 3.86Z" fill="#EA4335"/>
  </svg>
);

const Onboarding: React.FC<OnboardingProps> = ({ user, initialAuthMode }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialAuthMode || 'signup');
  const [viewMode, setViewMode] = useState<'auth' | 'forgot-password'>('auth');
  const [step, setStep] = useState(1); // 1: Auth Form, 2: Profile Setup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For Forgot Password / Email verification
  const [showPassword, setShowPassword] = useState(false);
  const { logoUrl } = useLogo();
  const navigate = useNavigate();

  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Effect to jump to step 2 if user is already technically signed in but has generic name
  useEffect(() => {
    if (user && user.name === 'User') {
      setStep(2);
      // Logic for existing user profile completion
      setAuthMode('signup'); // UI Mode
    }
  }, [user]);

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

  const handleStep1 = async () => {
    setError(null);
    setSuccessMessage(null);
    
    if (authMode === 'signin') {
       // Sign In Logic
       setLoading(true);
       try {
         const { error } = await supabase.auth.signInWithPassword({
           email: email.trim(),
           password,
         });
         if (error) throw error;
         // If successful, App.tsx will handle the session change automatically
       } catch (err: any) {
         console.error("Login Error:", err);
         let msg = err.message;
         if (msg.includes("Invalid login credentials") || msg.includes("Email not confirmed")) {
            // More specific error for the user
            msg = "Incorrect email or password. Please double-check your credentials.";
         }
         setError(msg);
         setLoading(false);
       }
    } else {
       // Sign Up Logic - Move to Step 2 to collect more info first
       if (!email || !password) {
         setError("Please enter a valid email and password.");
         return;
       }
       if (password.length < 6) {
         setError("Password must be at least 6 characters.");
         return;
       }
       setStep(2);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccessMessage("We've sent a password reset link to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        // CASE 1: Existing User (Logged in but incomplete profile)
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            role: role,
            interests: selectedInterests,
            volunteerHours: 0
          }
        });
        if (error) throw error;
        
        // Force reload to ensure App.tsx picks up the new metadata
        window.location.reload();

      } else {
        // CASE 2: New Signup (Not logged in yet)
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              interests: selectedInterests,
              volunteerHours: 0
            }
          }
        });
        
        if (error) throw error;
        
        // Show success message
        if (data.user) {
           // If user exists and is confirmed, we might get a user object but no session depending on config.
           // If Supabase is set to confirm email, we show the message.
           if (data.user.identities && data.user.identities.length === 0) {
              setError("This email is already registered. Please Sign In instead.");
              setAuthMode('signin');
              setStep(1);
           } else {
              setSuccessMessage("check_email_verification");
           }
        }
      }
      
    } catch (err: any) {
      let msg = err.message;
      if (msg.includes("User already registered")) {
        msg = "This email is already registered. Please sign in.";
        setAuthMode('signin');
        setStep(1);
      }
      setError(msg);
      setLoading(false);
    }
  };

  // SUCCESS SCREEN (Verification Link)
  if (successMessage === "check_email_verification") {
    return (
      <div className="min-h-screen bg-yawai-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-slide-up shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h2>
          <p className="text-slate-500 mb-6">
            We've sent a verification link to <span className="font-bold text-slate-800">{email}</span>. 
            Please check your inbox (and spam folder) to activate your account.
          </p>
          <button 
             onClick={() => {
               setSuccessMessage(null);
               setAuthMode('signin');
               setStep(1);
               setPassword(''); 
             }}
             className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
             Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background with modern gradients */}
      <div className="absolute inset-0 bg-yawai-blue">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yawai-blue via-slate-900 to-yawai-blue"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-yawai-gold/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Back Button for non-step 2 contexts */}
      {!user && step === 1 && (
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 z-20 text-white/50 hover:text-white flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
      )}

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Area */}
        <div className="text-center mb-10 animate-fade-in flex flex-col items-center">
           {logoUrl ? (
             <div className="w-24 h-24 bg-white/10 rounded-full p-2 mb-6 shadow-glow backdrop-blur-md overflow-hidden">
               <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
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
          
          {step === 1 && viewMode === 'auth' && (
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
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 text-red-200 text-sm animate-pulse">
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
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-yawai-gold focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {authMode === 'signin' && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setViewMode('forgot-password')}
                    className="text-sm text-yawai-gold hover:text-yellow-400 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                onClick={handleStep1}
                disabled={loading || !email || !password}
                className="w-full group bg-gradient-to-r from-yawai-gold to-yellow-500 text-yawai-blue font-bold py-4 rounded-xl hover:shadow-glow disabled:opacity-50 disabled:hover:shadow-none transition-all mt-2 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{authMode === 'signup' ? 'Continue' : 'Sign In'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-slate-500 font-semibold">Or continue with</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => handleSocialLogin('google')}
                   className="bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-slate-500 rounded-xl py-3 flex items-center justify-center gap-2 transition-all"
                 >
                   <GoogleIcon />
                   <span className="text-white font-medium text-sm">Google</span>
                 </button>
                 <button 
                   onClick={() => handleSocialLogin('facebook')}
                   className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 hover:border-[#1877F2]/50 rounded-xl py-3 flex items-center justify-center gap-2 transition-all"
                 >
                   <Facebook size={20} className="text-[#1877F2]" />
                   <span className="text-[#1877F2] font-medium text-sm">Facebook</span>
                 </button>
              </div>
            </div>
          )}

          {step === 1 && viewMode === 'forgot-password' && (
             <div className="space-y-6 animate-fade-in">
               <button onClick={() => setViewMode('auth')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium mb-2">
                 <ArrowLeft size={16} /> Back to Login
               </button>
               
               <div className="text-center mb-4">
                 <div className="w-16 h-16 bg-yawai-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} className="text-yawai-gold" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-1">Forgot Password</h2>
                 <p className="text-slate-400 text-sm">Enter your email and we'll send you a link to reset your password.</p>
               </div>

               {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
               )}

               {successMessage && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-3 flex items-start gap-3 text-green-200 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <p>{successMessage}</p>
                </div>
               )}

               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yawai-gold transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-yawai-gold focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Enter your email"
                  />
               </div>

               <button 
                  onClick={handleForgotPassword}
                  disabled={loading || !email}
                  className="w-full bg-yawai-gold text-yawai-blue font-bold py-4 rounded-xl hover:shadow-glow disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
               </button>
             </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
                <p className="text-slate-400 text-sm">Tell us a bit more about yourself.</p>
              </div>

              {/* Show error on step 2 as well if signup fails */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

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
              
              <div className="flex gap-3">
                {!user && (
                    <button 
                        onClick={() => setStep(1)}
                        className="px-6 py-4 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        Back
                    </button>
                )}
                <button 
                    onClick={handleFinishSetup}
                    disabled={loading || !fullName}
                    className="flex-1 bg-white text-yawai-blue font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-xl flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Finish Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
