import adapter from '@sveltejs/adapter-vercel';
import { withMicrofrontends } from '@vercel/microfrontends/experimental/sveltekit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = withMicrofrontends({
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		prerender: {
			entries: ['*'] // Prerender all discoverable pages
		}
	}
});

export default config;
