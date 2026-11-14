'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Credenciales inválidas. Intenta de nuevo.');
    setBusy(false);
  };

  return (
    <main className="admin admin--center admin--login">
      <form className="admin-card" onSubmit={submit}>
        <Logo variant="full" size={140} className="login-gorilla" />
        <h1>GORILA CAPS — ADMIN</h1>
        <p className="muted">Ingresa para administrar el catálogo y los textos</p>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn--dark btn--block" disabled={busy}>
          {busy ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
