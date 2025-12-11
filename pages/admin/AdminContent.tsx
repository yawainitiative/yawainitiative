
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen } from 'lucide-react';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');

  const tabs = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
          <Plus size={18} />
          <span className="capitalize">Create New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors
              ${activeTab === tab.id 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title / Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date/Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {/* Mock Data Row 1 */}
               <tr className="hover:bg-slate-50 group">
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 flex-shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {activeTab === 'programs' ? 'Digital Skills 101' : activeTab === 'events' ? 'Annual Summit' : 'Tech Scholarship'}
                        </span>
                     </div>
                  </td>
                  <td className="p-4">
                     <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">Published</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                     {activeTab === 'programs' ? 'Education' : 'Oct 24, 2024'}
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-500 hover:bg-slate-200 rounded"><Edit3 size={16} /></button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                     </div>
                  </td>
               </tr>
               {/* Mock Data Row 2 */}
               <tr className="hover:bg-slate-50 group">
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 flex-shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {activeTab === 'programs' ? 'Women Leadership' : activeTab === 'events' ? 'Charity Gala' : 'Internship Opening'}
                        </span>
                     </div>
                  </td>
                  <td className="p-4">
                     <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-500">Draft</span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                     {activeTab === 'programs' ? 'Leadership' : 'Nov 05, 2024'}
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-500 hover:bg-slate-200 rounded"><Edit3 size={16} /></button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
         
         <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Showing 2 of 2 items
         </div>
      </div>
    </div>
  );
};

export default AdminContent;
