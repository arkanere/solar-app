// Per-country configuration. This is the abstraction layer that resolves
// terminology differences (district vs county, PIN vs ZIP) so routes,
// components, queries and SEO code stay country-agnostic.
//
// Configs must stay serializable (plain JSON) — they are returned from
// +layout.server.ts load functions. Validation patterns are therefore
// stored as strings and compiled with `new RegExp(...)` where needed.

export type CountryCode = 'in' | 'us';

export interface LevelLabels {
	singular: string;
	plural: string;
}

export interface CountryConfig {
	code: CountryCode;
	name: string;
	locale: string; // e.g. 'en-IN'
	currency: string; // ISO 4217, e.g. 'INR'
	levels: {
		level1: LevelLabels; // State/States everywhere so far
		level2: LevelLabels; // District/Districts (IN), County/Counties (US)
	};
	postalCode: {
		label: string; // 'PIN Code' | 'ZIP Code'
		pattern: string; // regex source, e.g. '^\\d{6}$'
		maxLength: number;
	};
	phone: {
		callingCode: string; // '+91' | '+1'
		pattern: string; // regex source for a valid national number
	};
	features: {
		seoContentFamilies: boolean; // rooftop-solar, solar-panels, brand/size pages...
		subsidy: boolean;
		financing: boolean;
		tools: boolean;
		dynamicBlogs: boolean;
		authors: boolean;
		projects: boolean;
		chatbot: boolean;
		pincodeLookup: boolean; // postal-code -> level2 API (pincode_mapping is IN-only)
	};
	installerNoun: string; // noun used in SEO copy, e.g. 'solar installer'
}
