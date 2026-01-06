
import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { contentService } from '../services/contentService';
import { Briefcase, GraduationCap, Coins, ExternalLink, Loader2, Filter } from 'lucide-react';

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const tabs = ['All', 'Job', 'Scholarship', 'Grant', 'Internship', 'Bootcamp'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await contentService.fetchOpportunities();
      setOpportunities(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredOpp = filter === 'All' 
    ? opportunities 
    : opportunities.filter(o => o.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Job': return <Briefcase size={24} className="text-white" />;
      case 'Scholarship': return <GraduationCap size={24} className="text-white" />;
      case 'Grant': return <Coins size={24} className="text-white" />;
      default: return <Briefcase size={24} className="text-white" />;
    }
  };
  
  const getIconBg = (type: string) => {
    switch (type) {
      case 'Job': return 'bg-blue-500 shadow-blue-500/30';
      case 'Scholarship': return 'bg-green-500 shadow-green-500/30';
      case 'Grant': return 'bg-yawai-gold shadow-yellow-500/30';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100">
        <h2 className="text-3xl font-extrabold text-yawai-blue mb-6 tracking-tight">Opportunities Board</h2>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-4 no-scrollbar gap-3">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all
                ${filter === tab 
                  ? 'bg-yawai-blue text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="animate-spin text-yawai-gold" size={48} />
           <p className="mt-4 text-slate-400 font-bold">Checking for new opportunities...</p>
        </div>
      ) : filteredOpp.length > 0 ? (
        <div className="space-y-4">
          {filteredOpp.map((item) => (
            <div key={item.id} className="group bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl hover:border-yawai-gold/30 transition-all duration-300">
               <div className="flex items-start gap-6">
                 <div className={`p-4 rounded-2xl shadow-lg ${getIconBg(item.type)} transition-transform group-hover:scale-110`}>
                   {getIcon(item.type)}
                 </div>
                 <div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">{item.type}</span>
                   <h3 className="text-xl font-bold text-slate-800 mt-2 mb-1 group-hover:text-yawai-blue transition-colors">{item.title}</h3>
                   <p className="text-sm text-slate-500 font-medium">{item.organization}</p>
                   <p className="text-xs text-red-400 font-semibold mt-3 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Deadline: {item.deadline}
                   </p>
                 </div>
               </div>
               <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-slate-50 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-yawai-gold hover:text-white transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
               >
                 Apply Now <ExternalLink size={16} />
               </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
           <div className="inline-block p-4 bg-slate-100 rounded-full mb-4"><Filter size={32} /></div>
           <p className="font-bold">No active opportunities</p>
           <p className="text-sm">We are scouting for new grants and jobs. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
