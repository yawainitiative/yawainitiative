
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
  Calendar,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../../services/supabase';

type SubmissionType = 'programs' | 'events' | 'volunteers';

const AdminApplications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubmissionType>('programs');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  // Copy Feedback States
  const [copyStatus, setCopyStatus] = useState<{field: string | null}>({field: null});

  const fetchData = async () => {
    setLoading(true);
    // CRITICAL: Clear existing data immediately to prevent ghosting between tabs
    setData([]); 
    
    try {
      let query;
      if (activeTab === 'programs') {
        query = supabase.from('program_applications').select('*');
      } else if (activeTab === 'events') {
        query = supabase.from('event_rsvps').select('*');
      } else {
        query = supabase.from('volunteer_applications').select('*');
      }

      const { data: result, error } = await query.order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') setData([]);
        else throw error;
      } else {
        setData(result || []);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus({ field });
    setTimeout(() => setCopyStatus({ field: null }), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this submission?")) return;
    
    try {
      const table = activeTab === 'programs' ? 'program_applications' : 
                    activeTab === 'events' ? 'event_rsvps' : 'volunteer_applications';
      
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      setData(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      alert("Delete failed. Table might not support delete via RLS.");
    }
  };

  const handleSendEmail = (item: any) => {
    const name = item.full_name || item.user_name || 'there';
    const track = item.skill_track || item.event_title || item.task_title || 'YAWAI Program';
    
    const subject = encodeURIComponent(`Application Received: ${track} - YAWAI`);
    const body = encodeURIComponent(
      `Dear ${name},\n\n` +
      `Thank you for applying for the ${track} track with the Youngsters and Women Advancement Initiative (YAWAI).\n\n` +
      `We have received your application and it is currently being reviewed by our team. We will contact you shortly with the next steps regarding your admission/participation.\n\n` +
      `In the meantime, feel free to follow us on social media for updates.\n\n` +
      `Best regards,\n` +
      `YAWAI Administrative Team`
    );

    window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
  };

  const filteredData = data.filter(item => {
    const name = (item.full_name || item.user_name || item.email || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const tabs = [
    { id: 'programs', label: 'Programs', icon: Star, color: 'text-yawai-gold' },
    { id: 'events', label: 'Event RSVPs', icon: Calendar, color: 'text-blue-500' },
    { id: 'volunteers', label: 'Volunteers', icon: Heart, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Submissions Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Global inbox for all user interactions and registrations.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-yawai-blue transition-colors shadow-sm"
        >
          <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubmissionType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all
              ${activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-yawai-gold' : tab.color} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-blue transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold tracking-wide">Fetching submissions...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitter</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Goal</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 group transition-colors cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm border border-slate-200">
                          {(item.full_name || item.user_name || item.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.full_name || item.user_name || 'Anonymous'}</p>
                          <p className="text-xs text-slate-400 truncate font-bold">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                        ${activeTab === 'programs' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          activeTab === 'events' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          'bg-red-50 text-red-700 border-red-100'}
                      `}>
                        {item.skill_track || item.event_title || item.task_title || 'General'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-bold">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleSendEmail(item); }}
                           className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1.5"
                           title="Send Confirmation Email"
                         >
                           <Send size={16} />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
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
            <h4 className="text-xl font-black text-slate-900 mb-2">No {activeTab} yet</h4>
            <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">When users submit forms for this category, they will appear here.</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-slate-900 text-yawai-gold rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                   {(selectedItem.full_name || selectedItem.user_name || selectedItem.email).charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">
                         {selectedItem.full_name || selectedItem.user_name || 'Attendee'}
                       </h3>
                       <button 
                        onClick={() => handleCopy(selectedItem.full_name || selectedItem.user_name, 'name')}
                        className={`p-1.5 rounded-lg transition-all ${copyStatus.field === 'name' ? 'bg-green-100 text-green-600' : 'hover:bg-slate-200 text-slate-400'}`}
                        title="Copy Name"
                       >
                         {copyStatus.field === 'name' ? <Check size={14} /> : <Copy size={14} />}
                       </button>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Received: {new Date(selectedItem.created_at).toLocaleString()}
                    </p>
                 </div>
               </div>
               <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Interest</p>
                     <p className="text-lg font-black text-slate-800">{selectedItem.skill_track || selectedItem.event_title || selectedItem.task_title}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Submission Type</p>
                     <p className="text-lg font-black text-slate-800 capitalize">{activeTab.slice(0, -1)} Application</p>
                  </div>
               </div>

               {selectedItem.motivation && (
                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={18} className="text-yawai-gold" /> Application Motivation
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed font-bold">
                      "{selectedItem.motivation}"
                    </div>
                 </div>
               )}

               <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Details</h4>
                  <div className="flex flex-wrap gap-4">
                     <div className="flex-1 min-w-[200px] flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-yawai-blue transition-all group shadow-sm">
                        <div className="flex items-center gap-3">
                           <Mail className="text-slate-400 group-hover:text-yawai-blue" size={20} />
                           <span className="font-bold text-slate-700">{selectedItem.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleCopy(selectedItem.email, 'email')}
                             className={`p-1.5 rounded-lg transition-all ${copyStatus.field === 'email' ? 'bg-green-100 text-green-600' : 'hover:bg-slate-100 text-slate-300 group-hover:text-yawai-blue'}`}
                             title="Copy Email"
                           >
                             {copyStatus.field === 'email' ? <Check size={14} /> : <Copy size={14} />}
                           </button>
                           <a href={`mailto:${selectedItem.email}`} target="_blank" rel="noreferrer">
                             <ExternalLink size={14} className="text-slate-300 hover:text-yawai-blue" />
                           </a>
                        </div>
                     </div>
                     {selectedItem.phone && (
                        <a href={`tel:${selectedItem.phone}`} className="flex-1 min-w-[200px] flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-green-500 transition-all group shadow-sm">
                           <div className="flex items-center gap-3">
                              <Phone className="text-slate-400 group-hover:text-green-500" size={20} />
                              <span className="font-bold text-slate-700">{selectedItem.phone}</span>
                           </div>
                           <ExternalLink size={14} className="text-slate-300" />
                        </a>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
               <button 
                 onClick={() => handleSendEmail(selectedItem)}
                 className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                 <Send size={20} className="text-yawai-gold" />
                 Send Confirmation Email
               </button>
               <button 
                onClick={() => handleDelete(selectedItem.id)}
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
