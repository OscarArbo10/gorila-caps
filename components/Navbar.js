'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useCart } from './CartProvider';
import { useSettings } from './SettingsProvider';

export default function Navbar() {
  const { count, setOpen } = useCart();
  const s = useSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [count]);

  if (pathname?.startsWith('/admin')) return null;

  const isLightPage = pathname !== '/';

  return (
    <header className={`navbar ${scrolled || menuOpen || isLightPage ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <Logo size={46} className="brand__logo" />
          <span className="brand__text">{s.store_name}</span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          <Link href="/#catalogo" onClick={() => setMenuOpen(false)}>{s.nav_catalog}</Link>
          <Link href="/#manada" onClick={() => setMenuOpen(false)}>{s.nav_about}</Link>
          <Link href="/#contacto" onClick={() => setMenuOpen(false)}>{s.nav_contact}</Link>
        </nav>

        <div className="navbar__actions">
          <button
            className={`cart-btn ${bump ? 'cart-btn--bump' : ''}`}
            onClick={() => setOpen(true)}
            aria-label="Abrir carrito"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && <span className="cart-btn__count">{count}</span>}
          </button>

          <button
            className={`burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
