import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { Award, Clock, BookOpen } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = 'https://topalelectrique.ca';
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Matéo Saric — Électricien certifié | Topal Électrique'
    : 'Matéo Saric — Certified Electrician | Topal Électrique';
  const description = isFr
    ? 'Matéo Saric est électricien certifié chez Topal Électrique avec 7 ans d\'expérience en électricité résidentielle et commerciale à Montréal.'
    : 'Matéo Saric is a certified electrician at Topal Électrique with 7 years of experience in residential and commercial electrical work in Montreal.';
  const canonical = isFr ? `${base}/fr/auteur` : `${base}/en/author`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { 'fr-CA': `${base}/fr/auteur`, 'en-CA': `${base}/en/author` },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Topal Électrique',
      locale: isFr ? 'fr_CA' : 'en_CA',
      type: 'profile',
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const base = 'https://topalelectrique.ca';

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, published_at, category, reading_time')
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .limit(6);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matéo Saric',
    jobTitle: isFr ? 'Électricien de métier' : 'Journeyman Electrician',
    description: isFr
      ? 'Électricien de métier chez Topal Électrique avec 7 ans d\'expérience terrain en électricité résidentielle et commerciale dans le Grand Montréal.'
      : 'Journeyman electrician at Topal Électrique with 7 years of hands-on experience in residential and commercial electrical work throughout Greater Montreal.',
    url: isFr ? `${base}/fr/auteur` : `${base}/en/author`,
    image: `${base}/images/logo.png`,
    worksFor: {
      '@type': 'Organization',
      name: 'Topal Électrique',
      url: base,
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'licence', name: 'Licence RBQ 8317-3658-34' },
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'membership', name: 'Membre CMEQ' },
      ],
    },
    knowsAbout: isFr
      ? ['Électricité résidentielle', 'Électricité commerciale', 'Panneaux électriques', 'Bornes de recharge EV', 'Code de construction du Québec', 'Rénovation électrique']
      : ['Residential electrical', 'Commercial electrical', 'Electrical panels', 'EV charging stations', 'Quebec Construction Code', 'Electrical renovation'],
    sameAs: ['https://topalelectrique.ca'],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isFr ? 'Accueil' : 'Home', item: isFr ? `${base}/fr` : `${base}/en` },
      { '@type': 'ListItem', position: 2, name: isFr ? 'Auteur' : 'Author', item: isFr ? `${base}/fr/auteur` : `${base}/en/author` },
    ],
  };

  const cat = (c: string | null) => {
    if (!c) return '';
    const map: Record<string, { fr: string; en: string }> = {
      residential: { fr: 'Résidentiel', en: 'Residential' },
      commercial: { fr: 'Commercial', en: 'Commercial' },
      regulations: { fr: 'Réglementation', en: 'Regulations' },
      advice: { fr: 'Conseils', en: 'Advice' },
      trends: { fr: 'Tendances', en: 'Trends' },
    };
    return isFr ? (map[c]?.fr ?? c) : (map[c]?.en ?? c);
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen pb-24 pt-32">
        <div className="mx-auto max-w-4xl px-6">
          {/* Author card */}
          <div className="mb-12 flex flex-col items-center gap-8 rounded-2xl border border-white/10 bg-white/3 p-8 sm:flex-row sm:items-start">
            <div className="shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-orange-500/30 bg-dark-800">
                <Image
                  src="/images/logo.png"
                  alt="Topal Électrique"
                  width={64}
                  height={64}
                  className="h-16 w-auto"
                />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-3xl font-bold text-white">Matéo Saric</h1>
              <p className="mt-1 text-sm font-medium text-orange-400">
                {isFr ? 'Électricien de métier — Topal Électrique' : 'Journeyman Electrician — Topal Électrique'}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                {isFr
                  ? 'Électricien de métier avec 7 ans d\'expérience terrain en électricité résidentielle et commerciale dans le Grand Montréal. Spécialisé dans les mises à niveau de panneaux, les installations de bornes EV et les projets de rénovation complète. Les travaux sont réalisés sous la licence RBQ de Topal Électrique (8317-3658-34), membre CMEQ.'
                  : 'Journeyman electrician with 7 years of hands-on experience in residential and commercial electrical work throughout Greater Montreal. Specialized in panel upgrades, EV charger installations, and full renovation projects. All work is performed under Topal Électrique\'s RBQ licence (8317-3658-34), a CMEQ member company.'}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Clock className="h-3 w-3 text-orange-400" />
                  {isFr ? '7 ans d\'expérience terrain' : '7 years hands-on experience'}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Award className="h-3 w-3 text-orange-400" />
                  {isFr ? 'Panneaux · Bornes EV · Rénovation' : 'Panels · EV Chargers · Renovation'}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Award className="h-3 w-3 text-orange-400" />
                  {isFr ? 'Sous licence RBQ 8317-3658-34' : 'Under RBQ licence 8317-3658-34'}
                </span>
              </div>
            </div>
          </div>

          {/* Articles */}
          {articles && articles.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-orange-400" />
                <h2 className="font-heading text-lg font-bold text-white">
                  {isFr ? 'Articles récents' : 'Recent articles'}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={{ pathname: '/conseils/[slug]', params: { slug: article.slug } }}
                    className="group rounded-xl border border-white/8 bg-white/3 p-4 transition hover:border-orange-500/30"
                  >
                    {article.category && (
                      <span className="mb-2 inline-block text-[0.6rem] font-bold uppercase tracking-widest text-orange-400">
                        {cat(article.category)}
                      </span>
                    )}
                    <h3 className="font-heading text-sm font-bold text-white transition group-hover:text-orange-400 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-[0.65rem] text-gray-500">
                      <span>
                        {new Date(article.published_at).toLocaleDateString(
                          isFr ? 'fr-CA' : 'en-CA',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                      {article.reading_time && (
                        <>
                          <span>·</span>
                          <span>{article.reading_time} min</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/conseils"
                  className="text-sm text-orange-400 hover:text-orange-300 transition"
                >
                  {isFr ? 'Voir tous les articles →' : 'View all articles →'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
