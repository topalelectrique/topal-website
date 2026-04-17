import { supabase } from '@/lib/supabase';

export type InternalLink = {
  slug: string;
  title: string;
  locale: string;
};

export async function findInternalLinks(
  category: string,
  locale: string,
  excludeSlug?: string
): Promise<InternalLink[]> {
  const { data } = await supabase
    .from('articles')
    .select('slug, title, locale')
    .eq('locale', locale)
    .eq('category', category)
    .neq('slug', excludeSlug ?? '')
    .order('published_at', { ascending: false })
    .limit(5);

  if (!data || data.length === 0) {
    // Fallback: any recent articles in same locale
    const { data: fallback } = await supabase
      .from('articles')
      .select('slug, title, locale')
      .eq('locale', locale)
      .neq('slug', excludeSlug ?? '')
      .order('published_at', { ascending: false })
      .limit(3);
    return fallback ?? [];
  }

  return data.slice(0, 3);
}

export function buildInternalLinkHtml(links: InternalLink[], locale: string): string {
  if (links.length === 0) return '';
  const base = locale === 'fr' ? '/fr/conseils' : '/en/blog';
  const items = links
    .map((l) => `<li><a href="${base}/${l.slug}">${l.title}</a></li>`)
    .join('\n');
  return `\n<ul>\n${items}\n</ul>`;
}
