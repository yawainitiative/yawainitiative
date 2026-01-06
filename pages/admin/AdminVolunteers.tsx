
import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, Loader2, Check, Users } from 'lucide-react';

interface VolunteerApp {
  id: number;
  name: string;
  role: string;
  initial: string;
}

const MOCK_APPS: VolunteerApp[] = [];

const AdminVolunteers: React.FC = () => {
  const [pendingApps, setPendingApps] = useState<VolunteerApp[]>(MOCK_APPS);
  const [activeCount, setActiveCount] = useState(0); 
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);

  const handleApprove = (id: number) => {
    setPendingApps(prev => prev.filter(app => app.id !== id));
    setActiveCount(prev => prev + 1);
  };

  const handleGenerateCertificates = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-900">Volunteer Management</h2>
        <p className="text-slate-500">Approve new signups and issue community certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Pending Approvals</h3>
               <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                 {pendingApps.length} New
               </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
               <Users size={32} className="opacity-20 mb-3" />
               <p className="text-sm">No pending applications</p>
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100">
               <h3 className="font-bold text-slate-800">Engagement Overview</h3>
            </div>
            <div className="p-12 text-center text-slate-400">
               <p className="text-3xl font-bold text-slate-900 mb-2">{activeCount}</p>
               <p className="text-sm">Total Verified Volunteers</p>
            </div>
         </div>
      </div>
      
      <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Issue Certificates</h3>
            <p className="text-slate-400 text-sm">Send official YAWAI certificates to active volunteers.</p>
         </div>
         <div className="relative z-10">
            <button 
              onClick={handleGenerateCertificates}
              disabled={generating || activeCount === 0}
              className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
              {genSuccess ? 'Sent Successfully' : 'Generate & Send'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminVolunteers;
