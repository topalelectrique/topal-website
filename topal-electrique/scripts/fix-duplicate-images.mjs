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

const CATEGORY_CONTEXT = {
  residential: 'home electrical wiring',
  commercial: 'office building electrical',
  regulations: 'building permit inspection',
  advice: 'home improvement electrical',
  trends: 'smart home technology',
  default: 'electrical work',
};

function extractId(url) {
  const match = url?.match(/photo-([A-Za-z0-9_-]+)/);
  return match ? match[1] : url;
}

async function searchUnsplash(query, usedIds) {
  const page = Math.floor(Math.random() * 8) + 1;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);
  const data = await res.json();
  const results = data.results ?? [];
  const unused = results.filter(p => !usedIds.has(p.id));
  return unused.length > 0 ? unused : results;
}

async function fetchFreshImage(title, category, usedIds) {
  const context = CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.default;

  // Try progressively simpler queries until we get results
  const queries = [
    `${context} ${title}`.slice(0, 60),
    context,
    'electrician montreal',
    'electrical work',
    'home renovation',
  ];

  for (const query of queries) {
    const results = await searchUnsplash(query, usedIds);
    if (results.length > 0) {
      const photo = results[Math.floor(Math.random() * results.length)];
      return {
        url: `${photo.urls.raw}&w=1200&q=80&fit=crop&crop=entropy`,
        id: photo.id,
      };
    }
  }

  throw new Error('No Unsplash results after all fallbacks');
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, locale, image_url, pair_id')
    .order('published_at', { ascending: true });

  if (error) throw new Error(error.message);

  // Group articles by photo ID — find duplicates
  const idToArticles = new Map();
  for (const article of articles) {
    const photoId = extractId(article.image_url);
    if (!idToArticles.has(photoId)) idToArticles.set(photoId, []);
    idToArticles.get(photoId).push(article);
  }

  // Collect articles that need a new image — ignore FR/EN pairs sharing the same image (correct behaviour)
  const toFix = [];
  for (const [, group] of idToArticles) {
    if (group.length <= 1) continue;

    // Remove articles that share a pair_id with another article in the group (legitimate FR/EN pairs)
    const pairIds = group.map(a => a.pair_id).filter(Boolean);
    const pairedDupes = new Set(pairIds.filter((id, _, arr) => arr.filter(x => x === id).length > 1));
    const realDuplicates = group.filter(a => !pairedDupes.has(a.pair_id));

    if (realDuplicates.length > 1) {
      console.log(`Duplicate found (${realDuplicates.length}x): ${extractId(group[0].image_url)}`);
      realDuplicates.slice(1).forEach(a => toFix.push(a));
    }
  }

  if (toFix.length === 0) {
    console.log('No duplicates found.');
    return;
  }

  console.log(`\nFixing ${toFix.length} articles...\n`);

  // Track all IDs in use (including originals we're keeping)
  const usedIds = new Set([...idToArticles.keys()]);

  for (const article of toFix) {
    try {
      const { url, id: newId } = await fetchFreshImage(article.title, article.category, usedIds);
      usedIds.add(newId);

      await supabase
        .from('articles')
        .update({ image_url: url, image_alt: article.title })
        .eq('id', article.id);

      console.log(`✓ [${article.locale}] ${article.slug}`);

      // Respect Unsplash rate limit (50 req/hour on free tier)
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`✗ [${article.locale}] ${article.slug}: ${err.message}`);
    }
  }

  console.log('\nDone.');
}

main().catch(console.error);
