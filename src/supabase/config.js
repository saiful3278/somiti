import { createClient } from '@supabase/supabase-js';
import { getPublicEnv } from '../utils/env';

const supabaseUrl = getPublicEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getPublicEnv('VITE_SUPABASE_ANON_KEY');

let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase] Missing environment. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build or window.__ENV__.');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
  console.log('[supabase] client initialized');
}

export { supabase };
export const STORAGE_BUCKET = 'profile_photo';
