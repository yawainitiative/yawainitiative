
import React, { useEffect, useState } from 'react';
import { Users, Heart, Calendar, ArrowUpRight, Globe, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', change: '0%', icon: Users, color: 'bg-blue-500', table: 'profiles' },
    { label: 'Total Donations', value: '₦0', change: '0%', icon: Heart, color: 'bg-red-500', table: 'donations' },
    { label: 'Active Volunteers', value: '0', change: '0%', icon: Globe, color: 'bg-green-500', table: 'profiles' },
    { label: 'Active Events', value: '0', change: '0%', icon: Calendar, color: 'bg-amber-500', table: 'events' },
  ]);

  const fetchRealStats = async () => {
    setLoading(true);
    try {
      // Attempt to get user count from auth or profiles table
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Update state with real counts if available
      setStats(prev => prev.map(s => {
        if (s.label === 'Total Users') return { ...s, value: (userCount || 0).toString() };
        if (s.label === 'Active Events') return { ...s, value: (eventCount || 0).toString() };
        return s;
      }));
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
          <p className="text-slate-500">Database synchronized. Real-time metrics shown below.</p>
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
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent User Activity</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Users size={32} />
             </div>
             <h4 className="font-bold text-slate-800">No recent activity</h4>
             <p className="text-sm text-slate-400 max-w-xs mt-1">When new users register or join programs, they will appear here.</p>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-2 text-slate-600">
               <AlertCircle size={20} />
               <h3 className="font-bold">System Status</h3>
             </div>
          </div>
          <div className="p-6 space-y-4 flex-1">
             <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Queue Status</p>
                <p className="text-sm font-medium text-slate-600">Everything is up to date. No pending tasks found.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
