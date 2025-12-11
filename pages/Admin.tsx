import React from 'react';
import { STORIES, EVENTS } from '../constants';
import { PlusCircle, Trash2 } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yawai-blue">Admin Dashboard</h2>
      </div>

      {/* Content Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Manage Events */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Manage Events</h3>
            <button className="text-yawai-blue hover:bg-blue-50 p-2 rounded-full">
              <PlusCircle />
            </button>
          </div>
          <ul className="space-y-4">
            {EVENTS.map(evt => (
              <li key={evt.id} className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-sm font-medium truncate w-2/3">{evt.title}</span>
                <button className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Manage Stories */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Pending Stories</h3>
             <button className="text-yawai-blue hover:bg-blue-50 p-2 rounded-full">
              <PlusCircle />
            </button>
          </div>
          <ul className="space-y-4">
             {STORIES.map(story => (
              <li key={story.id} className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-sm font-medium truncate w-2/3">{story.author}</span>
                <div className="flex gap-2">
                   <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                   <button className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
         {/* Social Feed Config */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
          <h3 className="font-bold text-lg mb-4">Social Media Feed Configuration</h3>
          <p className="text-sm text-slate-500 mb-4">
            URLs entered here will be fetched by the API proxy layer to populate the dashboard feed.
          </p>
          <div className="space-y-3">
            {['TikTok', 'Instagram', 'Facebook', 'LinkedIn'].map(platform => (
              <div key={platform} className="flex items-center gap-4">
                <label className="w-24 text-sm font-semibold">{platform}</label>
                <input 
                  type="text" 
                  placeholder={`https://${platform.toLowerCase()}.com/...`}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yawai-gold"
                />
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <button className="bg-yawai-blue text-white px-6 py-2 rounded-lg text-sm font-bold">Save Configuration</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
