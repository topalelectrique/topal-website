import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({ ...routing, alternateLinks: false });

// Non-locale-prefixed static paths → next-intl would 307 these; we 301 directly.
// French-named paths always resolve to /fr/. Neutral paths (/contact) resolve to /fr/
// since FR is the default locale and these links come from FR content.
const STATIC_REDIRECTS: [string, string][] = [
  ['/',          '/fr'],
  ['/a-propos',  '/fr/a-propos'],
  ['/conseils',  '/fr/conseils'],
  ['/glossaire', '/fr/glossaire'],
  ['/auteur',    '/fr/auteur'],
  ['/contact',   '/fr/contact'],
  ['/services',  '/fr/services'],
  ['/projets',   '/fr/projets'],
  ['/faq',       '/fr/faq'],
];

// Articles that were generated with the wrong-language slug for their locale.
// Each entry: [wrong URL (404), correct URL (301 target)]
const ARTICLE_REDIRECTS: [string, string][] = [
  // French slugs that ended up under /en/blog/
  ['/en/blog/devis-electricien-gratuit-montreal',             '/fr/conseils/devis-electricien-gratuit-montreal'],
  ['/en/blog/maitre-electricien-certifie-rbq-montreal-topal', '/fr/conseils/maitre-electricien-certifie-rbq-montreal-topal'],
  ['/en/blog/electricien-grand-montreal-rive-sud-service-rapide', '/fr/conseils/electricien-grand-montreal-rive-sud-service-rapide'],
  ['/en/blog/electricien-urgence-24h-montreal',               '/fr/conseils/electricien-urgence-24h-montreal'],
  ['/en/blog/remplacement-panneau-electrique-montreal',       '/fr/conseils/remplacement-panneau-electrique-montreal'],
  // English slugs that ended up under /fr/conseils/
  ['/fr/conseils/free-electrical-quote-montreal-no-commitment',  '/en/blog/free-electrical-quote-montreal-no-commitment'],
  ['/fr/conseils/electrician-south-shore-montreal-fast-service', '/en/blog/electrician-south-shore-montreal-fast-service'],
  ['/fr/conseils/certified-rbq-master-electrician-montreal',     '/en/blog/certified-rbq-master-electrician-montreal'],
  ['/fr/conseils/electrical-panel-replacement-montreal',         '/en/blog/electrical-panel-replacement-montreal'],
  ['/fr/conseils/emergency-electrician-24h-montreal-topal',      '/en/blog/emergency-electrician-24h-montreal-topal'],
  ['/fr/conseils/complete-home-electrical-renovation-montreal',  '/en/blog/complete-home-electrical-renovation-montreal'],
  ['/conseils/complete-home-electrical-renovation-montreal',     '/en/blog/complete-home-electrical-renovation-montreal'],
  ['/blog/complete-home-electrical-renovation-montreal',         '/en/blog/complete-home-electrical-renovation-montreal'],
  // Non-locale-prefixed EN slugs under /conseils/
  ['/conseils/free-electrical-quote-montreal-no-commitment',  '/en/blog/free-electrical-quote-montreal-no-commitment'],
  ['/conseils/electrician-south-shore-montreal-fast-service', '/en/blog/electrician-south-shore-montreal-fast-service'],
  ['/conseils/certified-rbq-master-electrician-montreal',     '/en/blog/certified-rbq-master-electrician-montreal'],
  ['/conseils/electrical-panel-replacement-montreal',         '/en/blog/electrical-panel-replacement-montreal'],
  ['/conseils/emergency-electrician-24h-montreal-topal',      '/en/blog/emergency-electrician-24h-montreal-topal'],
  // Non-locale-prefixed FR slugs under /conseils/
  ['/conseils/devis-electricien-gratuit-montreal',                    '/fr/conseils/devis-electricien-gratuit-montreal'],
  ['/conseils/maitre-electricien-certifie-rbq-montreal-topal',        '/fr/conseils/maitre-electricien-certifie-rbq-montreal-topal'],
  ['/conseils/electricien-grand-montreal-rive-sud-service-rapide',    '/fr/conseils/electricien-grand-montreal-rive-sud-service-rapide'],
  ['/conseils/remplacement-panneau-electrique-montreal',              '/fr/conseils/remplacement-panneau-electrique-montreal'],
  ['/conseils/electricien-urgence-24h-montreal',                      '/fr/conseils/electricien-urgence-24h-montreal'],
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const [from, to] of STATIC_REDIRECTS) {
    if (pathname === from) {
      return NextResponse.redirect(new URL(to, request.url), { status: 301 });
    }
  }

  for (const [from, to] of ARTICLE_REDIRECTS) {
    if (pathname === from) {
      return NextResponse.redirect(new URL(to, request.url), { status: 301 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on all paths except Next.js internals, API routes, and static files (path-to-regexp v8: no bare .*)
  matcher: '/((?!_next|_vercel|api|[^/]+\\.[^/]+).+)',
};
