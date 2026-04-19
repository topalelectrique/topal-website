'use client';

import { createContext, useContext } from 'react';

type ArticleContextValue = {
  pairedSlug: string | null;
  pairedLocale: 'fr' | 'en' | null;
};

const ArticleContext = createContext<ArticleContextValue>({ pairedSlug: null, pairedLocale: null });

export function ArticleProvider({
  children,
  pairedSlug,
  pairedLocale,
}: {
  children: React.ReactNode;
  pairedSlug: string | null;
  pairedLocale: 'fr' | 'en' | null;
}) {
  return (
    <ArticleContext.Provider value={{ pairedSlug, pairedLocale }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticleContext() {
  return useContext(ArticleContext);
}
