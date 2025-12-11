
import React, { useState } from 'react';
import { useLogo } from '../../contexts/LogoContext';
import { Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { logoUrl, updateLogo } = useLogo();
  const [inputUrl, setInputUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(logoUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~2MB for base64 safety)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please use an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setInputUrl(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setPreview(e.target.value);
  };

  const handleSave = async () => {
    if (preview) {
      setIsSaving(true);
      await updateLogo(preview);
      setIsSaving(false);
      alert('Logo updated successfully!');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-500">Manage global application configurations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
         <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <ImageIcon className="text-slate-400" /> App Logo
         </h3>
         
         <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Preview Section */}
            <div className="flex-shrink-0">
               <div className="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                  {preview ? (
                    <img src={preview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-slate-400 text-xs font-bold text-center p-2">No Logo Set</span>
                  )}
               </div>
               <p className="text-xs text-center text-slate-500 mt-2 font-medium">Preview</p>
            </div>

            {/* Input Section */}
            <div className="flex-1 space-y-4 w-full">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Upload Image</label>
                 <label className="flex items-center justify-center w-full px-4 py-3 border border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                       <Upload size={18} />
                       <span>Choose file...</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                 </label>
                 <p className="text-[10px] text-slate-400 mt-1">Recommended: PNG or SVG, max 2MB.</p>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-white px-2 text-slate-400 font-bold">Or via URL</span>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                 <input 
                   type="text" 
                   value={inputUrl}
                   onChange={handleUrlChange}
                   placeholder="https://example.com/logo.png"
                   className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold text-sm"
                 />
               </div>

               <button 
                 onClick={handleSave}
                 disabled={!preview || isSaving}
                 className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 {isSaving ? 'Saving...' : 'Save Changes'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
