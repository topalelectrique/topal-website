import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GLOSSARY_TERMS, getTermsByLocale } from '@/lib/glossary';
import GlossaryClient from './GlossaryClient';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = 'https://topalelectrique.ca';
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Glossaire électrique | Termes et définitions | Topal Électrique'
    : 'Electrical Glossary | Terms & Definitions | Topal Électrique';
  const description = isFr
    ? 'Définitions claires de tous les termes électriques utilisés en résidentiel et commercial au Québec. Disjoncteur, panneau, GFCI, RBQ, mise à la terre et plus.'
    : 'Clear definitions of all electrical terms used in residential and commercial work in Quebec. Circuit breaker, panel, GFCI, RBQ, grounding and more.';
  const canonical = isFr ? `${base}/fr/glossaire` : `${base}/en/glossary`;
  const alternate = isFr ? `${base}/en/glossary` : `${base}/fr/glossaire`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { 'fr-CA': `${base}/fr/glossaire`, 'en-CA': `${base}/en/glossary` },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Topal Électrique',
      locale: isFr ? 'fr_CA' : 'en_CA',
      type: 'website',
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'Topal Électrique' }],
    },
  };
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const base = 'https://topalelectrique.ca';
  const terms = getTermsByLocale(locale as 'fr' | 'en');

  const definedTermSetSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: isFr ? 'Glossaire d\'électricité — Topal Électrique' : 'Electrical Glossary — Topal Électrique',
    description: isFr
      ? 'Définitions des termes électriques utilisés en construction résidentielle et commerciale au Québec.'
      : 'Definitions of electrical terms used in residential and commercial construction in Quebec.',
    url: isFr ? `${base}/fr/glossaire` : `${base}/en/glossary`,
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      name: t[locale as 'fr' | 'en'].term,
      description: t[locale as 'fr' | 'en'].definition,
      termCode: t.slug,
      inDefinedTermSet: isFr ? `${base}/fr/glossaire` : `${base}/en/glossary`,
      url: isFr ? `${base}/fr/glossaire#${t.slug}` : `${base}/en/glossary#${t.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isFr ? 'Accueil' : 'Home', item: isFr ? `${base}/fr` : `${base}/en` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Glossaire' : 'Glossary', item: isFr ? `${base}/fr/glossaire` : `${base}/en/glossary` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GlossaryClient terms={terms} locale={locale} />
    </>
  );
}
