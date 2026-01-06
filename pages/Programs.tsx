
import React, { useEffect, useState } from 'react';
import { Program } from '../types';
import { contentService } from '../services/contentService';
import { ArrowRight, Loader2, BookOpen, ChevronRight, Clock, Star } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
         <div>
          <h2 className="text-3xl font-extrabold text-yawai-blue tracking-tight">Active Programs</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Professional training and skill acquisition paths.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
           <Star className="text-yawai-gold" size={16} fill="currentColor" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{programs.length} Tracks Available</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
           <Loader2 className="animate-spin text-yawai-gold mb-4" size={48} />
           <p className="text-slate-400 font-bold tracking-wide">Syncing programs...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="space-y-5">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="group bg-white rounded-[2rem] p-4 md:p-5 shadow-soft border border-slate-100 hover:shadow-xl hover:border-yawai-gold/30 transition-all duration-300 flex items-center gap-5 md:gap-8 relative overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[1.5rem] overflow-hidden shrink-0 shadow-md">
                 <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   <span className="bg-yawai-gold/10 text-yawai-gold text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                     {program.category}
                   </span>
                   <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                     <Clock size={12} /> {program.duration}
                   </span>
                </div>
                
                <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-1 truncate group-hover:text-yawai-blue transition-colors">
                  {program.title}
                </h3>
                
                <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-1 font-medium leading-relaxed max-w-2xl">
                   {program.description}
                </p>

                <div className="mt-4 hidden md:flex">
                   <button className="text-xs font-bold text-yawai-blue flex items-center gap-2 group-hover:gap-3 transition-all">
                      View Syllabus & Enroll <ArrowRight size={14} className="text-yawai-gold" />
                   </button>
                </div>
              </div>

              {/* Right Action Trigger */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2">
                <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-yawai-blue group-hover:border-yawai-blue group-hover:bg-slate-50 transition-all shadow-sm">
                   <ChevronRight size={24} />
                </div>
              </div>

              {/* Mobile Interaction Layer */}
              <button className="absolute inset-0 z-10 md:hidden" aria-label="View Program Details" />
            </div>
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

      {/* Program Request Card */}
      {!loading && programs.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-yawai-blue to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute right-0 bottom-0 p-10 opacity-5">
              <Star size={180} fill="white" />
           </div>
           <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2">Can't find what you need?</h4>
              <p className="text-slate-400 text-sm max-w-md mb-6">Suggest a skill track or training category you'd like us to introduce in the next cohort.</p>
              <button className="bg-yawai-gold text-yawai-blue px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg">
                 Suggest a Program
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
