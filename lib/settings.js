import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Todos los textos editables de la tienda.
 * Cada sección se muestra como un bloque en Admin → "Textos y marca".
 * type: text | textarea | list (una línea por elemento) | image | url
 */
export const SETTINGS_SCHEMA = [
  {
    title: 'Marca',
    fields: [
      { key: 'store_name', label: 'Nombre de la tienda', type: 'text' },
      { key: 'tagline', label: 'Eslogan', type: 'text' },
      { key: 'logo_url', label: 'Logo principal (portada)', type: 'image' },
      { key: 'logo_mark_url', label: 'Ícono pequeño (menú, admin)', type: 'image' },
      { key: 'meta_description', label: 'Descripción para Google / redes', type: 'textarea' },
    ],
  },
  {
    title: 'Contacto y WhatsApp',
    fields: [
      { key: 'whatsapp_number', label: 'Número de WhatsApp (código país + número, sin +)', type: 'text' },
      { key: 'whatsapp_greeting', label: 'Mensaje del botón flotante de WhatsApp', type: 'textarea' },
      { key: 'order_header', label: 'Encabezado del mensaje de pedido', type: 'text' },
      { key: 'order_footer', label: 'Cierre del mensaje de pedido', type: 'text' },
      { key: 'instagram_url', label: 'Enlace de Instagram', type: 'url' },
      { key: 'tiktok_url', label: 'Enlace de TikTok', type: 'url' },
    ],
  },
  {
    title: 'Menú',
    fields: [
      { key: 'nav_catalog', label: 'Enlace "Catálogo"', type: 'text' },
      { key: 'nav_about', label: 'Enlace "La Manada"', type: 'text' },
      { key: 'nav_contact', label: 'Enlace "Contacto"', type: 'text' },
    ],
  },
  {
    title: 'Portada (Hero)',
    fields: [
      { key: 'hero_eyebrow', label: 'Etiqueta superior', type: 'text' },
      { key: 'hero_line1', label: 'Título línea 1', type: 'text' },
      { key: 'hero_line2', label: 'Título línea 2 (contorno)', type: 'text' },
      { key: 'hero_line3', label: 'Título línea 3', type: 'text' },
      { key: 'hero_text', label: 'Texto descriptivo', type: 'textarea' },
      { key: 'hero_cta_primary', label: 'Botón principal', type: 'text' },
      { key: 'hero_cta_secondary', label: 'Botón secundario', type: 'text' },
      { key: 'hero_badge', label: 'Sello giratorio', type: 'text' },
      { key: 'stat1_value', label: 'Dato 1 - valor', type: 'text' },
      { key: 'stat1_label', label: 'Dato 1 - texto', type: 'text' },
      { key: 'stat2_value', label: 'Dato 2 - valor', type: 'text' },
      { key: 'stat2_label', label: 'Dato 2 - texto', type: 'text' },
      { key: 'stat3_value', label: 'Dato 3 - valor', type: 'text' },
      { key: 'stat3_label', label: 'Dato 3 - texto', type: 'text' },
    ],
  },
  {
    title: 'Cinta animada',
    fields: [{ key: 'marquee', label: 'Frases (una por línea)', type: 'list' }],
  },
  {
    title: 'Catálogo',
    fields: [
      { key: 'catalog_eyebrow', label: 'Etiqueta', type: 'text' },
      { key: 'catalog_title', label: 'Título', type: 'text' },
      { key: 'catalog_search', label: 'Placeholder del buscador', type: 'text' },
      { key: 'catalog_empty', label: 'Mensaje sin resultados', type: 'text' },
      { key: 'catalog_all', label: 'Filtro "Todas"', type: 'text' },
    ],
  },
  {
    title: 'Sección "La Manada"',
    fields: [
      { key: 'about_eyebrow', label: 'Etiqueta', type: 'text' },
      { key: 'about_title', label: 'Título', type: 'textarea' },
      { key: 'about_text', label: 'Texto', type: 'textarea' },
      { key: 'about_perks', label: 'Beneficios (uno por línea, puedes iniciar con emoji)', type: 'list' },
    ],
  },
  {
    title: 'Página de producto',
    fields: [
      { key: 'product_add', label: 'Botón agregar al carrito', type: 'text' },
      { key: 'product_buy', label: 'Botón comprar ya', type: 'text' },
      { key: 'product_soldout', label: 'Texto agotado', type: 'text' },
      { key: 'product_notify', label: 'Botón "avísame"', type: 'text' },
      { key: 'product_perks', label: 'Beneficios (uno por línea)', type: 'list' },
    ],
  },
  {
    title: 'Carrito',
    fields: [
      { key: 'cart_title', label: 'Título', type: 'text' },
      { key: 'cart_empty', label: 'Carrito vacío', type: 'text' },
      { key: 'cart_empty_sub', label: 'Subtexto carrito vacío', type: 'text' },
      { key: 'cart_checkout', label: 'Botón de compra', type: 'text' },
    ],
  },
  {
    title: 'Pie de página',
    fields: [
      { key: 'footer_text', label: 'Texto', type: 'textarea' },
      { key: 'footer_copyright', label: 'Copyright', type: 'text' },
    ],
  },
];

