
import { SocialPost } from '../types';
import { supabase } from './supabase';

export const socialFeedService = {
  async fetchAllPosts(): Promise<SocialPost[]> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') return []; // Table missing, return empty
        throw error;
      }
      
      return (data || []).map(post => ({
        id: post.id,
        platform: post.platform,
        thumbnail: post.thumbnail,
        caption: post.caption,
        redirectUrl: post.redirect_url,
        timestamp: post.timestamp || 'Recent',
        likes: post.likes || 0
      }));
    } catch (err) {
      console.error("Error fetching social posts:", err);
      return [];
    }
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async addPost(post: Omit<SocialPost, 'id'>): Promise<SocialPost> {
    const { data, error } = await supabase
      .from('social_posts')
      .insert([{
        platform: post.platform,
        thumbnail: post.thumbnail,
        caption: post.caption,
        redirect_url: post.redirectUrl,
        timestamp: post.timestamp,
        likes: post.likes
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      platform: data.platform,
      thumbnail: data.thumbnail,
      caption: data.caption,
      redirectUrl: data.redirect_url,
      timestamp: data.timestamp,
      likes: data.likes
    };
  }
};
