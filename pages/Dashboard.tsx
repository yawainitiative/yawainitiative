
import React, { useEffect, useState } from 'react';
import { User, SocialPost, Event, Program } from '../types';
import { socialFeedService } from '../services/socialFeedService';
import { contentService } from '../services/contentService';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Heart, 
  TrendingUp, 
  ShieldCheck, 
  Loader2,
  Sparkles,
  User as UserIcon,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Video } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const SocialIcon = ({ platform }: { platform: string }) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md";
  switch (platform) {
    case 'instagram': return <div className={`${baseClasses} bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600`}><Instagram size={16} /></div>;
    case 'facebook': return <div className={`${baseClasses} bg-[#1877F2]`}><Facebook size={16} /></div>;
    case 'twitter': return <div className={`${baseClasses} bg-sky-500`}><Twitter size={16} /></div>;
    case 'linkedin': return <div className={`${baseClasses} bg-[#0A66C2]`}><Linkedin size={16} /></div>;
    case 'youtube': return <div className={`${baseClasses} bg-[#FF0000]`}><Youtube size={16} /></div>;
    case 'tiktok': return <div className={`${baseClasses} bg-black border border-white/20`}><Video size={16} /></div>;
    default: return <div className={`${baseClasses} bg-slate-500`}><ExternalLink size={16} /></div>;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [topPrograms, setTopPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    setShowGreeting(true);
    const loadData = async () => {
      try {
        const [posts, events, programs] = await Promise.all([
          socialFeedService.fetchAllPosts(),
          contentService.fetchEvents(),
          contentService.fetchPrograms()
        ]);
        setSocialPosts(posts);
        setFeaturedEvent(events[0] || null);
        setTopPrograms(programs.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <Loader2 className="animate-spin text-yawai-gold mb-4" size={48} />
         <h2 className="font-bold text-slate-600">Syncing your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 md:pb-0">
      
      {/* Sleek Welcome Impact Card */}
      <section className={`transition-all duration-700 transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yawai-blue via-slate-900 to-yawai-blue p-8 md:p-10 shadow-2xl border border-white/5">
           {/* Background Decorative Icon */}
           <div className="absolute -right-10 -bottom-10 opacity-5 transform rotate-12">
              <Sparkles size={240} className="text-white" />
           </div>
           <div className="absolute left-0 top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 bg-yawai-gold/20 backdrop-blur-md border border-yawai-gold/30 px-3 py-1 rounded-full">
                    <Sparkles size={14} className="text-yawai-gold" />
                    <span className="text-[10px] font-black text-yawai-goldLight uppercase tracking-widest">Active Journey</span>
                 </div>
                 
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                       Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-orange-400">{user.name.split(' ')[0]}</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium mt-2 max-w-md">
                       Your impact journey continues here. Ready to make a difference today?
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-3 pt-2">
                    <Link to="/profile" className="bg-white text-yawai-blue px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-yawai-gold transition-colors flex items-center gap-2 group">
                       My Impact Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/donate" className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2">
                       <Heart size={16} className="text-red-500 fill-red-500" /> Support
                    </Link>
                 </div>
              </div>

              {/* Quick Progress Stats Panel */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                 <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-5 rounded-3xl flex flex-col items-center justify-center text-center">
                    <Clock size={20} className="text-yawai-gold mb-2" />
                    <span className="text-2xl font-black text-white leading-none">{user.volunteerHours || 0}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Hours</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-5 rounded-3xl flex flex-col items-center justify-center text-center">
                    <Award size={20} className="text-blue-400 mb-2" />
                    <span className="text-2xl font-black text-white leading-none">0</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Badges</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl group transition-all duration-700 delay-100 transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="absolute inset-0 bg-yawai-blue">
               <img src={featuredEvent.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-r from-yawai-blue via-yawai-blue/80 to-transparent" />
          </div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col items-start justify-center min-h-[300px] max-w-2xl">
            <div className="flex items-center gap-2 bg-yawai-gold/20 backdrop-blur-sm border border-yawai-gold/30 text-yawai-goldLight text-xs font-bold px-3 py-1 rounded-full mb-4">
               <TrendingUp size={12} /> <span>COMMUNITY HIGHLIGHT</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{featuredEvent.title}</h3>
            <div className="flex flex-wrap items-center gap-6 text-slate-200 mb-8 font-medium">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm"><Calendar size={18} className="text-yawai-gold" /> {featuredEvent.date}</span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm"><MapPin size={18} className="text-yawai-gold" /> {featuredEvent.location}</span>
            </div>
            <Link to="/events" className="bg-white text-yawai-blue font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
              Explore Event <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Latest Social Updates Feed */}
      <section className={`transition-all duration-700 delay-200 transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h3 className="text-2xl font-black text-slate-800">Latest Updates</h3>
            <p className="text-sm font-medium text-slate-500">Real-time pulse of our community.</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x">
          {socialPosts.map((post) => (
            <a key={post.id} href={post.redirectUrl} target="_blank" rel="noopener noreferrer" className="min-w-[280px] md:min-w-[320px] h-[400px] snap-center relative rounded-[2.5rem] overflow-hidden group shadow-lg hover:-translate-y-2 transition-all duration-300">
              <img src={post.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-6 right-6 z-20"><SocialIcon platform={post.platform} /></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <p className="text-white font-bold line-clamp-2 mb-4 opacity-90 text-lg leading-snug">{post.caption}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  <span>{post.timestamp}</span>
                  <span className="flex items-center gap-1 text-yawai-gold">View Post <ExternalLink size={12} /></span>
                </div>
              </div>
            </a>
          ))}
          {socialPosts.length === 0 && (
            <div className="w-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
               No updates yet.
            </div>
          )}
        </div>
      </section>

      {/* Programs and Action Cards */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 delay-300 transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <div><h3 className="font-black text-xl text-slate-800">Top Programs</h3><p className="text-slate-400 text-sm font-medium">Recommended for you</p></div>
             <Link to="/programs" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-yawai-blue hover:border-yawai-blue transition-colors"><ArrowRight size={18} /></Link>
           </div>
           <div className="space-y-4 flex-1">
             {topPrograms.map(prog => (
               <Link key={prog.id} to="/programs" className="flex gap-5 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                 <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0"><img src={prog.image} className="w-full h-full object-cover" alt="" /></div>
                 <div className="flex-1"><h4 className="font-bold text-slate-800 group-hover:text-yawai-blue transition-colors">{prog.title}</h4><p className="text-[10px] font-black text-yawai-gold uppercase tracking-widest mt-1">{prog.category}</p></div>
                 <div className="text-slate-300 group-hover:translate-x-1 transition-transform"><ChevronRightIcon size={20} /></div>
               </Link>
             ))}
             {topPrograms.length === 0 && <p className="text-center py-10 text-slate-400">No programs listed.</p>}
           </div>
        </div>

        <div className="flex flex-col gap-6">
            <Link to="/volunteer" className="flex-1 group relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
               <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10"><ShieldCheck size={180} /></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div><div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4"><ShieldCheck size={28} /></div><h4 className="font-bold text-2xl mb-2">Volunteer Hub</h4><p className="text-blue-100 max-w-xs text-sm">Track your hours and earn certificates.</p></div>
                 <div className="mt-6 flex items-center gap-2 font-bold text-sm"><span>Enter Hub</span> <ArrowRight size={16} /></div>
               </div>
            </Link>
            <Link to="/donate" className="flex-1 group relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600" />
               <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10"><Heart size={180} /></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div><div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4"><Heart size={28} fill="currentColor" /></div><h4 className="font-bold text-2xl mb-2">Support the Mission</h4><p className="text-amber-100 max-w-xs text-sm">Directly empower youth and women.</p></div>
                 <div className="mt-6 flex items-center gap-2 font-bold text-sm"><span>Donate Now</span> <ArrowRight size={16} /></div>
               </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = ({size}:{size:number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
)

export default Dashboard;
