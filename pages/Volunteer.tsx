import React, { useState } from 'react';
import { User } from '../types';
import { VOLUNTEER_TASKS } from '../constants';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  Briefcase, 
  Users,
  ChevronRight,
  Globe
} from 'lucide-react';

interface VolunteerProps {
  user: User | null;
}

const Volunteer: React.FC<VolunteerProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'impact'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!user) return null;

  // Filter Logic
  const categories = ['All', 'Event Support', 'Mentorship', 'Advocacy', 'Field Work', 'Administrative'];
  
  const openTasks = VOLUNTEER_TASKS.filter(t => t.status === 'Open');
  const myTasks = VOLUNTEER_TASKS.filter(t => t.status === 'Completed' || t.status === 'Assigned');

  const filteredOpenTasks = openTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in min-h-[80vh]">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Users size={120} />
         </div>
         <div className="relative z-10">
           <h2 className="text-3xl font-extrabold mb-2">Volunteer Action Center</h2>
           <p className="text-blue-100 max-w-lg text-lg">
             Welcome, {user.name.split(' ')[0]}. Find your next mission and track your community impact.
           </p>
         </div>
         
         {/* Navigation Tabs */}
         <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setActiveTab('board')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2
                ${activeTab === 'board' 
                  ? 'bg-yawai-gold text-yawai-blue shadow-glow' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              <Search size={16} /> Opportunity Board
            </button>
            <button 
              onClick={() => setActiveTab('impact')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2
                ${activeTab === 'impact' 
                  ? 'bg-yawai-gold text-yawai-blue shadow-glow' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              <Award size={16} /> My Impact & History
            </button>
         </div>
      </div>

      {/* VIEW: OPPORTUNITY BOARD */}
      {activeTab === 'board' && (
        <div className="space-y-6 animate-slide-up">
          
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by role or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all
                      ${selectedCategory === cat 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {filteredOpenTasks.map(task => (
               <div key={task.id} className="group bg-white rounded-[2rem] p-6 shadow-soft border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${task.category === 'Field Work' ? 'bg-green-100 text-green-700' : 
                          task.category === 'Mentorship' ? 'bg-purple-100 text-purple-700' : 
                          'bg-blue-50 text-blue-700'}
                     `}>
                       {task.category}
                     </span>
                     <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                       <Clock size={12} /> {task.hours} Hrs
                     </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <Calendar size={14} className="text-yawai-gold" />
                        <span>{task.date}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        {task.location.includes('Remote') ? <Globe size={14} className="text-yawai-gold" /> : <MapPin size={14} className="text-yawai-gold" />}
                        <span>{task.location}</span>
                     </div>
                  </div>

                  <button className="mt-6 w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 group-hover:bg-yawai-blue group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                     Apply for Role
                  </button>
               </div>
             ))}

             {filteredOpenTasks.length === 0 && (
               <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <Briefcase size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No open opportunities match your search.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* VIEW: MY IMPACT */}
      {activeTab === 'impact' && (
        <div className="space-y-6 animate-slide-up">
           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">24</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Hours Contributed</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">5</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Tasks Completed</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Award size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">2</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Certificates Earned</p>
                 </div>
              </div>
           </div>

           {/* My Tasks List */}
           <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="font-bold text-lg text-slate-800">My Task History</h3>
              </div>
              <div className="divide-y divide-slate-50">
                 {myTasks.map(task => (
                   <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-800">{task.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                               ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                               {task.status}
                            </span>
                         </div>
                         <p className="text-sm text-slate-500">{task.date} • {task.location}</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-sm font-bold text-slate-400">{task.hours} Hours Credit</span>
                         <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-yawai-blue hover:border-yawai-blue transition-colors">
                            <ChevronRight size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
                 {myTasks.length === 0 && (
                   <div className="p-8 text-center text-slate-400">
                      <p>You haven't signed up for any tasks yet.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Volunteer;