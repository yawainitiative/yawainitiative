import React, { useEffect, useState } from 'react';
import { User, SocialPost } from '../types';
import { socialFeedService } from '../services/socialFeedService';
import { EVENTS, PROGRAMS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, ExternalLink, Heart, PlayCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Video 
} from 'lucide-react';

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
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Trigger welcome animation on mount
    setShowGreeting(true);

    const loadFeed = async () => {
      try {
        const posts = await socialFeedService.fetchAllPosts();
        setSocialPosts(posts);
      } catch (err) {
        console.error("Failed to load social feed", err);
      } finally {
        setLoadingFeed(false);
      }
    };
    loadFeed();
  }, []);

  const featuredEvent = EVENTS[0];

  return (
    <div className="space-y-10 pb-20 md:pb-0">
      {/* Greeting Header with Animation */}
      <div 
        className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-4 transition-all duration-700 ease-out transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div>
          <h2 className="text-4xl font-extrabold text-yawai-blue tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-orange-500 animate-pulse">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1 text-lg">Your impact journey continues here.</p>
        </div>
        <Link to="/donate" className="group hidden sm:flex items-center gap-2 bg-yawai-blue text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Heart size={18} className="text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
          <span>Donate Now</span>
        </Link>
      </div>

      {/* Hero Banner - Glass/Modern */}
      <div 
        className={`relative rounded-[2rem] overflow-hidden shadow-2xl group transition-all duration-700 delay-100 ease-out transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div className="absolute inset-0 bg-yawai-blue">
             <img 
              src="https://picsum.photos/1200/600?random=99" 
              alt="Featured" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
            />
             <div className="absolute inset-0 bg-gradient-to-r from-yawai-blue via-yawai-blue/80 to-transparent" />
        </div>
       
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start justify-center min-h-[300px] max-w-2xl">
          <div className="flex items-center gap-2 bg-yawai-gold/20 backdrop-blur-sm border border-yawai-gold/30 text-yawai-goldLight text-xs font-bold px-3 py-1 rounded-full mb-4">
             <TrendingUp size={12} />
             <span>FEATURED EVENT</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight shadow-sm">{featuredEvent?.title}</h3>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-200 mb-8 font-medium">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm"><Calendar size={18} className="text-yawai-gold" /> {featuredEvent?.date}</span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm"><MapPin size={18} className="text-yawai-gold" /> {featuredEvent?.location}</span>
          </div>
          
          <Link to="/events" className="bg-white text-yawai-blue font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
            RSVP Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Social Media Feed - Stories Style */}
      <section 
        className={`transition-all duration-700 delay-200 ease-out transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Latest Updates</h3>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live Feed</span>
          </div>
        </div>
        
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          {loadingFeed ? (
             <div className="flex gap-4 overflow-hidden">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="min-w-[280px] h-72 bg-slate-200 animate-pulse rounded-3xl" />
               ))}
             </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x">
              {socialPosts.map((post) => (
                <a 
                  key={post.id} 
                  href={post.redirectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="min-w-[280px] md:min-w-[320px] h-[400px] snap-center relative rounded-3xl overflow-hidden group shadow-lg hover:shadow-soft-hover hover:-translate-y-2 transition-all duration-300"
                >
                  <img src={post.thumbnail} alt="Post" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 z-20 transform group-hover:rotate-12 transition-transform duration-300">
                    <SocialIcon platform={post.platform} />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="text-white font-medium line-clamp-2 mb-3 leading-relaxed opacity-90">{post.caption}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span>{post.timestamp}</span>
                      <span className="flex items-center gap-1 text-yawai-gold group-hover:underline">
                         View Post <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Grid */}
      <div 
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 delay-300 ease-out transform ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        
        {/* Featured Programs */}
        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-bold text-xl text-slate-800">Top Programs</h3>
               <p className="text-slate-400 text-sm">Recommended for you</p>
             </div>
             <Link to="/programs" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-yawai-blue hover:border-yawai-blue transition-colors">
               <ArrowRight size={18} />
             </Link>
           </div>
           
           <div className="space-y-4 flex-1">
             {PROGRAMS.slice(0, 3).map(prog => (
               <Link key={prog.id} to="/programs" className="flex gap-5 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                 <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={prog.image} alt="" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-slate-800 group-hover:text-yawai-blue transition-colors">{prog.title}</h4>
                   <p className="text-xs font-semibold text-yawai-gold uppercase tracking-wider mt-1 mb-1">{prog.category}</p>
                   <p className="text-xs text-slate-500">{prog.duration} • Online</p>
                 </div>
                 <div className="text-slate-300 group-hover:translate-x-1 transition-transform">
                   <ChevronRight size={20} />
                 </div>
               </Link>
             ))}
           </div>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-6">
            <Link to="/volunteer" className="flex-1 group relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl hover:shadow-2xl transition-all">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
               <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                 <ShieldCheck size={180} />
               </div>
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4">
                     <ShieldCheck size={28} />
                   </div>
                   <h4 className="font-bold text-2xl mb-2">Volunteer Hub</h4>
                   <p className="text-blue-100 max-w-xs">Track your hours, find new tasks, and earn certificates for your impact.</p>
                 </div>
                 <div className="mt-6 flex items-center gap-2 font-bold text-sm">
                   <span>Enter Hub</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
            </Link>
            
            <Link to="/donate" className="flex-1 group relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl hover:shadow-2xl transition-all">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600" />
               <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                 <Heart size={180} />
               </div>

               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4">
                     <Heart size={28} fill="currentColor" />
                   </div>
                   <h4 className="font-bold text-2xl mb-2">Support the Mission</h4>
                   <p className="text-amber-100 max-w-xs">Your contribution directly empowers youth and women in need.</p>
                 </div>
                 <div className="mt-6 flex items-center gap-2 font-bold text-sm">
                   <span>Donate Now</span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

// Helper for Chevron (Dashboard only)
const ChevronRight = ({size}:{size:number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
)

export default Dashboard;