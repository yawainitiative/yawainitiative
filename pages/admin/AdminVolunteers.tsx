import React from 'react';
import { Users, CheckCircle, XCircle, FileText } from 'lucide-react';

const AdminVolunteers: React.FC = () => {
  // Mock Volunteer Requests
  const requests = [
    { id: 1, name: "Sarah Connor", email: "sarah@example.com", interest: "Event Support", date: "2 hrs ago" },
    { id: 2, name: "John Doe", email: "john@example.com", interest: "Mentorship", date: "5 hrs ago" },
    { id: 3, name: "Alice Wonder", email: "alice@example.com", interest: "Field Work", date: "1 day ago" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <div>
          <h2 className="text-3xl font-bold text-slate-800">Volunteer Hub</h2>
          <p className="text-slate-500">Manage applications and assign tasks.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
             <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Users size={16} /></div>
               <h3 className="font-bold text-lg">Pending Applications</h3>
             </div>
             
             <div className="space-y-4">
               {requests.map(req => (
                 <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                       <h4 className="font-bold text-slate-800">{req.name}</h4>
                       <p className="text-xs text-slate-500">{req.email} • {req.interest}</p>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{req.date}</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"><XCircle size={20} /></button>
                       <button className="p-2 rounded-xl bg-yawai-blue text-white shadow-lg hover:bg-slate-800 transition-all"><CheckCircle size={20} /></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Task Assignments Overview */}
          <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
             <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText size={16} /></div>
               <h3 className="font-bold text-lg">Active Tasks</h3>
             </div>
             
             <div className="space-y-4">
               <div className="p-4 border-l-4 border-green-500 bg-green-50/50 rounded-r-xl">
                  <h4 className="font-bold text-slate-800">Annual Summit Setup</h4>
                  <p className="text-xs text-slate-500 mt-1">5/10 Volunteers Assigned</p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 w-1/2"></div>
                  </div>
               </div>
               <div className="p-4 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-xl">
                  <h4 className="font-bold text-slate-800">Mentorship Drive</h4>
                  <p className="text-xs text-slate-500 mt-1">2/3 Volunteers Assigned</p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3"></div>
                  </div>
               </div>
             </div>
             
             <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 font-bold text-sm hover:border-yawai-blue hover:text-yawai-blue transition-colors">
               + Create New Task
             </button>
          </div>
       </div>
    </div>
  );
};

export default AdminVolunteers;