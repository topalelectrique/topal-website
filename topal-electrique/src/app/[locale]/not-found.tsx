'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const locale = useLocale();
  const isFr = locale === 'fr';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-heading text-8xl font-bold text-orange-500/20 leading-none select-none">404</p>
      <h1 className="font-heading mt-4 text-3xl font-bold text-white">
        {isFr ? 'Page introuvable' : 'Page not found'}
      </h1>
      <p className="mt-4 max-w-sm text-gray-400">
        {isFr
          ? "La page que vous cherchez n'existe pas ou a été déplacée."
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-400"
      >
        {isFr ? "Retour à l'accueil" : 'Back to home'}
      </Link>
    </div>
  );
}
