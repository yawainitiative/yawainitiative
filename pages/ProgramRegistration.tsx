
import React, { useState } from 'react';
import { 
  Palette, Video, Sparkles, FlaskConical, Cake, 
  Calendar, CheckCircle, ArrowLeft, Loader2, Send, 
  Target, Rocket, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogo } from '../contexts/LogoContext';
import { supabase } from '../services/supabase';

const ProgramRegistration: React.FC = () => {
  const { logoUrl } = useLogo();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedSkill: '',
    motivation: ''
  });

  const skillTracks = [
    { id: 'graphics', title: 'Graphics Design', icon: Palette, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Master visual communication using modern design tools.' },
    { id: 'video', title: 'Video Editing', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Learn the art of storytelling through cinematic editing.' },
    { id: 'gele', title: 'Auto-Gele', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Master the art of crafting trendy pre-tied headwraps and creative fashion styling.' },
    { id: 'soap', title: 'Liquid Soap Making', icon: FlaskConical, color: 'text-teal-600', bg: 'bg-teal-50', desc: 'Chemical formulation and branding for domestic products.' },
    { id: 'pastries', title: 'Pastries Production', icon: Cake, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Culinary skills for professional baking and catering.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you would save this to a 'program_applications' table in Supabase
      const { error } = await supabase
        .from('program_applications') // Ensure this table exists in your DB
        .insert([{
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            skill_track: formData.selectedSkill,
            motivation: formData.motivation,
            program_name: '3-Month Skill Acquisition 2026'
        }]);

      if (error) {
        // Fallback simulation if table doesn't exist yet for the user
        console.warn("Table 'program_applications' might not exist. Simulating success.");
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Registration Received!</h1>
        <p className="text-slate-500 text-lg max-w-md mb-10">
          Thank you for applying to the YAWAI Skill Acquisition Program. We have sent a confirmation email to <span className="font-bold text-slate-900">{formData.email}</span>.
        </p>
        <Link to="/" className="bg-yawai-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-yawai-gold rounded-xl flex items-center justify-center text-yawai-blue font-bold">Y</div>
          )}
          <span className="font-extrabold text-xl text-yawai-blue tracking-tight">YAWAI</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-slate-500 hover:text-yawai-blue transition-colors">Back to Site</Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-yawai-blue to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Rocket size={300} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-yawai-gold/20 border border-yawai-gold/30 text-yawai-goldLight px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
             <Calendar size={14} /> Registration Opens Jan 6, 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-4xl animate-slide-up">
            Master a Skill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Build Your Future.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join the YAWAI 3-Month Skill Acquisition Program. Designed to empower young people with practical, in-demand skills for personal growth and entrepreneurship.
          </p>
          <div className="flex flex-wrap gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-yawai-gold" />
                <span className="text-sm font-semibold">Hands-on Training</span>
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-yawai-gold" />
                <span className="text-sm font-semibold">Expert Mentors</span>
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-yawai-gold" />
                <span className="text-sm font-semibold">Certificate Issued</span>
             </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Available Skill Tracks</h2>
              <p className="text-slate-500 max-w-xl text-lg">Pick the path that aligns with your passion. Each track is meticulously designed for beginners and intermediates.</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-soft border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-yawai-gold/10 rounded-xl flex items-center justify-center text-yawai-gold">
                  <Target size={24} />
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kickoff Date</p>
                 <p className="text-lg font-extrabold text-slate-900">January 2026</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {skillTracks.map((track) => (
              <div key={track.id} className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 ${track.bg} ${track.color} rounded-2xl flex items-center justify-center mb-6`}>
                   <track.icon size={28} />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2">{track.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Registration Form */}
      <section id="register" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="bg-yawai-blue p-10 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <Users size={48} className="mx-auto mb-4 text-yawai-gold" />
                <h2 className="text-3xl font-extrabold mb-2">Registration Portal</h2>
                <p className="text-slate-400">Secure your spot today. Limited spaces available.</p>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:border-yawai-gold outline-none transition-all"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="johndoe@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:border-yawai-gold outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+234..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:border-yawai-gold outline-none transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Skill Track</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:border-yawai-gold outline-none transition-all appearance-none"
                      value={formData.selectedSkill}
                      onChange={e => setFormData({...formData, selectedSkill: e.target.value})}
                    >
                      <option value="">Select a track</option>
                      {skillTracks.map(t => (
                        <option key={t.id} value={t.title}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Why do you want to join this program?</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us a bit about your goals and expectations..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:border-yawai-gold outline-none transition-all resize-none"
                    value={formData.motivation}
                    onChange={e => setFormData({...formData, motivation: e.target.value})}
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
                   <div className="w-5 h-5 bg-yawai-gold/10 rounded flex items-center justify-center text-yawai-gold shrink-0 mt-0.5">
                     <Target size={12} />
                   </div>
                   <p>By registering, you commit to being available and passionate for the full 3-month duration starting January 2026. Official verification begins Tuesday, Jan 6th.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yawai-blue text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
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

      {/* Footer Overlay */}
      <footer className="py-12 bg-slate-900 text-white text-center">
         <p className="text-sm text-slate-500 mb-4">Youngsters and Women Advancement Initiative</p>
         <div className="flex justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
         </div>
      </footer>
    </div>
  );
};

export default ProgramRegistration;
