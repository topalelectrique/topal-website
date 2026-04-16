'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type ProjectCategory = 'all' | 'residential' | 'commercial';

const projects = [
  { image: '/images/projects/luxury-bathroom.jpg', title: 'Salle de bain luxe — LED', category: 'residential' as const, type: 'Résidentiel', alt: 'Installation éclairage LED salle de bain Montréal' },
  { image: '/images/projects/modern-lighting.jpg', title: 'Éclairage linéaire moderne', category: 'residential' as const, type: 'Résidentiel', alt: 'Installation éclairage linéaire salon Montréal' },
  { image: '/images/projects/meter-installation.jpg', title: 'Installation compteurs commerciaux', category: 'commercial' as const, type: 'Commercial', alt: 'Installation banque compteurs électriques Montréal' },
  { image: '/images/projects/bathroom-vanity.jpg', title: 'Éclairage salle de bain double vanité', category: 'residential' as const, type: 'Résidentiel', alt: 'Installation électrique salle de bain Montréal' },
  { image: '/images/projects/electrical-panel.jpg', title: 'Installation panneau électrique', category: 'residential' as const, type: 'Résidentiel', alt: 'Installation panneau électrique résidentiel Montréal' },
  { image: '/images/projects/commercial-lighting.jpg', title: 'Éclairage commercial suspendu', category: 'commercial' as const, type: 'Commercial', alt: 'Installation luminaires commerciaux Montréal' },
  { image: '/images/projects/kitchen-renovation.jpg', title: 'Rénovation cuisine — éclairage', category: 'residential' as const, type: 'Résidentiel', alt: 'Installation éclairage cuisine Montréal' },
];

function ProjectCard({ project, typeLabel }: { project: typeof projects[0]; typeLabel: string }) {
  return (
    <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl">
      <Image
        src={project.image}
        alt={project.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <span className="mb-2 inline-block rounded-full bg-orange-500/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-orange-400 border border-orange-500/20">
          {typeLabel}
        </span>
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const cta = useTranslations('cta');
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filters: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'residential', label: t('filterResidential') },
    { key: 'commercial', label: t('filterCommercial') },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
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
              {t('heroLabel')}
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

      {/* Projects grid */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Filter buttons */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={`${project.title}-${i}`}
                project={project}
                typeLabel={project.category === 'residential' ? t('filterResidential') : t('filterCommercial')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center">
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
