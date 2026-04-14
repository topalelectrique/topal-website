'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Zap, Building2, AlertCircle, Car, LayoutGrid,
  ArrowRight, Check, ChevronDown, Phone,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PHONE, PHONE_LINK } from '@/lib/constants';

/* ─────────────────────────────────────
   Animated counter
───────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────
   Parallax image
───────────────────────────────────── */
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[3/4] border border-white/10">
      <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={85} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(255,107,0,0.08) 0%,transparent 60%)' }} />
    </div>
  );
}

/* ─────────────────────────────────────
   Feature check item
───────────────────────────────────── */
function FeatureItem({ text, delay }: { text: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="flex items-center gap-3"
    >
      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-500/15 flex items-center justify-center">
        <Check className="h-3 w-3 text-orange-400" />
      </span>
      <span className="text-gray-300 text-sm leading-snug">{text}</span>
    </motion.li>
  );
}

/* ─────────────────────────────────────
   Service section
───────────────────────────────────── */
interface ServiceSectionProps {
  index: number;
  anchor: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  image: { src: string; alt: string };
  ctaLabel: string;
  isUrgence?: boolean;
  locale: string;
}

function ServiceSection({
  index, anchor, icon: Icon, title, description, features, image, ctaLabel, isUrgence, locale,
}: ServiceSectionProps) {
  const reversed = index % 2 !== 0;
  const contentRef = useRef(null);
  const inView = useInView(contentRef, { once: true, margin: '-80px' });
  const num = String(index + 1).padStart(2, '0');

  const callLabel = locale === 'fr' ? 'Appelez-nous' : 'Call Us Now';

  return (
    <section id={anchor} className="relative py-16 md:py-20 px-4 md:px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse 60% 50% at ${reversed ? '80%' : '20%'} 50%, rgba(255,107,0,0.06) 0%, transparent 70%)` }}
      />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* Content */}
        <motion.div
          ref={contentRef}
          className={reversed ? 'lg:order-2' : ''}
          initial={{ opacity: 0, x: reversed ? 40 : -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-heading text-5xl font-bold text-white/[0.06] select-none leading-none">{num}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
          </div>

          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 relative">
            <Icon className="h-7 w-7 text-orange-500" />
            <span className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 20px rgba(255,107,0,0.2)' }} />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h2>
          <p className="text-gray-400 leading-relaxed mb-6 text-base md:text-lg">{description}</p>

          <ul className="space-y-3 mb-8">
            {features.map((f, i) => <FeatureItem key={i} text={f} delay={i * 0.07} />)}
          </ul>

          {isUrgence ? (
            <a
              href={PHONE_LINK}
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 px-7 py-3 font-semibold text-white transition-all duration-300"
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(255,107,0,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <Phone className="h-4 w-4" />
              {callLabel}
              <span className="ml-1 text-orange-100 font-normal">{PHONE}</span>
            </a>
          ) : (
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 px-7 py-3 font-semibold text-white transition-all duration-300"
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(255,107,0,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? -40 : 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={reversed ? 'lg:order-1' : ''}
        >
          <ParallaxImage src={image.src} alt={image.alt} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Sticky nav pills
───────────────────────────────────── */
const NAV_LABELS_FR = ['Résidentiel', 'Commercial', 'Urgence 24/7', 'Bornes EV', 'Panneaux'];
const NAV_LABELS_EN = ['Residential', 'Commercial', 'Emergency', 'EV Charging', 'Panels'];
const NAV_ANCHORS = ['residentiel', 'commercial', 'urgence', 'bornes', 'panneaux'];

function ServiceNav({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const labels = locale === 'fr' ? NAV_LABELS_FR : NAV_LABELS_EN;

  useEffect(() => {
    lastY.current = window.scrollY;
    const sections = NAV_ANCHORS.map(id => document.getElementById(id));

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      // Hide after scrolling down more than 6px, show on any upward movement
      if (delta > 6) setVisible(false);
      else if (delta < -2) setVisible(true);

      lastY.current = y;

      // Active section tracking
      const scrollY = y + 120;
      let current = 0;
      sections.forEach((s, i) => { if (s && s.offsetTop <= scrollY) current = i; });
      setActive(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-[72px] z-30 py-3 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
          transition={{
            duration: visible ? 0.18 : 0.45,
            ease: 'easeInOut',
          }}
          className="flex items-center gap-2 overflow-x-auto py-1 justify-start md:justify-center"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            pointerEvents: visible ? 'auto' : 'none',
          }}
        >
          <div className="glass rounded-full px-2 py-1.5 flex items-center gap-1 shrink-0">
            {labels.map((label, i) => (
              <button
                key={i}
                onClick={() => scrollTo(NAV_ANCHORS[i])}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap ${active === i ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                style={active === i ? { boxShadow: '0 0 12px rgba(255,107,0,0.5)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Service area section
───────────────────────────────────── */
function ServiceAreaMap({ locale }: { locale: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const zones = locale === 'fr'
    ? [
        {
          label: 'Rive-Nord',
          sub: 'Saint-Sauveur · Mirabel · Terrebonne · Blainville · Repentigny · Saint-Eustache · Saint-Marthe · Laval',
          color: 'text-orange-400',
          highlight: false,
        },
        {
          label: 'Montréal',
          sub: 'Montréal et ses arrondissements',
          color: 'text-white',
          highlight: true,
        },
        {
          label: 'Rive-Sud',
          sub: 'Longueuil · Brossard · Delson · Sainte-Catherine · Saint-Constant · Richelieu',
          color: 'text-orange-400',
          highlight: false,
        },
      ]
    : [
        {
          label: 'North Shore',
          sub: 'Saint-Sauveur · Mirabel · Terrebonne · Blainville · Repentigny · Saint-Eustache · Saint-Marthe · Laval',
          color: 'text-orange-400',
          highlight: false,
        },
        {
          label: 'Montreal',
          sub: 'Montreal and its boroughs',
          color: 'text-white',
          highlight: true,
        },
        {
          label: 'South Shore',
          sub: 'Longueuil · Brossard · Delson · Sainte-Catherine · Saint-Constant · Richelieu',
          color: 'text-orange-400',
          highlight: false,
        },
      ];

  const title = locale === 'fr' ? 'Zone de service' : 'Service area';
  const subtitle = locale === 'fr'
    ? 'Nous intervenons dans un rayon de 80 km de Montréal — de Saint-Sauveur au nord jusqu\'à Richelieu au sud.'
    : 'We serve within an 80 km radius of Montreal — from Saint-Sauveur in the north to Richelieu in the south.';

  return (
    <section className="py-16 px-4 md:px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Zone cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col justify-center gap-4"
          >
            {zones.map((z, i) => (
              <div
                key={i}
                className={`rounded-xl border p-5 transition-all duration-300 ${z.highlight ? 'bg-orange-500/10 border-orange-500/30' : 'bg-dark-800 border-white/5'}`}
              >
                <p className={`font-heading font-bold text-lg mb-2 ${z.color}`}>{z.label}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{z.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Non-clickable map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 relative min-h-[320px]"
          >
            <iframe
              title="Zone de service Topal Électrique — Grand Montréal"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d363000!2d-73.65!3d45.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sca!4v1700000000001"
              width="100%"
              height="320"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)', display: 'block', pointerEvents: 'none' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Fully blocks all click-through to Google Maps */}
            <div className="absolute inset-0 z-10" aria-hidden="true" />
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(255,107,0,0.04) 0%,transparent 50%)' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Stats strip
───────────────────────────────────── */
function StatsStrip({ locale }: { locale: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const stats = locale === 'fr'
    ? [
        { value: 1000, suffix: '+', label: 'Projets complétés' },
        { value: 20, suffix: '+', label: "Années d'expérience" },
        { value: 100, suffix: '%', label: 'Satisfaction client' },
      ]
    : [
        { value: 1000, suffix: '+', label: 'Projects completed' },
        { value: 20, suffix: '+', label: 'Years of experience' },
        { value: 100, suffix: '%', label: 'Client satisfaction' },
      ];

  return (
    <div ref={ref} className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center rounded-2xl bg-dark-800 border border-white/5 p-5 md:p-7"
            >
              <div className="font-heading text-3xl md:text-4xl font-bold text-gradient">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="text-gray-500 text-xs md:text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Hero
───────────────────────────────────── */
function Hero({ heading, subtitle, locale }: { heading: string; subtitle: string; locale: string }) {
  const words = heading.split(' ');
  return (
    <section className="relative flex items-center justify-center pt-24 pb-6 md:pt-32 md:pb-0 px-4 min-h-[60vh]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 60%), linear-gradient(to bottom, var(--color-dark-950) 0%, var(--color-dark-900) 60%, var(--color-dark-950) 100%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-48"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-dark-950))' }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-500/60"
            style={{ left: `${15 + i * 14}%`, top: `${25 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}
      </div>
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
            {locale === 'fr' ? 'Certifié RBQ · Grand Montréal' : 'RBQ Certified · Greater Montreal'}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-16 bg-gradient-to-r from-orange-500/50 to-transparent origin-left"
          />
        </motion.div>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 30, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2 text-gray-600"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Feature data
───────────────────────────────────── */
const FEATURES_FR = [
  [
    'Conforme au Code de construction du Québec',
    'Câblage, prises, luminaires et disjoncteurs',
    'Maisons neuves et rénovations complètes',
    'Certification et permis inclus',
  ],
  [
    'Systèmes triphasés et haute puissance',
    'Éclairage optimisé pour commerces et bureaux',
    'Conformité aux normes CSA',
    'Devis détaillé avant tout démarrage',
  ],
  [
    'Intervention en moins de 2 heures',
    'Disponible nuits, fins de semaine et jours fériés',
    'Diagnostic rapide de pannes et courts-circuits',
    'Couverture de tout le Grand Montréal',
  ],
  [
    'Compatible Tesla, Grizzl-E et toutes marques',
    'Installation niveau 2 (240V) résidentiel & commercial',
    'Admissible aux subventions gouvernementales',
    'Certification RBQ incluse',
  ],
  [
    'Mise à niveau 100A, 150A, 200A, 320A et 400A',
    'Remplacement de panneaux obsolètes ou défectueux',
    'Inspection complète de votre installation',
    'Conformité garantie aux normes en vigueur',
  ],
];

const FEATURES_EN = [
  [
    'Compliant with Quebec Building Code',
    'Wiring, outlets, fixtures and breakers',
    'New homes and complete renovations',
    'Certification and permits included',
  ],
  [
    'Three-phase and high-power systems',
    'Optimized lighting for commercial and office spaces',
    'CSA standards compliance',
    'Detailed quote before any work begins',
  ],
  [
    'Response within 2 hours',
    'Available nights, weekends and holidays',
    'Fast diagnosis of outages and short circuits',
    'Coverage across Greater Montreal',
  ],
  [
    'Compatible with Tesla, Grizzl-E and all brands',
    'Level 2 (240V) residential & commercial installation',
    'Eligible for government subsidies',
    'RBQ certification included',
  ],
  [
    '100A, 150A, 200A, 320A and 400A upgrades',
    'Replacement of outdated or faulty panels',
    'Complete installation inspection',
    'Guaranteed compliance with current standards',
  ],
];

const SERVICE_ICONS = [Zap, Building2, AlertCircle, Car, LayoutGrid];
const SERVICE_ANCHORS = ['residentiel', 'commercial', 'urgence', 'bornes', 'panneaux'];
const SERVICE_IMAGES = [
  { src: '/images/services/residential-electrical.jpg', alt: 'Installation électrique résidentielle à Montréal' },
  { src: '/images/services/commercial-electrical.jpg', alt: 'Installation électrique commerciale à Montréal' },
  { src: '/images/services/emergency-service.jpg', alt: "Service d'urgence électrique 24/7 à Montréal" },
  { src: '/images/services/ev-charging.jpg', alt: 'Installation de borne de recharge EV à Montréal' },
  { src: '/images/services/electrical-panel.jpg', alt: 'Mise à niveau de panneau électrique à Montréal' },
];

/* ─────────────────────────────────────
   Main export
───────────────────────────────────── */
export default function ServicesPage() {
  const t = useTranslations('services');
  const cta = useTranslations('cta');
  const locale = useLocale();

  const ctaLabel = locale === 'fr' ? 'Demander une soumission' : 'Request a Quote';
  const features = locale === 'fr' ? FEATURES_FR : FEATURES_EN;

  const services = Array.from({ length: 5 }, (_, i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    icon: SERVICE_ICONS[i],
    anchor: SERVICE_ANCHORS[i],
    image: SERVICE_IMAGES[i],
    features: features[i],
  }));

  const bottomCTARef = useRef(null);
  const bottomCTAInView = useInView(bottomCTARef, { once: true });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            provider: { '@type': 'LocalBusiness', name: 'Topal Électrique' },
            serviceType: 'Electrical Services',
            areaServed: [
              'Montréal', 'Laval', 'Longueuil', 'Brossard', 'Terrebonne', 'Mirabel',
              'Saint-Sauveur', 'Blainville', 'Repentigny', 'Saint-Eustache',
              'Saint-Marthe-sur-le-Lac', 'Delson', 'Sainte-Catherine', 'Saint-Constant', 'Richelieu',
            ],
          }),
        }}
      />

      <Hero heading={t('heading')} subtitle={t('subtitle')} locale={locale} />
      <StatsStrip locale={locale} />
      <ServiceNav locale={locale} />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {services.map((service, i) => (
        <ServiceSection
          key={i}
          index={i}
          anchor={service.anchor}
          icon={service.icon}
          title={service.title}
          description={service.description}
          features={service.features}
          image={service.image}
          ctaLabel={ctaLabel}
          isUrgence={i === 2}
          locale={locale}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <ServiceAreaMap locale={locale} />

      {/* Bottom CTA */}
      <section className="py-20 px-4 md:px-6 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,107,0,0.07) 0%, transparent 65%)' }}
        />
        <motion.div
          ref={bottomCTARef}
          initial={{ opacity: 0, y: 30 }}
          animate={bottomCTAInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-5">{cta('heading')}</h2>
          <p className="text-gray-400 text-lg mb-10">{cta('subtitle')}</p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-orange-500 hover:bg-orange-400 px-10 py-4 text-lg font-semibold text-white transition-all duration-300"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          >
            {cta('primary')}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}
