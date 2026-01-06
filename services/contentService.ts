
import { supabase } from './supabase';
import { Program, Event, Opportunity } from '../types';

export const contentService = {
  // Programs
  async fetchPrograms(): Promise<Program[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return []; // Table doesn't exist yet
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

  // Generic Delete
  async deleteItem(table: 'programs' | 'events' | 'opportunities', id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
};
