import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/cities.js'; // Include .js extension
import { businesses } from './src/lib/businesses.js'


/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			entries: [ '/business-listing', '/business-form', '/campaign/nanded',
				// ...cities.map(city => `/solar-panel-installer-directory/${city}`),
				...businesses.map(business => `/solar-panel-installer/${business}`),

			]
		}
	}
};

export default config;
