'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Clock, ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/supabase';

type Category = 'all' | 'residential' | 'commercial' | 'regulations' | 'advice' | 'trends';

function ArticleCard({ article }: { article: Article }) {
  const t = useTranslations('blog');
  const date = new Date(article.published_at).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/conseils/${article.slug}` as '/conseils/[slug]'}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-dark-800 transition-all duration-300 hover:border-orange-500/30 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-dark-900">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.image_alt ?? article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
            <span className="text-4xl opacity-20">⚡</span>
          </div>
        )}
        {/* Category badge */}
        {article.category && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-orange-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {article.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading mb-3 text-lg font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mb-4 text-sm leading-relaxed text-gray-400 line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{date}</span>
            {article.reading_time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.reading_time} {t('readTime')}
                </span>
              </>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-orange-500 group-hover:gap-2 transition-all">
            {t('readMore')} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type Props = {
  articles: Article[];
  locale: string;
};

export default function BlogList({ articles, locale }: Props) {
  const t = useTranslations('blog');
  const cta = useTranslations('cta');
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  const filters: { key: Category; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'residential', label: t('filterResidential') },
    { key: 'commercial', label: t('filterCommercial') },
    { key: 'regulations', label: t('filterRegulations') },
    { key: 'advice', label: t('filterAdvice') },
    { key: 'trends', label: t('filterTrends') },
  ];

  const filtered =
    activeFilter === 'all'
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center py-32 px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,107,0,0.07) 0%, transparent 60%), linear-gradient(to bottom, var(--color-dark-950) 0%, var(--color-dark-900) 60%, var(--color-dark-950) 100%)',
          }}
        />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-500/60"
            style={{ left: `${15 + i * 14}%`, top: `${25 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-16 bg-gradient-to-l from-orange-500/50 to-transparent origin-right"
            />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-orange-400">
              {t('heroLabel')}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-16 bg-gradient-to-r from-orange-500/50 to-transparent origin-left"
            />
          </motion.div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">{t('heading')}</h1>
          <p className="text-xl text-gray-400">{t('subtitle')}</p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-dark-950))' }}
        />
      </section>

      {/* Articles grid */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeFilter === f.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-gray-500">{t('noArticles')}</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">{cta('heading')}</h2>
          <p className="text-gray-400 text-lg mb-10">{cta('subtitle')}</p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-orange-500 hover:bg-orange-400 px-10 py-4 text-lg font-semibold text-white transition-colors"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          >
            {cta('primary')}
          </Link>
        </div>
      </section>
    </>
  );
}
