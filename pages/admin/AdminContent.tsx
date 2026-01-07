
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen, Filter, X, Loader2, Image as ImageIcon, Save, RefreshCw, AlertCircle, Upload, HardDrive, Info, CheckCircle } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { supabase } from '../../services/supabase';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    title: '',
    category: 'Skill Track',
    type: 'Job',
    description: '',
    duration: '3 Months',
    date: '',
    location: '',
    organization: '',
    deadline: '',
    link: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

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

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'Skill Track',
      type: item.type || 'Job',
      description: item.description || '',
      duration: item.duration || '3 Months',
      date: item.date || '',
      location: item.location || '',
      organization: item.organization || '',
      deadline: item.deadline || '',
      link: item.link || '',
      image: item.image || ''
    });
    setUploadPreview(item.image || null);
    setSelectedFile(null);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this item?")) {
      try {
        await contentService.deleteItem(activeTab, id);
        setItems(items.filter(item => item.id !== id));
      } catch (err: any) {
        alert("Delete failed.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await contentService.uploadImage(selectedFile);
      }

      if (activeTab === 'programs') {
        const payload = { title: formData.title, category: formData.category, description: formData.description, duration: formData.duration, image: imageUrl };
        if (editId) await contentService.updateProgram(editId, payload);
        else await contentService.createProgram(payload);
      } else if (activeTab === 'events') {
        const payload = { title: formData.title, date: formData.date, location: formData.location, description: formData.description, image: imageUrl };
        if (editId) await contentService.updateEvent(editId, payload);
        else await contentService.createEvent(payload);
      } else {
        const payload = { type: formData.type, title: formData.title, organization: formData.organization, deadline: formData.deadline, link: formData.link };
        if (editId) await contentService.updateOpportunity(editId, payload);
        else await contentService.createOpportunity(payload);
      }

      setIsModalOpen(false);
      setEditId(null);
      loadContent();
    } catch (err: any) {
      setSaveError(err.message || 'Error saving data. Check your Supabase bucket permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'programs', label: 'Programs & Skills', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
          <p className="text-sm text-slate-500">Manage what users see in the YAWAI mobile app.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadContent} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-yawai-blue transition-colors">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => { 
              setEditId(null); 
              setIsModalOpen(true); 
              setFormData({
                title: '',
                category: 'Skill Track',
                type: 'Job',
                description: '',
                duration: '3 Months',
                date: '',
                location: '',
                organization: '',
                deadline: '',
                link: '',
                image: ''
              }); 
              setUploadPreview(null); 
              setSelectedFile(null);
            }}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            <span className="capitalize">New {activeTab.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap
              ${activeTab === tab.id ? 'border-red-600 text-red-600 bg-red-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'}
            `}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
         {loading ? (
           <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-medium">Loading items...</p>
           </div>
         ) : items.length > 0 ? (
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Status / Category</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                 {items.map(item => {
                   const catLower = (item.category || '').toLowerCase();
                   const isSkillRelated = catLower.includes('skill') || catLower.includes('acquisition') || catLower.includes('track');
                   
                   return (
                     <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                             {item.image ? (
                               <img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-slate-100" alt="" />
                             ) : (
                               <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={16} /></div>
                             )}
                             <span className="font-bold text-slate-800">{item.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isSkillRelated ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                               {activeTab === 'programs' ? item.category : activeTab === 'events' ? item.date : item.organization}
                             </span>
                             {activeTab === 'programs' && isSkillRelated && (
                               <div className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                 <CheckCircle size={10} /> Live on Reg. Page
                               </div>
                             )}
                           </div>
                        </td>
                        <td className="p-4 text-right pr-6">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-yawai-blue transition-colors"><Edit3 size={16} /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </td>
                     </tr>
                   );
                 })}
              </tbody>
           </table>
         ) : (
           <div className="p-20 text-center text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold">No items found</p>
           </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <h3 className="text-2xl font-black text-slate-900">{editId ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                {saveError && (
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex gap-4 text-red-800">
                    <AlertCircle size={24} className="shrink-0" />
                    <p className="text-xs leading-relaxed font-bold uppercase">{saveError}</p>
                  </div>
                )}

                {activeTab === 'programs' && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 text-xs font-bold">
                    <Info size={18} className="shrink-0" />
                    <p>To show a skill card (like Video Editing) on the registration page, set Category to <strong>'Skill Track'</strong>.</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" />
                </div>

                {activeTab === 'programs' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 appearance-none font-bold">
                        <option value="Skill Track">Skill Track (Individual Skill)</option>
                        <option value="Skill Acquisition">Skill Acquisition (Main Header)</option>
                        <option value="Digital Skills">Digital Skills</option>
                        <option value="Business">Business</option>
                        <option value="Leadership">Leadership</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</label>
                      <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="3 Months" />
                    </div>
                  </div>
                )}

                {(activeTab === 'programs' || activeTab === 'events') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 resize-none" />
                  </div>
                )}

                {(activeTab === 'programs' || activeTab === 'events') && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Display Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()} 
                      className={`group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${uploadPreview ? 'border-green-400 bg-green-50/20' : 'border-slate-200 hover:border-red-400 bg-slate-50/50'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      {uploadPreview ? (
                        <img src={uploadPreview} className="w-full max-h-40 object-cover rounded-xl shadow-md" alt="" />
                      ) : (
                        <div className="text-center">
                          <Upload size={24} className="mx-auto mb-2 text-slate-400 group-hover:text-red-500" />
                          <p className="text-xs font-bold text-slate-500">Upload Image</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button disabled={isSaving} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]">
                  {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                  <span>{isSaving ? 'Processing...' : editId ? 'Update' : 'Publish'}</span>
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
