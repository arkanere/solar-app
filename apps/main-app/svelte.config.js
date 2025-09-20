import adapter from '@sveltejs/adapter-vercel';
import { withMicrofrontends } from '@vercel/microfrontends/experimental/sveltekit';
import { cities } from './src/lib/cities.js';
import { businesses } from './src/lib/businesses.js';

/** @type {import('@sveltejs/kit').Config} */
const config = withMicrofrontends({
	kit: {
		adapter: adapter()
	}
});

export default config;