import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '@/lib/supabase';

// Revalida las páginas públicas cuando un admin modifica el catálogo.
export async function POST(request) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token || !isSupabaseConfigured) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) {
    return Response.json({ ok: false }, { status: 403 });
  }

  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
