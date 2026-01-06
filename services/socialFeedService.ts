
import { SocialPost, SocialPlatform } from '../types';

// In a real app, these would call a backend proxy which handles API keys securely.
const MOCK_POSTS: SocialPost[] = [];

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const socialFeedService = {
  async fetchAllPosts(): Promise<SocialPost[]> {
    await delay(500); 
    return MOCK_POSTS;
  },

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
