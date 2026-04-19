'use client';

import { createContext, useContext, useState } from 'react';

type ArticleContextValue = {
  pairedSlug: string | null;
  pairedLocale: 'fr' | 'en' | null;
  setPairedArticle: (slug: string | null, locale: 'fr' | 'en' | null) => void;
};

const ArticleContext = createContext<ArticleContextValue>({
  pairedSlug: null,
  pairedLocale: null,
  setPairedArticle: () => {},
});

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [pairedSlug, setPairedSlug] = useState<string | null>(null);
  const [pairedLocale, setPairedLocale] = useState<'fr' | 'en' | null>(null);

  const setPairedArticle = (slug: string | null, locale: 'fr' | 'en' | null) => {
    setPairedSlug(slug);
    setPairedLocale(locale);
  };

  return (
    <ArticleContext.Provider value={{ pairedSlug, pairedLocale, setPairedArticle }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticleContext() {
  return useContext(ArticleContext);
}
