'use client';

import Link from 'next/link';
import { useRef } from 'react';
import CapArt from './CapArt';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/products';

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const ref = useRef(null);
  const soldOut = Number(product.stock) <= 0;

  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${y * -10}deg`);
    el.style.setProperty('--ry', `${x * 12}deg`);
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={ref}
      className={`card ${index % 2 ? 'card--light' : 'card--dark'}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Link href={`/producto/${product.id}`} className="card__media">
        {product.featured && <span className="tag tag--hot">🔥 Top</span>}
        {soldOut && <span className="tag tag--out">Agotado</span>}
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <CapArt variant={index % 2 ? 'dark' : 'light'} />
        )}
      </Link>
      <div className="card__body">
        <span className="card__cat">{product.category}</span>
        <h3 className="card__title">
          <Link href={`/producto/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="card__foot">
          <span className="card__price">{formatPrice(product.price)}</span>
          <button
            className="card__add"
            disabled={soldOut}
            onClick={() => add(product)}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {soldOut ? '—' : '+'}
          </button>
        </div>
      </div>
    </article>
  );
}
