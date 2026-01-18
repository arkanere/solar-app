import { city_jsonLD1 } from './city_jsonLD1';

const DEFAULT_BUSINESS = {
  businessname: 'Solar Vipani',
  phonenumber: '8983066701',
};

export function generateCityJsonLD(city: string, businesses: any[], district?: string) {
  const city_jsonLD_1 = city_jsonLD1(city);

  const city_jsonLD_2 = (businesses.length > 0 ? businesses : [DEFAULT_BUSINESS]).map((business) => ({
    '@context': 'http://schema.org',
    '@type': 'LocalBusiness',
    name: business.businessname,
    image: business.image || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || '',
      addresslocality: business.city || '',
      addressRegion: business.state || '',
      postalCode: business.postalcode || '',
      addressCountry: 'IN',
    },
    url: `https://solarvipani.com/in/solar-panel-installer/${business.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating || '4.0',
      ratingCount: business.reviewCount || '1',
      bestRating: '5',
    },
  }));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://solarvipani.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Solar Panel Installer Directory',
        item: 'https://solarvipani.com/in/solar-panel-installer-directory',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Solar Panel Installers in ${city.replace('-', ' ')}`,
        item: `https://solarvipani.com/in/solar-panel-installer-directory/${city.toLowerCase()}`,
      },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Solar Vipani',
    url: 'https://solarvipani.com',
    logo: 'https://solarvipani.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8983066701',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/solarvipani',
      'https://www.instagram.com/solarvipani',
      'https://www.linkedin.com/company/solarvipani',
    ],
    description:
      'Solar Vipani connects customers with verified solar panel installers across India. Find trusted solar installers, compare quotes, and get expert solar installation services.',
    serviceArea: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return {
    jsonLD1: JSON.stringify(city_jsonLD_1),
    jsonLD2: JSON.stringify(city_jsonLD_2),
    breadcrumbSchema: JSON.stringify(breadcrumbSchema),
    organizationSchema: JSON.stringify(organizationSchema),
  };
}

export function injectJsonLDScripts(jsonLDData: ReturnType<typeof generateCityJsonLD>) {
  const fragment = document.createDocumentFragment();

  const scripts = [
    { type: 'application/ld+json', content: jsonLDData.jsonLD1 },
    { type: 'application/ld+json', content: jsonLDData.jsonLD2 },
    { type: 'application/ld+json', content: jsonLDData.breadcrumbSchema },
    { type: 'application/ld+json', content: jsonLDData.organizationSchema },
  ];

  scripts.forEach(({ type, content }) => {
    const script = document.createElement('script');
    script.type = type;
    script.textContent = content;
    fragment.appendChild(script);
  });

  document.head.appendChild(fragment);
}