export const DEFAULT_SETTINGS = {
  store_name: 'GORILA CAPS',
  tagline: 'Rule the streets',
  logo_url: '/logo.png',
  logo_mark_url: '/logo-mark.png',
  meta_description:
    'Tienda de gorras Gorila Caps. Snapbacks, truckers, dad hats y más en blanco y negro. Compra fácil por WhatsApp.',

  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567',
  whatsapp_greeting: '¡Hola Gorila Caps! 🦍 Quiero más información sobre sus gorras.',
  order_header: '🦍 *NUEVO PEDIDO - GORILA CAPS*',
  order_footer: '¡Hola! Quiero confirmar este pedido 🙌',
  instagram_url: 'https://instagram.com',
  tiktok_url: '',

  nav_catalog: 'Catálogo',
  nav_about: 'La Manada',
  nav_contact: 'Contacto',

  hero_eyebrow: '🦍 Nueva colección 2026',
  hero_line1: 'LIDERA',
  hero_line2: 'LA MANADA',
  hero_line3: 'CON ESTILO',
  hero_text:
    'Gorras con actitud salvaje. Diseños en blanco y negro para los que no siguen a nadie. Pide en segundos por WhatsApp.',
  hero_cta_primary: 'Ver catálogo',
  hero_cta_secondary: 'Conoce la manada',
  hero_badge: 'RULE THE STREETS',
  stat1_value: '+5K',
  stat1_label: 'Gorilas felices',
  stat2_value: '24h',
  stat2_label: 'Respuesta rápida',
  stat3_value: '100%',
  stat3_label: 'Actitud alfa',

  marquee: ['GORILA CAPS', '🦍', 'RULE THE STREETS', '🍌', 'BLACK & WHITE', '🦍', 'LIDERA LA MANADA', '🍌'],

  catalog_eyebrow: 'El territorio',
  catalog_title: 'CATÁLOGO',
  catalog_search: 'Buscar gorra...',
  catalog_empty: '🦍 No encontramos gorras con ese filtro.',
  catalog_all: 'Todas',

  about_eyebrow: 'La manada',
  about_title: 'NO SEGUIMOS TENDENCIAS.\nLAS LIDERAMOS.',
  about_text:
    'Gorila Caps nació en la calle con una idea simple: gorras fuertes, limpias y con carácter. Blanco y negro, sin rodeos. Cada pieza está pensada para quienes caminan al frente de su manada.',
  about_perks: [
    '🦍 Materiales premium y bordados resistentes',
    '🚚 Envíos a todo el país',
    '💬 Atención directa por WhatsApp',
    '🔁 Cambios fáciles si no te queda',
  ],

  product_add: 'Agregar al carrito',
  product_buy: 'Comprar ya',
  product_soldout: 'Agotado por ahora 🦍',
  product_notify: 'Avísame cuando llegue',
  product_perks: ['🚚 Envío a todo el país', '💬 Confirmación inmediata por WhatsApp', '🔁 Cambios fáciles'],

  cart_title: 'Tu carrito',
  cart_empty: 'Tu carrito está vacío.',
  cart_empty_sub: '¡Ningún gorila sale sin su gorra!',
  cart_checkout: 'Comprar por WhatsApp',

  footer_text: 'Gorras con actitud salvaje. Hechas para líderes de manada.',
  footer_copyright: 'Gorila Caps. Todos los derechos reservados.',
};

export function mergeSettings(data) {
  const out = { ...DEFAULT_SETTINGS };
  if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined) continue;
      if (typeof v === 'string' && v.trim() === '' && k !== 'tiktok_url' && k !== 'instagram_url') continue;
      out[k] = v;
    }
  }
  return out;
}

export async function getSettings() {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await supabase.from('settings').select('data').eq('id', 1).maybeSingle();
  if (error) {
    console.error('Error cargando textos:', error.message);
    return DEFAULT_SETTINGS;
  }
  return mergeSettings(data?.data);
}

/** Convierte "🦍 Texto" en { icon: '🦍', text: 'Texto' } */
export function splitEmoji(line) {
  const m = String(line).match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/u);
  return m ? { icon: m[1], text: m[2] } : { icon: '🦍', text: line };
}
