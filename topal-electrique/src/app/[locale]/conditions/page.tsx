import { getTranslations } from 'next-intl/server';
import TermsPage from '@/components/pages/TermsPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.terms' });
  const base = 'https://topalelectrique.ca';
  const frPath = `${base}/fr/conditions`;
  const enPath = `${base}/en/terms`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'fr' ? frPath : enPath,
      languages: { 'fr-CA': frPath, 'en-CA': enPath },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: locale === 'fr' ? frPath : enPath,
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website' as const,
      images: [{ url: 'https://topalelectrique.ca/og-image.png', width: 1200, height: 630, alt: 'Topal Électrique — Électricien certifié à Montréal' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      images: ['https://topalelectrique.ca/og-image.png'],
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function TermsRoute() {
  return <TermsPage />;
}
