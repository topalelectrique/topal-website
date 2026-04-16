'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect, useState } from 'react';

export default function AboutPreview() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Parallax scroll effect
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (sectionCenter - viewportCenter) * 0.1;
      setParallaxY(offset);
    };

    // Intersection observer for fade-in
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className={`
            grid grid-cols-1 items-center gap-16 lg:grid-cols-2
            transition-all duration-700 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          `}
        >
          {/* Left side - Photo placeholder with parallax */}
          <div className="relative">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 border-l-4 border-l-orange-500 bg-dark-800"
              style={{
                transform: `translateY(${parallaxY}px)`,
                transition: 'transform 0.1s linear',
                willChange: 'transform',
              }}
            >
              <Image
                src="/images/projects/modern-lighting.jpg"
                alt="Projet d'éclairage moderne par Topal Électrique à Montréal"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            {/* Orange label */}
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-orange-500">
              {t('label')}
            </span>

            {/* Heading */}
            <h2 className="font-heading mb-6 text-3xl font-bold text-white md:text-4xl">
              {t('heading')}
            </h2>

            {/* Description */}
            <p className="mb-8 leading-relaxed text-gray-400">
              {t('description')}
            </p>

            {/* Stats grid */}
            <div className="mb-10 grid grid-cols-2 gap-8">
              <div>
                <div className="font-heading text-3xl font-bold text-orange-500">
                  {t('stats.experience.value')}
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {t('stats.experience.label')}
                </p>
              </div>
              <div>
                <div className="font-heading text-3xl font-bold text-orange-500">
                  {t('stats.projects.value')}
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {t('stats.projects.label')}
                </p>
              </div>
            </div>

            {/* CTA link */}
            <Link
              href="/a-propos"
              className="inline-flex items-center font-medium text-orange-500 transition-colors hover:text-orange-400"
            >
              {t('cta')}
              <span className="ml-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
