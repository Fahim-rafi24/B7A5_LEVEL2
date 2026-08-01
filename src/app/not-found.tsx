import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-custom py-20 max-w-md mx-auto text-center">
      <section className="mt-20">
        <div className="card p-10 shadow-xl space-y-4">
          <div className="text-6xl font-black text-gradient">404</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary justify-center text-sm">
              <Home className="w-4 h-4" /> Back Home
            </Link>
            <Link href="/properties" className="btn-secondary justify-center text-sm">
              <Search className="w-4 h-4" /> Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
