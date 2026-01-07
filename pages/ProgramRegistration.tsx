
import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, ArrowLeft, Loader2, Send, 
  Target, Rocket, Users, Info, Sparkles, AlertCircle, Database, Settings, ChevronDown, ChevronUp
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
           // FUZZY MATCHING: Accept "Skill Acquisition", "skills", "acquisition", etc.
           const skills = allPrograms.filter(p => {
             const cat = (p.category || '').toLowerCase().trim();
             return cat.includes('skill') || cat.includes('acquisition') || cat === 'training';
           });
           
           if (skills.length === 0) {
              setErrorStatus("NO_SKILLS_MATCH");
           }
           setSkillTracks(skills);
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
            program_name: '3-Month Skill Acquisition 2026'
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
    <div className="min-h-screen bg-white pb-20 font-sans">
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

      <section className="pt-32 pb-20 bg-gradient-to-br from-yawai-blue via-slate-900 to-yawai-blue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-yawai-gold/20 border border-yawai-gold/30 text-yawai-goldLight px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in">
             <Calendar size={12} /> Registration Batch 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] max-w-4xl animate-slide-up">
            Master a Skill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Empower Your Future.</span>
          </h1>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Explore the Tracks</h2>
            <p className="text-slate-500 max-w-xl text-lg font-medium">Choose a track to begin your journey.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="bg-white rounded-[2.5rem] h-80 animate-pulse border border-slate-100" />
               ))}
            </div>
          ) : skillTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {skillTracks.map((track) => (
                <button 
                  key={track.id} 
                  onClick={() => setFormData({...formData, selectedSkill: track.title})}
                  className={`group text-left bg-white rounded-[2.5rem] overflow-hidden shadow-soft border transition-all duration-300 active:scale-[0.98]
                    ${formData.selectedSkill === track.title 
                      ? 'border-yawai-gold ring-4 ring-yawai-gold/10 scale-[1.02] shadow-xl' 
                      : 'border-slate-100 hover:border-yawai-gold/40 hover:-translate-y-2'
                    }
                  `}
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                     <img src={track.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={track.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     {formData.selectedSkill === track.title && (
                       <div className="absolute top-4 right-4 bg-yawai-gold text-yawai-blue p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                         <CheckCircle size={20} />
                       </div>
                     )}
                     <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-black text-xl text-white mb-1 leading-tight">{track.title}</h3>
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{track.duration || '3 Month Intensive'}</p>
                     </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 md:p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
               <div className="max-w-md mx-auto">
                 <Info size={48} className="mx-auto mb-4 text-yawai-gold" />
                 <p className="text-xl font-black text-slate-800">No Skill Tracks Found</p>
                 <p className="text-sm text-slate-500 mt-2">
                   {errorStatus === "TABLE_EMPTY" 
                    ? "Your 'programs' table is currently empty." 
                    : "Programs exist, but none match the 'Skill Acquisition' category."}
                 </p>
                 
                 {/* DEBUG SECTION */}
                 <div className="mt-8 pt-8 border-t border-slate-100 text-left">
                    <button 
                      onClick={() => setShowDebug(!showDebug)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                    >
                       {showDebug ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Admin Diagnostics
                    </button>
                    
                    {showDebug && (
                      <div className="mt-4 p-4 bg-slate-900 rounded-2xl text-[10px] font-mono text-blue-300 overflow-x-auto">
                        <p className="text-white mb-2 font-black border-b border-white/10 pb-1">Raw Programs Found ({allRawPrograms.length}):</p>
                        {allRawPrograms.length > 0 ? (
                          <ul className="space-y-1">
                            {allRawPrograms.map(p => (
                              <li key={p.id}>• "{p.title}" | Category: <span className="text-yawai-gold">"{p.category}"</span></li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-red-400">Database returned 0 records.</p>
                        )}
                        <p className="mt-4 text-slate-500">Note: Ensure "Public Select" policy is enabled in Supabase SQL Editor.</p>
                      </div>
                    )}
                 </div>

                 <Link to="/admin/content" className="mt-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yawai-blue bg-yawai-gold px-8 py-3 rounded-xl shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all">
                    <Settings size={14} /> Fix in Content Manager
                 </Link>
               </div>
            </div>
          )}
        </div>
      </section>

      <section id="register" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="bg-yawai-blue p-10 md:p-14 text-center text-white relative">
                <Users size={48} className="mx-auto mb-4 text-yawai-gold" />
                <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Registration Portal</h2>
             </div>
             <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-8">
                {formData.selectedSkill ? (
                  <div className="bg-yawai-gold/10 border border-yawai-gold/20 p-5 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yawai-gold text-yawai-blue rounded-xl flex items-center justify-center"><Target size={20} /></div>
                        <div>
                           <p className="text-[10px] font-black text-yawai-gold uppercase tracking-widest">Track</p>
                           <p className="text-lg font-black text-slate-800">{formData.selectedSkill}</p>
                        </div>
                     </div>
                     <button type="button" onClick={() => setFormData({...formData, selectedSkill: ''})} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500">Change</button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-2xl text-center">
                     <p className="text-sm font-bold text-slate-500">Please select a skill track above</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none font-medium" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  <input required type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-yawai-blue text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3">
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : <>Submit Application <Send size={20} className="text-yawai-gold" /></>}
                </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramRegistration;
