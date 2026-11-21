import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqjrzalaeqvpbqwcbpzi.supabase.co';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5yHEob4gd637zkOgOIjuMw_cBbXfm5g';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('TU-PROYECTO')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: typeof window !== 'undefined' },
    })
  : null;

const BUCKET_MARKER = '/storage/v1/object/public/products/';

/** Elimina del bucket `products` una imagen subida previamente (ignora URLs externas). */
export async function deleteStorageImage(imageUrl) {
  if (!supabase || !imageUrl || typeof imageUrl !== 'string') return;
  const idx = imageUrl.indexOf(BUCKET_MARKER);
  if (idx === -1) return;
  const rawPath = imageUrl.slice(idx + BUCKET_MARKER.length).split('?')[0];
  if (!rawPath) return;
  try {
    await supabase.storage.from('products').remove([decodeURIComponent(rawPath)]);
  } catch {}
}
