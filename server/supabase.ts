import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Add this line to load environment variables from .env
dotenv.config();

// Make sure you're using the correct environment variable names
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add error checking
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', {
    url: supabaseUrl ? 'defined' : 'missing',
    key: supabaseKey ? 'defined' : 'missing'
  });
}

// Supabase client setup for server-side operations
export const supabase = createClient(
  supabaseUrl!,
  supabaseKey!,
  {
    auth: {
      persistSession: false,
    }
  }
);