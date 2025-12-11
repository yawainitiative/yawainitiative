
import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, Upload, RotateCcw, Layout, Type, Mail, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings, loading } = useSettings();
  
  // Local state for form
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local form data when settings load from DB
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveSuccess(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // NOTE: For a real production app, upload to Supabase Storage bucket first.
      // For this MVP, we are storing the Base64 string directly in the text column.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
        setSaveSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all branding to default?")) {
      await resetSettings();
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-yawai-gold" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
       <div>
          <h2 className="text-3xl font-bold text-slate-800">Global App Settings</h2>
          <p className="text-slate-500">Manage branding, logo, and general configuration.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Branding Section */}
            <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <Layout className="text-yawai-gold" size={20} /> App Branding
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">App Name</label>
                    <div className="relative group">
                       <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         name="appName"
                         value={formData.appName}
                         onChange={handleChange}
                         className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all font-bold text-slate-700"
                       />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tagline (Sidebar)</label>
                    <div className="relative group">
                       <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         name="tagline"
                         value={formData.tagline}
                         onChange={handleChange}
                         className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all text-slate-600"
                       />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Email</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         name="contactEmail"
                         value={formData.contactEmail}
                         onChange={handleChange}
                         className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all text-slate-600"
                       />
                    </div>
                  </div>
               </div>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <ImageIcon className="text-yawai-gold" size={20} /> Logo Management
               </h3>

               <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Preview Circle */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-4xl font-extrabold text-slate-300">{formData.appName.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Upload size={18} /> Upload Logo
                      </button>
                      {formData.logoUrl && (
                        <button 
                           onClick={() => setFormData({...formData, logoUrl: null})}
                           className="px-4 py-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 font-bold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Recommended: PNG or SVG, Square ratio (1:1). Max 2MB.</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-yawai-blue text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : (saveSuccess ? <CheckCircle size={20} /> : <Save size={20} />)}
                {isSaving ? 'Saving...' : (saveSuccess ? 'Changes Saved!' : 'Save Configuration')}
              </button>
              
              <button 
                onClick={handleReset}
                className="px-6 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-white transition-all"
                title="Reset to Default"
              >
                <RotateCcw size={20} />
              </button>
            </div>

          </div>

          {/* Right Column: Live Preview Card */}
          <div className="space-y-6">
             <div className="sticky top-6">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-4">Sidebar Preview</h4>
                
                {/* Simulated Sidebar */}
                <div className="bg-yawai-blue rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-glow">
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-yawai-gold to-yellow-300 flex items-center justify-center text-yawai-blue font-bold text-xl">
                            {formData.appName.charAt(0)}
                          </div>
                        )}
                     </div>
                     <div>
                       <h1 className="text-xl font-bold tracking-tight leading-none">{formData.appName}</h1>
                       <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">{formData.tagline}</p>
                     </div>
                   </div>
                   
                   <div className="h-px bg-slate-700/50 mb-4" />
                   
                   <div className="space-y-3 opacity-60">
                      <div className="h-3 w-3/4 bg-slate-600 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-600 rounded"></div>
                      <div className="h-3 w-5/6 bg-slate-600 rounded"></div>
                   </div>
                   
                   <div className="mt-8 p-3 bg-slate-800/50 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400">Contact Preview:</p>
                      <p className="text-xs font-bold truncate">{formData.contactEmail}</p>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default AdminSettings;
