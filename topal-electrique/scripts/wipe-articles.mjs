// Wipes all rows from the articles table. Optionally resets keywords so the
// pipeline can re-pick them on the next cron run.
//
// Usage:
//   node scripts/wipe-articles.mjs --confirm
//   node scripts/wipe-articles.mjs --confirm --reset-keywords
//
// The --confirm flag is required: running with no flags only reports the count
// that would be deleted, no changes made. This protects against an accidental
// `node scripts/wipe-articles.mjs` from nuking everything.

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

const args = new Set(process.argv.slice(2));
const confirmed = args.has('--confirm');
const resetKeywords = args.has('--reset-keywords');

const { data: articles, error: countErr } = await supabase
  .from('articles')
  .select('id, slug, locale, published_at')
  .order('published_at', { ascending: false });

if (countErr) {
  console.error('Failed to read articles:', countErr.message);
  process.exit(1);
}

const BASE = 'https://topalelectrique.ca';
const urlFor = (a) => a.locale === 'fr'
  ? `${BASE}/fr/conseils/${a.slug}`
  : `${BASE}/en/blog/${a.slug}`;

console.log(`Found ${articles.length} articles in Supabase.\n`);
console.log('Full URLs (copy these into Google Search Console → Removals before confirming):\n');
articles.forEach((a) => console.log(urlFor(a)));

if (!confirmed) {
  console.log(`\n${articles.length} URLs listed above.`);
  console.log('DRY RUN. Pass --confirm to actually delete.');
  console.log('Optional: --reset-keywords to also clear used_at on the keywords table');
  console.log('so the pipeline re-picks them on the next cron run.');
  process.exit(0);
}

console.log('\nNullifying article_id references in pipeline_runs (preserves run history)...');
const { error: fkErr } = await supabase
  .from('pipeline_runs')
  .update({ article_id: null })
  .not('article_id', 'is', null);
if (fkErr) {
  console.error('FK nullify failed:', fkErr.message);
  process.exit(1);
}

console.log('Deleting all articles...');
const { error: delErr } = await supabase.from('articles').delete().neq('id', 0);
if (delErr) {
  console.error('Delete failed:', delErr.message);
  process.exit(1);
}
console.log(`Deleted ${articles.length} articles.`);

if (resetKeywords) {
  console.log('\nResetting keywords (clearing used_at)...');
  const { error: kwErr, count } = await supabase
    .from('keywords')
    .update({ used_at: null }, { count: 'exact' })
    .not('used_at', 'is', null);
  if (kwErr) {
    console.error('Keyword reset failed:', kwErr.message);
    process.exit(1);
  }
  console.log(`Reset ${count ?? '?'} keywords back to unused.`);
}

console.log('\nDone. Sitemap will rebuild on next request (revalidate=3600).');
console.log('Reminder: manually delete the matching Facebook posts.');
