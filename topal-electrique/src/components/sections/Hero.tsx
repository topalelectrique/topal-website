'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useEffect, useState, useMemo } from 'react';

/* ─── Spark / floating particle ─── */
interface SparkProps {
  size: number;
  left: string;
  top: string;
  opacity: number;
  delay: number;
  duration: number;
}

function Spark({ size, left, top, opacity, delay, duration }: SparkProps) {
  return (
    <span
      aria-hidden
      className="absolute rounded-full bg-orange-500"
      style={{
        width: size,
        height: size,
        left,
        top,
        opacity,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

/* ─── Scroll indicator chevron ─── */
function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-white"
      >
        <polyline points="6 9 12 15 18 9" />
      </motion.svg>
    </div>
  );
}

/* ─── Hero section ─── */
export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const headline = t('headline');

  /* Typewriter state */
  const [displayedCount, setDisplayedCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setDisplayedCount(i);
        if (i >= headline.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 40);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(startDelay);
  }, [headline]);

  /* Pre-compute spark data so it's stable across renders */
  const sparks = useMemo<SparkProps[]>(
    () => [
      { size: 4, left: '12%', top: '18%', opacity: 0.3, delay: 0, duration: 5 },
      { size: 6, left: '78%', top: '25%', opacity: 0.2, delay: 1.2, duration: 7 },
      { size: 3, left: '45%', top: '10%', opacity: 0.4, delay: 0.5, duration: 6 },
      { size: 5, left: '25%', top: '70%', opacity: 0.25, delay: 2, duration: 8 },
      { size: 4, left: '65%', top: '60%', opacity: 0.35, delay: 0.8, duration: 5.5 },
      { size: 3, left: '88%', top: '45%', opacity: 0.5, delay: 1.5, duration: 6.5 },
      { size: 5, left: '8%', top: '55%', opacity: 0.2, delay: 3, duration: 7.5 },
      { size: 4, left: '52%', top: '80%', opacity: 0.3, delay: 0.3, duration: 6 },
    ],
    [],
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center pt-20 pb-20">
      {/* Background gradient with orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,107,0,0.10) 0%, transparent 60%), linear-gradient(to bottom, var(--color-dark-950) 0%, var(--color-dark-900) 70%, var(--color-dark-950) 100%)',
        }}
      />
      {/* Bottom fade — blends hero into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-48"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-dark-950))' }}
      />

      {/* Floating sparks — contained so they don't escape the section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparks.map((s, i) => (
          <Spark key={i} {...s} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Typewriter headline */}
        <h1 className="mx-auto max-w-4xl font-heading text-5xl font-bold leading-tight md:text-7xl">
          {headline.slice(0, displayedCount)}
          <span
            className="ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[0.1em] border-r-2 border-orange-500 align-middle"
            style={{
              animation: 'blink-cursor 0.75s step-end infinite',
            }}
          />
        </h1>

        {/* Subtitle — fades in after typing completes */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={typingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={typingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <Link
            href="/contact"
            className="inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-400 hover:shadow-[0_0_32px_rgba(255,107,0,0.45)]"
          >
            {t('cta')}
          </Link>

          {/* Trust micro-signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
            {(locale === 'fr'
              ? ['Sans engagement', 'Certifié RBQ · CMEQ', 'Réponse en < 2 h']
              : ['No commitment', 'RBQ · CMEQ Certified', 'Response in < 2h']
            ).map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-orange-500/50" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
