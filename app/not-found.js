import Link from 'next/link';
import Logo from '@/components/Logo';

export default function NotFound() {
  return (
    <main className="notfound">
      <Logo variant="full" size={220} />
      <h1>404</h1>
      <p>Este gorila se perdió en la selva.</p>
      <Link href="/" className="btn btn--dark">Volver al inicio</Link>
    </main>
  );
}
