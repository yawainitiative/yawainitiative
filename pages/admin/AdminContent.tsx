
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen, Filter, X, Loader2, Image as ImageIcon, Save, RefreshCw, AlertCircle, Upload } from 'lucide-react';
import { contentService } from '../../services/contentService';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    title: '',
    category: 'Digital Skills',
    type: 'Job',
    description: '',
    duration: '3 Months',
    date: '',
    location: '',
    organization: '',
    deadline: '',
    link: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? This will remove the item from the user app immediately.")) {
      try {
        await contentService.deleteItem(activeTab, id);
        setItems(items.filter(item => item.id !== id));
      } catch (err: any) {
        if (err.message?.includes('row-level security')) {
          alert("Permission denied. Update your Supabase RLS policies to allow DELETE.");
        } else {
          alert("Failed to delete item.");
        }
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      let imageUrl = formData.image;

      // 1. Upload file if selected
      if (selectedFile) {
        try {
          imageUrl = await contentService.uploadImage(selectedFile);
        } catch (uploadErr: any) {
          throw new Error(`Image upload failed: ${uploadErr.message}. Make sure you created a public 'content' bucket in Supabase Storage.`);
        }
      }

      // 2. Save Data
      if (activeTab === 'programs') {
        await contentService.createProgram({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          duration: formData.duration,
          image: imageUrl
        });
      } else if (activeTab === 'events') {
        await contentService.createEvent({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          image: imageUrl
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
      
      // Reset form
      setFormData({
        title: '', category: 'Digital Skills', type: 'Job', description: '', duration: '3 Months',
        date: '', location: '', organization: '', deadline: '', link: '',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'
      });
      setSelectedFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('row-level security')) {
        setSaveError("Database Permission Error: Please run the RLS fix script in your Supabase SQL Editor.");
      } else {
        setSaveError(err.message || 'Check database connection');
      }
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
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
          <p className="text-sm text-slate-500">Publish programs and events to the live mobile app.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadContent}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-yawai-blue transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => {
              setSaveError(null);
              setSelectedFile(null);
              setUploadPreview(null);
              setIsModalOpen(true);
            }}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            <span className="capitalize">Create {activeTab.slice(0, -1)}</span>
          </button>
        </div>
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
              <p className="font-medium">Checking database...</p>
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
                           {item.image ? (
                             <img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-slate-100" alt="" />
                           ) : (
                             <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={16} /></div>
                           )}
                           <span className="font-bold text-slate-800">{item.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
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
             <p className="font-bold">No {activeTab} found in DB</p>
             <p className="text-sm">New entries will be visible to all users immediately.</p>
           </div>
         )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 capitalize">Create {activeTab.slice(0, -1)}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Publish to user app</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                {saveError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>{saveError}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                  <input 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    type="text" 
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" 
                    placeholder={activeTab === 'programs' ? "e.g. 3-Month Skill Acquisition Training" : "Enter title..."} 
                  />
                </div>

                {activeTab === 'programs' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 appearance-none font-bold">
                        <option>Digital Skills</option>
                        <option>Business</option>
                        <option>Leadership</option>
                        <option>Empowerment</option>
                        <option>Vocational</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</label>
                      <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="e.g. 3 Months" />
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                      <input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="e.g. Jan 15, 2026" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                      <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="e.g. Lagos, Nigeria" />
                    </div>
                  </div>
                )}

                {activeTab === 'opportunities' && (
                  <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 font-bold">
                        <option>Job</option>
                        <option>Scholarship</option>
                        <option>Grant</option>
                        <option>Internship</option>
                        <option>Bootcamp</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organization</label>
                      <input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="Organization name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deadline</label>
                      <input value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="e.g. Jan 30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Application Link</label>
                      <input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} type="text" className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50" placeholder="https://..." />
                    </div>
                  </div>
                  </>
                )}

                {(activeTab === 'programs' || activeTab === 'events') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 resize-none" placeholder="Provide full details about this content..." />
                  </div>
                )}

                {(activeTab === 'programs' || activeTab === 'events') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Display Image</label>
                    
                    <div className="flex flex-col gap-4">
                      {/* Upload Box */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                          ${uploadPreview ? 'border-green-400 bg-green-50/30' : 'border-slate-200 hover:border-red-400 bg-slate-50/50'}
                        `}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                          accept="image/*" 
                        />
                        
                        {uploadPreview ? (
                          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-md">
                            <img src={uploadPreview} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <p className="text-white text-xs font-bold">Click to change image</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
                              <Upload size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-slate-700">Upload from computer</p>
                              <p className="text-xs text-slate-400">JPG, PNG or WEBP (Max 2MB)</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                          <span className="bg-white px-2">Or Use URL</span>
                        </div>
                      </div>

                      <input 
                        value={formData.image} 
                        onChange={e => {
                          setFormData({...formData, image: e.target.value});
                          if (!selectedFile) setUploadPreview(e.target.value);
                        }} 
                        type="text" 
                        className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:border-red-500 outline-none shadow-inner bg-slate-50/50 text-sm" 
                        placeholder="Paste image link here..." 
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>{selectedFile ? 'Uploading & Publishing...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={24} />
                      <span className="text-lg">Publish to Mobile App</span>
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
