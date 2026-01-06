
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Users, BookOpen, Shield, Globe, Rocket, Calendar } from 'lucide-react';
import { useLogo } from '../contexts/LogoContext';

const LandingPage: React.FC = () => {
  const { logoUrl } = useLogo();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="YAWAI" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-yawai-gold to-yellow-300 rounded-xl flex items-center justify-center text-yawai-blue font-bold text-xl shadow-glow">Y</div>
            )}
            <span className="text-xl font-extrabold text-yawai-blue tracking-tight">YAWAI</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="hidden md:block text-sm font-bold text-slate-600 hover:text-yawai-blue transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-yawai-blue text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20"
            >
              Join Movement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-yawai-blue">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yawai-gold/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-yawai-goldLight text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Globe size={14} /> Empowering Global Change
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight animate-slide-up">
            Empowering the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yawai-gold to-yellow-300">Next Generation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Access world-class digital skills training, mentorship, and funding opportunities designed for youth and women.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yawai-gold to-yellow-500 text-yawai-blue font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Announcement Banner */}
      <section className="relative z-30 -mt-12 px-4 md:px-10">
         <Link to="/skill-acquisition" className="block max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-900 via-yawai-blue to-slate-900 rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl group transition-all hover:scale-[1.01] overflow-hidden relative">
               <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Rocket size={120} className="text-yawai-gold" />
               </div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="bg-yawai-gold text-yawai-blue text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">New Program</span>
                        <div className="flex items-center gap-1.5 text-yawai-goldLight font-bold text-xs">
                           <Calendar size={14} /> Kicks off Jan 2026
                        </div>
                     </div>
                     <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">3-Month Skill Acquisition Program</h2>
                     <p className="text-slate-400 max-w-xl text-sm md:text-base">Master Video Editing, Graphics, Auto-Gele, and more. Registration opens January 6th. Take a step toward your future.</p>
                  </div>
                  <div className="bg-white text-yawai-blue px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-lg group-hover:bg-yawai-gold transition-colors">
                     Register Now <ArrowRight size={18} />
                  </div>
               </div>
            </div>
         </Link>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-slate-100 relative z-20 mt-12 mx-4 md:mx-10 rounded-2xl shadow-xl">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div className="p-4">
               <div className="text-3xl md:text-4xl font-extrabold text-yawai-blue mb-1">5K+</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lives Impacted</div>
            </div>
            <div className="p-4">
               <div className="text-3xl md:text-4xl font-extrabold text-yawai-blue mb-1">₦10M+</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Grants Disbursed</div>
            </div>
            <div className="p-4">
               <div className="text-3xl md:text-4xl font-extrabold text-yawai-blue mb-1">150+</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Training Events</div>
            </div>
             <div className="p-4">
               <div className="text-3xl md:text-4xl font-extrabold text-yawai-blue mb-1">50+</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Communities</div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-yawai-blue mb-4">Why Join YAWAI?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We provide an ecosystem of support to help you achieve your personal and professional goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                 <BookOpen size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Digital Skills</h3>
               <p className="text-slate-500 leading-relaxed">Master coding, design, and digital marketing with our certified curriculums and workshops.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
               <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-yawai-gold mb-6">
                 <Users size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Mentorship</h3>
               <p className="text-slate-500 leading-relaxed">Connect with industry leaders who provide guidance, career advice, and networking opportunities.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
               <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                 <Shield size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Community Aid</h3>
               <p className="text-slate-500 leading-relaxed">Access grants, scholarships, and volunteer opportunities to uplift yourself and your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
           <div className="bg-gradient-to-r from-yawai-blue to-slate-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10 text-white">
                <Heart size={200} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Make a Difference?</h2>
                <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                  Whether you're looking to learn, lead, or volunteer, YAWAI is your platform for growth.
                </p>
                <Link to="/signup" className="inline-block bg-yawai-gold text-yawai-blue px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors shadow-lg">
                  Join for Free
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                 <span className="font-extrabold text-xl">YAWAI</span>
              </div>
              <p className="max-w-xs text-sm">Youngsters and Women Advancement Initiative. Empowering communities through education and technology.</p>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                 <li><Link to="/programs" className="hover:text-yawai-gold">Programs</Link></li>
                 <li><Link to="/events" className="hover:text-yawai-gold">Events</Link></li>
                 <li><Link to="/login" className="hover:text-yawai-gold">Login</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                 <li><span className="cursor-pointer hover:text-yawai-gold">Privacy Policy</span></li>
                 <li><span className="cursor-pointer hover:text-yawai-gold">Terms of Service</span></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-xs text-center border-t border-slate-800 pt-8">
           &copy; {new Date().getFullYear()} YAWAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
