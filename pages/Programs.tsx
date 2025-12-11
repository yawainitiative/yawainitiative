import React from 'react';
import { PROGRAMS } from '../constants';
import { ArrowRight } from 'lucide-react';

const Programs: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
          <h2 className="text-3xl font-extrabold text-yawai-blue tracking-tight">Training Programs</h2>
          <p className="text-slate-500 mt-2 text-lg">Skill up with our expert-led workshops and courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROGRAMS.map((program) => (
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
    </div>
  );
};

export default Programs;