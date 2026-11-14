'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/products';
import CapArt from '@/components/CapArt';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  category: CATEGORIES[0],
  stock: 10,
  image_url: '',
  featured: false,
  active: true,
};

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = Boolean(product?.id);
  const [form, setForm] = useState({ ...EMPTY, ...product, image_url: product?.image_url || '' });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('La imagen debe pesar menos de 5MB');
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
    });
    if (error) {
      setError('Error subiendo imagen: ' + error.message);
    } else {
      const { data } = supabase.storage.from('products').getPublicUrl(path);
      set('image_url', data.publicUrl);
    }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      stock: parseInt(form.stock, 10) || 0,
      image_url: form.image_url || null,
      featured: form.featured,
      active: form.active,
    };
    const query = isEdit
      ? supabase.from('products').update(payload).eq('id', product.id)
      : supabase.from('products').insert(payload);
    const { error } = await query;
    setBusy(false);
    if (error) return setError(error.message);
    onSaved();
  };

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal__box" onSubmit={submit}>
        <div className="modal__head">
          <h3>{isEdit ? 'Editar gorra' : 'Nueva gorra'}</h3>
          <button type="button" className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-image">
            <div className="form-image__preview">
              {form.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image_url} alt="" />
              ) : (
                <CapArt variant="dark" />
              )}
            </div>
            <label className="btn btn--outline btn--block btn--sm file-btn">
              {uploading ? 'Subiendo...' : 'Subir imagen'}
              <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
            </label>
            <input
              placeholder="o pega una URL de imagen"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
            />
          </div>

          <div className="form-fields">
            <label>
              Nombre
              <input required value={form.name} onChange={(e) => set('name', e.target.value)} />
            </label>
            <label>
              Descripción
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </label>
            <div className="form-row">
              <label>
                Precio
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                />
              </label>
            </div>
            <label>
              Categoría
              <input
                list="categories"
                required
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              />
              <datalist id="categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <div className="form-row form-row--checks">
              <label className="check">
                <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                Visible en tienda
              </label>
              <label className="check">
                <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                Destacado 🔥
              </label>
            </div>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal__foot">
          <button type="button" className="btn btn--outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn--dark" disabled={busy || uploading}>
            {busy ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
