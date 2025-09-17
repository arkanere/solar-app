import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/cities.js';
import { businesses } from './src/lib/businesses.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Vercel adapter configuration with rewrites
			rewrites: [
				{
					source: '/in',
					destination: 'https://solar-app-in.vercel.app/'
				},
				{
					source: '/in/(.*)',
					destination: 'https://solar-app-in.vercel.app/$1'
				}
			]
		}),
	}
};

export default config;
