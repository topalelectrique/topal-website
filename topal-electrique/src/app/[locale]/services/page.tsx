import { getTranslations } from 'next-intl/server';
import ServicesPage from '@/components/pages/ServicesPage';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';

export const revalidate = 3600;

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
      languages: { 'fr-CA': frPath, 'en-CA': enPath, 'x-default': enPath },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: locale === 'fr' ? frPath : enPath,
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website' as const,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'Topal Électrique — Électricien certifié à Montréal' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      images: [`${base}/og-image.png`],
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, category, image_url, image_alt, published_at, reading_time, locale')
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .limit(30);

  return <ServicesPage articles={(articles ?? []) as Article[]} />;
}
