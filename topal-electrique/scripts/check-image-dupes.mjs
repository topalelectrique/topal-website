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

function extractId(url) {
  const match = url?.match(/photo-([A-Za-z0-9_-]+)/);
  return match ? match[1] : url;
}

const { data: articles, error } = await supabase
  .from('articles')
  .select('id, slug, locale, image_url, pair_id, published_at, category')
  .order('published_at', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Total articles: ${articles.length}\n`);

// Group by photo ID
const idToArticles = new Map();
for (const a of articles) {
  const id = extractId(a.image_url);
  if (!idToArticles.has(id)) idToArticles.set(id, []);
  idToArticles.get(id).push(a);
}

// Find duplicates that are NOT FR/EN pairs (different pair_id)
const dupes = [];
for (const [photoId, group] of idToArticles) {
  if (group.length <= 1) continue;
  const distinctPairs = new Set(group.map(a => a.pair_id).filter(Boolean));
  if (distinctPairs.size > 1 || (distinctPairs.size === 0 && group.length > 1)) {
    dupes.push({ photoId, group });
  } else if (distinctPairs.size === 1 && group.length > 2) {
    // Same pair_id but more than 2 articles? unusual
    dupes.push({ photoId, group });
  }
}

console.log(`Photos used by multiple unrelated articles: ${dupes.length}\n`);

for (const { photoId, group } of dupes.slice(0, 20)) {
  console.log(`Photo ${photoId} used by ${group.length} articles:`);
  for (const a of group) {
    console.log(`  [${a.locale}] ${a.slug} (${a.category}, ${a.published_at?.slice(0, 10)}, pair=${a.pair_id?.slice(0, 8)})`);
  }
  console.log();
}

// Last 10 articles
console.log('\n=== Last 10 articles by date ===');
for (const a of articles.slice(0, 10)) {
  console.log(`[${a.locale}] ${a.published_at?.slice(0, 10)} ${a.slug} → photo:${extractId(a.image_url)}`);
}
