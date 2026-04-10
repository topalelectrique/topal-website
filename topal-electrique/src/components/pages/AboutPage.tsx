'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Phone, ArrowRight, ShieldCheck, Zap,
  Award, CheckCircle, ChevronDown,
  MessageSquare, MapPin, FileText, Wrench,
} from 'lucide-react';
import { PHONE, PHONE_LINK } from '@/lib/constants';

/* ─────────────────────────────────────
   Parallax glow blob
───────────────────────────────────── */
function ParallaxGlow({ side }: { side: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y }}
        className={`absolute w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] bg-orange-500 ${side === 'left' ? '-left-40 top-0' : '-right-40 top-0'}`}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   Horizontal reveal accent line
───────────────────────────────────── */
function RevealLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, originX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-px bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent"
    />
  );
}

/* ─────────────────────────────────────
   Why Choose Card — 3D tilt on hover
───────────────────────────────────── */
const REASON_ICONS = [Award, Zap, ShieldCheck, CheckCircle];

function ReasonCard({
  icon: Icon, title, description, index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, hover: false });
  const inView = useInView(cardRef, { once: true, margin: '-60px' });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.transform = `perspective(800px) rotateX(${((y - r.height / 2) / r.height) * -8}deg) rotateY(${((x - r.width / 2) / r.width) * 8}deg) scale3d(1.02,1.02,1.02)`;
    setMouse({ x, y, hover: true });
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    setMouse(p => ({ ...p, hover: false }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-dark-800 border border-white/5 p-8"
      style={{ willChange: 'transform', transitionDuration: mouse.hover ? '100ms' : '500ms', transitionProperty: 'transform' }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: mouse.hover ? 1 : 0,
          background: `radial-gradient(350px circle at ${mouse.x}px ${mouse.y}px, rgba(255,107,0,0.12), transparent 60%)`,
        }}
      />
      <span className="absolute top-4 right-6 font-heading text-7xl font-bold text-white/[0.03] select-none leading-none">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative z-10">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
        <h3 className="font-heading text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   Why Choose section header
───────────────────────────────────── */
function WhyChooseHeader({ label, title }: { label: string; title: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 block mb-3">{label}</span>
      <h2 className="font-heading text-3xl md:text-5xl font-bold">{title}</h2>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   Certification strip
───────────────────────────────────── */
function CertStrip({ items }: { items: { icon: React.ComponentType<{ className?: string }>; title: string; sub: string }[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map(({ icon: Icon, title, sub }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <div className="h-11 w-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   VALUES MANIFESTO — scroll-activated rows

   Each value row "lights up" as it reaches
   the center of the viewport while scrolling.
   Orange left bar draws in, number glows,
   statement reveals. Mobile-native (scroll-driven,
   no hover dependency).
───────────────────────────────────── */

interface ValueItem {
  num: string;
  name: string;
  statement: string;
}

function ValueRow({
  item,
  index,
  isActive,
  onMount,
}: {
  item: ValueItem;
  index: number;
  isActive: boolean;
  onMount: (i: number, el: HTMLDivElement | null) => void;
}) {
  const animRef = useRef<HTMLDivElement>(null);
  const hasEntered = useInView(animRef, { once: true, margin: '-60px' });

  const setOuterRef = useCallback(
    (el: HTMLDivElement | null) => { onMount(index, el); },
    [index, onMount],
  );

  return (
    <div ref={setOuterRef} className="relative">
      {/* Animated left orange bar */}
      <motion.div
        animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange-500 origin-top"
        style={{ borderRadius: 1 }}
      />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />

      {/* Entrance animation wrapper */}
      <motion.div
        ref={animRef}
        initial={{ opacity: 0, x: -28 }}
        animate={hasEntered ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr] gap-4 md:gap-8 px-5 md:px-10 py-8 md:py-12 items-start"
      >
        {/* Number */}
        <motion.span
          animate={{
            color: isActive ? '#FF6B00' : 'rgba(255,255,255,0.08)',
          }}
          transition={{ duration: 0.4 }}
          className="font-heading text-2xl md:text-3xl font-bold leading-none pt-1 md:pt-3 tabular-nums select-none"
        >
          {item.num}
        </motion.span>

        <div className="min-w-0">
          {/* Value name */}
          <motion.h3
            animate={{
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.28)',
              letterSpacing: isActive ? '0.02em' : '0.05em',
            }}
            transition={{ duration: 0.4 }}
            className="font-heading font-black uppercase leading-[0.9] mb-0"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
          >
            {item.name}
          </motion.h3>

          {/* Statement — slides down on activation */}
          <motion.div
            animate={{
              height: isActive ? 'auto' : 0,
              opacity: isActive ? 1 : 0,
              marginTop: isActive ? '1rem' : 0,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-orange-500/30 pl-4 italic">
              {item.statement}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const VALUES_FR: ValueItem[] = [
  {
    num: '01',
    name: 'Rigueur',
    statement: 'Chaque fil, chaque connexion, chaque détail. On ne quitte pas un chantier avant d\'avoir tout vérifié deux fois — sans exception.',
  },
  {
    num: '02',
    name: 'Intégrité',
    statement: 'On vous dit ce que vous avez besoin d\'entendre, même si ça signifie moins de travail pour nous. L\'honnêteté, ça se remarque.',
  },
  {
    num: '03',
    name: 'Sécurité',
    statement: 'L\'électricité ne pardonne pas les erreurs. Nos maîtres en ont fait une obsession personnelle — pas une case à cocher.',
  },
  {
    num: '04',
    name: 'Satisfaction',
    statement: 'Votre domicile, traité comme si c\'était le nôtre. Notre réputation se bâtit un client à la fois — et on en est pleinement conscients.',
  },
  {
    num: '05',
    name: 'CMEQ',
    statement: 'Certifiés — pas parce qu\'on y est obligés. Parce que vous méritez quelqu\'un qui a réellement prouvé ce qu\'il vaut.',
  },
];

const VALUES_EN: ValueItem[] = [
  {
    num: '01',
    name: 'Precision',
    statement: 'Every wire, every connection, every detail. We don\'t leave a job until we\'ve checked it twice — without exception.',
  },
  {
    num: '02',
    name: 'Integrity',
    statement: 'We tell you what you need to hear, even when it means less work for us. Honesty shows.',
  },
  {
    num: '03',
    name: 'Safety',
    statement: 'Electricity doesn\'t forgive mistakes. Our master electricians have made it a personal obsession — not a box to check.',
  },
  {
    num: '04',
    name: 'Satisfaction',
    statement: 'Your home, treated like ours. Our reputation is built one client at a time — and we\'re fully aware of that.',
  },
  {
    num: '05',
    name: 'CMEQ',
    statement: 'Certified — not because we have to be. Because you deserve someone who actually earned it.',
  },
];

function ValuesManifesto({ isFr }: { isFr: boolean }) {
  const values = isFr ? VALUES_FR : VALUES_EN;
  const [activeIndex, setActiveIndex] = useState(-1);
  const rowEls = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const onMount = useCallback((i: number, el: HTMLDivElement | null) => {
    rowEls.current[i] = el;
  }, []);

  /* Scroll listener — activates whichever row center is closest to viewport center */
  useEffect(() => {
    const tick = () => {
      const vh = window.innerHeight;
      const center = vh * 0.5;
      let best = -1;
      let bestDist = vh * 0.38; // only activate when within 38% of center

      rowEls.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });

      setActiveIndex(best);
    };

    window.addEventListener('scroll', tick, { passive: true });
    tick();
    return () => window.removeEventListener('scroll', tick);
  }, []);

  const sectionTitle = isFr ? 'Ce en quoi nous croyons' : 'What we stand for';
  const sectionLabel = isFr ? 'Nos valeurs' : 'Our values';

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 30%, rgba(255,107,0,0.03) 0%, transparent 70%)' }}
      />
      {/* Top fade — blends with section above */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-32"
        style={{ background: 'linear-gradient(to bottom, var(--color-dark-950), transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
            {sectionLabel}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-end justify-between mb-10 md:mb-14 gap-6"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight max-w-md">
            {sectionTitle}
          </h2>
          <p className="hidden md:block text-gray-500 text-sm max-w-xs text-right">
            {isFr
              ? 'Faites défiler pour découvrir ce qui nous définit.'
              : 'Scroll through what defines us.'}
          </p>
        </motion.div>

        {/* Top border */}
        <RevealLine />

        {/* Value rows */}
        <div className="mt-0">
          {values.map((v, i) => (
            <ValueRow
              key={i}
              item={v}
              index={i}
              isActive={activeIndex === i}
              onMount={onMount}
            />
          ))}
        </div>

        {/* Scroll hint — only visible before interaction, fades out */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: activeIndex >= 0 ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="mt-6 flex items-center gap-2 text-gray-600 text-xs"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
          {isFr ? 'Faites défiler' : 'Scroll down'}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Process Section — scroll-driven timeline
───────────────────────────────────── */
const STEP_ICONS_ABOUT = [MessageSquare, MapPin, FileText, Wrench, ShieldCheck];

function DesktopStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = step.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative mb-6 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.2, ease: 'backOut' }}
          className="h-[76px] w-[76px] rounded-full bg-dark-800 border-2 border-white/10 flex items-center justify-center relative"
          style={{ boxShadow: '0 0 0 4px rgba(10,10,10,1)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12 + 0.35 }}
            className="absolute inset-0 rounded-full border border-orange-500/40"
            style={{ boxShadow: '0 0 16px rgba(255,107,0,0.25)' }}
          />
          <Icon className="h-7 w-7 text-orange-500" />
        </motion.div>
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {index + 1}
        </span>
      </div>
      <h3 className="font-heading font-bold text-white text-sm mb-2 leading-tight">{step.title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
    </motion.div>
  );
}

function MobileStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = step.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="absolute -left-[52px] top-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.45, delay: index * 0.08 + 0.15, ease: 'backOut' }}
          className="h-14 w-14 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center relative"
          style={{ boxShadow: '0 0 0 3px #0a0a0a, 0 0 12px rgba(255,107,0,0.2)' }}
        >
          <Icon className="h-6 w-6 text-orange-500" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
        </motion.div>
      </div>
      <div className="rounded-xl bg-dark-800 border border-white/5 p-5">
        <h3 className="font-heading font-bold text-white mb-1">{step.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

interface ProcessStep {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

function ProcessSection({ isFr }: { isFr: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 40%'],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps: ProcessStep[] = isFr
    ? [
        { num: '01', icon: STEP_ICONS_ABOUT[0], title: 'Prise de contact', desc: 'Appelez-nous ou remplissez le formulaire. On répond rapidement — souvent le jour même.' },
        { num: '02', icon: STEP_ICONS_ABOUT[1], title: 'Évaluation sur place', desc: 'Nous visitons vos lieux pour bien comprendre vos besoins et contraintes techniques.' },
        { num: '03', icon: STEP_ICONS_ABOUT[2], title: 'Soumission détaillée', desc: 'Vous recevez un devis écrit, transparent, sans frais cachés — avant tout début des travaux.' },
        { num: '04', icon: STEP_ICONS_ABOUT[3], title: 'Réalisation des travaux', desc: 'Nos maîtres électriciens certifiés interviennent proprement et dans les délais convenus.' },
        { num: '05', icon: STEP_ICONS_ABOUT[4], title: 'Inspection & garantie', desc: 'Les travaux sont inspectés, certifiés conformes et couverts par notre garantie.' },
      ]
    : [
        { num: '01', icon: STEP_ICONS_ABOUT[0], title: 'Get in touch', desc: 'Call us or fill in the form. We respond quickly — often the same day.' },
        { num: '02', icon: STEP_ICONS_ABOUT[1], title: 'On-site assessment', desc: 'We visit your property to fully understand your needs and technical constraints.' },
        { num: '03', icon: STEP_ICONS_ABOUT[2], title: 'Detailed quote', desc: 'You receive a written, transparent quote — no hidden fees, before any work starts.' },
        { num: '04', icon: STEP_ICONS_ABOUT[3], title: 'Work execution', desc: 'Our certified master electricians work cleanly and within the agreed timeline.' },
        { num: '05', icon: STEP_ICONS_ABOUT[4], title: 'Inspection & warranty', desc: 'All work is inspected, code-certified, and covered by our workmanship warranty.' },
      ];

  const sectionTitle = isFr ? 'Comment ça marche' : 'How it works';
  const sectionLabel = isFr ? 'Notre processus' : 'Our process';

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,0,0.04) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 block mb-3">{sectionLabel}</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">{sectionTitle}</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            {isFr
              ? 'De votre premier appel à la garantie finale — voici exactement comment nous travaillons.'
              : 'From your first call to the final warranty — here is exactly how we work.'}
          </p>
        </motion.div>

        {/* Desktop: horizontal */}
        <div ref={sectionRef} className="hidden md:block relative">
          <div className="absolute top-[38px] left-[10%] right-[10%] h-px bg-white/5" />
          <motion.div
            className="absolute top-[38px] left-[10%] right-[10%] h-px origin-left"
            style={{ scaleX: lineScaleX, background: 'linear-gradient(to right, #FF6B00, rgba(255,107,0,0.3))' }}
          />
          <div className="relative grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <DesktopStepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-white/5" />
          <motion.div
            className="absolute left-[27px] top-4 w-px origin-top"
            style={{ scaleY: lineScaleY, background: 'linear-gradient(to bottom, #FF6B00, rgba(255,107,0,0.2))', height: 'calc(100% - 2rem)' }}
          />
          <div className="space-y-8 pl-16">
            {steps.map((step, i) => (
              <MobileStepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Main export
───────────────────────────────────── */
export default function AboutPage() {
  const t = useTranslations('about');
  const cta = useTranslations('cta');
  const locale = useLocale();
  const isFr = locale === 'fr';

  const reasons = Array.from({ length: 4 }, (_, i) => ({
    title: t(`whyChoose.reasons.${i}.title`),
    description: t(`whyChoose.reasons.${i}.description`),
  }));

  const heroWords = (t('title') as string).split(' ');

  const certItems = isFr
    ? [
        { icon: Award, title: 'Maîtres électriciens', sub: 'Licenciés par la CMEQ' },
        { icon: ShieldCheck, title: 'Code du Québec', sub: 'Tous travaux conformes CCQ' },
        { icon: Zap, title: 'Urgence 24/7', sub: 'Intervention rapide' },
        { icon: CheckCircle, title: 'Satisfaction garantie', sub: 'Chaque projet, sans exception' },
      ]
    : [
        { icon: Award, title: 'Master electricians', sub: 'Licensed by the CMEQ' },
        { icon: ShieldCheck, title: 'Quebec Code', sub: 'All work QBC-compliant' },
        { icon: Zap, title: '24/7 Emergency', sub: 'Fast response time' },
        { icon: CheckCircle, title: 'Satisfaction guaranteed', sub: 'Every project, every time' },
      ];

  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: '-80px' });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Topal Électrique',
            description: t('description'),
            telephone: PHONE,
            areaServed: 'Grand Montréal, Rive-Nord, Rive-Sud',
            hasCredential: 'CMEQ — Corporation des maîtres électriciens du Québec',
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center pt-24 pb-0 md:pt-32 px-4 min-h-[70vh]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,0,0.09) 0%, transparent 60%), linear-gradient(to bottom, var(--color-dark-950) 0%, var(--color-dark-900) 50%, var(--color-dark-950) 100%)' }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-orange-500/50"
              style={{ width: i % 3 === 0 ? 6 : 3, height: i % 3 === 0 ? 6 : 3, left: `${10 + i * 11}%`, top: `${20 + (i % 4) * 15}%` }}
              animate={{ y: [0, -(14 + i * 3), 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-8"
          >
            <Zap className="h-3 w-3" />
            {locale === 'fr' ? '20 ans d\'expérience · 1 000+ projets · Certifié CMEQ' : '20 years · 1,000+ projects · CMEQ Certified'}
          </motion.div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 36, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.65, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            {t('subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="flex flex-col items-center gap-1 text-gray-600">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-48"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-dark-950))' }}
        />
      </section>

      {/* ── Mission statement ── */}
      <section className="relative py-24 md:py-32 px-4">
        <ParallaxGlow side="left" />
        {/* Top fade — blends with hero above */}
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-32"
          style={{ background: 'linear-gradient(to bottom, var(--color-dark-950), transparent)' }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <RevealLine />
          <div ref={missionRef} className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              <div className="lg:sticky lg:top-32">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 block mb-3">{t('label')}</span>
                <div className="hidden lg:block h-12 w-px bg-gradient-to-b from-orange-500/60 to-transparent ml-0.5" />
              </div>
            </motion.div>
            <div className="lg:col-span-9 space-y-8">
              <motion.blockquote
                initial={{ opacity: 0, y: 24 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="absolute -top-4 -left-2 text-8xl text-orange-500/15 font-serif leading-none select-none" aria-hidden>&ldquo;</span>
                <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-100 pl-6">{t('mission')}</p>
              </motion.blockquote>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="text-gray-400 leading-relaxed text-lg"
              >
                {t('description')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.38 }}
                className="text-gray-500 leading-relaxed"
              >
                {t('values')}
              </motion.p>
            </div>
          </div>
          <RevealLine delay={0.2} />
        </div>
      </section>

      {/* ── Values manifesto ── */}
      <ValuesManifesto isFr={isFr} />

      {/* ── Why Choose ── */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <ParallaxGlow side="right" />
        <div className="max-w-6xl mx-auto relative z-10">
          <WhyChooseHeader label={t('label')} title={t('whyChoose.title')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((r, i) => (
              <ReasonCard key={i} icon={REASON_ICONS[i]} title={r.title} description={r.description} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Process timeline ── */}
      <ProcessSection isFr={isFr} />

      {/* ── Certifications strip ── */}
      <section className="py-16 px-4 border-y border-white/5 bg-dark-900/60">
        <CertStrip items={certItems} />
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,107,0,0.07) 0%, transparent 65%)' }} />
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 32 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-5">{cta('heading')}</h2>
          <p className="text-gray-400 text-lg mb-10">{cta('subtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 px-10 py-4 text-lg font-semibold text-white transition-all duration-300"
              style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
            >
              {cta('primary')}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={PHONE_LINK}
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 hover:border-orange-500 px-8 py-4 font-semibold text-orange-400 hover:text-orange-300 transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
              {PHONE}
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
