import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Revalida las páginas públicas cuando un admin modifica el catálogo.
export async function POST(request) {
  const token = (request.headers.get('authorization') || '').replace('Bearer ', '');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(url, key, {
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
