import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import LenisProvider from '@/components/LenisProvider';
import SetLocale from '@/components/SetLocale';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://topalelectrique.ca'),
    alternates: {
      canonical: `https://topalelectrique.ca/${locale}`,
      languages: {
        'fr-CA': 'https://topalelectrique.ca/fr',
        'en-CA': 'https://topalelectrique.ca/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://topalelectrique.ca',
      siteName: 'Topal Électrique',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SetLocale />
      <LenisProvider>
        <LoadingScreen />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <div className="grain-overlay" aria-hidden="true" />
      </LenisProvider>
    </NextIntlClientProvider>
  );
}
