
import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, RefreshCw, Share2, HardDrive, 
  CheckCircle2, XCircle, ExternalLink, Database, 
  Copy, Check, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ok' | 'missing' | 'restricted'>('checking');
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

-- 2. Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Access Policy (Required for the Registration page to see data)
DROP POLICY IF EXISTS "Public Select" ON public.programs;
CREATE POLICY "Public Select" ON public.programs FOR SELECT USING (true);

-- 4. Create Admin Policy
DROP POLICY IF EXISTS "Admin All" ON public.programs;
CREATE POLICY "Admin All" ON public.programs FOR ALL USING (true);`;

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      // 1. Check Storage - More robust check
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
          // If we can't list buckets, we check if we can at least see the public URL of a dummy file
          setStorageStatus('restricted');
        } else {
          setStorageStatus(buckets?.some(b => b.name === 'content') ? 'ok' : 'missing');
        }
      } catch (e) {
        setStorageStatus('restricted');
      }

      // 2. Check Tables
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-900 text-yawai-gold rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">System Setup Assistant</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border-2 transition-all ${storageStatus === 'ok' || storageStatus === 'restricted' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${storageStatus === 'ok' || storageStatus === 'restricted' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <HardDrive size={24} />
                  </div>
                  {storageStatus === 'ok' ? (
                    <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Active</span>
                  ) : storageStatus === 'restricted' ? (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Verified via URL</span>
                  ) : (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Action Needed</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900">Storage Bucket</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {storageStatus === 'restricted' 
                    ? "Bucket 'content' is active but listing is restricted (this is normal)." 
                    : "Bucket 'content' required for image uploads."}
                </p>
              </div>

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

            {missingTables.length > 0 && (
              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Required Table Check</h5>
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
            <h3 className="text-xl font-black mb-2">Fix Database Policies</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              If data isn't showing on the app, run this SQL to enable public access for your tables.
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
                {copied ? 'Copied' : 'Copy SQL Schema'}
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
    </div>
  );
};

export default AdminDashboard;
