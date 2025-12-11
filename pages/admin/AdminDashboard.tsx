
import React from 'react';
import { Users, Heart, Calendar, ArrowUpRight, Globe, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock Stats
  const stats = [
    { label: 'Total Users', value: '2,845', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Donations', value: '₦1.2M', change: '+5%', icon: Heart, color: 'bg-red-500' },
    { label: 'Active Volunteers', value: '143', change: '+8%', icon: Globe, color: 'bg-green-500' },
    { label: 'Events This Month', value: '8', change: '0%', icon: Calendar, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back. Here is what's happening at YAWAI today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center text-${stat.color.replace('bg-', '')}`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
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
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent User Activity</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">U</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">User <span className="font-bold">John Doe</span> signed up for <span className="font-bold">Digital Skills 101</span></p>
                      <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-amber-50/50">
             <div className="flex items-center gap-2 text-amber-600">
               <AlertCircle size={20} />
               <h3 className="font-bold">Needs Attention</h3>
             </div>
          </div>
          <div className="p-6 space-y-4">
             <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-slate-400 uppercase">Volunteers</span>
                 <span className="w-2 h-2 rounded-full bg-red-500"></span>
               </div>
               <p className="text-sm font-semibold text-slate-800">5 New Volunteer applications pending approval</p>
               <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800">Review Applications</button>
             </div>
             
             <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-slate-400 uppercase">Content</span>
                 <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               </div>
               <p className="text-sm font-semibold text-slate-800">Draft "Annual Gala" event needs publishing</p>
               <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800">Go to Content</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
