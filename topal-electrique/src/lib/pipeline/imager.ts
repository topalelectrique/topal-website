import { supabase } from '@/lib/supabase';

const CATEGORY_FALLBACKS: Record<string, string[]> = {
  residential: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
  ],
  regulations: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  ],
  advice: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  ],
  trends: [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
  ],
};

export type ImageResult = {
  url: string;
  alt: string;
};

export async function fetchImage(keyword: string, category: string): Promise<ImageResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  // Fetch already-used image URLs from Supabase to avoid duplicates
  const { data: usedRows } = await supabase
    .from('articles')
    .select('image_url')
    .not('image_url', 'is', null);
  const usedUrls = new Set((usedRows ?? []).map((r) => r.image_url as string));

  if (!accessKey) {
    const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
    const unused = fallbacks.find((u) => !usedUrls.has(u)) ?? fallbacks[0];
    return { url: unused, alt: keyword };
  }

  try {
    // Use full keyword for relevance, translated to English for better Unsplash results
    const searchTerms = keyword
      .replace(/électrique|électricien|électricité/gi, 'electrician')
      .replace(/montréal|québec/gi, '')
      .replace(/installation|remplacement/gi, 'installation')
      .trim()
      .split(' ')
      .slice(0, 5)
      .join(' ');

    const query = encodeURIComponent(`electrician ${searchTerms}`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=20&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) throw new Error('Unsplash API error');

    const data = await res.json();
    const results: { urls: { raw: string }; alt_description: string }[] = data.results ?? [];

    // Pick first unused result
    const unused = results.find((photo) => {
      const url = `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`;
      return !usedUrls.has(url);
    });

    const photo = unused ?? results[Math.floor(Math.random() * results.length)];
    if (!photo) throw new Error('No results');

    return {
      url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
      alt: photo.alt_description ?? keyword,
    };
  } catch {
    const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
    const unused = fallbacks.find((u) => !usedUrls.has(u)) ?? fallbacks[0];
    return { url: unused, alt: keyword };
  }
}
