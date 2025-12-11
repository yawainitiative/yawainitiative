
import { createClient } from '@supabase/supabase-js';

// Helper to access environment variables in Vite safely
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

// Fallback to hardcoded demo keys ONLY for local preview if env vars are missing
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://txzxsomapiouqaknvrqq.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4enhzb21hcGlvdXFha252cnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTk2MzEsImV4cCI6MjA4MTAzNTYzMX0.FUAfKvWJT1ZhZZ9Gw5JcU6SmsJTXNf9iMEM5EK_mUYo';

export const supabase = createClient(supabaseUrl, supabaseKey);
