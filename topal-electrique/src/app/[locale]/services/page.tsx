import { getTranslations } from 'next-intl/server';
import ServicesPage from '@/components/pages/ServicesPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.services' });
  const base = 'https://topalelectrique.ca';
  const frPath = `${base}/fr/services`;
  const enPath = `${base}/en/services`;
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
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function Services() {
  return <ServicesPage />;
}
