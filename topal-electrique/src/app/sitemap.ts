import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://topalelectrique.ca';
  const locales = ['fr', 'en'];
  const pages = ['', '/services', '/a-propos', '/projets', '/contact', '/faq', '/confidentialite', '/conditions'];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }
  return entries;
}
