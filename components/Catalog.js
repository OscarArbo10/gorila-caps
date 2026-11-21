'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { useCart } from './CartProvider';
import { useSettings } from './SettingsProvider';

const ALL_CATEGORY = '__all__';

export default function Catalog({ products }) {
  const s = useSettings();
  const { sync } = useCart();
  const allLabel = s.catalog_all || 'Todas';
  const [cat, setCat] = useState(ALL_CATEGORY);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    sync(products);
  }, [products, sync]);

  const categories = useMemo(
    () => [ALL_CATEGORY, ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (cat === ALL_CATEGORY || p.category === cat) &&
        (p.name + ' ' + (p.description || '')).toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [products, cat, q, sort]);

  return (
    <section id="catalogo" className="section section--light">
      <div className="container">
        <Reveal className="section__head">
          {s.catalog_eyebrow && <p className="eyebrow eyebrow--dark">{s.catalog_eyebrow}</p>}
          <h2 className="section__title">{s.catalog_title}</h2>
        </Reveal>

        <div className="filters">
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${cat === c ? 'is-active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c === ALL_CATEGORY ? allLabel : c}
              </button>
            ))}
          </div>
          <div className="filters__right">
            <input
              className="search"
              placeholder={s.catalog_search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="empty">{s.catalog_empty}</p>
        ) : (
          <div className="grid">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
