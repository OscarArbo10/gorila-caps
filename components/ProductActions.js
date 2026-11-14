'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { useSettings } from './SettingsProvider';
import { WhatsIcon } from './CartDrawer';
import { formatPrice, whatsappLink } from '@/lib/products';

export default function ProductActions({ product }) {
  const { add } = useCart();
  const s = useSettings();
  const [qty, setQty] = useState(1);
  const soldOut = Number(product.stock) <= 0;
  const max = Number(product.stock) || 1;

  const buyNow = () => {
    const msg = [
      s.order_header,
      '',
      `Producto: ${product.name} (${product.category})`,
      `Cantidad: ${qty}`,
      `Total: ${formatPrice(product.price * qty)}`,
      '',
      s.order_footer,
    ].join('\n');
    window.open(whatsappLink(s.whatsapp_number, msg), '_blank');
  };

  if (soldOut) {
    return (
      <div className="pd__actions">
        <p className="pd__soldout">{s.product_soldout}</p>
        <a
          className="btn btn--dark"
          target="_blank"
          rel="noreferrer"
          href={whatsappLink(
            s.whatsapp_number,
            `¡Hola! ¿Cuándo vuelve a estar disponible la gorra ${product.name}?`
          )}
        >
          {s.product_notify}
        </a>
      </div>
    );
  }

  return (
    <div className="pd__actions">
      <div className="qty qty--lg">
        <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
      </div>
      <button className="btn btn--dark btn--beat" onClick={() => add(product, qty)}>
        {s.product_add}
      </button>
      <button className="btn btn--whatsapp" onClick={buyNow}>
        <WhatsIcon /> {s.product_buy}
      </button>
    </div>
  );
}
