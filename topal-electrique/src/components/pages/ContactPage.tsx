'use client';

import { useTranslations } from 'next-intl';
import { Phone, Mail, Clock, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { PHONE, PHONE_LINK, EMAIL } from '@/lib/constants';

export default function ContactPage() {
  const t = useTranslations('contact');

  const serviceOptions: string[] = Array.from({ length: 6 }, (_, i) =>
    t(`serviceOptions.${i}`),
  );

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
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            {t('title')}
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

      {/* Two-column layout: form + contact info */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column: Form */}
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="space-y-6"
          >
            <input type="hidden" name="access_key" value="ab078f3b-18f0-435a-a5b0-1a6c9d3b1777" />
            <input type="hidden" name="subject" value="Nouvelle demande de soumission — Topal Électrique" />
            <input type="hidden" name="from_name" value="Topal Électrique — Site web" />
            {/* Name */}
            <div>
              <label htmlFor="name" className="sr-only">
                {t('form.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder={t('form.name')}
                className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                {t('form.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t('form.email')}
                className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="sr-only">
                {t('form.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={t('form.phone')}
                className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors w-full"
              />
            </div>

            {/* Service select */}
            <div>
              <label htmlFor="service" className="sr-only">
                {t('form.service')}
              </label>
              <select
                id="service"
                name="service"
                required
                defaultValue=""
                className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors w-full"
              >
                <option value="" disabled className="text-gray-500">
                  {t('form.service')}
                </option>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="sr-only">
                {t('form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder={t('form.message')}
                className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors w-full resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 rounded-full px-8 py-3 font-semibold text-white w-full transition-colors"
            >
              {t('form.submit')}
            </button>
          </form>

          {/* Right column: Contact info cards */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="bg-dark-800 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Phone className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('form.phone')}
                  </p>
                  <a
                    href={PHONE_LINK}
                    className="text-lg font-semibold text-white hover:text-orange-500 transition-colors"
                  >
                    {PHONE}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-dark-800 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('form.email')}
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-lg font-semibold text-white hover:text-orange-500 transition-colors"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-dark-800 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Horaires</p>
                  <p className="text-lg font-semibold text-white">
                    {t('hours')}
                  </p>
                </div>
              </div>
            </div>

            {/* Service area */}
            <div className="bg-dark-800 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Zone de service</p>
                  <p className="text-lg font-semibold text-white">
                    {t('area')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
