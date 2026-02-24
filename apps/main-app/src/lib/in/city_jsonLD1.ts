// src/lib/jsonld.ts

/**
 * Generates structured data for LocalBusiness
 */
export function city_jsonLD1(city: string, postalCode?: string): Record<string, unknown> {
	return {
		'@context': 'http://schema.org',
		'@type': 'LocalBusiness',
		name: `Solar Panel Installers in ${city.replace('-', ' ')}`,
		image: 'https://solarvipani.com/logo512.png',
		url: `https://solarvipani.com/solar-panel-installer-directory/${city.toLowerCase().replace(/\s+/g, '-')}`,
		address: {
			'@type': 'PostalAddress',
			addressRegion: city,
			...(postalCode ? { postalCode } : {}),
			addressCountry: 'IN'
		},
		areaServed: {
			'@type': 'City',
			name: city.replace('-', ' ')
		},
		priceRange: '$$$',
		telephone: '+918983066701'
	};
}
