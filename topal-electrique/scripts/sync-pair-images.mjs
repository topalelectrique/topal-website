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

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, title, locale, image_url, image_alt, pair_id')
    .not('pair_id', 'is', null);

  if (error) throw new Error(error.message);

  // Group by pair_id
  const pairs = new Map();
  for (const article of articles) {
    if (!pairs.has(article.pair_id)) pairs.set(article.pair_id, []);
    pairs.get(article.pair_id).push(article);
  }

  let fixed = 0;
  for (const [, pair] of pairs) {
    if (pair.length !== 2) continue;
    const fr = pair.find(a => a.locale === 'fr');
    const en = pair.find(a => a.locale === 'en');
    if (!fr || !en) continue;

    // If they already share the same image, skip
    if (fr.image_url === en.image_url) continue;

    // Use FR image as the canonical one for the pair, update EN to match
    await supabase
      .from('articles')
      .update({ image_url: fr.image_url, image_alt: en.title })
      .eq('id', en.id);

    console.log(`✓ Synced pair: [fr] ${fr.slug} → [en] ${en.slug}`);
    fixed++;
  }

  console.log(`\nDone — ${fixed} pairs re-synced.`);
}

main().catch(console.error);
