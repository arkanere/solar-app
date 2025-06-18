import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/cities.js';
import { businesses } from './src/lib/businesses.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			isr: {
				expiration: 1296000 // 15 days 
			}
		}),
	}
};

export default config;
