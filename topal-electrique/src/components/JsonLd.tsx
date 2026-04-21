export default function JsonLd() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Topal Électrique',
    description:
      'Topal Électrique, maîtres électriciens certifiés à Montréal. Installation électrique résidentielle et commerciale, panneaux électriques, bornes de recharge EV et service d\'urgence 24/7 dans le Grand Montréal.',
    url: 'https://topalelectrique.ca',
    telephone: '+1-514-999-2030',
    email: 'service@topalelectrique.ca',
    image: 'https://topalelectrique.ca/images/logo.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Montréal',
      addressRegion: 'QC',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.5017,
      longitude: -73.5673,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Montréal',
      },
      {
        '@type': 'City',
        name: 'Laval',
      },
      {
        '@type': 'City',
        name: 'Longueuil',
      },
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 45.5017,
          longitude: -73.5673,
        },
        geoRadius: 50000,
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'CreditCard', 'DebitCard'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services électriques',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Installation électrique résidentielle',
            description: 'Installation électrique complète pour maisons neuves, rénovations et mises à niveau.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Installation électrique commerciale',
            description: 'Services électriques pour commerces, bureaux et bâtiments industriels.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: "Service d'urgence 24/7",
            description: "Intervention d'urgence électrique disponible 24h/24, 7j/7.",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Installation de bornes de recharge EV',
            description: 'Installation de bornes de recharge pour véhicules électriques niveau 2.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mise à niveau de panneaux électriques',
            description: 'Remplacement et mise à niveau de panneaux 100A, 200A, 320A et 400A.',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '7',
      bestRating: '5',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Michel F.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: 'Service impeccable! Topal a diagnostiqué et résolu mon problème rapidement.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Sophie P.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: 'Travail soigné et équipe sympathique. Installation de panneau impeccable.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Erik F.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: 'Enfin une entreprise fiable et compétente! Travaux complétés dans les délais.',
      },
    ],
    sameAs: [
      'https://facebook.com/topalelectrique',
      'https://instagram.com/topal_electrique',
      'https://tiktok.com/@topalelectrique',
    ],
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Topal Électrique',
    url: 'https://topalelectrique.ca',
    inLanguage: ['fr-CA', 'en-CA'],
    publisher: {
      '@type': 'Organization',
      name: 'Topal Électrique',
      url: 'https://topalelectrique.ca',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }} />
    </>
  );
}
