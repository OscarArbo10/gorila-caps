'use client';

import { usePathname } from 'next/navigation';
import { WhatsIcon } from './CartDrawer';
import { useSettings } from './SettingsProvider';
import { whatsappLink } from '@/lib/products';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const s = useSettings();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <a
      className="wa-float"
      href={whatsappLink(s.whatsapp_number, s.whatsapp_greeting)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <WhatsIcon size={30} />
    </a>
  );
}
