import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/cities.js';
import { businesses } from './src/lib/businesses.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			external: ['/in/*'] // Tell SvelteKit to not handle /in routes
		}),
	}
};

export default config;
