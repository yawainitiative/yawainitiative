
import { supabase } from './supabase';
import { Program, Event, Opportunity } from '../types';

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  created_at: string;
}

// Utility to compress and optimize images before upload
const optimizeImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Export as WebP for superior compression and faster loading
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob conversion failed'));
          },
          'image/webp',
          0.75 // 75% quality is the sweet spot for performance/clarity
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const contentService = {
  // Storage
  async uploadImage(file: File): Promise<string> {
    // Optimize image before sending to Supabase
    const optimizedBlob = await optimizeImage(file);
    
    // We use .webp extension since we converted it
    const fileName = `${Math.random().toString(36).substring(2)}.webp`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('content')
      .upload(filePath, optimizedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000', // Cache for 1 year
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('bucket not found')) {
        throw new Error("Storage bucket 'content' not found. Please create it in your Supabase dashboard.");
      }
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Gallery
  async fetchGallery(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching gallery:", err);
      return [];
    }
  },

  async addGalleryImage(url: string, caption?: string) {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{ url, caption }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Programs
  async fetchPrograms(): Promise<Program[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching programs:", err);
      return [];
    }
  },

  async createProgram(program: Omit<Program, 'id'>) {
    const { data, error } = await supabase
      .from('programs')
      .insert([program])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProgram(id: string, updates: Partial<Program>) {
    const { data, error } = await supabase
      .from('programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Events
  async fetchEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  },

  async createEvent(event: Omit<Event, 'id'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Opportunities
  async fetchOpportunities(): Promise<Opportunity[]> {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      return [];
    }
  },

  async createOpportunity(opp: Omit<Opportunity, 'id'>) {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([opp])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateOpportunity(id: string, updates: Partial<Opportunity>) {
    const { data, error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Generic Delete
  async deleteItem(table: 'programs' | 'events' | 'opportunities' | 'gallery_images', id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
};
