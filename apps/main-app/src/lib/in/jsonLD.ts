import { city_jsonLD1 } from './city_jsonLD1';

export function generateCityJsonLD(city: string, businesses: any[], postalCode?: string): { jsonLD1: string | null; jsonLD2: string | null; breadcrumbSchema: string; organizationSchema: string } {
  const hasBusinesses = businesses.length > 0;

  const city_jsonLD_1 = hasBusinesses ? city_jsonLD1(city, postalCode) : null;

  const city_jsonLD_2 = hasBusinesses
    ? businesses.map((business) => ({
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
        areaServed: {
          '@type': 'City',
          name: city.replace('-', ' '),
        },
      }))
    : null;

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
    jsonLD1: city_jsonLD_1 ? JSON.stringify(city_jsonLD_1) : null,
    jsonLD2: city_jsonLD_2 ? JSON.stringify(city_jsonLD_2) : null,
    breadcrumbSchema: JSON.stringify(breadcrumbSchema),
    organizationSchema: JSON.stringify(organizationSchema),
  };
}

