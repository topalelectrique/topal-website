import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Run on all paths except Next.js internals and files with extensions (robots.txt, sitemap.xml, images, etc.)
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
};
