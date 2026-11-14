'use client';

import { useSettings } from './SettingsProvider';

/** Logo de la tienda. variant: 'full' (logo completo) | 'mark' (solo cabeza) */
export default function Logo({ variant = 'mark', size = 48, className = '' }) {
  const s = useSettings();
  const src = variant === 'full' ? s.logo_url : s.logo_mark_url || s.logo_url;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={s.store_name}
      width={size}
      height={size}
      className={`logo logo--${variant} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
