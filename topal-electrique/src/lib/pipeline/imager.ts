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

// Category context words appended to give Unsplash more signal
const CATEGORY_CONTEXT: Record<string, string> = {
  residential: 'home wiring',
  commercial: 'office building electrical',
  regulations: 'building permit inspection',
  advice: 'home improvement',
  trends: 'smart home technology',
  default: 'electrical work',
};

// FR → EN word-for-word translation map (sorted longest-first for greedy matching)
const FR_EN_MAP: [RegExp, string][] = [
  [/panneau électrique|tableau électrique/gi, 'electrical panel'],
  [/borne de recharge|chargeur de véhicule|chargeur ev/gi, 'EV charger'],
  [/mise à la terre/gi, 'electrical grounding'],
  [/disjoncteur différentiel|prise gfci/gi, 'GFCI outlet'],
  [/câblage résidentiel/gi, 'residential wiring'],
  [/éclairage extérieur/gi, 'outdoor lighting'],
  [/éclairage intérieur/gi, 'indoor lighting'],
  [/installation électrique/gi, 'electrical installation'],
  [/rénovation électrique/gi, 'electrical renovation'],
  [/électricien résidentiel/gi, 'residential electrician'],
  [/électricien commercial/gi, 'commercial electrician'],
  [/électricien|électricienne/gi, 'electrical work'],
  [/électrique|électricité/gi, 'electrical'],
  [/panneau|tableau/gi, 'panel'],
  [/câblage|câble/gi, 'wiring'],
  [/prise de courant|prise/gi, 'outlet'],
  [/interrupteur/gi, 'light switch'],
  [/disjoncteur/gi, 'circuit breaker'],
  [/éclairage|lumière/gi, 'lighting'],
  [/chargeur|borne/gi, 'charger'],
  [/résidentiel|maison|domicile/gi, 'home'],
  [/commercial|bureau/gi, 'office'],
  [/remplacement/gi, 'replacement'],
  [/installation/gi, 'installation'],
  [/réparation/gi, 'repair'],
  [/inspection/gi, 'inspection'],
  [/sécurité/gi, 'safety'],
  [/coût|prix/gi, 'cost'],
  [/économie|économiser/gi, 'energy saving'],
  [/montréal|québec|laval|longueuil/gi, ''],
  [/comment|guide|étapes|conseils/gi, ''],
];

/**
 * Translates a French article title into a concise English Unsplash search query.
 * Strips filler words and builds a topic-focused query with category context.
 */
function buildSearchQuery(title: string, category: string): string {
  let q = title;

  for (const [pattern, replacement] of FR_EN_MAP) {
    q = q.replace(pattern, replacement);
  }

  // Remove common French filler / stop words
  q = q.replace(/\b(de|du|des|le|la|les|un|une|et|en|à|au|aux|sur|pour|par|avec|sans|dans|tout|tous|votre|notre|vos|nos|son|ses|leur|leurs|ce|cet|cette|ces|qui|que|quoi|comment|pourquoi|quand|combien|quel|quelle|quels|quelles|est|sont|faire|avoir|être|se|si|ne|pas|plus|aussi|très|bien|peut|doit|faut)\b/gi, ' ');

  // Collapse whitespace and take first 5 meaningful words
  const words = q
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 5);

  const context = CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default;
  const combined = [...new Set([...words, ...context.split(' ')])].slice(0, 7).join(' ');

  return combined.trim() || context;
}

export type ImageResult = {
  url: string;
  alt: string;
};

export async function fetchImage(title: string, category: string): Promise<ImageResult> {
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
    return { url: unused, alt: title };
  }

  try {
    const searchTerms = buildSearchQuery(title, category);
    const query = encodeURIComponent(searchTerms);
    const randomPage = Math.floor(Math.random() * 4) + 1;

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=20&page=${randomPage}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) throw new Error('Unsplash API error');

    const data = await res.json();
    const results: { urls: { raw: string }; alt_description: string }[] = data.results ?? [];

    const unused = results.filter((photo) => {
      const url = `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`;
      return !usedUrls.has(url);
    });

    const pool = unused.length > 0 ? unused : results;
    const photo = pool[Math.floor(Math.random() * pool.length)];
    if (!photo) throw new Error('No results');

    return {
      url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
      alt: photo.alt_description ?? title,
    };
  } catch {
    const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
    const unused = fallbacks.find((u) => !usedUrls.has(u)) ?? fallbacks[0];
    return { url: unused, alt: title };
  }
}
