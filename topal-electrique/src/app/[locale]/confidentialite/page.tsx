import { getTranslations } from 'next-intl/server';
import PrivacyPage from '@/components/pages/PrivacyPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.privacy' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
