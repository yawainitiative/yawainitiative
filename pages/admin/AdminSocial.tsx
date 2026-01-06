
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { SocialPost } from '../../types';
import { socialFeedService } from '../../services/socialFeedService';

const AdminSocial: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setFetchingPosts(true);
    const data = await socialFeedService.fetchAllPosts();
    setPosts(data);
    setFetchingPosts(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleFetchPost = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    
    try {
      // 1. Fetch metadata via Microlink
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const result = await response.json();

      if (result.status === 'success') {
        const { image, title, description, logo } = result.data;
        
        const newPostData = {
          platform: platform as any,
          thumbnail: image?.url || logo?.url || 'https://via.placeholder.com/400?text=No+Preview',
          caption: description || title || `New post from ${platform}`,
          redirectUrl: url,
          timestamp: 'Just now',
          likes: 0
        };

        // 2. Persist to Supabase so it shows up in the user app
        const savedPost = await socialFeedService.addPost(newPostData);
        setPosts([savedPost, ...posts]);
        setUrl('');
      } else {
        throw new Error("Could not fetch content. Please check the URL.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch content. Ensure the URL is public and valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this post from the live app?")) {
      try {
        await socialFeedService.deletePost(id);
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Social Media Manager</h2>
          <p className="text-slate-500">Add URLs to populate the live feed on the user app.</p>
        </div>
        <button 
          onClick={loadPosts} 
          disabled={fetchingPosts}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={18} className={fetchingPosts ? 'animate-spin' : ''} />
          <span className="text-sm font-bold text-slate-600">Refresh Feed</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Post</h3>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
               <select 
                 className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500 bg-white font-medium"
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
                 {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                 <span>{loading ? 'Processing' : 'Add to Feed'}</span>
               </button>
            </div>
         </div>
         {error && <p className="mt-3 text-red-500 text-sm font-medium flex items-center gap-2"><ImageIcon size={14} /> {error}</p>}
      </div>

      {fetchingPosts ? (
        <div className="flex justify-center py-20">
           <Loader2 className="animate-spin text-slate-300" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 relative animate-slide-up">
               <div className="aspect-square relative bg-slate-100">
                 <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                 <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md uppercase font-bold tracking-widest">
                   {post.platform}
                 </div>
               </div>
               <div className="p-4">
                 <p className="text-slate-600 text-sm line-clamp-2 mb-1 h-10">{post.caption}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.timestamp}</p>
               </div>
               <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <a href={post.redirectUrl} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                    <ExternalLink size={20} />
                  </a>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-24 text-center text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
               <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
               <p className="font-bold text-slate-600">No active social feed</p>
               <p className="text-sm">Fetched posts will appear here and on the user dashboard.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSocial;
