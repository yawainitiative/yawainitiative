
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Heart, 
  User, 
  LogOut,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { User as UserType } from './types';
import { supabase } from './services/supabase';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

// Pages
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Events from './pages/Events';
import Opportunities from './pages/Opportunities';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Onboarding from './pages/Onboarding';

const Layout: React.FC<{ children: React.ReactNode, user: UserType | null, onLogout: () => void }> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const { settings } = useSettings();

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Programs', path: '/programs' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Briefcase, label: 'Jobs', path: '/opportunities' },
    { icon: Heart, label: 'Donate', path: '/donate' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (user.role === 'admin') {
    navItems.push({ icon: ShieldCheck, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar - Branding Only */}
      <header className="md:hidden bg-white/90 backdrop-blur-md text-yawai-blue p-4 flex justify-center items-center sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white shadow-sm border border-slate-100">
             {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
             ) : (
                <div className="w-full h-full bg-gradient-to-tr from-yawai-gold to-yellow-300 flex items-center justify-center text-yawai-blue font-bold text-lg">{settings.appName.charAt(0)}</div>
             )}
           </div>
           <h1 className="text-lg font-extrabold tracking-tight text-yawai-blue">{settings.appName}</h1>
        </div>
      </header>

      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-72 bg-yawai-blue text-white flex-col z-40 transition-transform duration-500 ease-in-out shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-glow">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-yawai-gold to-yellow-300 flex items-center justify-center text-yawai-blue font-bold text-xl">{settings.appName.charAt(0)}</div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">{settings.appName}</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">{settings.tagline}</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-slate-700/50 via-slate-700 to-slate-700/50 mb-6" />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-yawai-gold to-yellow-500 text-yawai-blue font-bold shadow-lg shadow-yellow-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon size={20} strokeWidth={2} />
                  <span className="flex-1">{item.label === 'Jobs' ? 'Opportunities' : item.label}</span>
                  <NavLink to={item.path} className={({isActive}) => isActive ? "block" : "hidden"}>
                     <div className="w-1.5 h-1.5 rounded-full bg-yawai-blue/50" />
                  </NavLink>
                </NavLink>
              </li>
            ))}
            
            {user.role !== 'admin' && (
              <li className="mt-4 pt-4 border-t border-slate-700/50">
                 <NavLink 
                  to="/volunteer"
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-blue-300 hover:text-white hover:bg-blue-900/30'
                    }
                  `}
                >
                  <ShieldCheck size={20} />
                  <span>Volunteer Hub</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 m-4 mt-0 bg-slate-800/50 rounded-2xl border border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate">{user.name}</p>
               <p className="text-xs text-slate-400 truncate">{user.email}</p>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="flex items-center justify-center gap-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 w-full py-2 rounded-lg text-xs font-medium transition-colors"
           >
             <LogOut size={14} />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto bg-slate-50 relative pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 px-2 pb-safe">
         <div className="flex justify-around items-center">
           {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full py-3 transition-all duration-300 relative
                  ${isActive ? 'text-yawai-blue' : 'text-slate-400 hover:text-slate-500'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`
                      relative p-1.5 rounded-xl transition-all duration-300
                      ${isActive ? '-translate-y-1' : ''}
                    `}>
                      <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yawai-gold rounded-full" />}
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
           ))}
         </div>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Session check error:", error.message);
        } else if (data?.session) {
          setUser(mapSessionToUser(data.session));
        }
      } catch (err) {
        console.error("Unexpected auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(mapSessionToUser(session));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSessionToUser = (session: any): UserType => {
    const meta = session.user.user_metadata || {};
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: meta.full_name || 'User',
      role: meta.role || 'user',
      interests: meta.interests || [],
      volunteerHours: meta.volunteerHours || 0
    };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-yawai-blue">
         <Loader2 size={48} className="animate-spin text-yawai-gold mb-4" />
         <h2 className="font-bold text-xl">Loading...</h2>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Route - Renders entirely separate from User Layout */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" replace />} 
          />

          {/* User Routes - Wrapped in the Standard Layout */}
          <Route path="*" element={
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={user ? <Dashboard user={user} /> : <Onboarding />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/events" element={<Events />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/volunteer" element={<Volunteer user={user} />} />
                <Route path="/donate" element={<Donate user={user} />} />
                <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
                {/* Catch-all for user routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;
