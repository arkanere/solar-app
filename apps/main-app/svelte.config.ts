import adapter from '@sveltejs/adapter-vercel';
import { withMicrofrontends } from '@vercel/microfrontends/experimental/sveltekit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Config } from '@sveltejs/kit';

// Generate blog prerender entries
const blogSlugs = [
	'1kw-ongrid-solar-system',
	'3kw-ongrid-solar-system',
	'5kw-ongrid-solar-system',
	'adoption-of-solar-photovoltaics-in-australia',
	'adoption-of-solar-photovoltaics-in-germany',
	'adoption-of-solar-photovoltaics-in-united-states',
	'advanced-materials-technologies-photovoltaics-india',
	'appliances-that-can-run-on-solar-power',
	'best-practices-clean-solar-panels',
	'building-integrated-photovoltaics-india',
	'callsafe',
	'capex-model-solar-energy',
	'case-against-diy-solar-panel-installation',
	'community-solar-projects-india',
	'cost-of-electricity-by-source-india',
	'cost-of-solar-on-grid-system',
	'demystifying-solar-energy-trend-in-india',
	'duck-curve-solar-energy-india',
	'electricity-sector-india',
	'energy-storage-systems-india',
	'energy-storage-systems-peak-shaving-india',
	'factors-determining-cost-manufacturing-solar-panels-india',
	'factors-determining-solar-panel-prices-india',
	'feed-in-electricity-tariff-policy-instrument',
	'flexible-solar-panels-applications',
	'green-energy-corridors-india',
	'green-solutions-for-greener-tomorrow',
	'grow-solar-business-online',
	'growth-of-photovoltaics',
	'hiring-verified-solar-installer-in-india-is-essential',
	'history-of-solar-photovoltaics',
	'how-to-install-solar-panel-at-home',
	'indian-scientists-contributed-solar-photovoltaics',
	'industrial-solar-installation-india',
	'install-solar-pump-in-india',
	'installing-solar-panels-new-house-construction',
	'integrated-solar-roof',
	'key-considerations-solar-panel-manufacturing',
	'managing-high-electricity-bills-india',
	'mono-perc-solar-panel',
	'off-grid-solar-system',
	'on-grid-solar-system',
	'opex-model-solar-energy',
	'pm-surya-ghar-yojana',
	'power-purchase-agreement',
	'public-private-partnerships-solar-energy-india',
	'resco-model-solar-energy',
	'research-institutes-solar-energy-india',
	'rooftop-solar-in-india',
	'scientists-contributed-solar-photovoltaics',
	'smart-cities-solar-energy-india',
	'smart-grid-india',
	'smart-home-rooftop-solar-india',
	'solar-energy-small-medium-enterprises-india',
	'solar-net-metering-how-it-works',
	'solar-panel-installers-in-india-explained',
	'solar-panel-systems-apartments-housing-societies-india',
	'solar-potential-india',
	'solar-pump-and-its-applications',
	'solar-subsidy-policy-instrument',
	'specialised-financing-for-solar-panel-power-plants',
	'subsidy-for-solar-installations-india',
	'topcon-solar-panel',
	'trend-price-of-solar-panels-last-decade-india',
	'trends-electricity-sector-india',
	'turn-unused-roof-into-solar-asset',
	'types-of-solar-panel-and-their-characteristics',
	'why-solar-rooftop-system-is-good-investment-2025',
	'zero-cost-emi-schemes-solar',
	'zero-upfront-solar-scheme-apartments'
];

const blogEntries = blogSlugs.map(slug => `/blogs/${slug}`);
const blogPaginationPages = ['/blogs', '/blogs/page/2', '/blogs/page/3', '/blogs/page/4', '/blogs/page/5', '/blogs/page/6', '/blogs/page/7'];

const config: Config = withMicrofrontends({
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		prerender: {
			entries: [
				'*', // Prerender all discoverable pages
				...blogEntries, // Explicitly prerender all blog posts
				...blogPaginationPages // Prerender blog pagination pages
			]
		}
	}
});

export default config;
