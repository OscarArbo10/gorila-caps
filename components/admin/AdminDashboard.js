'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/products';
import Logo from '@/components/Logo';
import CapArt from '@/components/CapArt';
import ProductForm from './ProductForm';
import SettingsForm from './SettingsForm';

export default function AdminDashboard({ session }) {
  const [tab, setTab] = useState('products'); // 'products' | 'settings'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const revalidate = async () => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    } catch {}
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) notify('Error: ' + error.message);
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.active).length,
      out: products.filter((p) => p.stock <= 0).length,
      featured: products.filter((p) => p.featured).length,
    }),
    [products]
  );

  const filtered = products.filter((p) =>
    (p.name + p.category).toLowerCase().includes(q.toLowerCase())
  );

  const toggle = async (p, field) => {
    const { error } = await supabase.from('products').update({ [field]: !p[field] }).eq('id', p.id);
    if (error) return notify('Error: ' + error.message);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: !p[field] } : x)));
    revalidate();
  };

  const remove = async (p) => {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) return notify('Error: ' + error.message);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    notify('Producto eliminado');
    revalidate();
  };

  const onSaved = () => {
    setEditing(null);
    notify('Producto guardado 🦍');
    load();
    revalidate();
  };

  return (
    <main className="admin">
      <header className="admin__top">
        <div className="container admin__top-inner">
          <Link href="/" className="brand">
            <Logo size={40} className="brand__logo" />
            <span className="brand__text">GORILA CAPS <span>ADMIN</span></span>
          </Link>

          <div className="admin__user">
            <span className="muted">{session.user.email}</span>
            <Link href="/" className="btn btn--ghost btn--sm" target="_blank">Tienda ↗</Link>
            <button className="btn btn--light btn--sm" onClick={() => supabase.auth.signOut()}>
              Salir
            </button>
          </div>

          <div className="admin__tabs">
            <button
              className={`admin__tab ${tab === 'products' ? 'is-active' : ''}`}
              onClick={() => setTab('products')}
            >
              🧢 Catálogo
            </button>
            <button
              className={`admin__tab ${tab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setTab('settings')}
            >
              ✏️ Textos y marca
            </button>
          </div>
        </div>
      </header>

      <div className="container admin__body">
        {tab === 'settings' ? (
          <SettingsForm
            notify={notify}
            onSaved={() => {
              notify('Textos actualizados 🦍');
              revalidate();
            }}
          />
        ) : (
          <>
            <div className="stats">
              <div className="stat"><span>Productos</span><strong>{stats.total}</strong></div>
              <div className="stat"><span>Visibles</span><strong>{stats.active}</strong></div>
              <div className="stat"><span>Destacados</span><strong>{stats.featured}</strong></div>
              <div className="stat stat--alert"><span>Agotados</span><strong>{stats.out}</strong></div>
            </div>

            <div className="admin__bar">
              <h2>Catálogo</h2>
              <div className="admin__bar-right">
                <input
                  className="search"
                  placeholder="Buscar gorra..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <button className="btn btn--dark admin__new-btn" onClick={() => setEditing({})}>
                  + Nueva gorra
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loader"><Logo size={80} /></div>
            ) : filtered.length === 0 ? (
              <p className="empty">No hay productos. ¡Crea la primera gorra!</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Visible</th>
                      <th>Destacado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.id} className={!p.active ? 'is-muted' : ''}>
                        <td className="td-product">
                          <div className="table__product">
                            <div className="table__thumb">
                              {p.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.image_url} alt="" />
                              ) : (
                                <CapArt variant={i % 2 ? 'light' : 'dark'} />
                              )}
                            </div>
                            <div>
                              <strong>{p.name}</strong>
                              <span className="table__mobile-meta">
                                {p.category} · {formatPrice(p.price)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td data-label="Categoría" className="td-hide-sm">{p.category}</td>
                        <td data-label="Precio" className="td-hide-sm">{formatPrice(p.price)}</td>
                        <td data-label="Stock">
                          <span className={`pill ${p.stock <= 0 ? 'pill--out' : ''}`}>
                            {p.stock <= 0 ? 'Agotado (0)' : p.stock}
                          </span>
                        </td>
                        <td data-label="Visible">
                          <button
                            className={`switch ${p.active ? 'is-on' : ''}`}
                            onClick={() => toggle(p, 'active')}
                            aria-label="Visible"
                          />
                        </td>
                        <td data-label="Destacado">
                          <button
                            className={`switch ${p.featured ? 'is-on' : ''}`}
                            onClick={() => toggle(p, 'featured')}
                            aria-label="Destacado"
                          />
                        </td>
                        <td className="table__actions">
                          <button className="btn btn--sm btn--outline" onClick={() => setEditing(p)}>
                            Editar
                          </button>
                          <button className="btn btn--sm btn--danger" onClick={() => remove(p)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {editing && (
        <ProductForm product={editing} onClose={() => setEditing(null)} onSaved={onSaved} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
