
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate, Outlet } from 'react-router-dom';
import { 
  Home, BookOpen, Calendar, Briefcase, Heart, User, LogOut, ShieldCheck, Loader2
} from 'lucide-react';
import { User as UserType } from './types';
import { supabase } from './services/supabase';
import { LogoProvider, useLogo } from './contexts/LogoContext';

// Public Pages
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Events from './pages/Events';
import Opportunities from './pages/Opportunities';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSocial from './pages/admin/AdminSocial';
import AdminContent from './pages/admin/AdminContent';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLayout from './layouts/AdminLayout';

// ScrollToTop Component to ensure navigation feels like a new page load
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Helper to determine if profile is fully set up
const isProfileComplete = (user: UserType) => {
  // If name is default 'User', we consider it incomplete
  return user.name && user.name !== 'User';
};

// Public Layout Component
const PublicLayout: React.FC<{ children: React.ReactNode, user: UserType | null, onLogout: () => void }> = ({ children, user, onLogout }) => {
  const { logoUrl } = useLogo();
  
  // If no user, or profile incomplete, just render content without sidebar (handled by LandingPage or Onboarding)
  if (!user || !isProfileComplete(user)) return <>{children}</>;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Programs', path: '/programs' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Briefcase, label: 'Jobs', path: '/opportunities' },
    { icon: Heart, label: 'Donate', path: '/donate' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* ScrollToTop acts here to reset scroll on route change */}
      <ScrollToTop />
      
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-white/90 backdrop-blur-md text-yawai-blue p-4 flex justify-center items-center sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
           {logoUrl ? (
             <img src={logoUrl} alt="YAWAI Logo" className="w-8 h-8 object-cover rounded-full" />
           ) : (
             <div className="w-8 h-8 bg-gradient-to-tr from-yawai-gold to-yellow-300 rounded-lg flex items-center justify-center text-yawai-blue font-bold text-lg shadow-sm">Y</div>
           )}
           <h1 className="text-lg font-extrabold tracking-tight">YAWAI</h1>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-72 bg-yawai-blue text-white flex-col z-40 shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            {logoUrl ? (
              <img src={logoUrl} alt="YAWAI Logo" className="w-10 h-10 object-cover rounded-full bg-white/10" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-yawai-gold to-yellow-300 rounded-xl flex items-center justify-center text-yawai-blue font-bold text-xl shadow-glow">Y</div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">YAWAI</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">Empowerment</p>
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
                </NavLink>
              </li>
            ))}
            
            <li className="mt-4 pt-4 border-t border-slate-700/50">
               <NavLink to="/volunteer" className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive ? 'bg-blue-600 text-white font-bold' : 'text-blue-300 hover:text-white hover:bg-blue-900/30'}
                `}>
                <ShieldCheck size={20} />
                <span>Volunteer Hub</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 m-4 mt-0 bg-slate-800/50 rounded-2xl border border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{user.name.charAt(0)}</div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate">{user.name}</p>
               <p className="text-xs text-slate-400 truncate">{user.email}</p>
             </div>
           </div>
           <button onClick={onLogout} className="flex items-center justify-center gap-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 w-full py-2 rounded-lg text-xs font-medium transition-colors">
             <LogOut size={14} /> <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto bg-slate-50 relative pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 px-2 pb-safe">
         <div className="flex justify-around items-center">
           {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full py-3 transition-all duration-300 relative
                  ${isActive ? 'text-yawai-blue' : 'text-slate-400 hover:text-slate-500'}
                `}>
                {({ isActive }) => (
                  <>
                    <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                      <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yawai-gold rounded-full" />}
                    </div>
                    <span className={`text-[10px] font-bold mt-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
           ))}
         </div>
      </nav>
    </div>
  );
};

const ProtectedAdminRoute = ({ user }: { user: UserType | null }) => {
  // If not admin, redirect to the new login path /admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <AdminLayout user={user} />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Local Storage "Demo" Admin Session
    const checkLocalSession = () => {
      const isDemoAdmin = localStorage.getItem('yawai_demo_admin') === 'true';
      if (isDemoAdmin) {
        setUser({
          id: 'admin-local-1',
          email: 'yawainitiative2022@gmail.com',
          name: 'YAWAI Admin',
          role: 'admin',
          interests: [],
          volunteerHours: 0
        });
        setLoading(false);
        return true;
      }
      return false;
    };

    if (checkLocalSession()) return;

    // 2. Check Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(mapSessionToUser(session));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we are locally logged in as admin, ignore supabase updates that might be null
      if (localStorage.getItem('yawai_demo_admin') === 'true') return;

      setUser(session ? mapSessionToUser(session) : null);
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
    localStorage.removeItem('yawai_demo_admin');
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/'; // Force reload to clear all states
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-yawai-blue">
         <Loader2 size={48} className="animate-spin text-yawai-gold mb-4" />
         <h2 className="font-bold text-xl">Loading YAWAI...</h2>
      </div>
    );
  }

  return (
    <LogoProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<ProtectedAdminRoute user={user} />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/social" element={<AdminSocial />} />
             <Route path="/admin/content" element={<AdminContent />} />
             <Route path="/admin/volunteers" element={<AdminVolunteers />} />
             <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Public / User Routes */}
          <Route path="*" element={
            <PublicLayout user={user} onLogout={handleLogout}>
              <Routes>
                {/* 
                   ROOT LOGIC:
                   1. If !user => Landing Page
                   2. If user && !complete => Profile Setup (Onboarding)
                   3. If user && complete => Dashboard
                */}
                <Route path="/" element={
                  user 
                    ? (isProfileComplete(user) ? <Dashboard user={user} /> : <Navigate to="/complete-profile" replace />)
                    : <LandingPage />
                } />

                {/* Auth Routes */}
                <Route path="/login" element={!user ? <Onboarding initialAuthMode="signin" /> : <Navigate to="/" replace />} />
                <Route path="/signup" element={!user ? <Onboarding initialAuthMode="signup" /> : <Navigate to="/" replace />} />
                
                {/* Profile Completion Route (Protected, for logged in but incomplete users) */}
                <Route path="/complete-profile" element={
                    user ? (isProfileComplete(user) ? <Navigate to="/" replace /> : <Onboarding user={user} />) : <Navigate to="/login" replace />
                } />

                {/* App Pages (Protected) */}
                <Route path="/programs" element={user ? <Programs /> : <Navigate to="/login" />} />
                <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
                <Route path="/opportunities" element={user ? <Opportunities /> : <Navigate to="/login" />} />
                <Route path="/volunteer" element={user ? <Volunteer user={user} /> : <Navigate to="/login" />} />
                <Route path="/donate" element={user ? <Donate user={user} /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </LogoProvider>
  );
};

export default App;
