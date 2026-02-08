import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bhqjkmnatcfbbcdktvuh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocWprbW5hdGNmYmJjZGt0dnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTkxMjYsImV4cCI6MjA4NjAzNTEyNn0.dWtPHc5Ijr1Iv7ugzfBeAFmqnOUO7BBK2_DsEahacJM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
