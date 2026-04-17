import type { InternalLink } from './linker';

export type ArticleType = 'evergreen' | 'news' | 'topal';

export type GeneratedArticle = {
  title: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  reading_time: number;
};

const SYSTEM_PROMPTS: Record<ArticleType, string> = {
  evergreen: `Tu es un rédacteur SEO expert spécialisé en électricité résidentielle et commerciale au Québec.
Ton ton est informatif, professionnel et accessible. Tu écris en français québécois naturel.
Tu mentions Topal Électrique une seule fois maximum, en conclusion, de façon subtile.
Tu cites des sources réglementaires quand pertinent (RBQ, CMEQ, Code de construction du Québec, CSA).
Tu inclus des prix réalistes en dollars canadiens quand la question porte sur les coûts.
Tu structures l'article avec des sous-titres H2 et H3 clairs.`,

  news: `Tu es un rédacteur de contenu actualités spécialisé en construction et électricité au Québec.
Ton ton est neutre et factuel, style journalistique. Tu écris en français québécois.
Tu contextualises l'actualité pour les propriétaires et entrepreneurs montréalais.
Tu ne mentionnes PAS Topal Électrique dans le corps de l'article — uniquement si absolument pertinent en conclusion.
Tu structures l'article avec des sous-titres H2 clairs et une conclusion pratique.`,

  topal: `Tu es le rédacteur de contenu de Topal Électrique, maîtres électriciens certifiés à Montréal.
Ton ton est chaleureux, expert et orienté vers l'action. Tu écris en français québécois.
Tu mentionnes Topal Électrique naturellement dans le corps du texte (2-3 fois maximum).
Tu inclus un appel à l'action clair vers /contact à la fin.
Tu mets en avant les certifications (RBQ, CMEQ), les 20+ ans d'expérience et le service Grand Montréal.
Tu structures l'article avec des sous-titres H2 et H3 et une conclusion avec CTA.`,
};

export async function generateArticle(
  keyword: string,
  articleType: ArticleType,
  locale: 'fr' | 'en',
  internalLinks: InternalLink[],
  newsContext?: { title: string; summary: string; url: string }
): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const linkContext =
    internalLinks.length > 0
      ? `\n\nIncorpore naturellement 2-3 liens internes vers ces articles existants du site (utilise le slug dans le href):\n${internalLinks.map((l) => `- "${l.title}" → /conseils/${l.slug}`).join('\n')}`
      : '';

  const newsContext_ = newsContext
    ? `\n\nContexte de l'actualité à traiter:\nTitre: ${newsContext.title}\nRésumé: ${newsContext.summary}\nSource: ${newsContext.url}`
    : '';

  const userPrompt =
    locale === 'fr'
      ? `Rédige un article SEO complet en français québécois sur le sujet suivant: "${keyword}"${newsContext_}${linkContext}

Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte (pas de markdown, pas de texte avant ou après):
{
  "title": "Titre principal H1 (60-70 caractères)",
  "meta_title": "Meta title SEO (55-60 caractères, inclure Montréal ou Québec)",
  "meta_description": "Meta description (150-160 caractères, inclure un CTA)",
  "slug": "slug-url-optimise-seo",
  "excerpt": "Résumé de 2-3 phrases (150-200 mots)",
  "content": "Contenu HTML complet (800-1200 mots) avec balises <h2>, <h3>, <p>, <ul>, <li>, <strong>. Minimum 4 sections H2.",
  "category": "residential|commercial|regulations|advice|trends",
  "reading_time": 5
}`
      : `Write a complete SEO article in Canadian English on the topic: "${keyword}"${newsContext_}${linkContext}

Return ONLY a valid JSON object with this exact structure (no markdown, no text before or after):
{
  "title": "Main H1 title (60-70 characters)",
  "meta_title": "SEO meta title (55-60 characters, include Montreal or Quebec)",
  "meta_description": "Meta description (150-160 characters, include a CTA)",
  "slug": "seo-optimized-url-slug",
  "excerpt": "2-3 sentence summary (150-200 words)",
  "content": "Full HTML content (800-1200 words) with <h2>, <h3>, <p>, <ul>, <li>, <strong> tags. Minimum 4 H2 sections.",
  "category": "residential|commercial|regulations|advice|trends",
  "reading_time": 5
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPTS[articleType],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';

  try {
    return JSON.parse(text) as GeneratedArticle;
  } catch {
    // Try to extract JSON if there's surrounding text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as GeneratedArticle;
    throw new Error('Failed to parse Claude response as JSON');
  }
}
