'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useSettings } from './SettingsProvider';
import { whatsappLink } from '@/lib/products';

export default function Footer() {
  const s = useSettings();
  const cleanNum = String(s.whatsapp_number || '').replace(/\D/g, '');

  return (
    <footer id="contacto" className="footer">
      <div className="container footer__grid">
        <div>
          <Link href="/" className="brand">
            <Logo size={54} className="brand__logo" />
            <span className="brand__text">{s.store_name}</span>
          </Link>
          <p className="muted footer__text">{s.footer_text}</p>
        </div>
        <div>
          <h4>Tienda</h4>
          <Link href="/#catalogo">{s.nav_catalog}</Link>
          <Link href="/#manada">{s.nav_about}</Link>
        </div>
        <div>
          <h4>{s.nav_contact}</h4>
          {cleanNum && (
            <a href={whatsappLink(cleanNum, s.whatsapp_greeting)} target="_blank" rel="noreferrer">
              WhatsApp: +{cleanNum}
            </a>
          )}
          {s.instagram_url && (
            <a href={s.instagram_url} target="_blank" rel="noreferrer">Instagram</a>
          )}
          {s.tiktok_url && (
            <a href={s.tiktok_url} target="_blank" rel="noreferrer">TikTok</a>
          )}
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {s.footer_copyright}</span>
        <Link href="/admin" className="muted">Admin</Link>
      </div>
    </footer>
  );
}
