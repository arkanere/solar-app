	import adapter from '@sveltejs/adapter-vercel';
	import { cities } from './src/lib/cities.js'; // Include .js extension
	import { businesses } from './src/lib/businesses.js'


	/** @type {import('@sveltejs/kit').Config} */
	const config = {
		kit: {
			adapter: adapter(),
			prerender: {
			  entries: [ '/business-listing', '/business-form', '/campaign/nanded',
				...businesses.map(business => `/solar-panel-installer/${business}`)
			  ],
			  handleHttpError: ({ path, referrer, message }) => {
				// Ignore 405 errors specifically for the assessment-tool route
				if (path === '/assessment-tool') {
				  return;
				}
				
				// Throw error for all other issues
				throw new Error(message);
			  }
			}
		  }
	};

	export default config;
