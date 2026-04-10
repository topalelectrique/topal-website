'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const projects = [
  { image: '/images/projects/luxury-bathroom.jpg', title: 'Salle de bain luxe', category: 'Résidentiel', alt: 'Installation éclairage LED salle de bain moderne Montréal' },
  { image: '/images/projects/modern-lighting.jpg', title: 'Éclairage moderne', category: 'Résidentiel', alt: 'Installation éclairage linéaire salon moderne Montréal' },
  { image: '/images/projects/meter-installation.jpg', title: 'Installation compteurs', category: 'Commercial', alt: 'Installation banque de compteurs électriques commercial Montréal' },
  { image: '/images/projects/bathroom-vanity.jpg', title: 'Vanité double', category: 'Résidentiel', alt: 'Installation électrique salle de bain double vanité Montréal' },
  { image: '/images/projects/electrical-panel.jpg', title: 'Panneau électrique', category: 'Résidentiel', alt: 'Installation panneau électrique résidentiel Montréal' },
  { image: '/images/projects/commercial-lighting.jpg', title: 'Éclairage commercial', category: 'Commercial', alt: 'Installation luminaires suspendus commercial Montréal' },
  { image: '/images/projects/kitchen-renovation.jpg', title: 'Cuisine rénovation', category: 'Résidentiel', alt: 'Installation éclairage cuisine rénovation Montréal' },
];

export default function ProjectsPreview() {
  const t = useTranslations('projects');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        // Section is pinned - calculate horizontal progress
        const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
        setScrollProgress(progress);
      } else if (rect.top > 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate how much horizontal space we need
  // Each card is ~400px + gap, we need enough scroll height to cover the full horizontal distance
  const cardCount = projects.length;

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-950"
      style={{ height: `${cardCount * 50}vh` }} // Extra scroll space for horizontal movement
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="px-6 mb-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              {t('heading')}
            </h2>
            <p className="mt-3 text-gray-400 text-lg">{t('subtitle')}</p>
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div className="relative flex-1 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 px-6 transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translateX(${-scrollProgress * (cardCount - 1) * 420}px)`,
            }}
          >
            {projects.map((project, i) => (
              <div
                key={i}
                className="group relative shrink-0 w-[380px] h-[280px] md:w-[450px] md:h-[340px] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="450px"
                />
                {/* Permanent subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/50 transition-all duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-full bg-orange-500/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-orange-400 mb-2 border border-orange-500/20">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="px-6 pb-8 pt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-100"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
            <Link
              href="/projets"
              className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
            >
              {t('viewAll')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
