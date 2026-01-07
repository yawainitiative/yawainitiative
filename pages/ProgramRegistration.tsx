
import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, ArrowLeft, Loader2, Send, 
  Target, Rocket, Users, Info, Sparkles, AlertCircle, Database
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
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
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
        // Check if data exists at all
        if (allPrograms.length === 0) {
           setErrorStatus("NO_PROGRAMS_FOUND");
        }
        
        // Filter for Skill Acquisition category (Case-insensitive check)
        const skills = allPrograms.filter(p => 
          p.category?.toLowerCase() === 'skill acquisition'
        );
        
        if (allPrograms.length > 0 && skills.length === 0) {
           setErrorStatus("NO_SKILLS_CATEGORY");
        }

        setSkillTracks(skills);
      } catch (err: any) {
        console.error("Failed to load skills:", err);
        setErrorStatus("DATABASE_ERROR");
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
      console.error(err);
      alert(`Registration failed: ${err.message || 'Please check your connection.'}`);
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
          Thank you for applying to the YAWAI Skill Acquisition Program. We have sent a confirmation email to <span className="font-bold text-slate-900">{formData.email}</span>.
        </p>
        <Link to="/" className="bg-yawai-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95">
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Navigation */}
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
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Rocket size={300} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-yawai-gold/20 border border-yawai-gold/30 text-yawai-goldLight px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in">
             <Calendar size={12} /> Registration Opens Jan 6, 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] max-w-4xl animate-slide-up">
            Master a Skill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Empower Your Future.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-8 animate-slide-up font-medium leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Our 3-Month Skill Acquisition Program is now accepting registrations. Select your preferred track below to begin.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle size={18} className="text-yawai-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Training</span>
             </div>
             <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle size={18} className="text-yawai-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Expert Facilitators</span>
             </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Explore the Tracks</h2>
              <p className="text-slate-500 max-w-xl text-lg font-medium">Choose a track to begin your journey.</p>
            </div>
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
                  <div className="p-6">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">{track.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
               {errorStatus === 'DATABASE_ERROR' ? (
                 <>
                   <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                   <p className="text-xl font-black text-slate-800">Connection Issue</p>
                   <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">Could not reach the database. Please ensure your Supabase project is active and tables are created.</p>
                 </>
               ) : errorStatus === 'NO_PROGRAMS_FOUND' ? (
                 <>
                   <Database size={48} className="mx-auto mb-4 text-slate-300" />
                   <p className="text-xl font-black text-slate-800">Database Empty</p>
                   <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">No programs found. Go to the Admin Dashboard &rarr; Content Manager to add your first training track.</p>
                 </>
               ) : (
                 <>
                   <Info size={48} className="mx-auto mb-4 text-yawai-gold" />
                   <p className="text-xl font-black text-slate-800">No Skill Tracks Found</p>
                   <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">We found programs in your DB, but none were tagged with the <strong>'Skill Acquisition'</strong> category.</p>
                 </>
               )}
               <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yawai-blue bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-white transition-all">
                  Access Admin Dashboard
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Registration Form */}
      <section id="register" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="bg-yawai-blue p-10 md:p-14 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <Users size={48} className="mx-auto mb-4 text-yawai-gold" />
                <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Registration Portal</h2>
                <p className="text-slate-400 font-medium">Please provide accurate details to secure your admission.</p>
             </div>
             
             <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-8">
                {formData.selectedSkill ? (
                  <div className="bg-yawai-gold/10 border border-yawai-gold/20 p-5 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yawai-gold text-yawai-blue rounded-xl flex items-center justify-center">
                           <Target size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-yawai-gold uppercase tracking-widest">Selected Track</p>
                           <p className="text-lg font-black text-slate-800">{formData.selectedSkill}</p>
                        </div>
                     </div>
                     <button type="button" onClick={() => setFormData({...formData, selectedSkill: ''})} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">Change</button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-2xl text-center">
                     <Info className="mx-auto text-slate-300 mb-2" size={24} />
                     <p className="text-sm font-bold text-slate-500">Please select a skill track from the grid above</p>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cohort</label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 font-black text-slate-400 uppercase">
                      January 2026 Batch
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Why are you joining this track?</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Briefly tell us about your goals and expectations..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all resize-none font-medium"
                    value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-yawai-blue text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send size={20} className="text-yawai-gold" />
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer Overlay */}
      <footer className="py-16 bg-slate-900 text-white text-center">
         <div className="max-w-7xl mx-auto px-6">
            <h4 className="text-xl font-black mb-2">Youngsters and Women Advancement Initiative</h4>
            <p className="text-slate-500 text-sm mb-8 font-medium">Equipping the next generation of leaders and innovators.</p>
         </div>
      </footer>
    </div>
  );
};

export default ProgramRegistration;
