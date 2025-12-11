import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txzxsomapiouqaknvrqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4enhzb21hcGlvdXFha252cnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTk2MzEsImV4cCI6MjA4MTAzNTYzMX0.FUAfKvWJT1ZhZZ9Gw5JcU6SmsJTXNf9iMEM5EK_mUYo';

export const supabase = createClient(supabaseUrl, supabaseKey);