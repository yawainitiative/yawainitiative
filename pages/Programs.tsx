
import React, { useEffect, useState } from 'react';
import { Program } from '../types';
import { contentService } from '../services/contentService';
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
  Sparkles
} from 'lucide-react';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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

  const closeDetail = () => setSelectedProgram(null);

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
              {/* Image Section - Mirrors Dashboard */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                 <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              </div>

              {/* Content Section - Simplified per request */}
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

              {/* Right Trigger Icon */}
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

      {/* DETAILED VIEW MODAL / SHEET */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-yawai-blue/40 backdrop-blur-md" onClick={closeDetail} />
          
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] sm:rounded-[3rem] rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            {/* Modal Header/Image */}
            <div className="relative h-64 sm:h-72 w-full shrink-0">
               <img src={selectedProgram.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
               <button 
                onClick={closeDetail}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-yawai-blue rounded-full flex items-center justify-center transition-all shadow-xl"
               >
                 <X size={24} />
               </button>
               <div className="absolute bottom-6 left-8">
                  <span className="bg-yawai-gold text-yawai-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {selectedProgram.category}
                  </span>
               </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 pt-2 overflow-y-auto no-scrollbar flex-1">
               <div className="flex justify-between items-start gap-4 mb-6">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">
                    {selectedProgram.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shrink-0">
                     <Clock size={16} />
                     <span className="text-xs font-bold uppercase tracking-widest">{selectedProgram.duration}</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About this program</h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      {selectedProgram.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center">
                           <CheckCircle2 size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">Certification Included</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                           <Users size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">Expert Mentorship</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Actions */}
            <div className="p-8 pt-4 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
               <button className="flex-1 bg-yawai-blue text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95">
                  Enroll in Track <ArrowRight size={20} className="text-yawai-gold" />
               </button>
               <button className="p-5 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] hover:text-yawai-blue transition-colors shadow-sm">
                  <Share2 size={24} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Users = ({size, className}:{size:number, className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default Programs;
