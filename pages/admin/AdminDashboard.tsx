
import React, { useEffect, useState } from 'react';
import { Users, Heart, Calendar, ArrowUpRight, Globe, AlertCircle, RefreshCw, Share2, HardDrive, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', change: 'Live', icon: Users, color: 'bg-blue-500', table: 'profiles' },
    { label: 'Feed Posts', value: '0', change: 'Live', icon: Share2, color: 'bg-pink-500', table: 'social_posts' },
    { label: 'Total Programs', value: '0', change: 'Live', icon: Globe, color: 'bg-green-500', table: 'programs' },
    { label: 'Active Events', value: '0', change: 'Live', icon: Calendar, color: 'bg-amber-500', table: 'events' },
  ]);

  const fetchRealStats = async () => {
    setLoading(true);
    try {
      // Check Stats
      const [{ count: userCount }, { count: postCount }, { count: progCount }, { count: eventCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('social_posts').select('*', { count: 'exact', head: true }),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
      ]);

      setStats(prev => prev.map(s => {
        if (s.label === 'Total Users') return { ...s, value: (userCount || 0).toString() };
        if (s.label === 'Feed Posts') return { ...s, value: (postCount || 0).toString() };
        if (s.label === 'Total Programs') return { ...s, value: (progCount || 0).toString() };
        if (s.label === 'Active Events') return { ...s, value: (eventCount || 0).toString() };
        return s;
      }));

      // Check Storage Bucket Status
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) throw bucketError;
      
      const hasContentBucket = buckets?.some(b => b.name === 'content');
      setStorageStatus(hasContentBucket ? 'ok' : 'missing');

    } catch (err) {
      console.error("Database check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Real-time metrics and system health.</p>
        </div>
        <button 
          onClick={fetchRealStats}
          disabled={loading}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-yawai-blue transition-all"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* STORAGE WARNING OVERLAY (IF MISSING) */}
      {storageStatus === 'missing' && (
        <div className="bg-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden animate-slide-up">
           <div className="absolute right-0 top-0 p-12 opacity-10 pointer-events-none">
              <HardDrive size={160} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shrink-0 border-2 border-white/20">
                 <AlertCircle size={40} className="text-white" />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                 <h3 className="text-2xl font-black">Critical Setup Required!</h3>
                 <p className="text-red-100 font-medium leading-relaxed">
                    Image uploads are currently disabled because the <strong>'content'</strong> storage bucket is missing from your Supabase project.
                 </p>
                 <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <a 
                      href="https://supabase.com/dashboard/project/txzxsomapiouqaknvrqq/storage" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg hover:bg-slate-100 transition-all"
                    >
                       Open Supabase Storage <ExternalLink size={16} />
                    </a>
                 </div>
              </div>
              <div className="bg-red-900/40 p-6 rounded-2xl border border-white/10 shrink-0">
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-200 mb-3">Steps to fix:</p>
                 <ul className="space-y-2 text-xs font-bold text-white">
                    <li className="flex gap-2"><span>1.</span> Create bucket named 'content'</li>
                    <li className="flex gap-2"><span>2.</span> Set bucket to 'Public'</li>
                    <li className="flex gap-2"><span>3.</span> Click refresh on this dashboard</li>
                 </ul>
              </div>
           </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center text-${stat.color.replace('bg-', '')}`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-500">
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[350px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">System Activity</h3>
              <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
            </div>
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Users size={32} />
               </div>
               <h4 className="font-bold text-slate-800 text-lg">Platform is Operational</h4>
               <p className="text-sm text-slate-400 max-w-xs mt-1 font-medium">Logs and activity tracking will appear here as users engage with the mobile app.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-2 text-slate-600">
               <AlertCircle size={20} />
               <h3 className="font-bold">System Health</h3>
             </div>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Globe size={18} className="text-slate-400" />
                   <span className="text-sm font-medium text-slate-600">Database API</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                   <CheckCircle2 size={14} /> ONLINE
                </div>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <HardDrive size={18} className="text-slate-400" />
                   <span className="text-sm font-medium text-slate-600">Storage Service</span>
                </div>
                {storageStatus === 'ok' ? (
                  <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                    <CheckCircle2 size={14} /> ONLINE
                  </div>
                ) : storageStatus === 'missing' ? (
                  <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                    <XCircle size={14} /> MISCONFIGURED
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs font-bold animate-pulse">CHECKING...</div>
                )}
             </div>

             <div className="p-4 bg-slate-50 rounded-xl mt-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project ID</p>
                <p className="text-xs font-mono text-slate-600 break-all font-bold">txzxsomapiouqaknvrqq</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
