import { getTranslations } from 'next-intl/server';
import ContactPage from '@/components/pages/ContactPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return { title: t('title'), description: t('description') };
}

export default function Contact() {
  return <ContactPage />;
}
