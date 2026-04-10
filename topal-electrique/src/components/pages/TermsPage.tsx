'use client';

import { useLocale } from 'next-intl';
import { COMPANY_NAME, EMAIL, SITE_URL } from '@/lib/constants';
import { motion } from 'framer-motion';

const content = {
  fr: {
    title: "Conditions d'utilisation",
    lastUpdate: 'Dernière mise à jour : Mars 2026',
    sections: [
      {
        title: 'Acceptation des conditions',
        text: `En accédant au site web de ${COMPANY_NAME} (${SITE_URL}), vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.`,
      },
      {
        title: 'Description des services',
        text: `${COMPANY_NAME} est une entreprise d'électriciens certifiés offrant des services d'installation électrique résidentielle et commerciale, de dépannage et d'urgence dans la région du Grand Montréal. Les informations présentées sur ce site sont à titre informatif et ne constituent pas un contrat de service.`,
      },
      {
        title: 'Propriété intellectuelle',
        text: `Tout le contenu de ce site web, incluant les textes, images, logos, graphiques et design, est la propriété de ${COMPANY_NAME} et est protégé par les lois canadiennes sur le droit d'auteur. Toute reproduction non autorisée est interdite.`,
      },
      {
        title: "Exactitude de l'information",
        text: "Nous nous efforçons de maintenir les informations sur ce site à jour et exactes. Cependant, nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité de toutes les informations présentées. Les prix, disponibilités et détails des services peuvent varier.",
      },
      {
        title: 'Limitation de responsabilité',
        text: `${COMPANY_NAME} ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site web ou de l'impossibilité d'y accéder.`,
      },
      {
        title: 'Liens externes',
        text: "Ce site peut contenir des liens vers des sites web tiers. Nous n'avons aucun contrôle sur le contenu de ces sites et déclinons toute responsabilité quant à leur contenu ou leurs pratiques de confidentialité.",
      },
      {
        title: 'Loi applicable',
        text: "Les présentes conditions d'utilisation sont régies par les lois de la province de Québec et les lois fédérales du Canada qui s'y appliquent.",
      },
      {
        title: 'Modifications',
        text: `${COMPANY_NAME} se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prennent effet dès leur publication sur ce site.`,
      },
      {
        title: 'Contact',
        text: `Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à ${EMAIL}.`,
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    lastUpdate: 'Last updated: March 2026',
    sections: [
      {
        title: 'Acceptance of Terms',
        text: `By accessing the ${COMPANY_NAME} website (${SITE_URL}), you agree to be bound by these terms of service. If you do not accept these terms, please do not use this site.`,
      },
      {
        title: 'Description of Services',
        text: `${COMPANY_NAME} is a certified electrical company offering residential and commercial electrical installation, troubleshooting and emergency services in the Greater Montreal area. Information presented on this site is for informational purposes and does not constitute a service contract.`,
      },
      {
        title: 'Intellectual Property',
        text: `All content on this website, including text, images, logos, graphics and design, is the property of ${COMPANY_NAME} and is protected by Canadian copyright laws. Any unauthorized reproduction is prohibited.`,
      },
      {
        title: 'Accuracy of Information',
        text: 'We strive to keep the information on this site current and accurate. However, we do not guarantee the accuracy, completeness or timeliness of all information presented. Prices, availability and service details may vary.',
      },
      {
        title: 'Limitation of Liability',
        text: `${COMPANY_NAME} shall not be held liable for any direct or indirect damages resulting from the use of this website or the inability to access it.`,
      },
      {
        title: 'External Links',
        text: 'This site may contain links to third-party websites. We have no control over the content of these sites and disclaim any responsibility for their content or privacy practices.',
      },
      {
        title: 'Governing Law',
        text: 'These terms of service are governed by the laws of the Province of Quebec and the applicable federal laws of Canada.',
      },
      {
        title: 'Changes',
        text: `${COMPANY_NAME} reserves the right to modify these terms of service at any time. Changes take effect upon publication on this site.`,
      },
      {
        title: 'Contact',
        text: `For any questions regarding these terms of service, please contact us at ${EMAIL}.`,
      },
    ],
  },
};

export default function TermsPage() {
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
