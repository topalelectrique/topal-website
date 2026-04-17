'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import type { Article } from '@/lib/supabase';

type Props = {
  article: Article;
  locale: string;
};

export default function BlogArticle({ article, locale }: Props) {
  const t = useTranslations('blog');
  const cta = useTranslations('cta');

  const date = new Date(article.published_at).toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.meta_description ?? article.excerpt ?? '',
            image: article.image_url ?? 'https://topalelectrique.ca/og-image.png',
            datePublished: article.published_at,
            author: {
              '@type': 'Organization',
              name: 'Topal Électrique',
              url: 'https://topalelectrique.ca',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Topal Électrique',
              logo: {
                '@type': 'ImageObject',
                url: 'https://topalelectrique.ca/images/logo.png',
              },
            },
          }),
        }}
      />

      <article className="pb-24">
        {/* Hero image */}
        {article.image_url && (
          <div className="relative h-[45vh] min-h-[300px] w-full overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.image_alt ?? article.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950/30 via-transparent to-dark-950" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 mb-8"
          >
            <Link
              href="/conseils"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToBlog')}
            </Link>
          </motion.div>

          {/* Category + meta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {article.category && (
              <span className="mb-4 inline-block rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400 border border-orange-500/20">
                {article.category}
              </span>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-10 pb-8 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
              {article.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.reading_time} {t('readTime')}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                Topal Électrique
              </span>
            </div>
          </motion.div>

          {/* Article content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-8 text-center"
          >
            <h2 className="font-heading text-2xl font-bold text-white mb-3">
              {cta('heading')}
            </h2>
            <p className="text-gray-400 mb-6">{cta('subtitle')}</p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-orange-500 hover:bg-orange-400 px-8 py-3 font-semibold text-white transition-colors"
            >
              {cta('primary')}
            </Link>
          </motion.div>
        </div>
      </article>
    </>
  );
}
