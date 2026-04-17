import { getTranslations } from 'next-intl/server';
import BlogList from '@/components/pages/BlogList';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const base = 'https://topalelectrique.ca';
  const frPath = `${base}/fr/conseils`;
  const enPath = `${base}/en/blog`;
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: locale === 'fr' ? frPath : enPath,
      languages: { 'fr-CA': frPath, 'en-CA': enPath },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: locale === 'fr' ? frPath : enPath,
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website' as const,
      images: [{ url: 'https://topalelectrique.ca/og-image.png', width: 1200, height: 630, alt: 'Topal Électrique — Électricien certifié à Montréal' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: ['https://topalelectrique.ca/og-image.png'],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, category, type, image_url, image_alt, published_at, reading_time')
    .eq('locale', locale)
    .order('published_at', { ascending: false });

  return <BlogList articles={(articles as Article[]) ?? []} locale={locale} />;
}
