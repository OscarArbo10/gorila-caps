import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqjrzalaeqvpbqwcbpzi.supabase.co';
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5yHEob4gd637zkOgOIjuMw_cBbXfm5g';

export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes('TU-PROYECTO')
);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: typeof window !== 'undefined' },
    })
  : null;
