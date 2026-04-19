import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import LenisProvider from '@/components/LenisProvider';
import SetLocale from '@/components/SetLocale';
import { ArticleProvider } from '@/context/article-context';
import '../globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://topalelectrique.ca'),
    robots: { index: true, follow: true },
    icons: {
      apple: '/images/logo.png',
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
    <html lang={locale} className={`${inter.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased bg-dark-950">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ArticleProvider>
            <SetLocale />
            <LenisProvider>
              <LoadingScreen />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <div className="grain-overlay" aria-hidden="true" />
            </LenisProvider>
          </ArticleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
