import { getTranslations } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import ServicesPreview from '@/components/sections/ServicesPreview';
import AboutPreview from '@/components/sections/AboutPreview';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import CTASection from '@/components/sections/CTASection';
import BlogPreview from '@/components/sections/BlogPreview';
import JsonLd from '@/components/JsonLd';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const base = 'https://topalelectrique.ca';
  const frPath = `${base}/fr`;
  const enPath = `${base}/en`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'fr' ? frPath : enPath,
      languages: { 'fr-CA': frPath, 'en-CA': enPath, 'x-default': enPath },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: locale === 'fr' ? frPath : enPath,
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website' as const,
      images: [{ url: 'https://topalelectrique.ca/og-image.png', width: 1200, height: 630, alt: 'Topal Électrique — Électricien certifié à Montréal' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: t('title'),
      description: t('description'),
      images: ['https://topalelectrique.ca/og-image.png'],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, category, image_url, image_alt, published_at, reading_time')
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <>
      <JsonLd />
      <Hero />
      <BlogPreview articles={(articles as Article[]) ?? []} locale={locale} />
      <TrustBar />
      <ServicesPreview />
      <AboutPreview />
      <ProjectsPreview />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
