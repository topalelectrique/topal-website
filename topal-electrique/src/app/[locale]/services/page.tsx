import { getTranslations } from 'next-intl/server';
import ServicesPage from '@/components/pages/ServicesPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.services' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Services() {
  return <ServicesPage />;
}
