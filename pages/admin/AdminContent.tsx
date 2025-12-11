import React, { useState } from 'react';
import { PROGRAMS, EVENTS, OPPORTUNITIES, STORIES } from '../../constants';
import { Plus, Edit2, Trash2, BookOpen, Calendar, Briefcase, Smile, Eye } from 'lucide-react';

type ContentType = 'programs' | 'events' | 'opportunities' | 'stories';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('programs');

  const tabs = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'stories', label: 'Stories', icon: Smile },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Content Management</h2>
            <p className="text-slate-500">Create and manage content across the app.</p>
          </div>
          <button className="bg-yawai-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
             <Plus size={20} /> <span>Create New</span>
          </button>
       </div>

       {/* Tabs */}
       <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border
                ${activeTab === tab.id 
                  ? 'bg-white border-yawai-gold text-yawai-blue shadow-md' 
                  : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                }
              `}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-yawai-gold' : 'text-slate-400'} />
              {tab.label}
            </button>
          ))}
       </div>

       {/* Content Table */}
       <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden min-h-[400px]">
          {/* Render content based on active tab */}
          {activeTab === 'programs' && (
            <div className="divide-y divide-slate-100">
               {PROGRAMS.map(prog => (
                 <div key={prog.id} className="p-6 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-4">
                       <img src={prog.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                       <div>
                         <h4 className="font-bold text-slate-800">{prog.title}</h4>
                         <p className="text-xs text-slate-500">{prog.category} • {prog.duration}</p>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={18} /></button>
                       <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="divide-y divide-slate-100">
               {EVENTS.map(evt => (
                 <div key={evt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold border border-blue-100">
                          <span className="text-xs uppercase">{evt.date.split(' ')[0]}</span>
                          <span className="text-lg">{evt.date.split(' ')[1].replace(',', '')}</span>
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800">{evt.title}</h4>
                         <p className="text-xs text-slate-500">{evt.location}</p>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={18} /></button>
                       <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
          )}

           {activeTab === 'opportunities' && (
            <div className="divide-y divide-slate-100">
               {OPPORTUNITIES.map(opp => (
                 <div key={opp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                          <Briefcase size={20} />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800">{opp.title}</h4>
                         <p className="text-xs text-slate-500">{opp.type} • {opp.organization}</p>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={18} /></button>
                       <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
          )}

           {activeTab === 'stories' && (
            <div className="divide-y divide-slate-100">
               {STORIES.map(story => (
                 <div key={story.id} className="p-6 flex items-center justify-between hover:bg-slate-50 group">
                    <div className="flex items-center gap-4">
                       <img src={story.image} alt="" className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                       <div className="max-w-md">
                         <h4 className="font-bold text-slate-800">{story.author}</h4>
                         <p className="text-xs text-slate-500 line-clamp-1 italic">"{story.content}"</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200">Approve</button>
                       <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
};

export default AdminContent;