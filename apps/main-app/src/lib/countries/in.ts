import type { CountryConfig } from './types';

export const IN: CountryConfig = {
	code: 'in',
	name: 'India',
	brandName: 'Solar Vipani',
	locale: 'en-IN',
	currency: 'INR',
	taxId: {
		label: 'GSTN'
	},
	levels: {
		level1: { singular: 'State', plural: 'States' },
		level2: { singular: 'District', plural: 'Districts' }
	},
	postalCode: {
		label: 'PIN Code',
		pattern: '^\\d{6}$',
		maxLength: 6
	},
	phone: {
		callingCode: '+91',
		pattern: '^[6-9]\\d{9}$'
	},
	features: {
		seoContentFamilies: true,
		subsidy: true,
		financing: true,
		tools: true,
		authors: true,
		projects: true,
		chatbot: true,
		pincodeLookup: true,
		userAccounts: true
	},
	installerNoun: 'solar installer'
};
