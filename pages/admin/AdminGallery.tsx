
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Loader2, Image as ImageIcon, RefreshCw, 
  Upload, X, Save, AlertCircle, Camera, CheckCircle
} from 'lucide-react';
import { contentService, GalleryImage } from '../../services/contentService';
import { supabase } from '../../services/supabase';

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Multiple Files State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<{id: string, url: string}[]>([]);
  const [globalCaption, setGlobalCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = async () => {
    setLoading(true);
    const data = await contentService.fetchGallery();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Fix: Explicitly cast Array.from result to File[] to prevent 'unknown[]' inference which causes issues when passed to Blob-expecting functions
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Generate previews
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreviews(prev => [
          ...prev, 
          { id: Math.random().toString(36).substr(2, 9), url: reader.result as string }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...uploadPreviews];
    newPreviews.splice(index, 1);
    setUploadPreviews(newPreviews);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setSaveError("Please select at least one image to upload.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Process all uploads in parallel
      // Fix: Ensure file parameter is explicitly typed as File to avoid unknown assignment to Blob
      const uploadPromises = selectedFiles.map(async (file: File) => {
        const publicUrl = await contentService.uploadImage(file);
        return contentService.addGalleryImage(publicUrl, globalCaption);
      });

      await Promise.all(uploadPromises);
      
      // Cleanup
      setIsModalOpen(false);
      setUploadPreviews([]);
      setSelectedFiles([]);
      setGlobalCaption('');
      loadGallery();
    } catch (err: any) {
      setSaveError(err.message || "Failed to upload one or more images. Check your connection or Supabase storage limits.");
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
          <p className="text-slate-500 text-sm">Upload multiple photos for community outreaches and memorial events.</p>
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
            <span>Upload Photos</span>
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
           <p className="text-sm">Click "Upload Photos" to start building your visual impact story.</p>
        </div>
      )}

      {/* MULTI-UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h3 className="text-2xl font-black text-slate-900">Batch Upload</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{selectedFiles.length} images selected</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
             </div>

             <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                {saveError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={18} />
                    <p>{saveError}</p>
                  </div>
                )}

                <div className="space-y-4">
                   {/* Caption for the whole batch */}
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Caption (Applied to all images)</label>
                     <input 
                       value={globalCaption}
                       onChange={e => setGlobalCaption(e.target.value)}
                       placeholder="e.g. Outreach at Ikorodu Community"
                       className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 outline-none focus:border-slate-900 transition-all font-medium"
                     />
                   </div>

                   {/* Dropzone / Picker */}
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`
                       group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                       ${uploadPreviews.length > 0 ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}
                     `}
                   >
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                        multiple
                      />
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-yawai-blue">
                        <Upload size={24} />
                     </div>
                     <p className="text-sm font-bold text-slate-600">Add More Photos</p>
                   </div>

                   {/* Preview Grid */}
                   {uploadPreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4">
                        {uploadPreviews.map((preview, idx) => (
                           <div key={preview.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                              <img src={preview.url} className="w-full h-full object-cover" alt="" />
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeSelectedFile(idx); }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <X size={12} />
                              </button>
                           </div>
                        ))}
                      </div>
                   )}
                </div>

                <div className="sticky bottom-0 bg-white pt-4 pb-2">
                   <button 
                     type="submit"
                     disabled={isSaving || selectedFiles.length === 0}
                     className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                   >
                     {isSaving ? (
                        <>
                           <Loader2 size={24} className="animate-spin" />
                           <span>Processing {selectedFiles.length} uploads...</span>
                        </>
                     ) : (
                        <>
                           <Save size={20} />
                           <span>Publish {selectedFiles.length} Photos to Gallery</span>
                        </>
                     )}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
