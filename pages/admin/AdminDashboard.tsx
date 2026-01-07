
import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, RefreshCw, Share2, HardDrive, 
  CheckCircle2, XCircle, ExternalLink, Database, 
  Copy, Check, ShieldCheck, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dbSchemaStatus, setDbSchemaStatus] = useState<{table: string, exists: boolean}[]>([]);
  const [copied, setCopied] = useState(false);

  const tablesToCheck = [
    'profiles', 
    'programs', 
    'events', 
    'opportunities', 
    'social_posts', 
    'gallery_images',
    'program_applications',
    'app_settings'
  ];

  const fullSqlSchema = `-- 1. CREATE TABLES
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    skill_track TEXT,
    motivation TEXT,
    program_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREATE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- 3. SET UP STORAGE POLICIES
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'content');
CREATE POLICY "Admin All Access" ON storage.objects FOR ALL USING (bucket_id = 'content');

-- 4. ENABLE RLS & PUBLIC ACCESS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Select" ON public.programs;
CREATE POLICY "Public Select" ON public.programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert App" ON public.program_applications;
CREATE POLICY "Public Insert App" ON public.program_applications FOR INSERT WITH CHECK (true);

-- 5. PRE-FILL INITIAL SKILLS (OPTIONAL)
INSERT INTO public.programs (title, category, description, duration, image)
VALUES 
('YAWAI 3-Month Skill Acquisition Program', 'Skill Acquisition', 'Main empowerment program for youth and women.', '3 Months', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800'),
('Video Editing', 'Skill Track', 'Professional video cutting and storytelling.', '3 Months', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800'),
('Graphics Design', 'Skill Track', 'Branding and layout design principles.', '3 Months', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800'),
('Auto-Gele & Turban', 'Skill Track', 'Traditional headgear and modern turban styling.', '3 Months', 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=800');`;

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        tablesToCheck.map(async (tableName) => {
          const { error } = await supabase.from(tableName).select('*').limit(1);
          return { table: tableName, exists: !error || error.code !== '42P01' };
        })
      );
      setDbSchemaStatus(results);
    } catch (err) {
      console.error("Health check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const copySql = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const missingTables = dbSchemaStatus.filter(t => !t.exists);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Dashboard</h2>
          <p className="text-slate-500">Infrastructure health and data status.</p>
        </div>
        <button 
          onClick={checkSystemHealth}
          disabled={loading}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-yawai-blue transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-900 text-yawai-gold rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Database Health</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl border-2 transition-all bg-blue-50/50 border-blue-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-yawai-blue text-white">
                    <HardDrive size={24} />
                  </div>
                  <span className="bg-slate-400 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Storage Ready</span>
                </div>
                <h4 className="font-bold text-slate-900">Media Bucket</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                  The 'content' bucket is required for all image uploads in the Admin Panel.
                </p>
              </div>

              <div className={`p-6 rounded-3xl border-2 transition-all ${missingTables.length === 0 ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${missingTables.length === 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <Database size={24} />
                  </div>
                  <span className={`${missingTables.length === 0 ? 'bg-green-500' : 'bg-red-500'} text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest`}>
                    {missingTables.length === 0 ? 'Online' : 'Broken'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900">Table Schema</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                  {missingTables.length === 0 ? 'All systems operational.' : `${missingTables.length} tables missing from public schema.`}
                </p>
              </div>
            </div>

            {missingTables.length > 0 && (
              <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100">
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertCircle size={18} />
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Required Tables Missing</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dbSchemaStatus.map(t => (
                    <div key={t.table} className={`flex items-center gap-2 px-3 py-1.5 bg-white border rounded-xl text-xs font-bold ${t.exists ? 'text-green-600 border-green-100' : 'text-red-500 border-red-100'}`}>
                      {t.exists ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {t.table}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Database size={120} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Master Fix Script</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed mb-6 font-medium">
              Run this SQL to create the 'content' bucket and the 3-Month Program skill tracks.
            </p>

            <div className="bg-black/40 rounded-2xl p-4 mb-6 font-mono text-[9px] h-32 overflow-y-auto no-scrollbar border border-white/5 text-blue-300">
              {fullSqlSchema}
            </div>

            <div className="space-y-3">
              <button 
                onClick={copySql}
                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                {copied ? 'Copied' : 'Copy All SQL Fixes'}
              </button>
              
              <a 
                href="https://supabase.com/dashboard/project/_/sql/new" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-white/10 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                Open SQL Editor <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
