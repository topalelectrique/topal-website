import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://topalelectrique.ca';

  const pages: Array<{ fr: string; en: string; freq: 'weekly' | 'monthly'; priority: number }> = [
    { fr: '/fr',                  en: '/en',        freq: 'weekly',  priority: 1.0 },
    { fr: '/fr/services',         en: '/en/services', freq: 'monthly', priority: 0.9 },
    { fr: '/fr/a-propos',         en: '/en/about',   freq: 'monthly', priority: 0.8 },
    { fr: '/fr/projets',          en: '/en/projects', freq: 'monthly', priority: 0.8 },
    { fr: '/fr/contact',          en: '/en/contact', freq: 'monthly', priority: 0.8 },
    { fr: '/fr/faq',              en: '/en/faq',     freq: 'monthly', priority: 0.7 },
    { fr: '/fr/confidentialite',  en: '/en/privacy', freq: 'monthly', priority: 0.3 },
    { fr: '/fr/conditions',       en: '/en/terms',   freq: 'monthly', priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const page of pages) {
    entries.push({ url: `${base}${page.fr}`, lastModified, changeFrequency: page.freq, priority: page.priority });
    entries.push({ url: `${base}${page.en}`, lastModified, changeFrequency: page.freq, priority: page.priority });
  }

  return entries;
}
