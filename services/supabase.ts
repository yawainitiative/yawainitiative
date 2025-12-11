
import { createClient } from '@supabase/supabase-js';

// Helper to get environment variables compatible with both Vite (import.meta.env) and standard Process (process.env)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    // @ts-ignore
    return (import.meta as any).env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    return process.env[key];
  }
  return undefined;
};

// Use Env Vars if available, otherwise fallback to the hardcoded demo keys
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL') || 'https://txzxsomapiouqaknvrqq.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4enhzb21hcGlvdXFha252cnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTk2MzEsImV4cCI6MjA4MTAzNTYzMX0.FUAfKvWJT1ZhZZ9Gw5JcU6SmsJTXNf9iMEM5EK_mUYo';

export const supabase = createClient(supabaseUrl, supabaseKey);
