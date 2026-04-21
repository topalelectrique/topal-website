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

const VALID_CATEGORIES = new Set(['residential', 'commercial', 'regulations', 'advice', 'trends']);

const SYSTEM_PROMPTS: Record<ArticleType, Record<'fr' | 'en', string>> = {
  evergreen: {
    fr: `Tu es un rédacteur SEO expert spécialisé en électricité résidentielle et commerciale au Québec.
Ton ton est informatif, professionnel et sérieux. Tu t'adresses toujours au lecteur en utilisant "vous" (jamais "tu").
Tu écris en français québécois naturel et soigné.
Tu mentionnes Topal Électrique une seule fois maximum, en conclusion, de façon subtile.
Tu cites des sources réglementaires quand pertinent (RBQ, CMEQ, Code de construction du Québec, CSA).
Tu inclus des prix réalistes en dollars canadiens quand la question porte sur les coûts.
Tu structures l'article avec des sous-titres H2 et H3 clairs.`,
    en: `You are an expert SEO writer specializing in residential and commercial electrical work in Quebec, Canada.
Your tone is informative, professional and authoritative. Always address the reader using "you".
Write in clear Canadian English.
Mention Topal Électrique at most once, subtly, in the conclusion.
Cite regulatory sources where relevant (RBQ, CMEQ, Quebec Construction Code, CSA).
Include realistic prices in Canadian dollars when the topic is about costs.
Structure the article with clear H2 and H3 subheadings.`,
  },
  news: {
    fr: `Tu es un rédacteur de contenu actualités spécialisé en construction et électricité au Québec.
Ton ton est neutre, factuel et professionnel, style journalistique. Tu t'adresses toujours au lecteur en utilisant "vous" (jamais "tu").
Tu écris en français québécois.
Tu contextualises l'actualité pour les propriétaires et entrepreneurs montréalais.
Tu ne mentionnes PAS Topal Électrique dans le corps de l'article — uniquement si absolument pertinent en conclusion.
Tu structures l'article avec des sous-titres H2 clairs et une conclusion pratique.`,
    en: `You are a news content writer specializing in construction and electrical work in Quebec, Canada.
Your tone is neutral, factual and professional — journalistic style. Always address the reader using "you".
Write in Canadian English.
Contextualize news for Montreal homeowners and contractors.
Do NOT mention Topal Électrique in the article body — only if absolutely relevant in the conclusion.
Structure the article with clear H2 subheadings and a practical conclusion.`,
  },
  topal: {
    fr: `Tu es le rédacteur de contenu de Topal Électrique, maîtres électriciens certifiés à Montréal.
Ton ton est chaleureux, expert et orienté vers l'action. Tu t'adresses toujours au lecteur en utilisant "vous" (jamais "tu").
Tu écris en français québécois.
Tu mentionnes Topal Électrique naturellement dans le corps du texte (2-3 fois maximum).
Tu inclus un appel à l'action clair vers /contact à la fin.
Tu mets en avant les certifications (RBQ, CMEQ), les 20+ ans d'expérience et le service Grand Montréal.
Tu structures l'article avec des sous-titres H2 et H3 et une conclusion avec CTA.`,
    en: `You are the content writer for Topal Électrique, certified master electricians in Montreal.
Your tone is warm, expert and action-oriented. Always address the reader using "you".
Write in Canadian English.
Mention Topal Électrique naturally in the body (2-3 times maximum).
Include a clear call to action toward /contact at the end.
Highlight certifications (RBQ, CMEQ), 20+ years of experience and Greater Montreal service area.
Structure the article with H2 and H3 subheadings and a conclusion with CTA.`,
  },
};

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9-]/g, '-')     // non-alphanumeric → hyphen
    .replace(/-+/g, '-')              // collapse multiple hyphens
    .replace(/^-|-$/g, '');           // trim leading/trailing hyphens
}

