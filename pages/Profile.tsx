import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Settings, LogOut, Bell, Shield, User as UserIcon, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User | null;
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleRoleSwitch = async (newRole: UserRole) => {
    setIsUpdating(true);
    try {
      // 1. Update the user metadata on the backend
      const { error } = await supabase.auth.updateUser({
        data: { role: newRole }
      });
      if (error) throw error;

      // 2. Force a session refresh so the App component picks up the new role immediately
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;

      // 3. Navigate smoothly without reloading the window
      if (newRole === 'admin') {
        navigate('/admin');
      } else {
        alert("Switched back to Member view.");
        navigate('/');
      }
    } catch (err) {
      console.error("Failed to switch role", err);
      alert("Failed to switch role. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-yawai-blue to-slate-800"></div>
         
         <div className="relative z-10 w-28 h-28 bg-white p-1.5 rounded-full -mt-4 mb-4 shadow-xl">
            <div className="w-full h-full bg-yawai-gold rounded-full flex items-center justify-center text-yawai-blue text-4xl font-extrabold shadow-inner">
               {user.name.charAt(0)}
            </div>
         </div>
         
         <div className="relative z-10">
           <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
           <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border 
                ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                {user.role}
              </span>
           </div>
           <p className="text-slate-500 mt-2 text-sm">{user.email}</p>
         </div>

         <button className="mt-6 flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
            <Settings size={16} /> Edit Profile
         </button>
      </div>

      {/* Interests */}
      <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
           <UserIcon size={18} className="text-yawai-gold" /> My Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.interests.map(int => (
            <span key={int} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold border border-slate-100">
              {int}
            </span>
          ))}
        </div>
      </div>
      
      {/* Settings Menu */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden divide-y divide-slate-50">
        <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group">
           <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
             <Bell size={20} />
           </div>
           <span className="font-semibold text-slate-700">Notifications</span>
        </button>
        <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group">
           <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
             <Shield size={20} />
           </div>
           <span className="font-semibold text-slate-700">Privacy & Security</span>
        </button>
        
        {/* Logout Button */}
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-colors text-left group"
          >
             <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
               <LogOut size={20} />
             </div>
             <span className="font-bold text-red-500">Sign Out</span>
          </button>
        )}
      </div>

      {/* Demo Developer Tools */}
      <div className="bg-slate-800 p-6 rounded-[2rem] shadow-xl text-white">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" size={20} /> 
          Developer / Demo Options
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Use these options to switch roles for previewing the app features.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={() => handleRoleSwitch('user')}
             disabled={isUpdating}
             className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border border-slate-600 hover:bg-slate-700
               ${user.role === 'user' ? 'bg-slate-700 border-white text-white' : 'text-slate-400'}
             `}
           >
             Switch to Member
           </button>
           <button 
             onClick={() => handleRoleSwitch('admin')}
             disabled={isUpdating}
             className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border border-slate-600 hover:bg-red-900/30
               ${user.role === 'admin' ? 'bg-red-600 border-red-400 text-white' : 'text-red-400'}
             `}
           >
             {isUpdating ? <RefreshCw className="animate-spin mx-auto" size={16} /> : 'Switch to Admin'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;