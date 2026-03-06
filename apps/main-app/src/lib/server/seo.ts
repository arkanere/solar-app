const BASE_URL = 'https://solarvipani.com';

export function breadcrumbLD(items: { name: string; url: string }[]): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}

export function faqLD(items: { question: string; answer: string }[]): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	};
}

export function localBusinessLD(business: {
	name: string;
	slug: string;
	address: string;
	city: string;
	state: string;
	postalCode: string;
	phone?: string;
}): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: business.name,
		url: `${BASE_URL}/in/installer/${business.slug}`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: business.address,
			addressLocality: business.city,
			addressRegion: business.state,
			postalCode: business.postalCode,
			addressCountry: 'IN'
		},
		...(business.phone ? { telephone: business.phone } : {}),
		areaServed: {
			'@type': 'City',
			name: business.city
		}
	};
}

export function productLD(product: {
	name: string;
	brand: string;
	category: string;
	price?: number;
	description?: string;
	image?: string;
}): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		brand: { '@type': 'Brand', name: product.brand },
		category: product.category,
		...(product.description ? { description: product.description } : {}),
		...(product.image ? { image: product.image } : {}),
		...(product.price
			? {
					offers: {
						'@type': 'Offer',
						price: product.price,
						priceCurrency: 'INR',
						availability: 'https://schema.org/InStock'
					}
				}
			: {})
	};
}

export function articleLD(article: {
	title: string;
	slug: string;
	description: string;
	datePublished: string;
	dateModified: string;
	author: string;
	image?: string;
}): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		url: `${BASE_URL}/in/blog/${article.slug}`,
		description: article.description,
		datePublished: article.datePublished,
		dateModified: article.dateModified,
		author: { '@type': 'Person', name: article.author },
		publisher: {
			'@type': 'Organization',
			name: 'Solar Vipani',
			logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` }
		},
		...(article.image ? { image: article.image } : {})
	};
}

export function personLD(author: {
	name: string;
	slug: string;
	credentials?: string;
	photo?: string;
}): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: author.name,
		url: `${BASE_URL}/in/author/${author.slug}`,
		...(author.credentials ? { jobTitle: author.credentials } : {}),
		...(author.photo ? { image: author.photo } : {})
	};
}

export function organizationLD(): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Solar Vipani',
		url: BASE_URL,
		logo: `${BASE_URL}/logo.png`,
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+91-8983066701',
			contactType: 'customer service',
			areaServed: 'IN',
			availableLanguage: ['English', 'Hindi']
		},
		sameAs: [
			'https://www.facebook.com/solarvipani',
			'https://www.instagram.com/solarvipani',
			'https://www.linkedin.com/company/solarvipani'
		],
		description:
			'Solar Vipani connects customers with verified solar panel installers across India. Find trusted solar installers, compare quotes, and get expert solar installation services.',
		serviceArea: { '@type': 'Country', name: 'India' }
	};
}

export function webAppLD(tool: { name: string; description: string; url: string }): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: tool.name,
		description: tool.description,
		url: tool.url,
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'All',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'INR'
		}
	};
}
