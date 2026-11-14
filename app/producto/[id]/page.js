import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import Logo from '@/components/Logo';
import { getProducts } from '@/lib/products';
import { getSettings, splitEmoji } from '@/lib/settings';

export const revalidate = 30;

export default async function Home() {
  const [products, s] = await Promise.all([getProducts(), getSettings()]);
  const marquee = Array.isArray(s.marquee) && s.marquee.length > 0 ? s.marquee : ['GORILA CAPS', '🦍'];
  const perks = Array.isArray(s.about_perks) ? s.about_perks : [];
  const aboutLines = String(s.about_title || '').split('\n');

  return (
    <main>
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee, ...marquee].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <Catalog products={products} />

      <section id="manada" className="section section--dark manada">
        <div className="container manada__grid">
          <Reveal className="manada__art">
            <div className="manada__circle">
              <Logo variant="full" size={320} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            {s.about_eyebrow && <p className="eyebrow">{s.about_eyebrow}</p>}
            <h2 className="section__title section__title--light">
              {aboutLines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < aboutLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="manada__text">{s.about_text}</p>
            {perks.length > 0 && (
              <ul className="perks">
                {perks.map((p, idx) => {
                  const { icon, text } = splitEmoji(p);
                  return (
                    <li key={idx}>
                      <span>{icon}</span> {text}
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
