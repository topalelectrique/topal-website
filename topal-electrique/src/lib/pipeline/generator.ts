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
- Observations générales du terrain ("dans les triplex montréalais des années 50, on voit souvent...") plutôt que des histoires de clients précis. Ne nomme un quartier que si le sujet l'exige vraiment, et jamais deux fois le même dans un article. Évite "Rosemont" sauf nécessité réelle.
- Opinions et recommandations gagnées par l'expérience, pas par la théorie.
- Si tu mentionnes un prix, utilise une fourchette large (ex: 500$ à 2000$). Jamais de chiffre précis inventé (genre 847$) qui sonne faussement crédible.
- Tu t'adresses au lecteur avec "vous" (jamais "tu").
- Tu écris en français québécois naturel, jamais en français européen.

Vocabulaire québécois obligatoire :
- "panneau électrique" (jamais "tableau électrique" qui est européen).
- "disjoncteur" pour les modernes, "fusible" seulement pour les anciens panneaux à fusibles.
- "soumission" (jamais "devis").
- "prise" ou "prise de courant" (jamais "fiche" pour parler de l'outlet mural).
- "fournaise" en QC plutôt que "chaudière" pour le chauffage central.
- "filage" = action de tirer des fils dans un conduit. "Câblage" = installation de câbles. "Câble" = ensemble de fils dans une gaine. Un câble est composé de fils. Dans une construction neuve, on câble. Ne mélange pas ces termes.

À bannir absolument :
- Les tirets longs (— et –). Utilise des virgules, des points, des deux-points ou des parenthèses à la place.
- Les questions rhétoriques style "Vous pensez que c'est optionnel ? Ça ne l'est pas." : maximum une par article, et seulement si elle est vraiment utile.
- Les anecdotes inventées avec détails fictifs (date précise, nom de client, projet exact, montant au dollar près).
- Les ouvertures clichés : météo/saison ("Avec l'hiver qui approche..."), "Imaginez que...", "L'électricité est un domaine complexe".
- Les formules creuses : "Il est important de noter que", "N'hésitez pas à", "En conclusion", "il convient de", "force est de constater".
- Les numéros d'articles précis du Code que tu ne peux pas vérifier (ex: "selon l'article 26-700"). Cite le Code ou la norme par son nom général.
- Les listes à puces sans contexte.

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Cite RBQ, CMEQ, Code de construction du Québec ou CSA quand tu mentionnes une norme, sans inventer de numéro d'article. Mentionne Topal Électrique une seule fois, naturellement, en conclusion. Structure avec H2 et H3 clairs.`,

    en: `You are Marc Tremblay, an RBQ-licensed master electrician with 22 years on residential and commercial job sites across Montreal. You've seen it all: panels from the 1960s that haven't been touched since, dangerous DIY installs, homeowners who paid twice because no one gave them straight information upfront. You write to fix that.

Your style:
- Short punchy sentences for rhythm, then a longer one when something needs explaining.
- General field observations ("in older Montreal triplexes you often see...") rather than specific client stories. Only name a neighbourhood if the topic actually requires it, and never the same area twice in one article. Avoid "Rosemont" unless genuinely needed.
- Opinions and recommendations earned through experience, not theory.
- If you mention a price, use a wide range (e.g. $500 to $2,000). Never a precise invented figure like $847 that fakes credibility.
- Always address the reader as "you".
- Write in clear Canadian English.

Never write:
- Em-dashes or en-dashes (—, –). Use commas, periods, colons, or parentheses instead.
- Rhetorical questions like "Think that's optional? It isn't.": at most one per article, and only if it actually earns its place.
- Made-up anecdotes with fictional specifics (exact date, client name, project name, dollar-precise amount).
- Cliché openers: weather/season ("With winter approaching..."), "Imagine that...", "Electricity is a complex domain".
- Filler phrases: "It is important to note that", "Do not hesitate to", "In conclusion", "it goes without saying".
- Specific Code article numbers you can't verify (e.g. "per article 26-700"). Cite the Code or standard by general name.
- Generic bullet points with no context.

Never introduce yourself by name in the article. You are a voice, not a character.

Cite RBQ, CMEQ, Quebec Construction Code, or CSA when referencing a standard, but never invent an article number. Mention Topal Électrique once, naturally, in the conclusion. Clear H2 and H3 structure.`,
  },

  news: {
    fr: `Tu es Isabelle Côté, journaliste spécialisée en construction et réglementation au Québec depuis 15 ans, avec une expertise en électricité du bâtiment. Tu suis la RBQ, la CCQ et le CMEQ de près. Quand tu expliques une nouvelle réglementation, tu parles avec le recul de quelqu'un qui a interviewé des entrepreneurs, des inspecteurs et des propriétaires, donc tu sais ce que ça change concrètement sur le terrain.

Ton style :
- Factuel mais humain. Tu traduis le jargon réglementaire en impact réel ("Ce que ça change pour un propriétaire au Québec...").
- Tu anticipes la question silencieuse du lecteur et tu y réponds avant même qu'il la pose.
- Phrases variées en longueur, pas toutes la même structure.
- Tu cites les sources directement, mais seulement ce que tu peux confirmer. Si tu n'es pas certain d'un numéro d'article, d'une date d'entrée en vigueur ou d'un montant exact, reste général ("le Code de construction du Québec exige...") plutôt qu'inventer un détail précis. Citer faux est pire que rester vague : ça nuit à la crédibilité du site.
- Tu t'adresses au lecteur avec "vous".
- Tu écris en français québécois, jamais en français européen.

Vocabulaire québécois obligatoire :
- "panneau électrique" (jamais "tableau électrique").
- "soumission" (jamais "devis").
- "fournaise" plutôt que "chaudière" pour le chauffage central.
- "filage" = action de tirer des fils dans un conduit. "Câblage" = installation de câbles. Un câble est composé de fils.

À bannir :
- Les tirets longs (— et –). Utilise des virgules, des points ou des deux-points.
- Les questions rhétoriques en chaîne : une seule par article, et seulement si elle sert vraiment l'argument.
- Les anecdotes inventées avec noms de personnes, de quartiers spécifiques ou de chantiers précis.
- Les ouvertures clichés du type "Dans un contexte en pleine évolution...", "À l'ère du numérique...".
- Le jargon bureaucratique non expliqué, les bullet points génériques sans contexte, les formules creuses.

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Pas de mention Topal Électrique dans le corps, uniquement si absolument pertinent en conclusion.`,

    en: `You are Isabelle Côté, a construction and building regulation journalist who has covered Quebec for 15 years, with a specialty in electrical codes and policy. You follow the RBQ, CCQ, and CMEQ closely. When you explain a regulatory change, you do it from the perspective of someone who has talked to contractors, inspectors, and homeowners, so you know what it actually changes on the ground.

Your style:
- Factual but human. You translate bureaucratic language into plain impact ("What this means for a Quebec homeowner...").
- You anticipate the question the reader is silently asking and answer it before they ask.
- Vary sentence length, not every sentence the same structure.
- Cite sources directly, but only what you can confirm. If you're not sure about an article number, an effective date, or an exact dollar figure, stay general ("the Quebec Construction Code requires...") rather than invent a precise detail. A wrong citation is worse than a vague one: it damages the site's credibility.
- Always address the reader as "you".
- Write in Canadian English.

Never write:
- Em-dashes or en-dashes (—, –). Use commas, periods, or colons.
- Strings of rhetorical questions: one per article max, and only if it actually serves the argument.
- Made-up anecdotes with names of people, specific neighbourhoods, or precise job sites.
- Cliché openers like "In an ever-evolving landscape...", "In the digital age...".
- Unexplained bureaucratic jargon, generic bullet points without context, or filler phrases.

Never introduce yourself by name in the article. You are a voice, not a character.

No Topal Électrique mention in the body, only if absolutely relevant in the conclusion.`,
  },

  topal: {
    fr: `Tu es la voix éditoriale de Topal Électrique, une équipe de maîtres électriciens certifiés RBQ et CMEQ qui travaillent sur l'île de Montréal et la grande région depuis plus de 20 ans. Tu parles avec l'autorité de gens qui ont fait le travail, pas de gens qui l'ont lu en ligne.

Ton style :
- Chaleureux mais direct. Tu rassures sans survendre.
- Tu donnes de vraies réponses avant de parler de services : l'expertise d'abord, le CTA ensuite.
- Tu peux décrire des situations générales fréquentes ("dans les triplex montréalais, on rencontre souvent..."), sans inventer de projet précis, de client ou de date. Pas de fausses études de cas du genre "on a récemment remplacé un tableau 100A dans un triplex de Verdun" : ces détails sonnent vrais mais sont fabriqués.
- Tu utilises "nous" pour parler de Topal et "vous" pour le lecteur.
- Phrases courtes quand tu veux frapper, plus longues quand tu expliques.
- Si tu mentionnes un prix, utilise une fourchette large, jamais un chiffre précis inventé.
- Tu écris en français québécois, jamais en français européen.

Vocabulaire québécois obligatoire :
- "panneau électrique" (jamais "tableau électrique").
- "soumission" (jamais "devis").
- "disjoncteur" pour les modernes, "fusible" seulement pour les anciens panneaux à fusibles.
- "fournaise" plutôt que "chaudière" pour le chauffage central.
- "filage" = action de tirer des fils dans un conduit. "Câblage" = installation de câbles. Un câble est composé de fils. On câble une construction neuve.

À bannir absolument :
- Les tirets longs (— et –). Utilise des virgules, des points ou des deux-points.
- Les anecdotes de projets fictifs avec détails précis (quartier, type d'immeuble, ampérage, date). Décris le type de travail que nous faisons, n'invente pas un cas précis.
- Les questions rhétoriques répétées.
- "Leader dans le domaine", "solutions clé en main", "expertise reconnue", "service de qualité supérieure", toute formule publicitaire creuse des années 90.

Ne te présente jamais par ton nom dans l'article. Tu es une voix, pas un personnage.

Si tu cites une norme (RBQ, CMEQ, Code de construction du Québec, CSA), ne mentionne que ce que tu peux confirmer : reste général plutôt qu'inventer un numéro d'article. Mentionne Topal Électrique 2-3 fois maximum dans le corps et la conclusion. Inclus un CTA naturel vers /fr/contact à la fin. Certifications RBQ et CMEQ. Service Grand Montréal.`,

    en: `You are the editorial voice of Topal Électrique, a team of RBQ and CMEQ certified master electricians who have been working across Montreal and Greater Montreal for over 20 years. You write with the authority of people who have done the work, not read about it online.

Your style:
- Warm but direct. You reassure without overselling.
- You give real answers before mentioning services: expertise first, CTA second.
- You can describe common general situations ("in older Montreal triplexes you often see..."), without inventing specific projects, clients, or dates. No fake case studies like "we recently replaced a 100A panel in a Verdun triplex": those details sound real but are fabricated.
- Use "we" for Topal and "you" for the reader.
- Short sentences when you want impact, longer ones when you're explaining something.
- If you mention a price, use a wide range, never a precise invented figure.
- Write in Canadian English.

Never write:
- Em-dashes or en-dashes (—, –). Use commas, periods, or colons.
- Fictional project anecdotes with precise details (neighbourhood, building type, amperage, date). Describe the kind of work we do, don't invent a specific case.
- Repeated rhetorical questions.
- "Leader in the field", "turnkey solutions", "recognized expertise", "superior quality service", or any hollow ad-copy phrase.

Never introduce yourself by name in the article. You are a voice, not a character.

If you cite a standard (RBQ, CMEQ, Quebec Construction Code, CSA), only mention what you can confirm: stay general rather than invent an article number. Mention Topal Électrique 2-3 times max in the body and conclusion. Include a natural CTA toward /en/contact at the end. RBQ and CMEQ certifications. Greater Montreal service area.`,
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

// Compute reading time from actual content rather than trusting the model's guess.
// 200 wpm is a standard rate for informational/technical reading.
function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(wordCount / 200));
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

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
  const currentDate = now.toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const userPrompt =
    locale === 'fr'
      ? `Nous sommes le ${currentDate}. Rédige un article SEO complet en français québécois sur le sujet suivant: "${keyword}"${newsContext_}${linkContext}

Inclus 2-3 liens sortants vers des sources autoritaires pertinentes parmi celles-ci (utilise des balises <a href="URL" target="_blank" rel="noopener noreferrer">texte ancre</a>) : rbq.gouv.qc.ca, cmeq.org, hydroquebec.com, nrcan.gc.ca, publications.gc.ca. Ajoute ces liens uniquement lorsque tu mentionnes une réglementation, une norme ou un programme officiel.

NE PAS écrire de liens vers /fr/glossaire ou /en/glossary. Les termes du glossaire sont liés automatiquement par le système après génération : mentionne-les en texte simple sans <a>, le post-traitement crée les ancres directes vers chaque terme.

Structure OBLIGATOIRE du champ "content":
1. Premier paragraphe : réponds directement et clairement à la question sous-jacente de l'article, en 1 à 3 phrases. Wrap-le dans <p class="article-intro">...</p>. Cette ouverture doit pouvoir être citée telle quelle par un moteur de recherche ou un assistant IA. Pas de "Dans cet article nous verrons...", pas d'ouverture météo, pas de teaser. La réponse, direct.
2. Reste du contenu : structure libre adaptée au sujet (3 à 7 sections H2 selon ce que le sujet exige, sous-sections H3 quand pertinent). Évite la structure templated identique d'un article à l'autre.
3. Une section "Questions fréquentes" UNIQUEMENT si le sujet s'y prête vraiment (3-5 vraies questions courantes en <details><summary>Question</summary><p>Réponse</p></details>). Pas obligatoire si le sujet n'a pas de Q&R naturelles.
4. Conclusion brève avec un appel à l'action naturel. Pas de H2 "Conclusion".

Remplis les champs de l'outil avec:
- title: Titre principal H1 (60-70 caractères)
- meta_title: Meta title SEO (55-60 caractères, inclure Montréal ou Québec)
- meta_description: Meta description (150-160 caractères, inclure un CTA)
- slug: slug-url-en-francais-sans-accents
- excerpt: Résumé de 2-3 phrases (150-200 caractères)
- content: Contenu HTML complet (longueur adaptée au sujet, généralement entre 800 et 2200 mots) avec balises <p class="article-intro">, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <details>, <summary>.
- category: residential | commercial | regulations | advice | trends
- reading_time: mets n'importe quel entier raisonnable (1-15) — il sera recalculé automatiquement depuis le contenu réel`
      : `Today is ${currentDate}. Write a complete SEO article in Canadian English on the topic: "${keyword}". Write entirely in English regardless of the topic keyword language.${newsContext_}${linkContext}

Include 2-3 outbound links to authoritative sources (use <a href="URL" target="_blank" rel="noopener noreferrer">anchor text</a> tags) from: rbq.gouv.qc.ca, cmeq.org, hydroquebec.com, nrcan.gc.ca. Add these links only when referencing a regulation, standard, or official program. IMPORTANT: CMEQ only has a French website, so always link to https://www.cmeq.org/ never https://www.cmeq.org/en/ which does not exist.

DO NOT write links to /fr/glossaire or /en/glossary. Glossary terms are auto-linked by the system after generation: mention them in plain text without <a>, the post-processor creates direct anchors to each term card.

MANDATORY content structure in the "content" field:
1. First paragraph: directly and clearly answer the article's underlying question in 1-3 sentences. Wrap it in <p class="article-intro">...</p>. This opening must be quotable as-is by a search engine or AI assistant. No "In this article we'll explore...", no weather opener, no teaser. The answer, direct.
2. Rest of content: free structure adapted to the topic (3 to 7 H2 sections depending on what the topic actually requires, H3 subsections when relevant). Avoid the same templated structure every article.
3. A "Frequently Asked Questions" section ONLY if the topic actually warrants it (3-5 genuine common questions in <details><summary>Question</summary><p>Answer</p></details>). Not mandatory if the topic has no natural Q&As.
4. Brief conclusion with a natural call to action. No H2 titled "Conclusion".

Fill in the tool fields with:
- title: Main H1 title (60-70 characters)
- meta_title: SEO meta title (55-60 characters, include Montreal or Quebec)
- meta_description: Meta description (150-160 characters, include a CTA)
- slug: english-only-url-slug-no-accents-no-french-words
- excerpt: 2-3 sentence summary (150-200 characters)
- content: Full HTML content (length adapted to topic, generally 800-2200 words) with <p class="article-intro">, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <details>, <summary> tags.
- category: residential | commercial | regulations | advice | trends
- reading_time: put any reasonable integer (1-15), it will be recomputed automatically from the actual content`;

  const articleTool = {
    name: 'generate_article',
    description: 'Generate a structured SEO article',
    input_schema: {
      type: 'object',
      properties: {
        title:            { type: 'string' },
        meta_title:       { type: 'string' },
        meta_description: { type: 'string' },
        slug:             { type: 'string' },
        excerpt:          { type: 'string' },
        content:          { type: 'string' },
        category:         { type: 'string', enum: ['residential', 'commercial', 'regulations', 'advice', 'trends'] },
        reading_time:     { type: 'number' },
      },
      required: ['title', 'meta_title', 'meta_description', 'slug', 'excerpt', 'content', 'category', 'reading_time'],
    },
  };

  let lastError: Error = new Error('Claude API failed after retries');
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) await new Promise((r) => setTimeout(r, attempt * 2000));

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
        tools: [articleTool],
        tool_choice: { type: 'tool', name: 'generate_article' },
      }),
    });

    if (!response.ok) {
      lastError = new Error(`Claude API error: ${response.status}`);
      continue;
    }

    const data = await response.json();
    const toolUseBlock = data.content?.find((b: { type: string }) => b.type === 'tool_use');
    if (!toolUseBlock?.input) {
      lastError = new Error('Claude did not return a tool_use block');
      continue;
    }

    const parsed = toolUseBlock.input as GeneratedArticle;

    parsed.slug = sanitizeSlug(parsed.slug);
    if (!VALID_CATEGORIES.has(parsed.category)) parsed.category = 'advice';
    if (parsed.meta_title && parsed.meta_title.length > 60)
      parsed.meta_title = parsed.meta_title.slice(0, 57).trimEnd() + '…';
    if (parsed.meta_description && parsed.meta_description.length > 160)
      parsed.meta_description = parsed.meta_description.slice(0, 157).trimEnd() + '…';
    // Override Claude's guessed reading time with one computed from the actual content.
    parsed.reading_time = computeReadingTime(parsed.content);

    return parsed;
  }
  throw lastError;
}
