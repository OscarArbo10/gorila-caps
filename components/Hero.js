'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useSettings } from './SettingsProvider';

export default function Hero() {
  const s = useSettings();
  const ref = useRef(null);

  // El logo se inclina con el cursor (PC), con el dedo o con el giroscopio (móvil)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (dx, dy) => {
      el.style.setProperty('--tilt-x', `${dy * -12}deg`);
      el.style.setProperty('--tilt-y', `${dx * 14}deg`);
      el.style.setProperty('--glow-x', `${50 + dx * 25}%`);
      el.style.setProperty('--glow-y', `${50 + dy * 25}%`);
    };

    const onPointer = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const dy = Math.max(-1, Math.min(1, (clientY - (r.top + r.height / 2)) / (r.height / 2)));
      apply(dx, dy);
    };

    const onMouse = (e) => onPointer(e.clientX, e.clientY);
    const onTouch = (e) => {
      if (e.touches?.[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onOrient = (e) => {
      if (e.gamma == null || e.beta == null) return;
      const dx = Math.max(-1, Math.min(1, e.gamma / 30));
      const dy = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      apply(dx, dy);
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, []);

  const stats = [
    [s.stat1_value, s.stat1_label],
    [s.stat2_value, s.stat2_label],
    [s.stat3_value, s.stat3_label],
  ].filter(([v]) => v);

  return (
    <section className="hero">
      <div className="hero__claws" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          {s.hero_eyebrow && <p className="eyebrow">{s.hero_eyebrow}</p>}
          <h1 className="hero__title">
            <span className="hero__line">{s.hero_line1}</span>
            <span className="hero__line hero__line--outline">{s.hero_line2}</span>
            <span className="hero__line">{s.hero_line3}</span>
          </h1>
          <p className="hero__text">{s.hero_text}</p>
          <div className="hero__cta">
            <Link href="#catalogo" className="btn btn--light btn--beat">{s.hero_cta_primary}</Link>
            <Link href="#manada" className="btn btn--ghost">{s.hero_cta_secondary}</Link>
          </div>
          {stats.length > 0 && (
            <div className="hero__stats">
              {stats.map(([v, l]) => (
                <div key={l + v}><strong>{v}</strong><span>{l}</span></div>
              ))}
            </div>
          )}
        </div>

        <div className="hero__art" ref={ref}>
          <div className="hero__ring hero__ring--1" />
          <div className="hero__ring hero__ring--2" />
          {s.hero_badge && <div className="hero__badge"><span>{s.hero_badge}</span></div>}
          <div className="hero__logo">
            <Logo variant="full" size={520} />
          </div>
        </div>
      </div>
    </section>
  );
}
