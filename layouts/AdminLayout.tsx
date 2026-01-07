
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Share2, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  ShieldAlert,
  ClipboardList,
  Image
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../services/supabase';
import { useLogo } from '../contexts/LogoContext';

interface AdminLayoutProps {
  user: User;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { logoUrl } = useLogo();

  const handleLogout = async () => {
    localStorage.removeItem('yawai_demo_admin');
    await supabase.auth.signOut();
    navigate('/admin'); // Redirect to login page at /admin
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: ClipboardList, label: 'Applications', path: '/admin/applications' },
    { icon: Share2, label: 'Social Feed', path: '/admin/social' },
    { icon: Image, label: 'Media Gallery', path: '/admin/gallery' },
    { icon: FileText, label: 'Content Manager', path: '/admin/content' },
    { icon: Users, label: 'Volunteer Hub', path: '/admin/volunteers' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-cover rounded-full bg-white/10" />
          ) : (
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">A</div>
          )}
          <div>
            <h1 className="font-bold text-lg leading-none">YAWAI</h1>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        <nav className="p-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'} // Ensure exact match for dashboard
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-8 mt-8 border-t border-slate-800">
             <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">System</div>
             <NavLink 
                to="/admin/settings"
                className={({ isActive }) => `
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}>
                <Settings size={20} />
                <span className="font-medium text-sm">Settings</span>
             </NavLink>
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 hover:text-red-300 rounded-lg transition-all"
             >
                <LogOut size={20} />
                <span className="font-medium text-sm">Logout</span>
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 lg:flex-none"></div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
              <ShieldAlert size={20} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
