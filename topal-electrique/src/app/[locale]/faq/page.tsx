import { getTranslations } from 'next-intl/server';
import FAQPage from '@/components/pages/FAQPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function FAQRoute() {
  return <FAQPage />;
}
