import React, { useState, useEffect } from 'react';
import { socialFeedService } from '../../services/socialFeedService';
import { SocialPost } from '../../types';
import { 
  Instagram, Facebook, Twitter, Linkedin, Youtube, Video, 
  Trash2, Pin, ExternalLink, RefreshCw, Plus, CheckCircle, AlertCircle 
} from 'lucide-react';

const AdminSocial: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await socialFeedService.fetchAllPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleFetch = async () => {
    if (!urlInput) return;
    setIsFetching(true);
    setFetchError('');

    try {
      const newPost = await socialFeedService.fetchPostMetadata(urlInput);
      await socialFeedService.addPost(newPost);
      await loadPosts(); // Reload list
      setUrlInput('');
    } catch (err) {
      setFetchError('Failed to fetch post. Please check the URL.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this post from the dashboard?')) {
      await socialFeedService.deletePost(id);
      loadPosts();
    }
  };

  const handlePin = async (id: string) => {
    await socialFeedService.togglePin(id);
    loadPosts();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'tiktok': return <Video size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Social Feed Manager</h2>
           <p className="text-slate-500">Auto-fetch and curate posts for the mobile app dashboard.</p>
        </div>
      </div>

      {/* URL Fetcher */}
      <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100">
         <h3 className="font-bold text-lg mb-4 text-yawai-blue">Add New Post</h3>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <input 
                 type="text" 
                 value={urlInput}
                 onChange={(e) => setUrlInput(e.target.value)}
                 placeholder="Paste URL from Instagram, TikTok, LinkedIn, etc."
                 className="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all"
               />
            </div>
            <button 
              onClick={handleFetch}
              disabled={isFetching || !urlInput}
              className="bg-yawai-blue text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isFetching ? <RefreshCw className="animate-spin" /> : <Plus />}
              <span>{isFetching ? 'Fetching...' : 'Fetch & Add'}</span>
            </button>
         </div>
         {fetchError && (
           <p className="text-red-500 text-sm mt-2 flex items-center gap-2"><AlertCircle size={14} /> {fetchError}</p>
         )}
         <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
           <CheckCircle size={12} className="text-green-500" /> Supports TikTok, Instagram, Facebook, YouTube, X (Twitter), LinkedIn
         </p>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg">Active Dashboard Posts</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading feed...</div>
        ) : (
          <div className="divide-y divide-slate-100">
             {posts.map(post => (
               <div key={post.id} className="p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden relative shadow-md">
                     <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                        {getPlatformIcon(post.platform)}
                     </div>
                  </div>
                  
                  <div className="flex-1 w-full text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{post.platform}</span>
                        <span className="text-xs text-slate-400">{post.timestamp}</span>
                     </div>
                     <p className="text-slate-800 font-medium line-clamp-2 mb-2">{post.caption}</p>
                     <a href={post.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-yawai-gold text-xs font-bold hover:underline flex items-center justify-center md:justify-start gap-1">
                       {post.redirectUrl} <ExternalLink size={10} />
                     </a>
                  </div>

                  <div className="flex gap-2">
                     <button 
                       onClick={() => handlePin(post.id)}
                       className={`p-3 rounded-xl transition-all border ${post.isPinned ? 'bg-yawai-gold/10 border-yawai-gold text-yawai-gold' : 'bg-white border-slate-200 text-slate-400 hover:text-yawai-blue'}`}
                       title="Pin to top"
                     >
                       <Pin size={18} />
                     </button>
                     <button 
                       onClick={() => handleDelete(post.id)}
                       className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
                       title="Remove post"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
               </div>
             ))}
             {posts.length === 0 && (
               <div className="p-12 text-center text-slate-400">
                 No posts in feed. Add one above!
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSocial;