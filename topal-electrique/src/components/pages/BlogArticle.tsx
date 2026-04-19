'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Facebook, Twitter, Link2 } from 'lucide-react';
import { useState } from 'react';
import type { Article } from '@/lib/supabase';

function ShareButtons({ title, locale, slug }: { title: string; locale: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const base = 'https://topalelectrique.ca';
  const path = locale === 'fr' ? `/fr/conseils/${slug}` : `/en/blog/${slug}`;
  const url = `${base}${path}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">{locale === 'fr' ? 'Partager' : 'Share'}</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
        aria-label="Partager sur Facebook"
      >
        <Facebook className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400"
        aria-label="Partager sur X"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>
      <button
        onClick={copyLink}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
        aria-label="Copier le lien"
      >
        {copied ? <span className="text-[0.55rem] font-bold text-orange-400">✓</span> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

type Props = {
  article: Article;
  locale: string;
};

export default function BlogArticle({ article, locale }: Props) {
  const t = useTranslations('blog');
  const cta = useTranslations('cta');
  const cat = useTranslations('categories');

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
                {cat(article.category as 'residential' | 'commercial' | 'regulations' | 'advice' | 'trends')}
              </span>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-10 pb-8 border-b border-white/10">
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
            <ShareButtons title={article.title} locale={locale} slug={article.slug} />
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
