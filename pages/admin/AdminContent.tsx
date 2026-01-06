
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen, Filter } from 'lucide-react';

interface ContentItem {
  id: number;
  type: 'programs' | 'events' | 'opportunities';
  title: string;
  status: 'Published' | 'Draft';
  dateOrCategory: string;
}

const MOCK_DATA: ContentItem[] = [];

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');
  const [items, setItems] = useState<ContentItem[]>(MOCK_DATA);

  const tabs = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  const filteredItems = items.filter(item => item.type === activeTab);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleCreate = () => {
    const title = window.prompt(`Enter title for new ${activeTab.slice(0, -1)}:`);
    if (!title) return;

    const dateOrCat = window.prompt(`Enter ${activeTab === 'events' ? 'Date' : 'Category'}:`);
    if (!dateOrCat) return;

    const newItem: ContentItem = {
      id: Date.now(),
      type: activeTab,
      title,
      status: 'Draft',
      dateOrCategory: dateOrCat
    };

    setItems([newItem, ...items]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
        <button 
          onClick={handleCreate}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span className="capitalize">Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {filteredItems.length > 0 ? (
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredItems.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="p-4 font-semibold text-slate-800">{item.title}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                           {item.status}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
         ) : (
           <div className="p-20 text-center text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold">No {activeTab} yet</p>
             <p className="text-sm">Create your first entry to publish it to the app.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminContent;
