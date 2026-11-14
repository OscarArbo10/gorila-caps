import Link from 'next/link';
import { notFound } from 'next/navigation';
import CapArt from '@/components/CapArt';
import Footer from '@/components/Footer';
import ProductActions from '@/components/ProductActions';
import { formatPrice, getProduct } from '@/lib/products';
import { getSettings } from '@/lib/settings';

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const [p, s] = await Promise.all([getProduct(params.id), getSettings()]);
  if (!p) return { title: `Producto no encontrado | ${s.store_name}` };
  return {
    title: `${p.name} | ${s.store_name}`,
    description: p.description,
    openGraph: { images: p.image_url ? [p.image_url] : [s.logo_url] },
  };
}

export default async function ProductPage({ params }) {
  const [product, s] = await Promise.all([getProduct(params.id), getSettings()]);
  if (!product) notFound();
  const perks = Array.isArray(s.product_perks) ? s.product_perks : [];

  return (
    <main>
      <section className="pd">
        <div className="container">
          <Link href="/#catalogo" className="back">← Volver al catálogo</Link>
          <div className="pd__grid">
            <div className="pd__media">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} />
              ) : (
                <CapArt variant="dark" />
              )}
            </div>
            <div className="pd__info">
              <span className="card__cat">{product.category}</span>
              <h1 className="pd__title">{product.name}</h1>
              <p className="pd__price">{formatPrice(product.price)}</p>
              <p className="pd__desc">{product.description}</p>
              <p className="pd__stock">
                {Number(product.stock) > 0
                  ? `✅ ${product.stock} disponibles`
                  : '❌ Sin stock'}
              </p>
              <ProductActions product={product} />
              {perks.length > 0 && (
                <ul className="pd__perks">
                  {perks.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
