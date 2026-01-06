
import React, { useEffect, useState } from 'react';
import { Users, Heart, Calendar, ArrowUpRight, Globe, AlertCircle, RefreshCw, Share2, HardDrive, CheckCircle2, XCircle } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
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
          {/* Storage Alert if missing */}
          {storageStatus === 'missing' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                <HardDrive size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-red-900 font-bold text-lg">Storage Bucket Missing</h3>
                <p className="text-red-700 text-sm mt-1">
                  You cannot upload images because the <strong>'content'</strong> bucket hasn't been created in Supabase Storage.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                   <div className="bg-white/50 px-3 py-1 rounded text-[10px] font-bold text-red-800 uppercase">1. Go to Supabase</div>
                   <div className="bg-white/50 px-3 py-1 rounded text-[10px] font-bold text-red-800 uppercase">2. Storage -> New Bucket</div>
                   <div className="bg-white/50 px-3 py-1 rounded text-[10px] font-bold text-red-800 uppercase">3. Name it 'content'</div>
                   <div className="bg-white/50 px-3 py-1 rounded text-[10px] font-bold text-red-800 uppercase">4. Set to Public</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">System Activity</h3>
              <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
            </div>
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Users size={32} />
               </div>
               <h4 className="font-bold text-slate-800">Operational</h4>
               <p className="text-sm text-slate-400 max-w-xs mt-1">When new content is published or users register, logs will appear here.</p>
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

             <div className="p-4 bg-slate-50 rounded-xl mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project ID</p>
                <p className="text-xs font-mono text-slate-600 break-all">txzxsomapiouqaknvrqq</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
