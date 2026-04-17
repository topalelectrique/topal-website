import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://topalelectrique.ca';

  const staticPages: Array<{ fr: string; en: string; freq: 'weekly' | 'monthly'; priority: number }> = [
    { fr: '/fr',                  en: '/en',          freq: 'weekly',  priority: 1.0 },
    { fr: '/fr/services',         en: '/en/services', freq: 'monthly', priority: 0.9 },
    { fr: '/fr/conseils',         en: '/en/blog',     freq: 'weekly',  priority: 0.9 },
    { fr: '/fr/a-propos',         en: '/en/about',    freq: 'monthly', priority: 0.8 },
    { fr: '/fr/projets',          en: '/en/projects', freq: 'monthly', priority: 0.8 },
    { fr: '/fr/contact',          en: '/en/contact',  freq: 'monthly', priority: 0.8 },
    { fr: '/fr/faq',              en: '/en/faq',      freq: 'monthly', priority: 0.7 },
    { fr: '/fr/confidentialite',  en: '/en/privacy',  freq: 'monthly', priority: 0.3 },
    { fr: '/fr/conditions',       en: '/en/terms',    freq: 'monthly', priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const page of staticPages) {
    entries.push({ url: `${base}${page.fr}`, lastModified, changeFrequency: page.freq, priority: page.priority });
    entries.push({ url: `${base}${page.en}`, lastModified, changeFrequency: page.freq, priority: page.priority });
  }

  // Add all published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, locale, published_at')
    .order('published_at', { ascending: false });

  if (articles) {
    for (const article of articles) {
      const path = article.locale === 'fr'
        ? `${base}/fr/conseils/${article.slug}`
        : `${base}/en/blog/${article.slug}`;
      entries.push({
        url: path,
        lastModified: new Date(article.published_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
