'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';

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

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allItems = Array.from({ length: 12 }, (_, i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  // Show only first 4 on homepage
  const items = allItems.slice(0, 4);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-white">
            {t('heading')}
          </h2>
          <p className="mt-4 text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Accordion */}
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

        {/* Link to full FAQ */}
        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center text-sm font-medium text-orange-500 transition-colors hover:text-orange-400"
          >
            {t('viewAll')}
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
