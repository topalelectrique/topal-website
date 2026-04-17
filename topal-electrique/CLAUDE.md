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
- JSON-LD: `LocalBusiness + Electrician` schema in `src/components/JsonLd.tsx` (homepage only)
- FAQPage schema inline in `src/components/pages/FAQPage.tsx`
- Sitemap: `src/app/sitemap.ts` — asymmetric FR/EN paths
- Robots: `src/app/robots.ts`

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

## See also
- `PIPELINE.md` — automated SEO content pipeline (blog + cross-posting system)
