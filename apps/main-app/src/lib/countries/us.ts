import type { CountryConfig } from './types';

export const US: CountryConfig = {
	code: 'us',
	name: 'United States',
	brandName: 'Solar Vipani USA',
	locale: 'en-US',
	currency: 'USD',
	taxId: {
		label: 'EIN',
		collectOnSignup: false
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
		// Turned on 2026-08-22 on the user's instruction, when the chat was added
		// to the country-less root tree. ⚠️ The gate is tree-wide, not per page:
		// the chat now appears on every /us page, and the assistant's knowledge
		// is India-framed (PM Surya Ghar, state subsidies, rupees), so US
		// visitors asking about incentives can get Indian answers.
		chatbot: true,
		pincodeLookup: false,
		userAccounts: false
	},
	installerNoun: 'solar panel installer'
};
