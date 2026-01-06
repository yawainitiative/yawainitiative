
import React, { useEffect, useState } from 'react';
import { Program } from '../types';
import { contentService } from '../services/contentService';
import { ArrowRight, Loader2, BookOpen, ChevronRight, Clock, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
         <div>
          <h2 className="text-3xl font-black text-yawai-blue tracking-tight">Active Programs</h2>
          <p className="text-slate-500 mt-1 text-lg font-medium">Professional training and skill acquisition paths.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-soft">
           <Star className="text-yawai-gold" size={16} fill="currentColor" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{programs.length} Tracks Live</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
           <Loader2 className="animate-spin text-yawai-gold mb-4" size={48} />
           <p className="text-slate-400 font-bold tracking-wide">Syncing your paths...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="space-y-4">
          {programs.map((program) => (
            <Link 
              key={program.id} 
              to={`/programs/${program.id}`} // Assuming a detail route exists or is planned
              className="group bg-white rounded-[2.5rem] p-4 md:p-5 shadow-soft border border-slate-100 hover:shadow-glow hover:border-yawai-gold/20 transition-all duration-300 flex items-center gap-5 md:gap-8 relative overflow-hidden"
            >
              {/* Image Section - Mirrors "Top Programs" card */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[1.8rem] overflow-hidden shrink-0 shadow-md">
                 <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                   <span className="bg-yawai-blue/5 text-yawai-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-yawai-blue/5">
                     {program.category}
                   </span>
                   <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     <Clock size={12} className="text-yawai-gold" /> {program.duration}
                   </span>
                </div>
                
                <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-1 truncate group-hover:text-yawai-blue transition-colors">
                  {program.title}
                </h3>
                
                <p className="text-slate-500 text-sm line-clamp-1 font-medium leading-relaxed hidden sm:block">
                   {program.description}
                </p>

                <div className="mt-3 flex items-center gap-2 md:hidden">
                   <span className="text-[10px] font-bold text-yawai-blue uppercase tracking-widest">Enroll Now</span>
                   <ArrowRight size={12} className="text-yawai-gold" />
                </div>
              </div>

              {/* Sleek Action Indicator */}
              <div className="hidden sm:flex items-center justify-center pr-2">
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-yawai-blue group-hover:border-yawai-gold group-hover:bg-yawai-gold/5 transition-all shadow-sm">
                   <ChevronRight size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="opacity-20" />
           </div>
           <p className="text-xl font-black text-slate-800">No active programs</p>
           <p className="text-sm mt-2 font-medium">We are currently curating new skill acquisition tracks.</p>
        </div>
      )}

      {/* Suggestion Card */}
      {!loading && (
        <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft relative overflow-hidden group">
           <div className="absolute right-0 bottom-0 p-8 opacity-5 text-yawai-blue transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
              <Sparkles size={160} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md">
                 <h4 className="text-2xl font-black text-yawai-blue mb-2">Can't find what you need?</h4>
                 <p className="text-slate-500 font-medium">Suggest a skill track or training category you'd like us to introduce in the next cohort.</p>
              </div>
              <button className="bg-yawai-blue text-white px-8 py-4 rounded-2xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
                 Suggest Track <ArrowRight size={18} className="text-yawai-gold" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
