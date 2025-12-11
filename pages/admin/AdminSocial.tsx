
import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { SocialPost } from '../../types';

// Mock initial data
const INITIAL_POSTS: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    thumbnail: 'https://picsum.photos/400/400?random=1',
    caption: 'Great time at the summit!',
    redirectUrl: 'https://instagram.com/p/123',
    timestamp: '2h ago',
    likes: 120
  }
];

const AdminSocial: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [autoFetch, setAutoFetch] = useState(true);

  // Simulation of "Auto-Fetch" logic
  const handleFetchPost = async () => {
    if (!url) return;
    setLoading(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    // Create a mock post based on the input
    const newPost: SocialPost = {
      id: Date.now().toString(),
      platform: platform as any,
      thumbnail: `https://picsum.photos/400/400?random=${Date.now()}`,
      caption: `Auto-fetched content from ${platform}...`,
      redirectUrl: url,
      timestamp: 'Just now',
      likes: Math.floor(Math.random() * 500)
    };

    setPosts([newPost, ...posts]);
    setUrl('');
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Social Media Manager</h2>
          <p className="text-slate-500">Curate the live social feed shown on the app dashboard.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
           <span className="text-sm font-medium text-slate-700">Auto-Fetch Background Job</span>
           <button 
             onClick={() => setAutoFetch(!autoFetch)}
             className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${autoFetch ? 'bg-green-500' : 'bg-slate-300'}`}
           >
             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${autoFetch ? 'left-6' : 'left-1'}`} />
           </button>
        </div>
      </div>

      {/* Add New Post */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="font-bold text-lg mb-4">Add New Post</h3>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
               <select 
                 className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500 bg-white"
                 value={platform}
                 onChange={e => setPlatform(e.target.value)}
               >
                 <option value="instagram">Instagram</option>
                 <option value="facebook">Facebook</option>
                 <option value="twitter">X (Twitter)</option>
                 <option value="linkedin">LinkedIn</option>
                 <option value="youtube">YouTube</option>
                 <option value="tiktok">TikTok</option>
               </select>
            </div>
            <div className="md:col-span-7">
               <input 
                 type="text" 
                 placeholder="Paste post URL here..." 
                 value={url}
                 onChange={e => setUrl(e.target.value)}
                 className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500"
               />
            </div>
            <div className="md:col-span-2">
               <button 
                 onClick={handleFetchPost}
                 disabled={loading || !url}
                 className="w-full h-full bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                 <span>Fetch</span>
               </button>
            </div>
         </div>
      </div>

      {/* Active Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
             <div className="aspect-[4/3] relative bg-slate-100">
               <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md uppercase font-bold">
                 {post.platform}
               </div>
             </div>
             <div className="p-4">
               <p className="text-slate-600 text-sm line-clamp-2 mb-3">{post.caption}</p>
               <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-50 pt-3">
                 <span>{post.timestamp}</span>
                 <span>{post.likes} Likes</span>
               </div>
             </div>
             
             {/* Admin Actions Overlay */}
             <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                <a href={post.redirectUrl} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                  <ExternalLink size={20} />
                </a>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
             <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
             <p>No posts in feed. Add a URL above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSocial;
