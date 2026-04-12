'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Easing helper (ease-out cubic) ─── */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ─── Animated counter ─── */
interface CounterProps {
  target: number;
  suffix: string;
  label: string;
  started: boolean;
  duration?: number;
}

function Counter({ target, suffix, label, started, duration = 2000 }: CounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();

    let raf: number;
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <div className="flex flex-col items-center">
      <span className="font-heading text-4xl font-bold text-orange-500 md:text-5xl">
        {value}
        {suffix}
      </span>
      <span className="mt-2 text-gray-400">{label}</span>
    </div>
  );
}

/* ─── Marquee ticker ─── */
const MARQUEE_TEXT =
  'Électricien certifié \u00A0\u2022\u00A0 Montréal & Grand Montréal \u00A0\u2022\u00A0 Service 24/7 \u00A0\u2022\u00A0 Résidentiel & Commercial \u00A0\u2022\u00A0 Bornes de recharge EV \u00A0\u2022\u00A0 Panneaux électriques \u00A0\u2022\u00A0 ';

function Marquee() {
  return (
    <div className="mt-12 overflow-hidden border-t border-white/5 pt-8">
      <div
        className="flex whitespace-nowrap text-sm uppercase tracking-widest text-gray-500"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {/* Duplicate text for seamless loop */}
        <span className="shrink-0">{MARQUEE_TEXT}</span>
        <span className="shrink-0">{MARQUEE_TEXT}</span>
      </div>
    </div>
  );
}

/* ─── TrustBar section ─── */
export default function TrustBar() {
  const t = useTranslations('trust');
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) {
        setStarted(true);
      }
    },
    [],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  /* Parse numeric targets from translations */
  const counters: { target: number; suffix: string; label: string }[] = [
    { target: 1000, suffix: '+', label: t('projectsLabel') },
    { target: 20, suffix: '+', label: t('yearsLabel') },
    { target: 100, suffix: '%', label: t('satisfactionLabel') },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16"
      style={{
        background: 'linear-gradient(to bottom, var(--color-dark-950), var(--color-dark-900) 30%, var(--color-dark-900) 70%, var(--color-dark-950))',
      }}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Counters */}
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {counters.map((c) => (
            <Counter key={c.label} {...c} started={started} />
          ))}
        </div>

        {/* Marquee ticker */}
        <Marquee />
      </div>
    </section>
  );
}
