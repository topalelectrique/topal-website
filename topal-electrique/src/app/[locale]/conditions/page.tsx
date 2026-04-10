import { getTranslations } from 'next-intl/server';
import TermsPage from '@/components/pages/TermsPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.terms' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function TermsRoute() {
  return <TermsPage />;
}
