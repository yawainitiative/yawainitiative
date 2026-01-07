
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Users, BookOpen, Shield, Globe, Rocket, Calendar, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useLogo } from '../contexts/LogoContext';

const LandingPage: React.FC = () => {
  const { logoUrl } = useLogo();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              {logoUrl ? (
                <img src={logoUrl} alt="YAWAI" className="w-12 h-12 rounded-full object-contain shadow-sm border border-slate-100 transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-yawai-gold to-yellow-300 rounded-xl flex items-center justify-center text-yawai-blue font-bold text-xl shadow-glow">Y</div>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/login" 
              className="hidden sm:block text-sm font-bold text-slate-600 hover:text-yawai-blue transition-colors px-3"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-yawai-blue text-white px-5 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Join Movement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-yawai-blue">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yawai-gold/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-yawai-goldLight text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Globe size={14} /> Empowering Global Change
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight animate-slide-up">
            Empowering the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Next Generation</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Access world-class digital skills training, mentorship, and funding opportunities designed for youth and women.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-yawai-gold to-yellow-500 text-yawai-blue font-black rounded-2xl shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Announcement Banner */}
      <section className="relative z-30 -mt-12 px-4 md:px-10">
         <Link to="/skill-acquisition" className="block max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-900 via-yawai-blue to-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl group transition-all hover:scale-[1.01] overflow-hidden relative">
               <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Rocket size={120} className="text-yawai-gold" />
               </div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                        <span className="bg-yawai-gold text-yawai-blue text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">Join The Batch</span>
                        <div className="flex items-center gap-1.5 text-yawai-goldLight font-bold text-xs">
                           <Calendar size={14} /> Batch 2026
                        </div>
                     </div>
                     <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">3-Month Skill Acquisition</h2>
                     <p className="text-slate-400 max-w-xl text-sm md:text-lg leading-relaxed">Master high-demand tech and vocational skills. Registration is now open for all aspiring leaders.</p>
                  </div>
                  <div className="bg-white text-yawai-blue px-10 py-5 rounded-2xl font-black text-base flex items-center gap-3 shadow-xl group-hover:bg-yawai-gold transition-all active:scale-95 shrink-0">
                     Register Now <ArrowRight size={20} />
                  </div>
               </div>
            </div>
         </Link>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-slate-100 relative z-20 mt-12 mx-4 md:mx-10 rounded-[2rem] shadow-xl">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center divide-x divide-slate-100">
            <div className="p-4">
               <div className="text-2xl md:text-4xl font-black text-yawai-blue mb-1 tracking-tighter">5K+</div>
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Lives Impacted</div>
            </div>
            <div className="p-4">
               <div className="text-2xl md:text-4xl font-black text-yawai-blue mb-1 tracking-tighter">₦10M+</div>
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Grants Given</div>
            </div>
            <div className="p-4">
               <div className="text-2xl md:text-4xl font-black text-yawai-blue mb-1 tracking-tighter">150+</div>
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Training Sessions</div>
            </div>
             <div className="p-4 border-none">
               <div className="text-2xl md:text-4xl font-black text-yawai-blue mb-1 tracking-tighter">50+</div>
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Partner Communities</div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-yawai-blue mb-4 tracking-tight">Impact Ecosystem</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Holistic support for your advancement journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Digital Skills', color: 'blue', desc: 'Practical training in tech, design, and business management.' },
              { icon: Users, title: 'Mentorship', color: 'amber', desc: 'Direct access to experienced professionals for career guidance.' },
              { icon: Shield, title: 'Community Aid', color: 'green', desc: 'Social protection, grants, and scholarships for the underserved.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-soft hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-100 group">
                 <div className={`w-16 h-16 ${feature.color === 'blue' ? 'bg-blue-50 text-blue-600' : feature.color === 'amber' ? 'bg-amber-50 text-yawai-gold' : 'bg-green-50 text-green-600'} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                   <feature.icon size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                 <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-full object-contain shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-yawai-blue rounded-2xl flex items-center justify-center text-yawai-gold font-black text-xl">Y</div>
                )}
                <div className="flex flex-col">
                  <span className="font-black text-2xl text-yawai-blue tracking-tight leading-none">YAWAI</span>
                  <span className="text-[10px] font-black text-yawai-gold uppercase tracking-[0.3em] mt-1">Everyone Matters</span>
                </div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                The Youngsters and Women Advancement Initiative (YAWAI) is a non-profit dedicated to closing the opportunity gap through education, technology, and community support.
              </p>
              <div className="flex items-center gap-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yawai-blue hover:text-white transition-all shadow-sm"><Instagram size={18} /></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yawai-blue hover:text-white transition-all shadow-sm"><Facebook size={18} /></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yawai-blue hover:text-white transition-all shadow-sm"><Twitter size={18} /></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-yawai-blue hover:text-white transition-all shadow-sm"><Linkedin size={18} /></a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Initiatives</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link to="/programs" className="hover:text-yawai-blue transition-colors">Skill Acquisition</Link></li>
                  <li><Link to="/events" className="hover:text-yawai-blue transition-colors">Youth Summits</Link></li>
                  <li><Link to="/donate" className="hover:text-yawai-blue transition-colors">Donation Hub</Link></li>
                  <li><Link to="/volunteer" className="hover:text-yawai-blue transition-colors">Volunteer Hub</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><button className="hover:text-yawai-blue transition-colors">About Us</button></li>
                  <li><button className="hover:text-yawai-blue transition-colors">Our Impact</button></li>
                  <li><button className="hover:text-yawai-blue transition-colors">Contact</button></li>
                  <li><Link to="/login" className="hover:text-yawai-blue transition-colors">Partner Portal</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} YAWAI — YOUNGSTERS AND WOMEN ADVANCEMENT INITIATIVE
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <button className="hover:text-yawai-blue">Privacy Policy</button>
               <button className="hover:text-yawai-blue">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
