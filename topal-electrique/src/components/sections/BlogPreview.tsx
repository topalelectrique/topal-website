'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import type { Article } from '@/lib/supabase';

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 0, y: 0, active: false });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    el.style.transform = `perspective(900px) rotateX(${((y - cy) / cy) * -6}deg) rotateY(${((x - cx) / cx) * 6}deg) scale3d(1.015,1.015,1.015)`;
    setGlow({ x, y, active: true });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    setGlow((g) => ({ ...g, active: false }));
  }, []);

  return { ref, glow, onMouseMove, onMouseLeave };
}

function FeaturedCard({ article, index }: { article: Article; index: number }) {
  const t = useTranslations('blogPreview');
  const { ref, glow, onMouseMove, onMouseLeave } = useTilt();
  const date = new Date(article.published_at).toLocaleDateString('fr-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={{ pathname: '/conseils/[slug]', params: { slug: article.slug } }}>
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-dark-800 transition-[border-color] duration-300 hover:border-orange-500/30"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 200ms ease, border-color 300ms ease' }}
        >
          {/* Mouse glow */}
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: glow.active ? 1 : 0,
              background: `radial-gradient(500px circle at ${glow.x}px ${glow.y}px, rgba(249,115,22,0.12), transparent 60%)`,
            }}
          />

          {/* Image */}
          {article.image_url && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.image_alt ?? article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/20 to-transparent" />
            </div>
          )}

          <div className="relative z-10 p-7">
            {article.category && (
              <span className="mb-4 inline-block rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-orange-400">
                {article.category}
              </span>
            )}
            <h3 className="font-heading mb-3 text-2xl font-bold leading-snug text-white transition-colors group-hover:text-orange-400">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-gray-400">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{date}</span>
                {article.reading_time && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time} {t('min')}
                    </span>
                  </>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 transition-all group-hover:gap-2">
                {t('read')} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SmallCard({ article, index }: { article: Article; index: number }) {
  const t = useTranslations('blogPreview');
  const { ref, glow, onMouseMove, onMouseLeave } = useTilt();
  const date = new Date(article.published_at).toLocaleDateString('fr-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1"
    >
      <Link href={{ pathname: '/conseils/[slug]', params: { slug: article.slug } }}>
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="group relative flex h-full gap-5 overflow-hidden rounded-2xl border border-white/5 bg-dark-800 p-5 transition-[border-color] duration-300 hover:border-orange-500/30"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 200ms ease, border-color 300ms ease' }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: glow.active ? 1 : 0,
              background: `radial-gradient(350px circle at ${glow.x}px ${glow.y}px, rgba(249,115,22,0.12), transparent 60%)`,
            }}
          />

          {article.image_url && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={article.image_url}
                alt={article.image_alt ?? article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            </div>
          )}

          <div className="relative z-10 flex min-w-0 flex-col justify-between">
            <div>
              {article.category && (
                <span className="mb-2 inline-block text-[0.6rem] font-bold uppercase tracking-widest text-orange-400">
                  {article.category}
                </span>
              )}
              <h3 className="font-heading line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-orange-400">
                {article.title}
              </h3>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[0.65rem] text-gray-500">
              <span>{date}</span>
              {article.reading_time && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {article.reading_time} {t('min')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

type Props = { articles: Article[] };

export default function BlogPreview({ articles }: Props) {
  const t = useTranslations('blogPreview');

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 60%, rgba(255,107,0,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-px w-12 origin-left bg-gradient-to-r from-orange-500/60 to-transparent"
              />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-orange-400">
                {t('label')}
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
              {t('heading')}
            </h2>
            <p className="mt-3 max-w-lg text-gray-400">{t('subtitle')}</p>
          </div>

          <Link
            href="/conseils"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
          >
            {t('viewAll')}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Grid: featured left + 2 stacked right */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Featured */}
          <div className="lg:col-span-3">
            <FeaturedCard article={featured} index={0} />
          </div>

          {/* Stack */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {rest.slice(0, 2).map((article, i) => (
              <SmallCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
