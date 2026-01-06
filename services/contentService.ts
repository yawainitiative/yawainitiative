
import { supabase } from './supabase';
import { Program, Event, Opportunity } from '../types';

export const contentService = {
  // Programs
  async fetchPrograms(): Promise<Program[]> {
    const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async createProgram(program: Omit<Program, 'id'>) {
    const { data, error } = await supabase.from('programs').insert([program]).select().single();
    if (error) throw error;
    return data;
  },

  // Events
  async fetchEvents(): Promise<Event[]> {
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async createEvent(event: Omit<Event, 'id'>) {
    const { data, error } = await supabase.from('events').insert([event]).select().single();
    if (error) throw error;
    return data;
  },

  // Opportunities
  async fetchOpportunities(): Promise<Opportunity[]> {
    const { data, error } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async createOpportunity(opp: Omit<Opportunity, 'id'>) {
    const { data, error } = await supabase.from('opportunities').insert([opp]).select().single();
    if (error) throw error;
    return data;
  },

  // Generic Delete
  async deleteItem(table: 'programs' | 'events' | 'opportunities', id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
};
