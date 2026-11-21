'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'gorila-caps-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      const max = product.stock ?? 99;
      if (max <= 0) return prev;
      if (found) {
        return prev.map((i) =>
          i.id === product.id
            ? {
                ...i,
                name: product.name,
                price: Number(product.price),
                image_url: product.image_url,
                category: product.category,
                stock: max,
                qty: Math.min(i.qty + qty, max),
              }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url,
          category: product.category,
          stock: max,
          qty: Math.min(qty, max),
        },
      ];
    });
    setOpen(true);
  }, []);

  const sync = useCallback((products) => {
    if (!Array.isArray(products) || products.length === 0) return;
    const byId = new Map(products.map((p) => [p.id, p]));
    setItems((prev) => {
      if (prev.length === 0) return prev;
      let changed = false;
      const next = [];
      for (const item of prev) {
        const fresh = byId.get(item.id);
        if (!fresh) {
          next.push(item);
          continue;
        }
        const max = Number(fresh.stock) || 0;
        if (max <= 0) {
          changed = true;
          continue;
        }
        const nextQty = Math.min(item.qty, max);
        const nextPrice = Number(fresh.price);
        if (
          item.name !== fresh.name ||
          item.price !== nextPrice ||
          item.image_url !== fresh.image_url ||
          item.category !== fresh.category ||
          item.stock !== max ||
          item.qty !== nextQty
        ) {
          changed = true;
          next.push({
            ...item,
            name: fresh.name,
            price: nextPrice,
            image_url: fresh.image_url,
            category: fresh.category,
            stock: max,
            qty: nextQty,
          });
        } else {
          next.push(item);
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const setQty = useCallback(
    (id, qty) =>
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(qty, i.stock ?? 99)) } : i))
          .filter((i) => i.qty > 0)
      ),
    []
  );

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, count, total, add, sync, setQty, remove, clear, open, setOpen };
  }, [items, open, add, sync, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
