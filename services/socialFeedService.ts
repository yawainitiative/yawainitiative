import { SocialPost, SocialPlatform } from '../types';

// MOCK DATA for initial load
const MOCK_POSTS: SocialPost[] = [
  {
    id: '1',
    platform: 'tiktok',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    caption: 'Empowering the next generation! #YAWAI #Youth',
    redirectUrl: 'https://tiktok.com/@yawai/video/1',
    timestamp: '2h ago',
    likes: 1205,
    status: 'published',
    isPinned: true
  },
  {
    id: '2',
    platform: 'instagram',
    thumbnail: 'https://picsum.photos/600/600?random=2',
    caption: 'Highlights from our Women in Tech summit.',
    redirectUrl: 'https://instagram.com/p/xyz',
    timestamp: '5h ago',
    likes: 890,
    status: 'published'
  },
  {
    id: '3',
    platform: 'linkedin',
    thumbnail: 'https://picsum.photos/600/400?random=3',
    caption: 'We are proud to announce our new scholarship partnership.',
    redirectUrl: 'https://linkedin.com/posts/xyz',
    timestamp: '1d ago',
    likes: 450,
    status: 'published'
  },
  {
    id: '4',
    platform: 'youtube',
    thumbnail: 'https://picsum.photos/600/340?random=4',
    caption: 'Full Documentary: Changing Lives in Rural Communities',
    redirectUrl: 'https://youtube.com/watch?v=xyz',
    timestamp: '2d ago',
    likes: 3200,
    status: 'published'
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to detect platform from URL
const detectPlatform = (url: string): SocialPlatform => {
  if (url.includes('tiktok')) return 'tiktok';
  if (url.includes('instagram')) return 'instagram';
  if (url.includes('facebook')) return 'facebook';
  if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
  if (url.includes('linkedin')) return 'linkedin';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
  return 'twitter'; // default fallback
};

export const socialFeedService = {
  // Fetch all active posts for the Dashboard
  async fetchAllPosts(): Promise<SocialPost[]> {
    await delay(800);
    // Return sorted by pinned first, then timestamp (mocked order)
    return MOCK_POSTS.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  },

  // ADMIN: Fetch metadata from a URL (Simulated Proxy)
  async fetchPostMetadata(url: string): Promise<SocialPost> {
    await delay(1500); // Simulate API crawling time
    
    const platform = detectPlatform(url);
    
    // Simulate finding content
    return {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      thumbnail: `https://picsum.photos/500/500?random=${Math.floor(Math.random() * 1000)}`,
      caption: `Auto-fetched content from ${platform}. This would be the actual post caption extracted via API.`,
      redirectUrl: url,
      timestamp: 'Just now',
      likes: 0,
      status: 'published'
    };
  },

  // ADMIN: Add new post manually
  async addPost(post: SocialPost): Promise<SocialPost[]> {
    await delay(500);
    MOCK_POSTS.unshift(post);
    return MOCK_POSTS;
  },

  // ADMIN: Delete post
  async deletePost(id: string): Promise<void> {
    const index = MOCK_POSTS.findIndex(p => p.id === id);
    if (index > -1) MOCK_POSTS.splice(index, 1);
  },

  // ADMIN: Toggle Pin
  async togglePin(id: string): Promise<void> {
    const post = MOCK_POSTS.find(p => p.id === id);
    if (post) post.isPinned = !post.isPinned;
  }
};