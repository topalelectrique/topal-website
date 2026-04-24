import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const idx = l.indexOf('=');
    return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
  })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
const UNSPLASH_KEY = env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_KEY) {
  console.error('UNSPLASH_ACCESS_KEY missing in .env.local');
  process.exit(1);
}

const CATEGORY_CONTEXT = {
  residential: 'residential electrician home wiring',
  commercial: 'commercial building electrical office',
  regulations: 'electrical inspection permit safety',
  advice: 'home improvement electrical work',
  trends: 'smart home technology energy',
  default: 'electrician electrical work',
};

// Translate common French electrical terms for better Unsplash results
const FR_EN = [
  [/panneau électrique|tableau électrique/gi, 'electrical panel'],
  [/borne de recharge|chargeur ev/gi, 'EV charger'],
  [/mise à la terre/gi, 'electrical grounding'],
  [/disjoncteur/gi, 'circuit breaker'],
  [/câblage|câble/gi, 'wiring'],
  [/prise de courant|prise/gi, 'electrical outlet'],
  [/interrupteur/gi, 'light switch'],
  [/éclairage/gi, 'lighting'],
  [/électricien|électrique|électricité/gi, 'electrician electrical'],
  [/remplacement/gi, 'replacement'],
  [/installation/gi, 'installation'],
  [/rénovation/gi, 'renovation'],
  [/urgence/gi, 'emergency'],
  [/sécurité/gi, 'safety'],
  [/coût|prix|devis/gi, 'cost estimate'],
  [/maison|résidentiel/gi, 'home residential'],
  [/commercial|bureau/gi, 'commercial office'],
  [/montréal|québec|grand montréal|rive.sud/gi, ''],
  [/certifié|maître|rbq|cmeq/gi, 'certified professional'],
  [/comment|guide|conseils/gi, ''],
];

function buildQuery(title, category) {
  let q = title;
  for (const [pattern, replacement] of FR_EN) {
    q = q.replace(pattern, replacement);
  }
  // Strip filler words
  q = q.replace(/\b(de|du|des|le|la|les|un|une|et|en|à|au|pour|par|avec|dans|votre|notre|comment|pourquoi|combien|quel)\b/gi, ' ');
  const words = q.replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 2).slice(0, 4);
  const context = CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default;
  const combined = [...new Set([...words, ...context.split(' ')])].slice(0, 6).join(' ');
  return combined.trim() || context;
}

function extractId(url) {
  const match = url?.match(/photo-([A-Za-z0-9_-]+)/);
  return match ? match[1] : url;
}

async function fetchSubjectImage(title, category, usedIds, attempt = 0) {
  const queries = [
    buildQuery(title, category),
    CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default,
    'electrician work professional',
    'electrical installation',
    'home renovation construction',
  ];

  const query = queries[Math.min(attempt, queries.length - 1)];
  const page = Math.floor(Math.random() * 5) + 1;

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );

  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const data = await res.json();
  const results = data.results ?? [];
  const unused = results.filter(p => !usedIds.has(p.id));

  if (unused.length === 0 && attempt < queries.length - 1) {
    return fetchSubjectImage(title, category, usedIds, attempt + 1);
  }

  const pool = unused.length > 0 ? unused : results;
  const photo = pool[Math.floor(Math.random() * pool.length)];
  if (!photo) throw new Error('No results');

  return {
    url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
    id: photo.id,
    query,
  };
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, locale, image_url, pair_id')
    .order('published_at', { ascending: true });

  if (error) throw new Error(error.message);

  // Group by pair_id — process one pair at a time
  const pairs = new Map();
  const unpaired = [];
  for (const a of articles) {
    if (a.pair_id) {
      if (!pairs.has(a.pair_id)) pairs.set(a.pair_id, []);
      pairs.get(a.pair_id).push(a);
    } else {
      unpaired.push(a);
    }
  }

  const usedIds = new Set();

  console.log(`Processing ${pairs.size} pairs + ${unpaired.length} unpaired articles...\n`);

  for (const [, pair] of pairs) {
    const fr = pair.find(a => a.locale === 'fr') ?? pair[0];
    const en = pair.find(a => a.locale === 'en');

    try {
      const { url, id, query } = await fetchSubjectImage(fr.title, fr.category, usedIds);
      usedIds.add(id);

      // Update FR
      await supabase.from('articles').update({ image_url: url, image_alt: fr.title }).eq('id', fr.id);
      // Update EN with same image but EN alt text
      if (en) {
        await supabase.from('articles').update({ image_url: url, image_alt: en.title }).eq('id', en.id);
      }

      console.log(`✓ [${fr.category}] ${fr.slug}`);
      console.log(`  query: "${query}"`);
      if (en) console.log(`  → synced to EN: ${en.slug}`);
      console.log();

      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`✗ ${fr.slug}: ${err.message}\n`);
    }
  }

  // Handle unpaired articles
  for (const article of unpaired) {
    try {
      const { url, id, query } = await fetchSubjectImage(article.title, article.category, usedIds);
      usedIds.add(id);
      await supabase.from('articles').update({ image_url: url, image_alt: article.title }).eq('id', article.id);
      console.log(`✓ [unpaired] ${article.slug} — query: "${query}"\n`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`✗ ${article.slug}: ${err.message}\n`);
    }
  }

  console.log('Done.');
}

main().catch(console.error);
