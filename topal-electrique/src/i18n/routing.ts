import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/services': '/services',
    '/a-propos': {
      fr: '/a-propos',
      en: '/about',
    },
    '/projets': {
      fr: '/projets',
      en: '/projects',
    },
    '/contact': '/contact',
    '/faq': '/faq',
    '/confidentialite': {
      fr: '/confidentialite',
      en: '/privacy',
    },
    '/conditions': {
      fr: '/conditions',
      en: '/terms',
    },
  },
});
