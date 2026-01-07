
import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, RefreshCw, Share2, HardDrive, 
  CheckCircle2, XCircle, ExternalLink, Database, 
  Copy, Check, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
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
    'event_rsvps',
    'volunteer_applications',
    'app_settings'
  ];

  const fullSqlSchema = `-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT,
    location TEXT,
    description TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT,
    title TEXT,
    organization TEXT,
    deadline TEXT,
    link TEXT,
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

-- 2. Enable RLS and Create Public Policies
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Select" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.programs FOR ALL USING (true);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Select" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admin All" ON public.gallery_images FOR ALL USING (true);

ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert" ON public.program_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Select" ON public.program_applications FOR SELECT USING (true);`;

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      // 1. Check Storage
      const { data: buckets } = await supabase.storage.listBuckets();
      setStorageStatus(buckets?.some(b => b.name === 'content') ? 'ok' : 'missing');

      // 2. Check Tables (using a simple select head query for each)
      const results = await Promise.all(
        tablesToCheck.map(async (tableName) => {
          const { error } = await supabase.from(tableName).select('*').limit(0);
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
          <p className="text-slate-500">Infrastructure health and community metrics.</p>
        </div>
        <button 
          onClick={checkSystemHealth}
          disabled={loading}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-yawai-blue transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* SETUP ASSISTANT SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Status Cards */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-900 text-yawai-gold rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">System Setup Assistant</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Storage Status */}
              <div className={`p-6 rounded-3xl border-2 transition-all ${storageStatus === 'ok' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${storageStatus === 'ok' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <HardDrive size={24} />
                  </div>
                  {storageStatus === 'ok' ? (
                    <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Active</span>
                  ) : (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Action Needed</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900">Storage Bucket</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Bucket named 'content' required for image uploads.</p>
              </div>

              {/* Database Status */}
              <div className={`p-6 rounded-3xl border-2 transition-all ${missingTables.length === 0 ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${missingTables.length === 0 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                    <Database size={24} />
                  </div>
                  {missingTables.length === 0 ? (
                    <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Healthy</span>
                  ) : (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">{missingTables.length} Missing</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900">Database Schema</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Tables must exist in the 'public' schema.</p>
              </div>
            </div>

            {/* Missing Tables List */}
            {missingTables.length > 0 && (
              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Missing Components Detected</h5>
                <div className="flex flex-wrap gap-2">
                  {missingTables.map(t => (
                    <div key={t.table} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-500">
                      <XCircle size={14} /> {t.table}
                    </div>
                  ))}
                  {storageStatus === 'missing' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-500">
                      <HardDrive size={14} /> Storage Bucket: 'content'
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Database size={120} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Setup Script</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Run this SQL in your Supabase SQL Editor to create all missing tables and enable public access.
            </p>

            <div className="bg-black/40 rounded-2xl p-4 mb-6 font-mono text-[10px] h-32 overflow-y-auto no-scrollbar border border-white/5 text-blue-300">
              {fullSqlSchema}
            </div>

            <div className="space-y-3">
              <button 
                onClick={copySql}
                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                {copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}
              </button>
              
              <a 
                href="https://supabase.com/dashboard/project/txzxsomapiouqaknvrqq/sql/new" 
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Platform Users', value: '...', icon: Users, color: 'text-blue-500' },
          { label: 'Social Content', value: '...', icon: Share2, color: 'text-pink-500' },
          { label: 'Growth Programs', value: '...', icon: Globe, color: 'text-green-500' },
          { label: 'Upcoming Events', value: '...', icon: Calendar, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-slate-50 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Globe = ({size, className}: {size:number, className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/></svg>
);

export default AdminDashboard;
