import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/entries.js'; // Include .js extension


/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			entries: ['/', '/business-listing', ...cities.map(city => `/solar-panel-installer-directory/${city}`)]
		}
	}
};

export default config;
