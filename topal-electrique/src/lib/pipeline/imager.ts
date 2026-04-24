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
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
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

// Mandatory keywords appended to every query to keep results on-topic
const CATEGORY_CONTEXT: Record<string, string> = {
  residential: 'electrical panel wiring residential home',
  commercial: 'electrical commercial building wiring',
  regulations: 'electrical panel inspection safety permit',
  advice: 'electrical tools wiring installation',
  trends: 'smart home electrical panel technology',
  default: 'electrical panel wiring installation',
};

// Blacklisted terms — skip any photo whose alt_description contains these
const BLACKLIST = [
  // Electronics / gadgets
  'phone', 'iphone', 'smartphone', 'tablet', 'laptop', 'computer', 'keyboard', 'screen', 'monitor',
  'electronics', 'gadget', 'device', 'circuit board', 'motherboard', 'chip', 'microchip', 'led strip',
  // Food / lifestyle
  'cooking', 'food', 'restaurant', 'kitchen', 'chef', 'coffee', 'drink',
  // People / portraits — must reject before REQUIRED check fires
  'fashion', 'model', 'selfie', 'portrait', 'office worker', 'business person',
  'man smiling', 'woman smiling', 'person smiling', 'smiling man', 'smiling woman',
  'man standing', 'woman standing', 'man sitting', 'woman sitting',
  'man wearing', 'woman wearing', 'man holding', 'woman holding',
  'man in', 'woman in', 'person in', 'people in',
  'headshot', 'face', 'close-up of a man', 'close-up of a woman', 'close-up of person',
  // Health / other
  'surgery', 'medical', 'doctor', 'gym', 'fitness', 'sport',
];

// Required keywords — at least one must appear in alt_description for the photo to qualify
const REQUIRED = ['electric', 'electrician', 'wire', 'wiring', 'cable', 'panel', 'outlet', 'switch', 'circuit', 'power', 'voltage', 'conduit', 'breaker', 'construction', 'tools', 'installation', 'repair', 'maintenance', 'industrial', 'infrastructure'];

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

function extractUnsplashId(url: string): string {
  const match = url.match(/photo-([A-Za-z0-9_-]+)/);
  return match ? match[1] : url;
}

export async function fetchImage(title: string, category: string): Promise<ImageResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  // Deduplicate by Unsplash photo ID — more reliable than full URL string comparison
  const { data: usedRows } = await supabase
    .from('articles')
    .select('image_url')
    .not('image_url', 'is', null);
  const usedIds = new Set((usedRows ?? []).map((r) => extractUnsplashId(r.image_url as string)));

  if (!accessKey) {
    const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
    const unused = fallbacks.find((u) => !usedIds.has(extractUnsplashId(u))) ?? fallbacks[0];
    return { url: unused, alt: title };
  }

  try {
    const searchTerms = buildSearchQuery(title, category);
    const query = encodeURIComponent(searchTerms);
    const randomPage = Math.floor(Math.random() * 8) + 1;

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=${randomPage}&orientation=landscape&order_by=relevant`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) throw new Error('Unsplash API error');

    const data = await res.json();
    const results: { id: string; urls: { raw: string }; alt_description: string }[] = data.results ?? [];

    const isGoodPhoto = (photo: { id: string; alt_description: string }) => {
      const alt = photo.alt_description?.toLowerCase() ?? '';
      const blacklisted = BLACKLIST.some(word => alt.includes(word));
      const relevant = REQUIRED.some(word => alt.includes(word));
      return !blacklisted && relevant;
    };

    let unused = results.filter((photo) => !usedIds.has(photo.id) && isGoodPhoto(photo));

    // If strict filter killed everything, retry on a different page with a broader query
    if (unused.length === 0) {
      const fallbackPage = Math.floor(Math.random() * 8) + 1;
      const broadQuery = encodeURIComponent(CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default);
      const res2 = await fetch(
        `https://api.unsplash.com/search/photos?query=${broadQuery}&per_page=30&page=${fallbackPage}&orientation=landscape&order_by=relevant`,
        { headers: { Authorization: `Client-ID ${accessKey}` } }
      );
      if (res2.ok) {
        const data2 = await res2.json();
        const results2: { id: string; urls: { raw: string }; alt_description: string }[] = data2.results ?? [];
        unused = results2.filter((photo) => !usedIds.has(photo.id) && isGoodPhoto(photo));
      }
    }

    // Last resort: unused but no quality filter — still never reuse a photo
    if (unused.length === 0) {
      unused = results.filter((photo) => !usedIds.has(photo.id));
    }

    const photo = unused[Math.floor(Math.random() * unused.length)];
    if (!photo) throw new Error('No results');

    return {
      url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
      alt: photo.alt_description ?? title,
    };
  } catch {
    const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
    const unused = fallbacks.find((u) => !usedIds.has(extractUnsplashId(u))) ?? fallbacks[0];
    return { url: unused, alt: title };
  }
}
