import type { CountryConfig } from './types';

export const US: CountryConfig = {
	code: 'us',
	name: 'United States',
	brandName: 'Solar Vipani USA',
	locale: 'en-US',
	currency: 'USD',
	taxId: {
		label: 'EIN'
	},
	levels: {
		level1: { singular: 'State', plural: 'States' },
		level2: { singular: 'County', plural: 'Counties' }
	},
	postalCode: {
		label: 'ZIP Code',
		pattern: '^\\d{5}$',
		maxLength: 5
	},
	phone: {
		callingCode: '+1',
		pattern: '^\\d{10}$'
	},
	features: {
		seoContentFamilies: false,
		subsidy: false,
		financing: false,
		tools: false,
		authors: false,
		projects: false,
		chatbot: false,
		pincodeLookup: false,
		userAccounts: false
	},
	installerNoun: 'solar panel installer'
};