export async function generateArticle(
  keyword: string,
  articleType: ArticleType,
  locale: 'fr' | 'en',
  internalLinks: InternalLink[],
  newsContext?: { title: string; summary: string; url: string }
): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const basePath = locale === 'fr' ? '/conseils' : '/blog';

  const linkContext =
    internalLinks.length > 0
      ? locale === 'fr'
        ? `\n\nIncorpore naturellement 2-3 liens internes vers ces articles existants du site (utilise le slug dans le href):\n${internalLinks.map((l) => `- "${l.title}" → ${basePath}/${l.slug}`).join('\n')}`
        : `\n\nNaturally incorporate 2-3 internal links to these existing site articles (use the slug in the href):\n${internalLinks.map((l) => `- "${l.title}" → ${basePath}/${l.slug}`).join('\n')}`
      : '';

  const newsContext_ = newsContext
    ? locale === 'fr'
      ? `\n\nContexte de l'actualité à traiter:\nTitre: ${newsContext.title}\nRésumé: ${newsContext.summary}\nSource: ${newsContext.url}`
      : `\n\nNews context to cover:\nTitle: ${newsContext.title}\nSummary: ${newsContext.summary}\nSource: ${newsContext.url}`
    : '';

  const currentDate = new Date().toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const userPrompt =
    locale === 'fr'
      ? `Nous sommes le ${currentDate}. Rédige un article SEO complet en français québécois sur le sujet suivant: "${keyword}"${newsContext_}${linkContext}

Inclus 2-3 liens sortants vers des sources autoritaires pertinentes parmi celles-ci (utilise des balises <a href="URL" target="_blank" rel="noopener noreferrer">texte ancre</a>) : rbq.gouv.qc.ca, cmeq.org, hydroquebec.com, nrcan.gc.ca, publications.gc.ca. Ajoute ces liens uniquement lorsque tu mentionnes une réglementation, une norme ou un programme officiel.


Structure OBLIGATOIRE du champ "content":
1. Un bloc résumé GEO au tout début (avant tout autre contenu) sous cette forme exacte:
   <aside class="ai-overview"><strong>En bref</strong><ul><li>Point clé 1</li><li>Point clé 2</li><li>Point clé 3</li><li>Point clé 4</li></ul></aside>
2. Introduction (1 paragraphe accrocheur)
3. Minimum 5 sections H2 avec contenu détaillé
4. Une section H2 "Questions fréquentes" avec 4-5 questions/réponses en <details><summary>Question</summary><p>Réponse</p></details>
5. Conclusion avec appel à l'action

Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte (pas de markdown, pas de texte avant ou après):
{
  "title": "Titre principal H1 (60-70 caractères)",
  "meta_title": "Meta title SEO (55-60 caractères, inclure Montréal ou Québec)",
  "meta_description": "Meta description (150-160 caractères, inclure un CTA)",
  "slug": "slug-url-en-francais-sans-accents",
  "excerpt": "Résumé de 2-3 phrases (150-200 caractères)",
  "content": "Contenu HTML complet (1500-2000 mots) avec balises <h2>, <h3>, <p>, <ul>, <li>, <strong>, <aside>, <details>, <summary>. Minimum 5 sections H2.",
  "category": "residential|commercial|regulations|advice|trends",
  "reading_time": 8
}`
      : `Today is ${currentDate}. Write a complete SEO article in Canadian English on the topic: "${keyword}". Write entirely in English regardless of the topic keyword language.${newsContext_}${linkContext}

Include 2-3 outbound links to authoritative sources (use <a href="URL" target="_blank" rel="noopener noreferrer">anchor text</a> tags) from: rbq.gouv.qc.ca, cmeq.org, hydroquebec.com, nrcan.gc.ca. Add these links only when referencing a regulation, standard, or official program.

MANDATORY content structure in the "content" field:
1. A GEO summary block at the very top (before any other content) in this exact format:
   <aside class="ai-overview"><strong>Quick Summary</strong><ul><li>Key point 1</li><li>Key point 2</li><li>Key point 3</li><li>Key point 4</li></ul></aside>
2. Introduction paragraph
3. Minimum 5 H2 sections with detailed content
4. A "Frequently Asked Questions" H2 section with 4-5 Q&As using <details><summary>Question</summary><p>Answer</p></details>
5. Conclusion with call to action

Return ONLY a valid JSON object with this exact structure (no markdown, no text before or after):
{
  "title": "Main H1 title (60-70 characters)",
  "meta_title": "SEO meta title (55-60 characters, include Montreal or Quebec)",
  "meta_description": "Meta description (150-160 characters, include a CTA)",
  "slug": "english-only-url-slug-no-accents-no-french-words",
  "excerpt": "2-3 sentence summary (150-200 characters)",
  "content": "Full HTML content (1500-2000 words) with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <aside>, <details>, <summary> tags. Minimum 5 H2 sections.",
  "category": "residential|commercial|regulations|advice|trends",
  "reading_time": 8
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
      max_tokens: 6000,
      system: SYSTEM_PROMPTS[articleType][locale],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';

  let parsed: GeneratedArticle;
  try {
    parsed = JSON.parse(text) as GeneratedArticle;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]) as GeneratedArticle;
    else throw new Error('Failed to parse Claude response as JSON');
  }

  // Sanitize slug — strip accents, special chars, ensure lowercase hyphenated
  parsed.slug = sanitizeSlug(parsed.slug);

  // Validate category — fall back to 'advice' if Claude returned something unexpected
  if (!VALID_CATEGORIES.has(parsed.category)) {
    parsed.category = 'advice';
  }

  // Hard clamp meta fields to Ahrefs-safe lengths
  if (parsed.meta_title && parsed.meta_title.length > 60) {
    parsed.meta_title = parsed.meta_title.slice(0, 57).trimEnd() + '…';
  }
  if (parsed.meta_description && parsed.meta_description.length > 160) {
    parsed.meta_description = parsed.meta_description.slice(0, 157).trimEnd() + '…';
  }

  return parsed;
}
