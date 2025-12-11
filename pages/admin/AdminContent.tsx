
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Calendar, Briefcase, BookOpen, Filter } from 'lucide-react';

interface ContentItem {
  id: number;
  type: 'programs' | 'events' | 'opportunities';
  title: string;
  status: 'Published' | 'Draft';
  dateOrCategory: string;
}

const MOCK_DATA: ContentItem[] = [
  { id: 1, type: 'programs', title: 'Digital Skills 101', status: 'Published', dateOrCategory: 'Education' },
  { id: 2, type: 'programs', title: 'Women Leadership', status: 'Draft', dateOrCategory: 'Leadership' },
  { id: 3, type: 'events', title: 'Annual Summit', status: 'Published', dateOrCategory: 'Oct 24, 2024' },
  { id: 4, type: 'events', title: 'Charity Gala', status: 'Draft', dateOrCategory: 'Nov 05, 2024' },
  { id: 5, type: 'opportunities', title: 'Tech Scholarship', status: 'Published', dateOrCategory: 'Scholarship' },
  { id: 6, type: 'opportunities', title: 'Internship Opening', status: 'Draft', dateOrCategory: 'Internship' },
];

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'events' | 'opportunities'>('programs');
  const [items, setItems] = useState<ContentItem[]>(MOCK_DATA);

  const tabs = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  const filteredItems = items.filter(item => item.type === activeTab);

  const getIcon = (type: string) => {
    return tabs.find(t => t.id === type)?.icon || BookOpen;
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleCreate = () => {
    // For this demo, we use prompts to simulate a creation wizard
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

  const handleEdit = (id: number) => {
     alert(`Edit functionality for ID ${id} would open a full form editor here.`);
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
          <span className="capitalize">Create New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Tabs */}
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

      {/* Content List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {filteredItems.length > 0 ? (
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
                 {filteredItems.map(item => {
                   const Icon = getIcon(item.type);
                   return (
                   <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300">
                              <Icon size={20} />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {item.title}
                            </span>
                         </div>
                      </td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                           {item.status}
                         </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                         {item.dateOrCategory}
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item.id)} className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors" title="Edit"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 )})}
              </tbody>
           </table>
         ) : (
           <div className="p-12 text-center text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-20" />
             <p>No {activeTab} found. Create one to get started.</p>
           </div>
         )}
         
         <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Showing {filteredItems.length} items
         </div>
      </div>
    </div>
  );
};

export default AdminContent;
