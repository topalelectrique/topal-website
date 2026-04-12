'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useCallback } from 'react';

function StarRating() {
  return (
    <div className="mb-4 flex gap-1 text-orange-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

interface TestimonialItem {
  name: string;
  location: string;
  text: string;
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="min-w-[320px] max-w-[380px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-orange-500/30">
      <StarRating />
      <p className="mb-6 text-sm italic leading-relaxed text-gray-300">
        &ldquo;{item.text}&rdquo;
      </p>
      <div>
        <p className="font-semibold text-white">{item.name}</p>
        <p className="text-sm text-gray-500">{item.location}</p>
      </div>
    </div>
  );
}

const SPEED_PX_PER_SEC = 50;

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const items: TestimonialItem[] = Array.from({ length: 7 }, (_, i) => ({
    name: t(`items.${i}.name`),
    location: t(`items.${i}.location`),
    text: t(`items.${i}.text`),
  }));

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const lastTime = useRef<number | null>(null);
  const rafRef = useRef<number>(undefined);

  const animate = useCallback((timestamp: number) => {
    if (lastTime.current === null) lastTime.current = timestamp;
    const delta = timestamp - lastTime.current;
    lastTime.current = timestamp;

    const track = trackRef.current;
    if (track && !isPaused.current) {
      const halfWidth = track.scrollWidth / 2;
      offsetRef.current += (SPEED_PX_PER_SEC * delta) / 1000;
      if (halfWidth > 0 && offsetRef.current >= halfWidth) {
        offsetRef.current -= halfWidth;
      }
      track.style.transform = `translateX(-${offsetRef.current}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  /* ── Mouse drag handlers ── */
  const onMouseEnter = () => { isPaused.current = true; };

  const onMouseLeave = () => {
    isDragging.current = false;
    isPaused.current = false;
    lastTime.current = null; // reset so no jump after pause
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = dragStartX.current - e.clientX;
    const halfWidth = trackRef.current.scrollWidth / 2;
    let next = dragStartOffset.current + delta;
    // keep within [0, halfWidth)
    next = ((next % halfWidth) + halfWidth) % halfWidth;
    offsetRef.current = next;
    trackRef.current.style.transform = `translateX(-${next}px)`;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  /* ── Touch handlers ── */
  const onTouchStart = (e: React.TouchEvent) => {
    isPaused.current = true;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartOffset.current = offsetRef.current;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = dragStartX.current - e.touches[0].clientX;
    const halfWidth = trackRef.current.scrollWidth / 2;
    let next = dragStartOffset.current + delta;
    next = ((next % halfWidth) + halfWidth) % halfWidth;
    offsetRef.current = next;
    trackRef.current.style.transform = `translateX(-${next}px)`;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    isPaused.current = false;
    lastTime.current = null;
  };

  return (
    <section className="overflow-hidden py-24 px-6">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-4xl font-bold text-white">
          {t('heading')}
        </h2>
        <p className="mt-4 text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Draggable carousel */}
      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
        >
          {[...items, ...items].map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
