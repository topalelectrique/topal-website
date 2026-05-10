import { supabase } from '@/lib/supabase';

const CATEGORY_FALLBACKS: Record<string, string[]> = {
  residential: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
  ],
  regulations: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    'https://images.unsplash.com/photo-1581091224003-7eecdfb70be7?w=1200&q=80',
  ],
  advice: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80',
  ],
  trends: [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  ],
};

const CATEGORY_CONTEXT: Record<string, string> = {
  residential: 'electrical panel wiring residential home',
  commercial: 'electrical commercial building wiring',
  regulations: 'electrical panel inspection safety permit',
  advice: 'electrical tools wiring installation',
  trends: 'smart home electrical panel technology',
  default: 'electrical panel wiring installation',
};

const BLACKLIST = [
  'phone', 'iphone', 'smartphone', 'tablet', 'laptop', 'computer', 'keyboard', 'screen', 'monitor',
  'electronics', 'gadget', 'device', 'circuit board', 'motherboard', 'chip', 'microchip', 'led strip',
  'cooking', 'food', 'restaurant', 'kitchen', 'chef', 'coffee', 'drink',
  'fashion', 'model', 'selfie', 'portrait', 'office worker', 'business person',
  'man smiling', 'woman smiling', 'person smiling', 'smiling man', 'smiling woman',
  'man standing', 'woman standing', 'man sitting', 'woman sitting',
  'man wearing', 'woman wearing', 'man holding', 'woman holding',
  'man in', 'woman in', 'person in', 'people in',
  'headshot', 'face', 'close-up of a man', 'close-up of a woman', 'close-up of person',
  'surgery', 'medical', 'doctor', 'gym', 'fitness', 'sport',
];

const REQUIRED = ['electric', 'electrician', 'wire', 'wiring', 'cable', 'panel', 'outlet', 'switch', 'circuit', 'power', 'voltage', 'conduit', 'breaker', 'construction', 'tools', 'installation', 'repair', 'maintenance', 'industrial', 'infrastructure', 'meter', 'box', 'wall', 'building'];

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

function buildSearchQuery(title: string, category: string): string {
  let q = title;
  for (const [pattern, replacement] of FR_EN_MAP) {
    q = q.replace(pattern, replacement);
  }
  q = q.replace(/\b(de|du|des|le|la|les|un|une|et|en|à|au|aux|sur|pour|par|avec|sans|dans|tout|tous|votre|notre|vos|nos|son|ses|leur|leurs|ce|cet|cette|ces|qui|que|quoi|comment|pourquoi|quand|combien|quel|quelle|quels|quelles|est|sont|faire|avoir|être|se|si|ne|pas|plus|aussi|très|bien|peut|doit|faut)\b/gi, ' ');
  const words = q
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 3);
  const context = CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default;
  const combined = [...new Set([...words, ...context.split(' ')])].slice(0, 5).join(' ');
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

type UnsplashPhoto = {
  id: string;
  urls: { raw: string };
  alt_description: string | null;
};

function isBlacklisted(photo: UnsplashPhoto): boolean {
  const alt = photo.alt_description?.toLowerCase() ?? '';
  if (!alt) return false;
  return BLACKLIST.some((w) => alt.includes(w));
}

function isRelevant(photo: UnsplashPhoto): boolean {
  const alt = photo.alt_description?.toLowerCase() ?? '';
  // Treat null/empty alt as neutral — Unsplash often omits alt for valid photos.
  // Reject only if alt exists AND has zero overlap with electrical vocabulary.
  if (!alt) return true;
  return REQUIRED.some((w) => alt.includes(w));
}

async function searchUnsplash(query: string, accessKey: string): Promise<UnsplashPhoto[]> {
  const page = Math.floor(Math.random() * 4) + 1;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape&order_by=relevant`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const data = await res.json();
  return (data.results ?? []) as UnsplashPhoto[];
}

export async function fetchImage(title: string, category: string): Promise<ImageResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

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

  // Progressive query escalation — try most specific first, broaden until we find an unused photo
  const context = CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default;
  const queries = [
    buildSearchQuery(title, category),
    context,
    'electrician work professional',
    'electrical installation',
    'home renovation construction',
  ];

  try {
    for (const query of queries) {
      let results: UnsplashPhoto[];
      try {
        results = await searchUnsplash(query, accessKey);
      } catch {
        continue;
      }
      if (results.length === 0) continue;

      // Tier 1: unused + not blacklisted + relevant
      let pool = results.filter((p) => !usedIds.has(p.id) && !isBlacklisted(p) && isRelevant(p));
      // Tier 2: unused + not blacklisted (drop relevance check)
      if (pool.length === 0) pool = results.filter((p) => !usedIds.has(p.id) && !isBlacklisted(p));
      // Tier 3: unused (drop blacklist too — last resort within this query)
      if (pool.length === 0) pool = results.filter((p) => !usedIds.has(p.id));
      if (pool.length === 0) continue;

      const photo = pool[Math.floor(Math.random() * pool.length)];
      return {
        url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
        alt: photo.alt_description ?? title,
      };
    }
  } catch {
    // Fall through to fallback
  }

  const fallbacks = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.default;
  const unused = fallbacks.find((u) => !usedIds.has(extractUnsplashId(u))) ?? fallbacks[0];
  return { url: unused, alt: title };
}
