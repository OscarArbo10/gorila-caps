import { supabase, isSupabaseConfigured } from './supabase';

export const CATEGORIES = ['Snapback', 'Trucker', 'Dad Hat', 'Fitted', 'Beanie'];

// Datos de demostración (se muestran si Supabase aún no está configurado)
export const DEMO_PRODUCTS = [
  { id: 'demo-1', name: 'Silverback Classic', description: 'Snapback negra con bordado de gorila en 3D. Visera plana y ajuste trasero.', price: 89000, category: 'Snapback', stock: 25, featured: true, image_url: null },
  { id: 'demo-2', name: 'Alpha Trucker', description: 'Trucker blanca con malla negra. Para el líder de la manada.', price: 79000, category: 'Trucker', stock: 18, featured: true, image_url: null },
  { id: 'demo-3', name: 'Jungle Dad Hat', description: 'Dad hat de algodón lavado, logo minimalista.', price: 69000, category: 'Dad Hat', stock: 30, featured: false, image_url: null },
  { id: 'demo-4', name: 'Kong Fitted', description: 'Fitted premium de lana con parche frontal.', price: 109000, category: 'Fitted', stock: 12, featured: true, image_url: null },
  { id: 'demo-5', name: 'Banana Split Beanie', description: 'Gorro tejido blanco y negro para la temporada fría.', price: 59000, category: 'Beanie', stock: 0, featured: false, image_url: null },
  { id: 'demo-6', name: 'Primate Snapback', description: 'Snapback blanca con logo negro de alto contraste.', price: 89000, category: 'Snapback', stock: 15, featured: false, image_url: null },
];

export async function getProducts() {
  if (!isSupabaseConfigured) return DEMO_PRODUCTS;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error cargando productos:', error.message);
    return [];
  }
  return data;
}

export async function getProduct(id) {
  if (!isSupabaseConfigured) return DEMO_PRODUCTS.find((p) => p.id === id) || null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();
  if (error) return null;
  return data;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function whatsappLink(number, message) {
  const clean = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${clean}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
