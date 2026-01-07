
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Loader2, Image as ImageIcon, RefreshCw, 
  Upload, HardDrive, X, Save, AlertCircle, Camera
} from 'lucide-react';
import { contentService, GalleryImage } from '../../services/contentService';
import { supabase } from '../../services/supabase';

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkBucket = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === 'content');
      setBucketStatus(exists ? 'ok' : 'missing');
    } catch (e) {
      setBucketStatus('missing');
    }
  };

  const loadGallery = async () => {
    setLoading(true);
    const data = await contentService.fetchGallery();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
    checkBucket();
  }, []);

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
    if (!selectedFile && !uploadPreview) {
      setSaveError("Please select an image or provide a URL.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      let finalUrl = uploadPreview || '';

      if (selectedFile) {
        finalUrl = await contentService.uploadImage(selectedFile);
      }

      await contentService.addGalleryImage(finalUrl, caption);
      
      setIsModalOpen(false);
      setUploadPreview(null);
      setSelectedFile(null);
      setCaption('');
      loadGallery();
    } catch (err: any) {
      setSaveError(err.message || "Failed to upload image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this image from the gallery?")) {
      try {
        await contentService.deleteItem('gallery_images', id);
        setImages(images.filter(img => img.id !== id));
      } catch (err) {
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Media Gallery Manager</h2>
          <p className="text-slate-500 text-sm">Upload and manage photos for the impact gallery.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadGallery}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-yawai-blue transition-colors shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-slate-300" size={48} />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map(img => (
            <div key={img.id} className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 animate-slide-up">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm p-4 text-center">
                 {img.caption && <p className="text-white text-[10px] font-black uppercase tracking-widest line-clamp-2">{img.caption}</p>}
                 <button 
                   onClick={() => handleDelete(img.id)}
                   className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-transform shadow-lg"
                 >
                   <Trash2 size={20} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
           <Camera size={64} className="mx-auto mb-4 opacity-10" />
           <p className="font-bold text-slate-600">No gallery images</p>
           <p className="text-sm">Click "Upload Photo" to start building your visual impact story.</p>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-900">Upload to Gallery</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
             </div>

             <form onSubmit={handleSave} className="p-8 space-y-6">
                {saveError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={18} />
                    <p>{saveError}</p>
                  </div>
                )}

                <div className="space-y-4">
                   {bucketStatus === 'missing' && (
                     <div className="p-4 bg-amber-50 rounded-xl text-amber-700 text-[10px] font-bold uppercase tracking-tight flex gap-2">
                       <HardDrive size={16} />
                       Bucket 'content' missing. Uploads will fail.
                     </div>
                   )}

                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`
                       group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                       ${uploadPreview ? 'border-green-400 bg-green-50/20' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}
                     `}
                   >
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                     {uploadPreview ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md relative">
                           <img src={uploadPreview} className="w-full h-full object-cover" alt="Preview" />
                           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <p className="text-white text-xs font-bold">Click to Change</p>
                           </div>
                        </div>
                     ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-yawai-blue">
                             <Upload size={24} />
                          </div>
                          <p className="text-sm font-bold text-slate-600">Select Impact Photo</p>
                        </>
                     )}
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optional Caption</label>
                     <input 
                       value={caption}
                       onChange={e => setCaption(e.target.value)}
                       placeholder="e.g. Graduation Batch 2025"
                       className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 outline-none focus:border-slate-900 transition-all font-medium"
                     />
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving || (!uploadPreview && !selectedFile)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={20} />}
                  <span>{isSaving ? 'Uploading Photo...' : 'Publish to Gallery'}</span>
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
