import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Share2, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X
} from 'lucide-react';

// Sub-pages
import AdminOverview from './admin/AdminOverview';
import AdminSocial from './admin/AdminSocial';
import AdminContent from './admin/AdminContent';
import AdminVolunteers from './admin/AdminVolunteers';

const Admin: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'overview' | 'social' | 'content' | 'volunteers' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'social', label: 'Social Feed', icon: Share2 },
    { id: 'content', label: 'Manage Content', icon: FileText },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeModule) {
      case 'overview': return <AdminOverview />;
      case 'social': return <AdminSocial />;
      case 'content': return <AdminContent />;
      case 'volunteers': return <AdminVolunteers />;
      default: return <div className="p-10 text-center text-slate-400">Settings module coming soon.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-yawai-blue text-white z-50 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-yawai-gold rounded-lg flex items-center justify-center text-yawai-blue font-extrabold text-lg">A</div>
              <h1 className="font-bold text-xl tracking-tight">Admin Panel</h1>
           </div>
           
           <nav className="space-y-1">
             {menuItems.map(item => (
               <button
                 key={item.id}
                 onClick={() => { setActiveModule(item.id as any); setMobileMenuOpen(false); }}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                   ${activeModule === item.id 
                     ? 'bg-yawai-gold text-yawai-blue font-bold shadow-lg' 
                     : 'text-slate-400 hover:bg-white/5 hover:text-white'
                   }
                 `}
               >
                 <item.icon size={18} />
                 {item.label}
               </button>
             ))}
           </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6">
           <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
             <LogOut size={16} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={24} />
             </button>
             <h2 className="text-lg font-bold text-slate-800 capitalize">{activeModule.replace('-', ' ')}</h2>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Admin" />
              </div>
           </div>
        </header>

        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default Admin;