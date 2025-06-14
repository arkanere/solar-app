import adapter from '@sveltejs/adapter-vercel';
import { cities } from './src/lib/cities.js';
import { businesses } from './src/lib/businesses.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			entries: [
				'/business-listing',
				'/business-form',
				'/campaign/nanded',
				...businesses.map((business) => `/solar-panel-installer/${business}`)
			],
			handleHttpError: ({ path, referrer, message, status }) => {
				// Ignore 405 errors for specific routes that have dynamic behavior
				if (
					status === 405 &&
					(path === '/assessment-tool' || path === '/solar-panel-installer-directory')
				) {
					console.warn(`Skipping prerender for ${path} due to 405 error`);
					return;
				}

				// Throw error for all other issues
				throw new Error(message);
			}
		}
	}
};

export default config;
