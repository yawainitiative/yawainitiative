import { SocialPost, SocialPlatform } from '../types';

// In a real app, these would call a backend proxy which handles API keys securely.
// Since we are client-side only here, we simulate the API responses.

const MOCK_POSTS: SocialPost[] = [
  {
    id: '1',
    platform: 'tiktok',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    caption: 'Empowering the next generation! #YAWAI #Youth',
    redirectUrl: 'https://tiktok.com/@yawai/video/1',
    timestamp: '2h ago',
    likes: 1205
  },
  {
    id: '2',
    platform: 'instagram',
    thumbnail: 'https://picsum.photos/600/600?random=2',
    caption: 'Highlights from our Women in Tech summit.',
    redirectUrl: 'https://instagram.com/p/xyz',
    timestamp: '5h ago',
    likes: 890
  },
  {
    id: '3',
    platform: 'linkedin',
    thumbnail: 'https://picsum.photos/600/400?random=3',
    caption: 'We are proud to announce our new scholarship partnership.',
    redirectUrl: 'https://linkedin.com/posts/xyz',
    timestamp: '1d ago',
    likes: 450
  },
  {
    id: '4',
    platform: 'youtube',
    thumbnail: 'https://picsum.photos/600/340?random=4',
    caption: 'Full Documentary: Changing Lives in Rural Communities',
    redirectUrl: 'https://youtube.com/watch?v=xyz',
    timestamp: '2d ago',
    likes: 3200
  },
  {
    id: '5',
    platform: 'twitter',
    thumbnail: 'https://picsum.photos/600/300?random=5',
    caption: 'Join us live tomorrow for the Town Hall meeting! 📢',
    redirectUrl: 'https://twitter.com/yawai/status/xyz',
    timestamp: '3h ago',
    likes: 120
  }
];

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const socialFeedService = {
  async fetchAllPosts(): Promise<SocialPost[]> {
    await delay(800); // Simulate network latency
    // In a real scenario, this would aggregate results from the below functions
    return MOCK_POSTS;
  },

  // Independent fetchers as requested by the prompt
  async fetchTikTokPosts(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'tiktok');
  },
  
  async fetchInstagramPosts(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'instagram');
  },

  async fetchFacebookPosts(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'facebook');
  },

  async fetchTwitterPosts(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'twitter');
  },

  async fetchYouTubeVideos(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'youtube');
  },

  async fetchLinkedInPosts(): Promise<SocialPost[]> {
    return MOCK_POSTS.filter(p => p.platform === 'linkedin');
  }
};
