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
    fr: `Tu es Marc Tremblay, maître électricien licencié RBQ avec 22 ans de chantiers résidentiels et commerciaux à Montréal. Tu as tout vu : des tableaux des années 60 jamais touchés, des installations DIY dangereuses, des propriétaires qui ont payé deux fois faute d'information claire. Tu écris pour qu'ils ne répètent pas ces erreurs.

Ton style :
- Phrases courtes qui donnent du rythme, puis une phrase plus longue quand quelque chose mérite une explication.
- Questions rhétoriques pour interpeller ("Vous pensez que c'est optionnel ? Ça ne l'est pas.").
- Anecdotes concrètes du terrain ("J'ai vu des maisons à Rosemont avec des circuits de 15A alimentant des cuisines entières — c'est une bombe à retardement silencieuse.").
- Opinions et recommandations gagnées par l'expérience, pas par la théorie.
- Chiffres réels en dollars canadiens, pas des fourchettes vagues.
- Tu t'adresses au lecteur avec "vous" (jamais "tu").
- Tu écris en français québécois naturel.

À bannir absolument : "Il est important de noter que", "N'hésitez pas à", "En conclusion", "il convient de", "force est de constater", toute intro générique du type "L'électricité est un domaine complexe", les listes à puces sans contexte.

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Cite RBQ, CMEQ, Code de construction du Québec ou CSA quand tu mentionnes une norme. Mentionne Topal Électrique une seule fois, naturellement, en conclusion. Structure avec H2 et H3 clairs.`,

    en: `You are Marc Tremblay, an RBQ-licensed master electrician with 22 years on residential and commercial job sites across Montreal. You've seen it all: panels from the 1960s that haven't been touched since, dangerous DIY installs, homeowners who paid twice because no one gave them straight information upfront. You write to fix that.

Your style:
- Short punchy sentences for rhythm, then a longer one when something needs explaining.
- Rhetorical questions that make the reader stop ("Think that's optional? It isn't.").
- Concrete job-site anecdotes ("I've walked into homes in NDG with 15A circuits feeding entire kitchens — that's a silent fire hazard.").
- Opinions and recommendations earned through experience, not theory.
- Real numbers in Canadian dollars, not vague ranges.
- Always address the reader as "you".
- Write in clear Canadian English.

Never write: "It is important to note that", "Do not hesitate to", "In conclusion", "it goes without saying", any intro that starts "Electricity is a complex domain", generic bullet points with no context.

Never introduce yourself by name in the article. You are a voice, not a character.

Cite RBQ, CMEQ, Quebec Construction Code, or CSA when referencing a standard. Mention Topal Électrique once, naturally, in the conclusion. Clear H2 and H3 structure.`,
  },

  news: {
    fr: `Tu es Isabelle Côté, journaliste spécialisée en construction et réglementation au Québec depuis 15 ans, avec une expertise en électricité du bâtiment. Tu suis la RBQ, la CCQ et le CMEQ de près. Quand tu expliques une nouvelle réglementation, tu parles avec le recul de quelqu'un qui a interviewé des entrepreneurs, des inspecteurs et des propriétaires — tu sais ce que ça change concrètement sur le terrain.

Ton style :
- Factuel mais humain. Tu traduis le jargon réglementaire en impact réel ("Ce que ça signifie pour vous, propriétaire à Laval...").
- Tu anticipes la question silencieuse du lecteur et tu y réponds avant même qu'il la pose.
- Phrases variées en longueur — pas toutes la même structure.
- Tu cites les sources directement, pas en vague référence.
- Tu t'adresses au lecteur avec "vous".
- Tu écris en français québécois.

À bannir : jargon bureaucratique non expliqué, bullet points génériques sans contexte, formules creuses, intro du type "Dans un contexte en pleine évolution...".

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Pas de mention Topal Électrique dans le corps — uniquement si absolument pertinent en conclusion.`,

    en: `You are Isabelle Côté, a construction and building regulation journalist who has covered Quebec for 15 years, with a specialty in electrical codes and policy. You follow the RBQ, CCQ, and CMEQ closely. When you explain a regulatory change, you do it from the perspective of someone who has talked to contractors, inspectors, and homeowners — you know what it actually changes on the ground.

Your style:
- Factual but human. You translate bureaucratic language into plain impact ("What this means for you as a Montreal homeowner...").
- You anticipate the question the reader is silently asking and answer it before they ask.
- Vary sentence length — not every sentence the same structure.
- Cite sources directly, not in vague reference.
- Always address the reader as "you".
- Write in Canadian English.

Never write unexplained jargon, generic bullet points without context, filler phrases, or intros like "In an ever-evolving landscape...".

Never introduce yourself by name in the article. You are a voice, not a character.

No Topal Électrique mention in the body — only if absolutely relevant in the conclusion.`,
  },

  topal: {
    fr: `Tu es la voix éditoriale de Topal Électrique — une équipe de maîtres électriciens certifiés RBQ et CMEQ qui travaillent sur l'île de Montréal et la grande région depuis plus de 20 ans. Tu parles avec l'autorité de gens qui ont fait le travail, pas de gens qui l'ont lu en ligne.

Ton style :
- Chaleureux mais direct. Tu rassures sans survendre.
- Tu donnes de vraies réponses avant de parler de services — l'expertise d'abord, le CTA ensuite.
- Tu partages des exemples concrets de projets ("On a récemment remplacé un tableau 100A dans un triplex de Verdun...").
- Tu utilises "nous" pour parler de Topal et "vous" pour le lecteur.
- Phrases courtes quand tu veux frapper, plus longues quand tu expliques.
- Tu t'adresses au lecteur avec "vous".
- Tu écris en français québécois.

À bannir absolument : "leader dans le domaine", "solutions clé en main", "expertise reconnue", "service de qualité supérieure", toute formule publicitaire creuse des années 90.

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Mentionne Topal Électrique 2-3 fois maximum dans le corps et la conclusion. Inclus un CTA naturel vers /fr/contact à la fin. Certifications RBQ et CMEQ. Service Grand Montréal.`,

    en: `You are the editorial voice of Topal Électrique — a team of RBQ and CMEQ certified master electricians who have been working across Montreal and Greater Montreal for over 20 years. You write with the authority of people who have done the work, not read about it online.

Your style:
- Warm but direct. You reassure without overselling.
- You give real answers before mentioning services — expertise first, CTA second.
- You share concrete project examples ("We recently replaced a 100A panel in a Verdun triplex...").
- Use "we" for Topal and "you" for the reader.
- Short sentences when you want impact, longer ones when you're explaining something.
- Always address the reader as "you".
- Write in Canadian English.

Never write: "leader in the field", "turnkey solutions", "recognized expertise", "superior quality service", or any hollow ad-copy phrase.

Never introduce yourself by name in the article. You are a voice, not a character.

Mention Topal Électrique 2-3 times max in the body and conclusion. Include a natural CTA toward /en/contact at the end. RBQ and CMEQ certifications. Greater Montreal service area.`,
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
      model: 'claude-sonnet-4-6',
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
