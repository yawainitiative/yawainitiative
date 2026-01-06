
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen, Filter, X, Loader2, Image as ImageIcon, Save } from 'lucide-react';
import { contentService } from '../../services/contentService';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    title: '',
    category: 'Digital Skills',
    type: 'Job',
    description: '',
    duration: '',
    date: '',
    location: '',
    organization: '',
    deadline: '',
    link: '',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800'
  });

  const loadContent = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === 'programs') data = await contentService.fetchPrograms();
      else if (activeTab === 'events') data = await contentService.fetchEvents();
      else data = await contentService.fetchOpportunities();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? This will remove the item from the user app immediately.")) {
      try {
        await contentService.deleteItem(activeTab, id);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'programs') {
        await contentService.createProgram({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          duration: formData.duration,
          image: formData.image
        });
      } else if (activeTab === 'events') {
        await contentService.createEvent({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          image: formData.image
        });
      } else {
        await contentService.createOpportunity({
          type: formData.type,
          title: formData.title,
          organization: formData.organization,
          deadline: formData.deadline,
          link: formData.link
        });
      }
      setIsModalOpen(false);
      loadContent();
      setFormData({
        title: '', category: 'Digital Skills', type: 'Job', description: '', duration: '',
        date: '', location: '', organization: '', deadline: '', link: '',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800'
      });
    } catch (err) {
      alert("Error saving content.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
          <p className="text-sm text-slate-500">Publish programs and events to the mobile app.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} />
          <span className="capitalize">Create {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-red-600 text-red-600 bg-red-50/30' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
         {loading ? (
           <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-medium">Fetching database...</p>
           </div>
         ) : items.length > 0 ? (
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {items.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           {item.image && <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                           <span className="font-bold text-slate-800">{item.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                         <span className="text-xs font-bold text-slate-400 uppercase">
                           {activeTab === 'programs' ? item.category : activeTab === 'events' ? item.date : item.organization}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
         ) : (
           <div className="p-20 text-center text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold">No {activeTab} found</p>
             <p className="text-sm">Create your first entry to publish it to the app.</p>
           </div>
         )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl h-full md:h-auto md:max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900 capitalize">Create {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
             </div>
             
             <form onSubmit={handleSave} className="p-8 space-y-5 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="Enter title..." />
                </div>

                {activeTab === 'programs' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none">
                        <option>Digital Skills</option>
                        <option>Business</option>
                        <option>Leadership</option>
                        <option>Empowerment</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</label>
                      <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="e.g. 3 Months" />
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
                      <input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="e.g. Jan 15, 2026" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
                      <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="e.g. Lagos, Nigeria" />
                    </div>
                  </div>
                )}

                {activeTab === 'opportunities' && (
                  <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none">
                        <option>Job</option>
                        <option>Scholarship</option>
                        <option>Grant</option>
                        <option>Internship</option>
                        <option>Bootcamp</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organization</label>
                      <input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="Organization name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deadline</label>
                      <input value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="Expiry Date" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">External Link</label>
                      <input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="https://..." />
                    </div>
                  </div>
                  </>
                )}

                {(activeTab === 'programs' || activeTab === 'events') && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none resize-none" placeholder="What is this about?" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Image URL</label>
                      <div className="flex gap-2">
                        <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} type="text" className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:border-red-500 outline-none" placeholder="Unsplash/Direct link" />
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img src={formData.image} className="w-full h-full object-cover" alt="" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  <span>{isSaving ? 'Saving...' : 'Publish Content'}</span>
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
