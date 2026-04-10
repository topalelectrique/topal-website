import { getTranslations } from 'next-intl/server';
import ProjectsPage from '@/components/pages/ProjectsPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.projects' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Projects() {
  return <ProjectsPage />;
}
