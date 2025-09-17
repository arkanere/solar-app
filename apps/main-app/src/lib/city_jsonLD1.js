// src/lib/jsonld.js

/**
 * Generates structured data for LocalBusiness
 * @param {string} city - City name
 * @returns {object} JSON-LD structured data object
 */
export function city_jsonLD1(city) {
	return {
		'@context': 'http://schema.org',
		'@type': 'LocalBusiness',
		name: `Solar Panel Installers in ${city.replace('-', ' ')}`,
		image: 'https://solarvipani.com/logo512.png',
		url: `https://solarvipani.com/solar-panel-installer-directory/${city.toLowerCase().replace(/\s+/g, '-')}`,
		address: {
			'@type': 'PostalAddress',
			addressRegion: city,
			postalCode: '111111',
			addressCountry: 'IN'
		},
		priceRange: '$$$',
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.0',
			ratingCount: '1',
			bestRating: '5'
		},
		telephone: '+918983066701'
	};
}
