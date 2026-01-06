
import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X,
  Loader2,
  ChevronRight,
  MessageSquare,
  ArrowUpDown
} from 'lucide-react';
import { supabase } from '../../services/supabase';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  skill_track: string;
  motivation: string;
  program_name: string;
  created_at: string;
  status?: 'pending' | 'contacted' | 'rejected';
}

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('program_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn("Table 'program_applications' does not exist yet.");
          setApplications([]);
        } else {
          throw error;
        }
      } else {
        setApplications(data || []);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) return;
    
    try {
      const { error } = await supabase
        .from('program_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      alert("Failed to delete record. Ensure your RLS policies allow deletion.");
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTrack === 'All' || app.skill_track === filterTrack;
    return matchesSearch && matchesFilter;
  });

  const tracks = ['All', ...new Set(applications.map(app => app.skill_track))];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Program Applications</h2>
          <p className="text-slate-500 text-sm font-medium">Manage and process registrations from all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <ClipboardList size={18} className="text-yawai-gold" />
            <span className="text-sm font-bold text-slate-700">{applications.length} Submissions</span>
          </div>
          <button 
            onClick={fetchApplications}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-yawai-blue transition-colors"
          >
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search applicants by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-blue transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="flex-1 md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-yawai-blue appearance-none cursor-pointer"
          >
            {tracks.map(track => <option key={track} value={track}>{track}</option>)}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold tracking-wide">Syncing submissions...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Track</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 group transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 border border-slate-200">
                          {app.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{app.full_name}</p>
                          <p className="text-xs text-slate-500 truncate">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {app.skill_track}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} className="text-slate-300" />
                        <span className="text-xs font-medium">
                          {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => { e.stopPropagation(); window.open(`mailto:${app.email}`); }}
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                         >
                           <Mail size={16} />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }}
                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                         >
                           <Trash2 size={16} />
                         </button>
                         <ChevronRight size={18} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ClipboardList size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">No Applications Found</h4>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">When users register for programs, they will appear here for processing.</p>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-yawai-blue text-yawai-gold rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                   {selectedApp.full_name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedApp.full_name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Application ID: {selectedApp.id.split('-')[0]}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skill Interest</p>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={20} className="text-green-500" />
                     <span className="text-lg font-bold text-slate-800">{selectedApp.skill_track}</span>
                   </div>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Origin Program</p>
                   <p className="text-lg font-bold text-slate-800 line-clamp-1">{selectedApp.program_name}</p>
                 </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={18} className="text-yawai-gold" /> Statement of Motivation
                  </h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed font-medium">
                    "{selectedApp.motivation}"
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Information</h4>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={`mailto:${selectedApp.email}`}
                      className="flex-1 min-w-[200px] flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-yawai-blue hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="text-slate-400 group-hover:text-yawai-blue" size={20} />
                        <span className="font-bold text-slate-700">{selectedApp.email}</span>
                      </div>
                      <ExternalLink size={14} className="text-slate-300" />
                    </a>
                    <a 
                      href={`tel:${selectedApp.phone}`}
                      className="flex-1 min-w-[200px] flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="text-slate-400 group-hover:text-green-500" size={20} />
                        <span className="font-bold text-slate-700">{selectedApp.phone}</span>
                      </div>
                      <ExternalLink size={14} className="text-slate-300" />
                    </a>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
               <button 
                 onClick={() => { window.open(`mailto:${selectedApp.email}?subject=Regarding your application for ${selectedApp.skill_track}`); }}
                 className="flex-1 bg-yawai-blue text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2"
               >
                 Review & Reply
               </button>
               <button 
                onClick={() => handleDelete(selectedApp.id)}
                className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors border border-red-100"
               >
                 <Trash2 size={24} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
