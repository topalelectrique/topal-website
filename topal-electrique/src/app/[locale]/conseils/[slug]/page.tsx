import { notFound } from 'next/navigation';
import BlogArticle from '@/components/pages/BlogArticle';
import { ArticleProvider } from '@/context/article-context';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = 'https://topalelectrique.ca';

  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, image_url, slug, pair_id')
    .eq('slug', slug)
    .eq('locale', locale)
    .single();

  if (!article) return {};

  const frSlug = locale === 'fr' ? article.slug : null;
  const enSlug = locale === 'en' ? article.slug : null;

  // Fetch paired article slug for hreflang
  let pairedSlug: string | null = null;
  if (article.pair_id) {
    const { data: paired } = await supabase
      .from('articles')
      .select('slug')
      .eq('pair_id', article.pair_id)
      .neq('locale', locale)
      .single();
    pairedSlug = paired?.slug ?? null;
  }

  const frPath = locale === 'fr'
    ? `${base}/fr/conseils/${article.slug}`
    : pairedSlug ? `${base}/fr/conseils/${pairedSlug}` : `${base}/fr/conseils`;

  const enPath = locale === 'en'
    ? `${base}/en/blog/${article.slug}`
    : pairedSlug ? `${base}/en/blog/${pairedSlug}` : `${base}/en/blog`;

  const title = article.meta_title ?? article.title;
  const description = article.meta_description ?? '';

  return {
    title,
    description,
    alternates: {
      canonical: locale === 'fr' ? frPath : enPath,
      languages: { 'fr-CA': frPath, 'en-CA': enPath },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? frPath : enPath,
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'article' as const,
      images: article.image_url
        ? [{ url: article.image_url, width: 1200, height: 630, alt: title }]
        : [{ url: 'https://topalelectrique.ca/og-image.png', width: 1200, height: 630, alt: 'Topal Électrique' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [article.image_url ?? 'https://topalelectrique.ca/og-image.png'],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .single();

  if (!article) notFound();

  let pairedSlug: string | null = null;
  if (article.pair_id) {
    const { data: paired } = await supabase
      .from('articles')
      .select('slug')
      .eq('pair_id', article.pair_id)
      .neq('locale', locale)
      .single();
    pairedSlug = paired?.slug ?? null;
  }

  const pairedLocale = locale === 'fr' ? 'en' : 'fr';

  return (
    <ArticleProvider pairedSlug={pairedSlug} pairedLocale={pairedLocale as 'fr' | 'en'}>
      <BlogArticle article={article as Article} locale={locale} />
    </ArticleProvider>
  );
}
