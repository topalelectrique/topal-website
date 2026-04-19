'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PHONE, PHONE_LINK } from '@/lib/constants';
import { useArticleContext } from '@/context/article-context';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/' as const, label: t('home') },
    { href: '/services' as const, label: t('services') },
    { href: '/a-propos' as const, label: t('about') },
    { href: '/projets' as const, label: t('projects') },
    { href: '/conseils' as const, label: t('blog') },
    { href: '/contact' as const, label: t('contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const { pairedSlug, pairedLocale } = useArticleContext();

  const switchLocale = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    if (pairedSlug && pairedLocale === newLocale) {
      const pairedPath = newLocale === 'en' ? `/blog/${pairedSlug}` : `/conseils/${pairedSlug}`;
      router.push(pairedPath as '/', { locale: newLocale });
    } else {
      router.replace(pathname as '/', { locale: newLocale });
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* ── Logo ── */}
            <Link href="/" className="group flex items-center gap-2">
              <Image src="/images/logo.png" alt="Topal Électrique" width={40} height={40} className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-tight text-orange-500 leading-none transition-colors group-hover:text-orange-400">
                  TOPAL
                </span>
                <span className="font-heading text-[0.5rem] font-medium uppercase tracking-[0.15em] text-white/60 leading-none transition-colors group-hover:text-white/80">
                  ÉLECTRIQUE
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-300',
                    isActive(item.href)
                      ? 'text-orange-500'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-orange-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Right ── */}
            <div className="hidden items-center gap-3 lg:flex">
              {/* Language Toggle */}
              <button
                onClick={switchLocale}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-orange-500/40 hover:text-white"
              >
                {locale === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Phone */}
              <a
                href={PHONE_LINK}
                className="flex items-center gap-2 text-sm text-white/70 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="hidden xl:inline">{PHONE}</span>
              </a>

              {/* CTA */}
              <Link
                href="/contact"
                className="relative rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-400 hover:shadow-orange-500/40"
              >
                <span className="relative z-10">{t('cta')}</span>
                <span className="absolute inset-0 rounded-lg bg-orange-500 opacity-0 blur-xl transition-opacity duration-300 hover:opacity-50" />
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark-950/95 backdrop-blur-xl lg:hidden overflow-y-auto"
          >
            <div className="flex min-h-full flex-col items-center justify-center gap-1 px-6 py-24">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block py-2 text-center text-xl font-heading font-semibold transition-colors duration-300',
                      isActive(item.href)
                        ? 'text-orange-500'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile bottom actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.35,
                  delay: navItems.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 flex flex-col items-center gap-3"
              >
                <a
                  href={PHONE_LINK}
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-orange-500" />
                  {PHONE}
                </a>

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-400"
                >
                  {t('cta')}
                </Link>

                <button
                  onClick={() => {
                    switchLocale();
                    setMobileOpen(false);
                  }}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition-all hover:border-orange-500/40 hover:text-white"
                >
                  {locale === 'fr' ? 'English' : 'Français'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
