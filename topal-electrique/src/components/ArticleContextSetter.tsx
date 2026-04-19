'use client';

import { useEffect } from 'react';
import { useArticleContext } from '@/context/article-context';

export default function ArticleContextSetter({
  pairedSlug,
  pairedLocale,
}: {
  pairedSlug: string | null;
  pairedLocale: 'fr' | 'en' | null;
}) {
  const { setPairedArticle } = useArticleContext();

  useEffect(() => {
    setPairedArticle(pairedSlug, pairedLocale);
    return () => setPairedArticle(null, null);
  }, [pairedSlug, pairedLocale]);

  return null;
}
