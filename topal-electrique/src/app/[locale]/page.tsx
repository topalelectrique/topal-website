import { getTranslations } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import ServicesPreview from '@/components/sections/ServicesPreview';
import AboutPreview from '@/components/sections/AboutPreview';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import CTASection from '@/components/sections/CTASection';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
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
