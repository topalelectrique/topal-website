'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PHONE, PHONE_LINK } from '@/lib/constants';

export default function CTASection() {
  const t = useTranslations('cta');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      {/* Background radial gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249, 115, 22, 0.07) 0%, transparent 60%)',
        }}
      />

      {/* Parallax blurred orange circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl"
        style={{
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-6 font-heading text-4xl font-bold text-white md:text-5xl">
          {t('heading')}
        </h2>

        <p className="mb-10 text-xl text-gray-400">{t('subtitle')}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary CTA */}
          <Link
            href="/contact"
            className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-400"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          >
            {t('primary')}
          </Link>

          {/* Secondary CTA - Phone */}
          <a
            href={PHONE_LINK}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500 px-8 py-4 font-semibold text-orange-500 transition-colors hover:bg-orange-500/10"
          >
            <Phone className="h-5 w-5" />
            {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
