# Topal Électrique — Automated SEO Pipeline

## Goal
Publish 2–3 SEO articles per week to `/fr/conseils` automatically, then cross-post summaries
to Facebook and Google Business Profile. Zero manual work after setup.

## Stack
| Layer | Tool |
|---|---|
| Database | Supabase (PostgreSQL) |
| Scheduler | Render Cron Jobs |
| Content generation | Claude Sonnet 4.6 (Anthropic) |
| Images | Unsplash API (UNSPLASH_ACCESS_KEY set on Render web service) |
| Facebook posts | Meta Graph API |
| GBP posts | Google Business Profile API (OAuth2) |
| Blog pages | Next.js ISR (revalidatePath on publish) |

## Cron schedule
- Monday 12:00 UTC (8am EDT) → `type: evergreen` (keyword from queue)
- Wednesday 12:00 UTC (8am EDT) → `type: topal` (branded, direct CTA)
- Friday 12:00 UTC (8am EDT) → `type: topal` (branded, direct CTA)

One Render Cron Job service, schedule `0 12 * * 1,3,5`, no body type — `getTypeFromDay()` in `route.ts` picks the type automatically.
Render Cron hits: `POST /api/pipeline/run` with header `x-pipeline-secret: $PIPELINE_SECRET`

Note: `maxDuration` is set to 300s — Sonnet generation takes ~2.5 min for FR+EN sequentially.

## RSS sources to scrape
- APCHQ feed
- RBQ (Régie du bâtiment du Québec)
- CCQ (Commission de la construction du Québec)
- CMEQ
- La Presse — section Habitation
- Google News RSS: `https://news.google.com/rss/search?q=construction+électricité+québec&hl=fr-CA`

## Content generation — 3 modes

**informational** (regulatory/RBQ/code articles)
Strictly neutral tone, facts only, cite the regulation, no sales language, mention Topal once max in conclusion.

**sales_funnel** (cost/advice articles e.g. "combien coûte un panneau 200A")
Start with the answer, build trust with expertise, soft CTA toward getting a quote at the end.

**topal** (Friday branded articles)
Direct CTA, mention Topal Électrique by name, link to /contact, highlight certifications + service area.

Each generated article must include: title, meta_title, meta_description, slug, excerpt, content (800–1200 words), category, 2–3 internal links to existing articles.

## Database schema

### `keywords` — evergreen queue (seed with 200 keywords)
```
id, keyword, category, priority INT, used_at TIMESTAMP
```
Categories: residential | commercial | regulations | advice | trends

### `articles`
```
id, slug (unique), title, meta_title, meta_description,
content, excerpt, category, type (evergreen|news|topal),
image_url, image_alt, locale (default: fr),
published_at, facebook_posted_at, gbp_posted_at, source_url
```

### `rss_sources`
```
id, name, url, active BOOLEAN
```

### `pipeline_runs` — audit log
```
id, ran_at, type, status (success|error), article_id, error TEXT
```

## File structure

```
src/lib/pipeline/
  scraper.ts       — fetch + parse RSS, score stories by keyword relevance
  generator.ts     — Claude API call with mode-aware system prompt
  imager.ts        — Unsplash keyword search, returns best image URL + alt
  linker.ts        — query articles table for 2-3 related slugs to inject
  publisher.ts     — insert to Supabase + call revalidatePath
  facebook.ts      — post summary to Facebook Page via Graph API
  gbp.ts           — post summary to GBP via Google API OAuth2

src/app/api/pipeline/run/route.ts   — orchestrator endpoint (POST, secret-protected)

src/app/[locale]/conseils/
  page.tsx                          — blog list, category filters
  [slug]/page.tsx                   — individual article, reads from Supabase
```

## Pipeline flow
```
Render Cron
  → POST /api/pipeline/run (x-pipeline-secret header)
    → Determine type from day or body param
    → [news]     scrape RSS → score by relevance → pick top story
    → [evergreen/topal] pull next unused keyword from DB (ORDER BY priority DESC, used_at ASC)
    → Call Claude API → receive {title, meta_title, meta_description, slug, content, excerpt, category}
    → Search Unsplash by keyword → pick first result
    → Query articles for internal links (2-3 slugs by category match)
    → Inject internal links into content
    → INSERT article into Supabase
    → Mark keyword as used (used_at = NOW())
    → revalidatePath('/fr/conseils') + revalidatePath('/fr/conseils/' + slug)
    → POST to Facebook (async, non-blocking)
    → POST to GBP (async, non-blocking)
    → INSERT into pipeline_runs (status, article_id)
```

## Fallbacks
| Failure | Fallback |
|---|---|
| RSS scrape fails | Fall back to evergreen keyword |
| Claude API fails | Retry 3× exponential backoff → log error → skip run |
| Unsplash fails | Use default placeholder per category |
| Facebook post fails | Log, retry next run, do not block article publish |
| GBP post fails | Same — async, non-blocking |

## Environment variables needed
```
ANTHROPIC_API_KEY
UNSPLASH_ACCESS_KEY
META_PAGE_ACCESS_TOKEN
META_PAGE_ID
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
GOOGLE_GBP_ACCOUNT_ID
GOOGLE_GBP_LOCATION_ID
SUPABASE_URL
SUPABASE_SERVICE_KEY
PIPELINE_SECRET
```

## New pages this adds to the site
- `/fr/conseils` — blog list with category filter tabs
- `/fr/conseils/[slug]` — individual article
- Homepage: last 3 articles displayed below existing sections
- 10–15 individual service pages at `/fr/services/[slug]`
- 25–30 location pages at `/fr/electricien-[secteur]`

## Content quality notes
- Articles must be 800–1200 words minimum — thin content hurts rankings
- Quebec-specific: use Quebec French, reference RBQ/CMEQ/CCQ, use local pricing
- Each article needs at least 2 internal links to existing site pages
- Avoid duplicate slugs — check DB before inserting

## Build order
1. Supabase schema + seed 200 keywords
2. Blog pages (list + article) — static shell first
3. Pipeline modules (scraper, generator, imager, linker)
4. publisher.ts + API route
5. Facebook + GBP cross-posting
6. Render Cron Jobs setup
