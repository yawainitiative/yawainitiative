
import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, Loader2, Check } from 'lucide-react';

interface VolunteerApp {
  id: number;
  name: string;
  role: string;
  initial: string;
}

const MOCK_APPS: VolunteerApp[] = [
  { id: 1, name: 'Jane Doe', role: 'Event Support', initial: 'J' },
  { id: 2, name: 'Michael Chen', role: 'Mentorship', initial: 'M' },
  { id: 3, name: 'Sarah Connor', role: 'Field Work', initial: 'S' },
];

const AdminVolunteers: React.FC = () => {
  const [pendingApps, setPendingApps] = useState<VolunteerApp[]>(MOCK_APPS);
  const [activeCount, setActiveCount] = useState(15); // Mock count
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);

  const handleApprove = (id: number) => {
    setPendingApps(prev => prev.filter(app => app.id !== id));
    setActiveCount(prev => prev + 1); // Simulate adding to active pool
  };

  const handleReject = (id: number) => {
    if (window.confirm("Reject this volunteer application?")) {
      setPendingApps(prev => prev.filter(app => app.id !== id));
    }
  };

  const handleGenerateCertificates = () => {
    setGenerating(true);
    setGenSuccess(false);
    
    // Simulate process
    setTimeout(() => {
      setGenerating(false);
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 3000); // Hide success after 3s
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-900">Volunteer Management</h2>
        <p className="text-slate-500">Approve signups, assign tasks, and generate certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Pending Approvals */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Pending Approvals</h3>
               <span className={`text-xs font-bold px-2 py-1 rounded-full ${pendingApps.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                 {pendingApps.length} New
               </span>
            </div>
            <div className="divide-y divide-slate-50 flex-1 overflow-y-auto max-h-[300px]">
               {pendingApps.length > 0 ? pendingApps.map(app => (
                  <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{app.initial}</div>
                        <div>
                           <p className="text-sm font-bold text-slate-800">{app.name}</p>
                           <p className="text-xs text-slate-500">Applied for: {app.role}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleApprove(app.id)} className="text-green-500 hover:bg-green-100 p-2 rounded-full transition-colors" title="Approve"><CheckCircle size={20} /></button>
                        <button onClick={() => handleReject(app.id)} className="text-red-400 hover:bg-red-100 p-2 rounded-full transition-colors" title="Reject"><XCircle size={20} /></button>
                     </div>
                  </div>
               )) : (
                 <div className="p-8 text-center text-slate-400 text-sm">
                   <CheckCircle size={32} className="mx-auto mb-2 text-green-400 opacity-50" />
                   No pending approvals. All caught up!
                 </div>
               )}
            </div>
         </div>

         {/* Active Tasks Overview */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Active Task Status</h3>
               <button className="text-blue-600 text-xs font-bold hover:underline">Manage Tasks</button>
            </div>
            <div className="p-6 space-y-6">
               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">Annual Summit Setup</span>
                    <span className="text-xs font-bold text-slate-500">{activeCount}/20 Spots</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(activeCount / 20) * 100}%` }}></div>
                  </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">Community Cleanup</span>
                    <span className="text-xs font-bold text-slate-500">5/20 Spots</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-amber-500 h-2 rounded-full w-1/4"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      {/* Certificate Generator Preview */}
      <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Certificate Generator</h3>
            <p className="text-slate-400 text-sm">Issue PDF certificates to volunteers who completed 10+ hours.</p>
         </div>
         <div className="relative z-10">
            <button 
              onClick={handleGenerateCertificates}
              disabled={generating || genSuccess}
              className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all min-w-[200px] justify-center
                ${genSuccess ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'}
              `}
            >
              {generating ? (
                <><Loader2 size={18} className="animate-spin" /> Generating...</>
              ) : genSuccess ? (
                <><Check size={18} /> Sent Successfully</>
              ) : (
                <><FileText size={18} /> Generate Certificates</>
              )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminVolunteers;
