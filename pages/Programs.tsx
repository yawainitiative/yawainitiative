
import React, { useEffect, useState } from 'react';
import { Program } from '../types';
import { contentService } from '../services/contentService';
import { ArrowRight, Loader2, BookOpen } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
          <h2 className="text-3xl font-extrabold text-yawai-blue tracking-tight">Training Programs</h2>
          <p className="text-slate-500 mt-2 text-lg">Skill up with our expert-led workshops and courses.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="animate-spin text-yawai-gold" size={48} />
           <p className="mt-4 text-slate-400 font-bold">Loading available programs...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-soft border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="h-56 overflow-hidden relative">
                 <div className="absolute inset-0 bg-yawai-blue/10 group-hover:bg-transparent transition-colors z-10" />
                 <img src={program.image} alt={program.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur-md text-yawai-blue text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {program.category}
                    </span>
                 </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-yawai-gold transition-colors">{program.title}</h3>
                <p className="text-slate-600 mb-6 flex-1 leading-relaxed">{program.description}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-400">{program.duration}</span>
                  <button className="flex items-center gap-2 text-yawai-blue font-bold text-sm hover:gap-3 transition-all">
                    Enroll Now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
           <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
           <p className="text-lg font-bold">No active programs</p>
           <p className="text-sm">Check back later for new training opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default Programs;
