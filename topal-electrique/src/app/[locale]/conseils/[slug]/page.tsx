import { notFound } from 'next/navigation';
import BlogArticle from '@/components/pages/BlogArticle';
import ArticleContextSetter from '@/components/ArticleContextSetter';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import { linkifyGlossaryTerms } from '@/lib/glossary';

export const revalidate = 3600;

function extractH2Steps(html: string): string[] {
  return [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').trim())
    .filter((s) => s.length > 0 && !/faq|question|fréquent/i.test(s));
}

function isHowToArticle(title: string, locale: string): boolean {
  const lower = title.toLowerCase();
  return locale === 'fr'
    ? /^comment\b/.test(lower) || /^guide\b/.test(lower) || lower.includes('étapes pour')
    : /^how (to|do)\b/.test(lower) || /^guide\b/.test(lower) || lower.includes('step by step');
}

function extractFAQs(html: string): { question: string; answer: string }[] {
  const regex = /<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  const faqs: { question: string; answer: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').trim();
    const answer = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = 'https://topalelectrique.ca';
  const isFr = locale === 'fr';

  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, image_url, slug, pair_id')
    .eq('slug', slug)
    .eq('locale', locale)
    .single();

  if (!article) return {};

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

  const frPath = `${base}/fr/conseils/${isFr ? article.slug : (pairedSlug ?? '')}`;
  const enPath = `${base}/en/blog/${!isFr ? article.slug : (pairedSlug ?? '')}`;
  const canonical = isFr ? `${base}/fr/conseils/${article.slug}` : `${base}/en/blog/${article.slug}`;

  // Only declare cross-language hreflang when the paired article actually exists.
  // Falling back to list pages (/fr/conseils or /en/blog) causes "missing reciprocal
  // hreflang" errors because the list page doesn't link back to this article.
  const hreflangLanguages = pairedSlug
    ? { 'fr-CA': frPath, 'en-CA': enPath, 'x-default': enPath }
    : { [isFr ? 'fr-CA' : 'en-CA']: canonical, 'x-default': canonical };

  const title = article.meta_title ?? article.title;
  const description = article.meta_description ?? '';

  return {
    title,
    description,
    authors: [{ name: 'Matéo Saric', url: `${base}/${locale}/${isFr ? 'auteur' : 'author'}` }],
    alternates: {
      canonical,
      languages: hreflangLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Topal Électrique',
      locale: isFr ? 'fr_CA' : 'en_CA',
      type: 'article' as const,
      authors: ['Matéo Saric'],
      images: article.image_url
        ? [{ url: article.image_url, width: 1200, height: 630, alt: title }]
        : [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'Topal Électrique' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [article.image_url ?? `${base}/og-image.png`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = 'https://topalelectrique.ca';
  const isFr = locale === 'fr';

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .single();

  if (!article) notFound();

  // Fetch paired slug for language switcher
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

  // Fetch related articles (same category, same locale, exclude current)
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, category, image_url, image_alt, published_at, reading_time, locale')
    .eq('locale', locale)
    .eq('category', article.category ?? 'advice')
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);

  const articlePath = isFr
    ? `${base}/fr/conseils/${article.slug}`
    : `${base}/en/blog/${article.slug}`;

  // Article JSON-LD (comprehensive)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description ?? article.excerpt ?? '',
    image: article.image_url ?? `${base}/og-image.png`,
    datePublished: article.published_at,
    dateModified: article.published_at,
    inLanguage: isFr ? 'fr-CA' : 'en-CA',
    author: {
      '@type': 'Person',
      name: 'Matéo Saric',
      jobTitle: isFr ? 'Électricien certifié' : 'Certified Electrician',
      url: `${base}/${locale}/${isFr ? 'auteur' : 'author'}`,
      worksFor: { '@type': 'Organization', name: 'Topal Électrique', url: base },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Topal Électrique',
      url: base,
      logo: { '@type': 'ImageObject', url: `${base}/images/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articlePath },
    isPartOf: {
      '@type': 'Blog',
      name: isFr ? 'Topal Électrique — Conseils' : 'Topal Électrique — Blog',
      url: isFr ? `${base}/fr/conseils` : `${base}/en/blog`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.ai-overview', 'article h1', '.article-excerpt'],
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isFr ? 'Accueil' : 'Home', item: isFr ? `${base}/fr` : `${base}/en` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Conseils' : 'Blog', item: isFr ? `${base}/fr/conseils` : `${base}/en/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articlePath },
    ],
  };

  // HowTo JSON-LD (for "Comment…" / "How to…" articles)
  const howToSteps = isHowToArticle(article.title, locale) ? extractH2Steps(article.content) : [];
  const howToSchema = howToSteps.length >= 3 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.title,
    description: article.excerpt ?? article.meta_description ?? '',
    ...(article.reading_time ? { totalTime: `PT${article.reading_time}M` } : {}),
    step: howToSteps.map((name, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name,
      text: name,
    })),
  } : null;

  // FAQPage JSON-LD (auto-parsed from article content)
  const faqs = extractFAQs(article.content);
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  const pairedLocale = locale === 'fr' ? 'en' : 'fr';

  // Auto-link glossary terms in article content (first occurrence only, skips headings/links/aside)
  const linkedContent = linkifyGlossaryTerms(article.content, locale as 'fr' | 'en');
  const processedArticle = { ...article, content: linkedContent } as Article;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
      <ArticleContextSetter pairedSlug={pairedSlug} pairedLocale={pairedLocale as 'fr' | 'en'} />
      <BlogArticle
        article={processedArticle}
        locale={locale}
        relatedArticles={(relatedArticles ?? []) as Article[]}
      />
    </>
  );
}
