'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_SETTINGS, SETTINGS_SCHEMA, mergeSettings } from '@/lib/settings';

export default function SettingsForm({ onSaved, notify }) {
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    supabase
      .from('settings')
      .select('data')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        setValues(mergeSettings(data?.data));
        setLoading(false);
      });
  }, []);

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));

  const upload = async (key, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return notify('La imagen debe pesar menos de 5MB');
    setUploading(key);
    const ext = file.name.split('.').pop();
    const path = `brand-${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file);
    if (error) {
      notify('Error: ' + error.message);
    } else {
      const { data } = supabase.storage.from('products').getPublicUrl(path);
      set(key, data.publicUrl);
    }
    setUploading(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const cleaned = { ...values };
    for (const group of SETTINGS_SCHEMA) {
      for (const f of group.fields) {
        if (f.type === 'list' && typeof cleaned[f.key] === 'string') {
          cleaned[f.key] = cleaned[f.key]
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    }
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, data: cleaned, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return notify('Error: ' + error.message);
    setValues(cleaned);
    onSaved();
  };

  const reset = () => {
    if (!confirm('¿Restaurar todos los textos a los valores originales?')) return;
    setValues(DEFAULT_SETTINGS);
  };

  if (loading) return <p className="empty">Cargando textos...</p>;

  return (
    <form className="settings" onSubmit={submit}>
      <div className="settings__head">
        <div>
          <h2>Textos y marca</h2>
          <p className="muted">Cambia cualquier texto, enlace o logo de la tienda.</p>
        </div>
        <div className="settings__actions">
          <button type="button" className="btn btn--outline btn--sm" onClick={reset}>
            Restaurar originales
          </button>
          <button className="btn btn--dark" disabled={busy}>
            {busy ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {SETTINGS_SCHEMA.map((group) => (
        <section key={group.title} className="settings__group">
          <h3>{group.title}</h3>
          <div className="settings__fields">
            {group.fields.map((f) => {
              const val = values[f.key];
              if (f.type === 'image') {
                return (
                  <div key={f.key} className="settings__field settings__field--full">
                    <span>{f.label}</span>
                    <div className="settings__image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={val || '/logo.png'} alt="" />
                      <div className="settings__image-controls">
                        <input
                          value={val || ''}
                          onChange={(e) => set(f.key, e.target.value)}
                          placeholder="/logo.png o URL"
                        />
                        <label className="btn btn--outline btn--sm file-btn">
                          {uploading === f.key ? 'Subiendo...' : 'Subir archivo'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => upload(f.key, e.target.files?.[0])}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              }
              if (f.type === 'list') {
                const text = Array.isArray(val) ? val.join('\n') : String(val || '');
                return (
                  <label key={f.key} className="settings__field settings__field--full">
                    {f.label}
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  </label>
                );
              }
              if (f.type === 'textarea') {
                return (
                  <label key={f.key} className="settings__field settings__field--full">
                    {f.label}
                    <textarea
                      rows={3}
                      value={val || ''}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  </label>
                );
              }
              return (
                <label key={f.key} className="settings__field">
                  {f.label}
                  <input
                    type={f.type === 'url' ? 'url' : 'text'}
                    value={val || ''}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <div className="settings__foot">
        <button className="btn btn--dark" disabled={busy}>
          {busy ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
