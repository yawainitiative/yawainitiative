
import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, ArrowLeft, Loader2, Send, 
  Target, Rocket, Users, Info, Sparkles, AlertCircle, Database, Settings, ChevronDown, ChevronUp,
  MapPin, Clock, BookOpen, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogo } from '../contexts/LogoContext';
import { supabase } from '../services/supabase';
import { contentService } from '../services/contentService';
import { Program } from '../types';

const ProgramRegistration: React.FC = () => {
  const { logoUrl } = useLogo();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [mainProgram, setMainProgram] = useState<Program | null>(null);
  const [skillTracks, setSkillTracks] = useState<Program[]>([]);
  const [allRawPrograms, setAllRawPrograms] = useState<Program[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedSkill: '',
    motivation: ''
  });

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setErrorStatus(null);
      try {
        const allPrograms = await contentService.fetchPrograms();
        setAllRawPrograms(allPrograms);
        
        if (allPrograms.length === 0) {
           setErrorStatus("TABLE_EMPTY");
        } else {
           // 1. Identify the Main Program (Usually has "Program" or "3-Month" in title)
           const main = allPrograms.find(p => 
             p.category?.toLowerCase().trim() === 'skill acquisition' || 
             p.title?.toLowerCase().includes('program')
           );
           setMainProgram(main || null);

           // 2. Identify the Skill Tracks (Specific skills to be learned)
           // We'll look for programs with category "Skill Track" or items that aren't the main one
           const tracks = allPrograms.filter(p => {
             const cat = (p.category || '').toLowerCase().trim();
             // Match "Skill Track" or any other training item that isn't the primary header
             return cat.includes('track') || (cat.includes('skill') && p.id !== main?.id);
           });
           
           if (tracks.length === 0 && !main) {
              setErrorStatus("NO_SKILLS_MATCH");
           }
           setSkillTracks(tracks);
        }
      } catch (err: any) {
        console.error("Failed to load skills:", err);
        if (err.code === '42P01') setErrorStatus("TABLE_MISSING");
        else setErrorStatus("DATABASE_ERROR");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedSkill) {
      alert("Please select a skill track first.");
      return;
    }
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('program_applications')
        .insert([{
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            skill_track: formData.selectedSkill,
            motivation: formData.motivation,
            program_name: mainProgram?.title || '3-Month Skill Acquisition 2026'
        }]);

      if (error) throw error;
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Registration Received!</h1>
        <p className="text-slate-500 text-lg max-w-md mb-10 leading-relaxed">
          Thank you for applying. We have sent a confirmation email to <span className="font-bold text-slate-900">{formData.email}</span>.
        </p>
        <Link to="/" className="bg-yawai-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95">
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-yawai-gold rounded-xl flex items-center justify-center text-yawai-blue font-bold">Y</div>
          )}
          <span className="font-extrabold text-xl text-yawai-blue tracking-tight">YAWAI</span>
        </Link>
        <Link to="/" className="text-xs font-black text-slate-500 hover:text-yawai-blue transition-colors uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Back to Site</Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-yawai-blue via-slate-900 to-yawai-blue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yawai-gold/20 border border-yawai-gold/30 text-yawai-goldLight px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in">
             <Calendar size={12} /> Registration Batch 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] animate-slide-up">
            Master a New Skill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Start Your Journey.</span>
          </h1>
        </div>
      </section>

      {/* Main Program & Skills Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        
        {/* 1. THE MAIN PROGRAM CARD */}
        {mainProgram ? (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 mb-20 animate-slide-up">
            <div className="flex flex-col lg:flex-row">
               <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden relative">
                  <img src={mainProgram.image} className="w-full h-full object-cover" alt={mainProgram.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
               </div>
               <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                  <span className="text-yawai-gold font-black text-[10px] uppercase tracking-[0.3em] mb-4">Official Program</span>
                  <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">{mainProgram.title}</h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                    {mainProgram.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Clock className="text-yawai-gold" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                           <p className="text-sm font-bold text-slate-800">{mainProgram.duration}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Target className="text-yawai-gold" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                           <p className="text-sm font-bold text-slate-800">Youth & Women</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : !loading && (
          <div className="bg-amber-50 border border-amber-200 p-10 rounded-[3rem] text-center mb-20 text-amber-900">
             <AlertCircle size={40} className="mx-auto mb-4" />
             <p className="font-black text-xl">Main Program Info Missing</p>
             <p className="text-sm font-medium opacity-70">Add a program with category 'Skill Acquisition' to see the program header here.</p>
          </div>
        )}

        {/* 2. THE SKILLS GRID */}
        <section className="space-y-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Select Your Learning Track</h2>
            <p className="text-slate-500 text-lg font-medium">Choose the specific skill you want to master in this batch.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-slate-100 shadow-soft" />
               ))}
            </div>
          ) : skillTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {skillTracks.map((track) => (
                <button 
                  key={track.id} 
                  onClick={() => {
                    setFormData({...formData, selectedSkill: track.title});
                    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group text-left bg-white rounded-[2.5rem] overflow-hidden shadow-soft border transition-all duration-300 active:scale-[0.98]
                    ${formData.selectedSkill === track.title 
                      ? 'border-yawai-gold ring-8 ring-yawai-gold/10 scale-[1.02] shadow-2xl' 
                      : 'border-slate-100 hover:border-yawai-gold/40 hover:-translate-y-2'
                    }
                  `}
                >
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                     <img src={track.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={track.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     
                     {formData.selectedSkill === track.title && (
                       <div className="absolute top-6 right-6 bg-yawai-gold text-yawai-blue p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                         <CheckCircle size={24} />
                       </div>
                     )}

                     <div className="absolute bottom-8 left-8 right-8">
                        <span className="text-[10px] font-black text-yawai-gold uppercase tracking-[0.2em] mb-2 block">Skill Track</span>
                        <h3 className="font-black text-2xl text-white mb-1 leading-tight">{track.title}</h3>
                     </div>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3 mb-6">{track.description}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14} /> {track.duration || '3 Months'}
                       </span>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${formData.selectedSkill === track.title ? 'bg-yawai-gold text-yawai-blue' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors'}`}>
                          {formData.selectedSkill === track.title ? 'Selected' : 'Select Track'}
                       </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
               <Info size={48} className="mx-auto mb-4 text-yawai-gold" />
               <p className="text-xl font-black text-slate-800">No Skill Tracks Found</p>
               <p className="text-sm text-slate-500 mt-2">Add individual skills with the category <strong>'Skill Track'</strong> in your Admin Panel to list them here.</p>
               
               <div className="mt-8">
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Diagnostics
                  </button>
                  {showDebug && (
                    <div className="mt-4 p-4 bg-slate-900 rounded-2xl text-[10px] font-mono text-blue-300 text-left">
                       <p className="text-white border-b border-white/10 pb-1 mb-2">DB Raw Content ({allRawPrograms.length}):</p>
                       {allRawPrograms.map(p => (
                         <div key={p.id}>• {p.title} | Cat: <span className="text-yawai-gold">"{p.category}"</span></div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          )}
        </section>
      </div>

      {/* Main Registration Form */}
      <section id="register" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="bg-yawai-blue p-10 md:p-14 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <Users size={48} className="mx-auto mb-4 text-yawai-gold" />
                <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Final Step: Register</h2>
                <p className="text-slate-400 font-medium">Please provide accurate details to secure your admission.</p>
             </div>
             
             <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-8">
                {formData.selectedSkill ? (
                  <div className="bg-yawai-gold/10 border border-yawai-gold/20 p-6 rounded-3xl flex items-center justify-between animate-fade-in">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yawai-gold text-yawai-blue rounded-2xl flex items-center justify-center">
                           <Star size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-yawai-gold uppercase tracking-widest">Applying For</p>
                           <p className="text-xl font-black text-slate-800">{formData.selectedSkill}</p>
                        </div>
                     </div>
                     <button type="button" onClick={() => setFormData({...formData, selectedSkill: ''})} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors bg-white px-3 py-1 rounded-full border border-slate-200">Change</button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center">
                     <Info className="mx-auto text-slate-300 mb-2" size={32} />
                     <p className="text-sm font-bold text-slate-500">Please select a skill track from the grid above to continue</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all font-medium"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="johndoe@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all font-medium"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+234..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all font-medium"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 opacity-50 pointer-events-none">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Program Batch</label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 font-black text-slate-400 uppercase">
                      2026 Cohort
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motivation</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Briefly tell us why you want to master this skill..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all resize-none font-medium"
                    value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !formData.selectedSkill}
                  className="w-full bg-yawai-blue text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Send size={20} className="text-yawai-gold" />
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white text-center border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-6">
            <h4 className="text-xl font-black mb-2 text-slate-900 tracking-tight">Youngsters and Women Advancement Initiative</h4>
            <p className="text-slate-500 text-sm mb-8 font-medium">Equipping the next generation of leaders and innovators.</p>
         </div>
      </footer>
    </div>
  );
};

export default ProgramRegistration;
