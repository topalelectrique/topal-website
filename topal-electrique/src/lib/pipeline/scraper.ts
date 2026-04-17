import Parser from 'rss-parser';
import { supabase } from '@/lib/supabase';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Topal-Electrique-Bot/1.0' },
});

export type ScrapedStory = {
  title: string;
  summary: string;
  url: string;
  source: string;
};

const ELECTRICITY_KEYWORDS = [
  'électri', 'electri', 'panneau', 'borne recharge', 'véhicule électrique',
  'rénovation', 'construction', 'rbq', 'hydro', 'énergie', 'câblage',
  'résidentiel', 'commercial', 'travaux',
];

function scoreStory(title: string, summary: string): number {
  const text = (title + ' ' + summary).toLowerCase();
  return ELECTRICITY_KEYWORDS.reduce((score, kw) => {
    return text.includes(kw) ? score + 1 : score;
  }, 0);
}

export async function scrapeNews(): Promise<ScrapedStory | null> {
  const { data: sources } = await supabase
    .from('rss_sources')
    .select('name, url')
    .eq('active', true);

  if (!sources || sources.length === 0) return null;

  const stories: Array<ScrapedStory & { score: number }> = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items.slice(0, 10)) {
        const title = item.title ?? '';
        const summary = item.contentSnippet ?? item.summary ?? '';
        const score = scoreStory(title, summary);
        if (score >= 2) {
          stories.push({
            title,
            summary: summary.slice(0, 500),
            url: item.link ?? '',
            source: source.name,
            score,
          });
        }
      }
    } catch {
      // Source failed, continue to next
    }
  }

  if (stories.length === 0) return null;

  // Return highest scoring story
  stories.sort((a, b) => b.score - a.score);
  const { score: _, ...best } = stories[0];
  return best;
}
