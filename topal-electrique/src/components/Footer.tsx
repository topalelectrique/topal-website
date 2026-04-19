'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PHONE, PHONE_LINK, EMAIL, COMPANY_NAME, SOCIAL_LINKS } from '@/lib/constants';

/* ── Social Icons ── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.77-1.84V6.69h3.77z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  const navItems = [
    { href: '/' as const, label: nav('home') },
    { href: '/services' as const, label: nav('services') },
    { href: '/a-propos' as const, label: nav('about') },
    { href: '/projets' as const, label: nav('projects') },
    { href: '/contact' as const, label: nav('contact') },
  ];

  const services = [
    t('service1'),
    t('service2'),
    t('service3'),
    t('service4'),
    t('service5'),
  ];

  return (
    <footer className="bg-dark-900 border-t border-white/10">
      {/* ── Main Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2">
              <Image src="/images/logo.png" alt="Topal Électrique" width={36} height={36} className="h-9 w-auto" />
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-tight text-orange-500 transition-colors group-hover:text-orange-400 leading-none">
                  TOPAL
                </span>
                <span className="font-heading text-[0.5rem] font-medium uppercase tracking-[0.15em] text-white/60 leading-none">
                  ÉLECTRIQUE
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {t('description')}
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all duration-300 hover:border-orange-500/40 hover:text-orange-500"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all duration-300 hover:border-orange-500/40 hover:text-orange-500"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all duration-300 hover:border-orange-500/40 hover:text-orange-500"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/50 transition-colors duration-300 hover:text-orange-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {t('ourServices')}
            </h3>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-white/50 transition-colors duration-300 hover:text-orange-500"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact Info */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {t('contactInfo')}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={PHONE_LINK}
                  className="flex items-center gap-3 text-sm text-white/50 transition-colors duration-300 hover:text-orange-500"
                >
                  <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-sm text-white/50 transition-colors duration-300 hover:text-orange-500"
                >
                  <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/50">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div>
                  <p>{t('hours')}</p>
                  <p>{t('hoursWeekend')}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                {t('serviceArea')}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Certifications ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <Image
              src="/images/CMEQ_LOGO_signature_Hori_blanc_rgb.png"
              alt="Membre CMEQ — Corporation des maîtres électriciens du Québec"
              width={140}
              height={48}
              className="h-10 w-auto opacity-60"
            />
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="font-semibold uppercase tracking-widest text-white/50">RBQ</span>
              <span className="font-mono">8317-3658-34</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. {t('copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/confidentialite"
              className="text-xs text-white/40 transition-colors duration-300 hover:text-white/70"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/conditions"
              className="text-xs text-white/40 transition-colors duration-300 hover:text-white/70"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
