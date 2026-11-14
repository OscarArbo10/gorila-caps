import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSettings } from '@/lib/settings';

const display = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const revalidate = 30;

export async function generateMetadata() {
  const s = await getSettings();
  const title = `${s.store_name} | ${s.tagline}`;
  return {
    title,
    description: s.meta_description,
    icons: { icon: s.logo_mark_url, apple: s.logo_mark_url },
    openGraph: { title, description: s.meta_description, images: [s.logo_url], type: 'website' },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <SettingsProvider settings={settings}>
          <CartProvider>
            <Navbar />
            {children}
            <CartDrawer />
            <WhatsAppFloat />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
