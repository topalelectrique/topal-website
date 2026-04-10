'use client';

import { useTranslations } from 'next-intl';
import { Zap, Building2, AlertCircle, Car, LayoutGrid, type LucideIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';

const serviceIcons: LucideIcon[] = [Zap, Building2, AlertCircle, Car, LayoutGrid];

interface CardMouseState {
  x: number;
  y: number;
  isHovered: boolean;
}

function ServiceCard({
  icon: Icon,
  titleKey,
  descriptionKey,
  linkKey,
  index,
  t,
}: {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  linkKey: string;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<CardMouseState>({ x: 0, y: 0, isHovered: false });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setMouse({ x, y, isHovered: true });
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    setMouse((prev) => ({ ...prev, isHovered: false }));
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative max-w-sm w-full overflow-hidden rounded-2xl border border-white/5
        bg-dark-800 p-8 transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
      style={{
        transitionProperty: 'transform, opacity',
        transitionDuration: mouse.isHovered ? '100ms' : '500ms',
        willChange: 'transform',
      }}
    >
      {/* Orange glow following mouse */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: mouse.isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, rgba(249, 115, 22, 0.15), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10">
          <Icon className="h-7 w-7 text-orange-500" />
        </div>

        <h3 className="mb-3 text-xl font-semibold text-white">
          {t(titleKey)}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-gray-400">
          {t(descriptionKey)}
        </p>

        <Link
          href={t(linkKey)}
          className="inline-flex items-center text-sm font-medium text-orange-500 transition-colors hover:text-orange-400"
        >
          {t('learnMore')}
          <span className="ml-1">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPreview() {
  const t = useTranslations('services');

  const services = serviceIcons.map((icon, i) => ({
    icon,
    titleKey: `items.${i}.title`,
    descriptionKey: `items.${i}.description`,
    linkKey: `items.${i}.link`,
  }));

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-white">
            {t('heading')}
          </h2>
          <p className="mt-4 text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Service cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              icon={service.icon}
              titleKey={service.titleKey}
              descriptionKey={service.descriptionKey}
              linkKey={service.linkKey}
              index={i}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
