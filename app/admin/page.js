'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Logo from '@/components/Logo';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [session]);

  if (!isSupabaseConfigured) {
    return (
      <main className="admin admin--center">
        <div className="admin-card">
          <Logo variant="full" size={140} />
          <h1>Configura Supabase</h1>
          <p className="muted">
            Para usar el panel admin define las variables <code>NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu archivo <code>.env.local</code> (local)
            o en Vercel → Settings → Environment Variables. Luego ejecuta{' '}
            <code>supabase/schema.sql</code> en el SQL Editor de Supabase.
          </p>
        </div>
      </main>
    );
  }

  if (loading || (session && isAdmin === null)) {
    return (
      <main className="admin admin--center">
        <div className="loader"><Logo size={90} /></div>
      </main>
    );
  }

  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <main className="admin admin--center">
        <div className="admin-card">
          <Logo variant="full" size={120} />
          <h1>Acceso denegado</h1>
          <p className="muted">
            Tu usuario ({session.user.email}) no está registrado como administrador.
            Agrega su UUID a la tabla <code>admins</code> en Supabase.
          </p>
          <code className="uuid">{session.user.id}</code>
          <button className="btn btn--dark" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </main>
    );
  }

  return <AdminDashboard session={session} />;
}
