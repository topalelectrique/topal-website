'use client';

import { useLocale } from 'next-intl';
import { COMPANY_NAME, EMAIL, SITE_URL } from '@/lib/constants';
import { motion } from 'framer-motion';

const content = {
  fr: {
    title: 'Politique de confidentialité',
    lastUpdate: 'Dernière mise à jour : Mars 2026',
    sections: [
      {
        title: 'Collecte de renseignements',
        text: `${COMPANY_NAME} recueille les renseignements personnels que vous nous fournissez volontairement via notre formulaire de contact, notamment votre nom, adresse courriel, numéro de téléphone et le détail de votre demande. Ces informations sont collectées uniquement dans le but de répondre à votre demande de service ou de soumission.`,
      },
      {
        title: 'Utilisation des renseignements',
        text: 'Les renseignements personnels collectés sont utilisés exclusivement pour : répondre à vos demandes de soumission ou de renseignements, vous contacter concernant nos services électriques, améliorer notre service à la clientèle et respecter nos obligations légales.',
      },
      {
        title: 'Protection des renseignements',
        text: 'Nous nous engageons à protéger vos renseignements personnels. Nous mettons en place des mesures de sécurité appropriées pour prévenir tout accès non autorisé, toute divulgation, modification ou destruction de vos données personnelles.',
      },
      {
        title: 'Partage des renseignements',
        text: 'Nous ne vendons, n\'échangeons ni ne transférons vos renseignements personnels à des tiers, sauf si la loi l\'exige ou si cela est nécessaire pour la prestation de nos services (par exemple, traitement des paiements).',
      },
      {
        title: 'Témoins (Cookies)',
        text: 'Notre site web peut utiliser des témoins (cookies) pour améliorer l\'expérience utilisateur et analyser le trafic du site via des outils d\'analyse. Vous pouvez configurer votre navigateur pour refuser les témoins.',
      },
      {
        title: 'Vos droits',
        text: `Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25), vous avez le droit d'accéder à vos renseignements personnels, de les rectifier ou de demander leur suppression. Pour exercer ces droits, contactez-nous à ${EMAIL}.`,
      },
      {
        title: 'Modifications',
        text: `${COMPANY_NAME} se réserve le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour.`,
      },
      {
        title: 'Contact',
        text: `Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à ${EMAIL}.`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdate: 'Last updated: March 2026',
    sections: [
      {
        title: 'Information Collection',
        text: `${COMPANY_NAME} collects personal information that you voluntarily provide through our contact form, including your name, email address, phone number and details of your request. This information is collected solely to respond to your service or quote request.`,
      },
      {
        title: 'Use of Information',
        text: 'Personal information collected is used exclusively to: respond to your quote or information requests, contact you regarding our electrical services, improve our customer service and comply with our legal obligations.',
      },
      {
        title: 'Information Protection',
        text: 'We are committed to protecting your personal information. We implement appropriate security measures to prevent unauthorized access, disclosure, modification or destruction of your personal data.',
      },
      {
        title: 'Information Sharing',
        text: 'We do not sell, trade or transfer your personal information to third parties, unless required by law or necessary for the provision of our services (e.g., payment processing).',
      },
      {
        title: 'Cookies',
        text: 'Our website may use cookies to enhance the user experience and analyze site traffic through analytics tools. You can configure your browser to refuse cookies.',
      },
      {
        title: 'Your Rights',
        text: `In accordance with Quebec's Act Respecting the Protection of Personal Information in the Private Sector (Law 25), you have the right to access, correct or request the deletion of your personal information. To exercise these rights, contact us at ${EMAIL}.`,
      },
      {
        title: 'Changes',
        text: `${COMPANY_NAME} reserves the right to modify this privacy policy at any time. Any changes will be posted on this page with the updated date.`,
      },
      {
        title: 'Contact',
        text: `For any questions regarding this privacy policy, please contact us at ${EMAIL}.`,
      },
    ],
  },
};

export default function PrivacyPage() {
  const locale = useLocale() as 'fr' | 'en';
  const c = content[locale];

  return (
    <>
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
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">{c.title}</h1>
          <p className="text-gray-500 text-sm">{c.lastUpdate}</p>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-dark-950))' }}
        />
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {c.sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-heading text-xl font-semibold text-white mb-4">
                {i + 1}. {section.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
