
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService, GalleryImage } from '../services/contentService';
import { Loader2, Camera, Sparkles, Image as ImageIcon, Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { useLogo } from '../contexts/LogoContext';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { logoUrl } = useLogo();

  useEffect(() => {
    const load = async () => {
      const data = await contentService.fetchGallery();
      setImages(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Public Navbar */}
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

          <div className="flex items-center gap-4 md:gap-8">
            <Link 
              to="/" 
              className="text-sm font-bold text-slate-600 hover:text-yawai-blue transition-colors px-3"
            >
              Home
            </Link>
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
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-32 space-y-10 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-yawai-blue p-10 md:p-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-yawai-gold/20 border border-yawai-gold/30 px-4 py-1.5 rounded-full text-yawai-goldLight text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> Visualizing Impact
              </div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight">Community <span className="text-yawai-gold">Gallery</span></h1>
              <p className="text-slate-400 max-w-xl mx-auto font-medium md:text-lg">
                Capturing the moments of transformation, learning, and empowerment across our various initiatives.
              </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-yawai-gold mb-4" size={48} />
            <p className="text-slate-400 font-bold tracking-wide">Developing memories...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img) => (
              <div 
                key={img.id} 
                className="relative break-inside-avoid rounded-[2rem] overflow-hidden group shadow-soft border border-slate-100 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <img 
                  src={img.url} 
                  alt={img.caption || 'Impact photo'} 
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="bg-yawai-gold/90 text-yawai-blue w-fit p-3 rounded-2xl mb-4 shadow-lg scale-0 group-hover:scale-100 transition-transform delay-100 duration-300">
                      <ImageIcon size={24} />
                    </div>
                    {img.caption && <p className="text-white font-bold text-lg leading-snug drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
            <Camera size={64} className="mx-auto mb-6 opacity-10" />
            <p className="text-xl font-black text-slate-800">Our story is just beginning</p>
            <p className="text-sm mt-2 font-medium">New impact photos will appear here soon.</p>
          </div>
        )}
      </div>

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
                  <li><Link to="/skill-acquisition" className="hover:text-yawai-blue transition-colors">Skill Acquisition</Link></li>
                  <li><Link to="/gallery" className="hover:text-yawai-blue transition-colors">Impact Gallery</Link></li>
                  <li><Link to="/donate" className="hover:text-yawai-blue transition-colors">Donation Hub</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><button className="hover:text-yawai-blue transition-colors">About Us</button></li>
                  <li><button className="hover:text-yawai-blue transition-colors">Our Impact</button></li>
                  <li><button className="hover:text-yawai-blue transition-colors">Contact</button></li>
                  <li><Link to="/admin" className="hover:text-yawai-blue transition-colors">Admin Portal</Link></li>
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

export default Gallery;
