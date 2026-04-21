# Topal Électrique — Project Overview

## What this is
Next.js 15 bilingual website (FR/EN) for Topal Électrique, a Montreal electrician company.
Deployed on **Render**. Domain: `topalelectrique.ca`.

## Stack
- **Framework**: Next.js 15 App Router
- **i18n**: next-intl v4.8.3 — default locale is `fr`, second locale `en`
- **Styling**: Tailwind CSS v4 with `@theme` tokens in `globals.css`
- **Fonts**: Rajdhani (headings) + Inter (body) via `next/font/google`
- **Smooth scroll**: Lenis v1.3.18 via `LenisProvider`
- **Animations**: Framer Motion
- **Contact form**: Web3Forms (access key in `ContactPage.tsx`)
- **Icons**: Lucide React

## Routing & i18n
- All pages live under `src/app/[locale]/`
- Locale-specific slugs defined in `src/i18n/routing.ts` (e.g. `/fr/a-propos` ↔ `/en/about`)
- Navigation uses `Link` from `@/i18n/navigation` (not next/link directly)
- Translations in `messages/fr.json` and `messages/en.json`
- Middleware at `src/middleware.ts` — matcher: `/((?!_next|_vercel|.*\\..*).*)`

## SEO setup
- Per-page `generateMetadata` with canonical, hreflang (fr-CA / en-CA), OG, Twitter
- Layout `generateMetadata` only sets `metadataBase` + `robots` — never canonical
- OG image: `public/og-image.png` (1200×630) referenced in all page metadata
- JSON-LD: `LocalBusiness` schema in `src/components/JsonLd.tsx` (homepage only)
- FAQPage schema inline in `src/components/pages/FAQPage.tsx`
- Sitemap: `src/app/sitemap.ts` — asymmetric FR/EN paths
- Robots: `src/app/robots.ts`
- IndexNow: auto-submitted on new article publish via `publisher.ts`; key endpoint at `/api/indexnow/key`; requires `INDEXNOW_KEY` env var on Render

## Key constants
All in `src/lib/constants.ts`: SITE_URL, PHONE, PHONE_LINK, EMAIL, ADDRESS, SOCIAL_LINKS

## CSS notes
- `html, body` use `overflow-x: clip` (NOT hidden) — clip doesn't break `position: sticky`
- Color tokens defined in `globals.css` under `@theme`
- `pulse-glow` animation used on primary CTA buttons

## Important decisions made
- `overflow-x: clip` over `hidden` — fixes ProjectsPreview horizontal scroll + sticky
- Layout metadata simplified to avoid stamping wrong canonical on every page
- All hardcoded French strings removed from components — everything goes through next-intl

---

## Checklist: adding a new static page

Every new page under `src/app/[locale]/` must have:

- [ ] `generateMetadata()` with:
  - `title` — under 60 characters, primary keyword first
  - `description` — 120–160 characters, include a soft CTA
  - `alternates.canonical` — locale-conditional absolute URL
  - `alternates.languages` — both `fr-CA` and `en-CA` pointing to their respective paths
  - `openGraph.images` — always include, use `/og-image.png` as fallback
  - `openGraph.url` — must match canonical
- [ ] Exactly one `<h1>` tag in the page component
- [ ] Route registered in `src/i18n/routing.ts` with both FR and EN paths
- [ ] Both FR and EN paths added to `src/app/sitemap.ts`
- [ ] Translations added to both `messages/fr.json` and `messages/en.json`

---

## Checklist: hreflang rules (learned the hard way)

- **Never** point hreflang to a list/index page as a fallback for a missing translation.
  That creates "missing reciprocal hreflang" errors — the list page doesn't link back to the article.
- When a translation doesn't exist yet: declare only the self-referencing hreflang, omit the other locale.
- Every page in a hreflang pair must reference all variants including itself (A→B and B→A).
- Article hreflang is driven by `pair_id` in Supabase. If `pair_id` is null or the paired article
  doesn't exist, the code now falls back to self-only hreflang (see `conseils/[slug]/page.tsx`).

---

## Checklist: pipeline-generated articles

The pipeline (`src/lib/pipeline/`) auto-generates FR + EN article pairs. Known failure modes
and their fixes — all already implemented, listed here so they stay fixed:

| What can go wrong | Why | Fix in place |
|---|---|---|
| French slug on EN article | Claude used French system prompt for both locales | Locale-specific system prompts in `generator.ts` |
| EN article links to `/conseils/` | Path was hardcoded FR | `basePath` is now locale-aware in `generator.ts` |
| Accented chars in slug (é, è…) → 404 | No sanitization on Claude output | `sanitizeSlug()` strips accents after every generation |
| Invalid category value | Claude occasionally drifts | Whitelist validation, falls back to `'advice'` |
| FR links injected into EN articles | `findInternalLinks` called with `'fr'` for both | `route.ts` now fetches EN links separately for EN generation |
| Wrong-locale slugs in old articles | Pre-fix pipeline bug | 301 redirects in `middleware.ts` for the 10 affected URLs |
| Redirect chains (307→301) | Ahrefs crawls non-prefixed `/conseils/` URLs, next-intl adds locale prefix before our redirect fires | Non-prefixed redirects added to `middleware.ts` |

**When adding new redirect entries to `middleware.ts`:**
Always add both the locale-prefixed version (`/fr/conseils/[slug]`) AND the non-prefixed
version (`/conseils/[slug]`) to avoid 307→301 chains.

---

## Schema.org rules (learned from Ahrefs validation errors)

- `@type` must be a single valid schema.org type string — not an array with invented types
  (`'Electrician'` is not a schema.org type; use `'LocalBusiness'`)
- `geoRadius` must be a number, not a string (`50000` not `'50000'`)
- `paymentAccepted` values must be schema.org enums: `'Cash'`, `'CreditCard'`, `'DebitCard'`
- `hasCredential` belongs on the `Person` root, not nested inside `worksFor`
- Always include `og:image` — even on non-article pages (use `/og-image.png` as default)

---

## Render deployment notes

- RAM limit: 512 MB on current plan. Never use `Promise.all` for two Claude API calls —
  run FR and EN article generation sequentially with `await`.
- After each redeploy, old `/_next/static/chunks/[hash].js` files no longer exist.
  Ahrefs may report 502 on old chunk URLs — this is a crawl artifact, not a real error.
  It clears itself once Ahrefs recrawls the current HTML.
- 5xx errors in Ahrefs → check Render dashboard logs filtered by `error` or `500`.

---

## See also
- `PIPELINE.md` — automated SEO content pipeline (blog + cross-posting system)
