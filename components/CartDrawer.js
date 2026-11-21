'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { useSettings } from './SettingsProvider';
import CapArt from './CapArt';
import { formatPrice, whatsappLink } from '@/lib/products';

export default function CartDrawer() {
  const { items, total, count, setQty, remove, clear, open, setOpen } = useCart();
  const s = useSettings();
  const [form, setForm] = useState({ name: '', city: '', note: '' });

  const checkout = (e) => {
    e.preventDefault();
    if (!items.length) return;
    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.name} (${i.category}) x${i.qty} — ${formatPrice(i.price * i.qty)}`
    );
    const msg = [
      s.order_header,
      '',
      ...lines,
      '',
      `*Total: ${formatPrice(total)}*`,
      '',
      form.name && `👤 Nombre: ${form.name}`,
      form.city && `📍 Ciudad / Dirección: ${form.city}`,
      form.note && `📝 Nota: ${form.note}`,
      '',
      s.order_footer,
    ]
      .filter((l) => l !== false && l !== undefined)
      .join('\n');
    window.open(whatsappLink(s.whatsapp_number, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__head">
          <h3>{s.cart_title} <span>({count})</span></h3>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-emoji">🍌</div>
            <p>{s.cart_empty}</p>
            <p className="muted">{s.cart_empty_sub}</p>
            <button className="btn btn--dark" onClick={() => setOpen(false)}>
              {s.hero_cta_primary}
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__items">
              {items.map((i, idx) => (
                <li key={i.id} className="drawer__item">
                  <div className="drawer__thumb">
                    {i.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image_url} alt={i.name} />
                    ) : (
                      <CapArt variant={idx % 2 ? 'light' : 'dark'} />
                    )}
                  </div>
                  <div className="drawer__info">
                    <strong>{i.name}</strong>
                    <span className="muted">{formatPrice(i.price)}</span>
                    <div className="qty">
                      <button onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="icon-btn icon-btn--danger" onClick={() => remove(i.id)} aria-label="Quitar">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <form className="drawer__checkout" onSubmit={checkout}>
              <input
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Ciudad / dirección de envío"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                placeholder="Nota (talla, color, etc.)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <div className="drawer__total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button type="submit" className="btn btn--whatsapp btn--block">
                <WhatsIcon /> {s.cart_checkout}
              </button>
              <button type="button" className="link-btn" onClick={clear}>Vaciar carrito</button>
            </form>
          </>
        )}
      </aside>
    </>
  );
}

export function WhatsIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.8 2 6.8L3 29l6.8-2.2c1.9 1 4 1.6 6.2 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-2 0-3.9-.6-5.6-1.6l-.4-.2-4 1.3 1.3-3.9-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.3 9.8 10.1 5.2 16 5.2s10.5 4.6 10.5 10.5S21.9 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z" />
    </svg>
  );
}
