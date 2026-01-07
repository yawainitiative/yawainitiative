
import React, { useEffect, useState } from 'react';
import { contentService, GalleryImage } from '../services/contentService';
import { Loader2, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await contentService.fetchGallery();
      setImages(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
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

      {/* Footer Decoration */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
         <div className="h-px bg-slate-100 w-full mb-10"></div>
         <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">YAWAI Media Hub</p>
      </div>
    </div>
  );
};

export default Gallery;
