export interface PillarConfig {
	name: string;
	description: string;
	clusters: string[];
	hasBrands: boolean;
	productCategory?: string;
}

export const PILLAR_CONFIG: Record<string, PillarConfig> = {
	'rooftop-solar': {
		name: 'Rooftop Solar',
		description: 'Complete guide to rooftop solar systems for homes and businesses in India',
		clusters: [
			'cost',
			'how-it-works',
			'on-grid',
			'off-grid',
			'hybrid',
			'benefits',
			'maintenance',
			'residential',
			'commercial',
			'net-metering',
			'for-apartments',
			'1kw-system',
			'2kw-system',
			'3kw-system',
			'5kw-system',
			'10kw-system',
			'inverter',
			'on-grid-inverter',
			'off-grid-inverter',
			'hybrid-inverter',
			'on-grid-vs-off-grid',
			'complete-system',
			'cost-per-watt'
		],
		hasBrands: false
	},
	'solar-panels': {
		name: 'Solar Panels',
		description: 'Compare solar panel types, brands, prices and specifications in India',
		clusters: [
			'price',
			'types',
			'monocrystalline',
			'polycrystalline',
			'bifacial',
			'half-cut',
			'efficiency',
			'warranty',
			'for-home',
			'for-commercial',
			'brands',
			'monocrystalline-vs-polycrystalline',
			'buying-guide'
		],
		hasBrands: true,
		productCategory: 'panels'
	},
	'solar-inverters': {
		name: 'Solar Inverters',
		description: 'Compare solar inverter types, brands and prices in India',
		clusters: [
			'price',
			'types',
			'on-grid',
			'off-grid',
			'hybrid',
			'micro-inverter',
			'string-inverter',
			'hybrid-inverter',
			'on-grid-inverter',
			'off-grid-inverter',
			'sizing',
			'for-home',
			'for-commercial'
		],
		hasBrands: true,
		productCategory: 'inverters'
	},
	'solar-pumps': {
		name: 'Solar Pumps',
		description: 'Solar water pump types, prices and government subsidies in India',
		clusters: [
			'price',
			'how-it-works',
			'submersible',
			'surface',
			'irrigation',
			'1hp',
			'2hp',
			'3hp',
			'5hp',
			'7-5hp',
			'10hp',
			'borewell',
			'bldc',
			'controller',
			'for-home',
			'kusum-yojana',
			'types',
			'ac-pump',
			'dc-pump',
			'for-agriculture',
			'kusum-scheme',
			'sizing',
			'maintenance'
		],
		hasBrands: true,
		productCategory: 'pumps'
	},
	'solar-installation': {
		name: 'Solar Installation',
		description: 'Guide to solar panel installation process, timeline and best practices',
		clusters: [
			'cost',
			'process',
			'timeline',
			'checklist',
			'choosing-installer',
			'roof-assessment',
			'permits',
			'grid-connection',
			'safety',
			'diy-vs-professional',
			'site-survey',
			'wiring',
			'commissioning'
		],
		hasBrands: false
	},
	'solar-subsidy': {
		name: 'Solar Subsidy',
		description: 'State-wise solar subsidies, DISCOM policies and application process in India',
		clusters: [
			'pm-surya-ghar',
			'central-government',
			'state-wise',
			'eligibility',
			'how-to-apply',
			'net-metering',
			'application-process',
			'documents-required',
			'central-subsidy',
			'state-subsidy',
			'commercial-subsidy',
			'mnre-guidelines',
			'subsidy-calculator',
			'latest-updates'
		],
		hasBrands: false
	},
	'solar-financing': {
		name: 'Solar Financing',
		description: 'Solar loan options, EMI plans and financing schemes from banks in India',
		clusters: [
			'solar-loan',
			'emi',
			'free-solar-scheme',
			'roi',
			'emi-options',
			'interest-rates',
			'eligibility',
			'documents-required',
			'payback-period',
			'lease-vs-loan',
			'commercial-financing',
			'green-bonds'
		],
		hasBrands: false
	}
};

export function isClusterSlug(pillar: string, slug: string): boolean {
	return PILLAR_CONFIG[pillar]?.clusters.includes(slug) ?? false;
}

export function getPillarConfig(pillar: string): PillarConfig | undefined {
	return PILLAR_CONFIG[pillar];
}
