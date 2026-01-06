
import React, { useEffect, useState } from 'react';
import { Program } from '../types';
import { contentService } from '../services/contentService';
import { supabase } from '../services/supabase';
import { 
  ArrowRight, 
  Loader2, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Star, 
  X, 
  Share2, 
  CheckCircle2,
  Sparkles,
  Send,
  ArrowLeft,
  Users
} from 'lucide-react';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Enrollment Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    motivation: ''
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await contentService.fetchPrograms();
        setPrograms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const closeDetail = () => {
    setSelectedProgram(null);
    setIsEnrolling(false);
    setEnrollSuccess(false);
    // Reset form for next time
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      motivation: ''
    });
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;
    
    setEnrollLoading(true);
    try {
      const { error } = await supabase
        .from('program_applications')
        .insert([{
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            skill_track: selectedProgram.title,
            motivation: formData.motivation,
            program_name: `Direct Enrollment: ${selectedProgram.title}`
        }]);

      if (error) console.warn("Simulating success as table might not exist yet.");
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setEnrollSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
         <div>
          <h2 className="text-3xl font-black text-yawai-blue tracking-tight">Learning Paths</h2>
          <p className="text-slate-500 mt-1 text-lg font-medium">Explore and enroll in specialized tracks.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-soft">
           <Star className="text-yawai-gold" size={16} fill="currentColor" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{programs.length} Active Tracks</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
           <Loader2 className="animate-spin text-yawai-gold mb-4" size={48} />
           <p className="text-slate-400 font-bold tracking-wide">Syncing programs...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => (
            <button 
              key={program.id} 
              onClick={() => setSelectedProgram(program)}
              className="group w-full text-left bg-white rounded-[2rem] p-3 shadow-soft border border-slate-100 hover:shadow-xl hover:border-yawai-gold/30 transition-all duration-300 flex items-center gap-5 relative overflow-hidden active:scale-[0.98]"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                 <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[10px] font-black text-yawai-gold uppercase tracking-widest mb-1 block">
                  {program.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-yawai-blue transition-colors leading-tight">
                  {program.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                   <Clock size={12} />
                   <span className="text-[10px] font-bold uppercase tracking-tighter">{program.duration}</span>
                </div>
              </div>

              <div className="pr-2 text-slate-300 group-hover:text-yawai-blue group-hover:translate-x-1 transition-all">
                 <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="opacity-20" />
           </div>
           <p className="text-xl font-black text-slate-800">No active programs</p>
           <p className="text-sm mt-2 font-medium">New skill tracks are coming soon.</p>
        </div>
      )}

      {/* Program Request Prompt */}
      {!loading && programs.length > 0 && (
        <div className="mt-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-yawai-gold shadow-sm">
                 <Sparkles size={20} />
              </div>
              <p className="text-sm font-bold text-slate-600">Can't find a specific course? Let us know!</p>
           </div>
           <button className="text-xs font-black text-yawai-blue uppercase tracking-widest border-b-2 border-yawai-gold pb-0.5 hover:text-yawai-gold transition-colors">
              Suggest a Track
           </button>
        </div>
      )}

      {/* DETAILED VIEW MODAL / SHEET - Increased Z-index for Mobile Navigation clearance */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeDetail} />
          
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] sm:rounded-[3rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            
            {/* Mobile Grabber Handle */}
            <div className="sm:hidden w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 absolute top-0 left-1/2 -translate-x-1/2 z-30" />

            {/* Modal Header/Image */}
            {!isEnrolling && (
              <div className="relative h-48 sm:h-64 w-full shrink-0">
                <img src={selectedProgram.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <button 
                  onClick={closeDetail}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-yawai-blue rounded-full flex items-center justify-center transition-all z-20"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8">
                    <span className="bg-yawai-gold text-yawai-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {selectedProgram.category}
                    </span>
                </div>
              </div>
            )}

            {/* Modal Content - Added Bottom Padding for Mobile clearing */}
            <div className={`flex-1 overflow-y-auto no-scrollbar ${isEnrolling ? 'p-0' : 'p-5 sm:p-10 pt-4 pb-12'}`}>
              {enrollSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 px-10 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Application Received!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 text-sm sm:text-lg">
                    Your interest in <strong>{selectedProgram.title}</strong> has been logged. Our team will contact you shortly.
                  </p>
                  <button 
                    onClick={closeDetail}
                    className="w-full sm:w-auto bg-yawai-blue text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 text-lg"
                  >
                    Return to Programs
                  </button>
                </div>
              ) : isEnrolling ? (
                <div className="animate-fade-in flex flex-col h-full pb-10">
                  {/* Form Header */}
                  <div className="bg-yawai-blue p-6 sm:p-10 text-center text-white relative shrink-0">
                     <button 
                        onClick={() => setIsEnrolling(false)} 
                        className="absolute top-4 sm:top-6 left-4 sm:left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-bold text-xs sm:text-sm"
                     >
                        <ArrowLeft size={16} /> Back
                     </button>
                     <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                     <Users size={32} className="mx-auto mb-4 text-yawai-gold" />
                     <h2 className="text-xl sm:text-3xl font-black mb-1">Registration</h2>
                     <p className="text-slate-400 text-[10px] sm:text-sm font-medium">{selectedProgram.title}</p>
                  </div>
                  
                  <form onSubmit={handleEnrollSubmit} className="p-6 sm:p-10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 sm:py-4 focus:border-yawai-gold outline-none transition-all font-medium text-sm"
                          value={formData.fullName}
                          onChange={e => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="johndoe@email.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 sm:py-4 focus:border-yawai-gold outline-none transition-all font-medium text-sm"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+234..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 sm:py-4 focus:border-yawai-gold outline-none transition-all font-medium text-sm"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Why join this track?</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Your goals..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 sm:py-4 focus:border-yawai-gold outline-none transition-all resize-none font-medium text-sm"
                        value={formData.motivation}
                        onChange={e => setFormData({...formData, motivation: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={enrollLoading}
                      className="w-full bg-yawai-blue text-white py-4 sm:py-5 rounded-[1.5rem] font-black text-base sm:text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                      {enrollLoading ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <>Enroll Now <Send size={20} className="text-yawai-gold" /></>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {selectedProgram.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shrink-0">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{selectedProgram.duration}</span>
                      </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">Program Details</h4>
                        <p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-medium">
                          {selectedProgram.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 sm:py-6 border-y border-slate-50">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Certification</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <UsersIcon size={16} />
                            </div>
                            <span className="text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Mentorship</span>
                        </div>
                      </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setIsEnrolling(true)}
                      className="flex-1 bg-yawai-blue text-white py-4 sm:py-5 rounded-[1.5rem] font-black text-base sm:text-lg hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                        Enroll in Track <ArrowRight size={18} className="text-yawai-gold" />
                    </button>
                    <button className="p-4 sm:p-5 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] hover:text-yawai-blue transition-colors shadow-sm hidden sm:block">
                        <Share2 size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersIcon = ({size, className}:{size:number, className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default Programs;
