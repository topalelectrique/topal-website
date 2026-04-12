'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left text-lg font-semibold text-white transition-colors hover:text-orange-400"
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 leading-relaxed text-gray-400">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations('faq');
  const cta = useTranslations('cta');
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = Array.from({ length: 12 }, (_, i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero banner */}
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
              {locale === 'fr' ? 'Questions & Réponses' : 'Questions & Answers'}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-16 bg-gradient-to-r from-orange-500/50 to-transparent origin-left"
            />
          </motion.div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            {t('heading')}
          </h1>
          <p className="text-xl text-gray-400">{t('subtitle')}</p>
        </div>
        {/* Scroll indicator */}
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

      {/* Full FAQ accordion */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div>
            {items.map((item, i) => (
              <FAQItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            {cta('heading')}
          </h2>
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
