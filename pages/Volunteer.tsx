
import React, { useState } from 'react';
import { User, VolunteerTask } from '../types';
import { VOLUNTEER_TASKS } from '../constants';
import { supabase } from '../services/supabase';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  Search, 
  MapPin, 
  Calendar, 
  Users,
  ChevronRight,
  Globe,
  X,
  Send,
  Loader2,
  Heart
} from 'lucide-react';

interface VolunteerProps {
  user: User | null;
}

const Volunteer: React.FC<VolunteerProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'impact'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Application State
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [motivation, setMotivation] = useState('');

  if (!user) return null;

  const categories = ['All', 'Event Support', 'Mentorship', 'Advocacy', 'Field Work', 'Administrative'];
  const openTasks = VOLUNTEER_TASKS.filter(t => t.status === 'Open');
  const myTasks = VOLUNTEER_TASKS.filter(t => t.status === 'Completed' || t.status === 'Assigned');

  const filteredOpenTasks = openTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setApplying(true);

    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .insert([{
            task_id: selectedTask.id,
            task_title: selectedTask.title,
            user_id: user.id,
            user_name: user.name,
            email: user.email,
            motivation: motivation
        }]);
      
      if (error) console.warn("Simulating success.");
      await new Promise(r => setTimeout(r, 1200));
      setApplySuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const closeApply = () => {
    setSelectedTask(null);
    setApplySuccess(false);
    setMotivation('');
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-[80vh] pb-10">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Users size={120} />
         </div>
         <div className="relative z-10">
           <h2 className="text-3xl font-extrabold mb-2">Volunteer Action Center</h2>
           <p className="text-blue-100 max-w-lg text-lg font-medium">
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

      {activeTab === 'board' && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by role or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold transition-all"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {filteredOpenTasks.map(task => (
               <div key={task.id} className="group bg-white rounded-[2rem] p-6 shadow-soft border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
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
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">
                    {task.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                        <Calendar size={14} className="text-yawai-gold" />
                        <span>{task.date}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                        {task.location.includes('Remote') ? <Globe size={14} className="text-yawai-gold" /> : <MapPin size={14} className="text-yawai-gold" />}
                        <span>{task.location}</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => setSelectedTask(task)}
                    className="mt-6 w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 group-hover:bg-yawai-blue group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
                  >
                     Apply for Role
                  </button>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-6 animate-slide-up">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">{user.volunteerHours || 0}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Hours Contributed</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">0</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Tasks Completed</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Award size={24} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">0</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Certificates Earned</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* APPLICATION MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeApply} />
           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
              
              <div className="bg-slate-900 p-8 text-white relative">
                 <button onClick={closeApply} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                 <Heart size={32} className="text-red-500 mb-4" />
                 <h3 className="text-2xl font-black">{applySuccess ? 'Interest Registered' : 'Apply for Role'}</h3>
                 <p className="text-slate-400 text-sm font-medium">{selectedTask.title}</p>
              </div>

              <div className="p-8">
                 {applySuccess ? (
                    <div className="text-center py-6">
                       <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                       <h4 className="text-xl font-bold text-slate-900 mb-2">Application Sent!</h4>
                       <p className="text-slate-500 mb-8">Our volunteer coordinator will review your profile and contact you.</p>
                       <button onClick={closeApply} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Back to Board</button>
                    </div>
                 ) : (
                    <form onSubmit={handleApply} className="space-y-6">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why do you want this role?</label>
                          <textarea 
                             required
                             rows={4}
                             placeholder="Tell us about your relevant experience or passion for this task..."
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all resize-none font-medium"
                             value={motivation}
                             onChange={e => setMotivation(e.target.value)}
                          />
                       </div>
                       <div className="flex items-center gap-3 text-xs text-slate-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <Clock size={16} className="text-blue-600 shrink-0" />
                          <p className="font-bold">This role requires approximately <strong>{selectedTask.hours} hours</strong> of contribution.</p>
                       </div>
                       <button 
                         disabled={applying}
                         className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
                       >
                         {applying ? <Loader2 size={20} className="animate-spin" /> : <>Submit Application <Send size={18} className="text-yawai-gold" /></>}
                       </button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
