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
			'net-metering'
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
			'for-commercial'
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
			'string-inverter',
			'micro-inverter',
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
			'types',
			'submersible',
			'surface',
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
			'process',
			'timeline',
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
			'eligibility',
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
			'emi-options',
			'interest-rates',
			'eligibility',
			'documents-required',
			'roi',
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
