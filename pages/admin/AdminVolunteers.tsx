
import React from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const AdminVolunteers: React.FC = () => {
  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-2xl font-bold text-slate-900">Volunteer Management</h2>
        <p className="text-slate-500">Approve signups, assign tasks, and generate certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Pending Approvals */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Pending Approvals</h3>
               <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">3 New</span>
            </div>
            <div className="divide-y divide-slate-50">
               {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">J</div>
                        <div>
                           <p className="text-sm font-bold text-slate-800">Jane Doe</p>
                           <p className="text-xs text-slate-500">Applied for: Event Support</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="text-green-500 hover:bg-green-50 p-2 rounded-full"><CheckCircle size={20} /></button>
                        <button className="text-red-400 hover:bg-red-50 p-2 rounded-full"><XCircle size={20} /></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Active Tasks Overview */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Active Task Status</h3>
               <button className="text-blue-600 text-xs font-bold">Manage Tasks</button>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">Annual Summit Setup</span>
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">15/20 Spots</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">Community Cleanup</span>
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                     <div className="bg-amber-500 h-2 rounded-full w-1/4"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">5/20 Spots</span>
               </div>
            </div>
         </div>
      </div>
      
      {/* Certificate Generator Preview */}
      <div className="bg-slate-900 text-white rounded-xl p-8 flex items-center justify-between">
         <div>
            <h3 className="text-xl font-bold mb-1">Certificate Generator</h3>
            <p className="text-slate-400 text-sm">Issue PDF certificates to volunteers who completed 10+ hours.</p>
         </div>
         <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors">
            <FileText size={18} />
            Generate Certificates
         </button>
      </div>
    </div>
  );
};

export default AdminVolunteers;
