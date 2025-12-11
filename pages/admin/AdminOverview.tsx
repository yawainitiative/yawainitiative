import React from 'react';
import { AdminStats } from '../../types';
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';

const AdminOverview: React.FC = () => {
  // Mock stats
  const stats: AdminStats = {
    totalUsers: 1250,
    totalVolunteers: 340,
    activePrograms: 8,
    upcomingEvents: 3,
    totalDonations: 4500000,
    newSignups: 45
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Volunteers', value: stats.totalVolunteers, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Donations (₦)', value: stats.totalDonations.toLocaleString(), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Programs', value: stats.activePrograms, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'New Signups', value: `+${stats.newSignups}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
               <span className="text-green-500 font-bold">↑ 12%</span> vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity Log</h3>
           <div className="space-y-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                  <div>
                    <p className="text-sm text-slate-700 font-medium">New volunteer application from <span className="font-bold">Sarah James</span></p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-yawai-blue to-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
           <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
           <p className="text-slate-400 mb-6 text-sm">Manage your platform efficiently.</p>
           
           <div className="grid grid-cols-2 gap-4">
             <button className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left transition-colors">
                <BookOpen className="mb-2 text-yawai-gold" size={20} />
                <span className="font-bold text-sm">Add Program</span>
             </button>
             <button className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left transition-colors">
                <Calendar className="mb-2 text-yawai-gold" size={20} />
                <span className="font-bold text-sm">Create Event</span>
             </button>
             <button className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left transition-colors">
                <Users className="mb-2 text-yawai-gold" size={20} />
                <span className="font-bold text-sm">Verify Users</span>
             </button>
             <button className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left transition-colors">
                <DollarSign className="mb-2 text-yawai-gold" size={20} />
                <span className="font-bold text-sm">View Report</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;