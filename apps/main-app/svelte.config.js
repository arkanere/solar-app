import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		})
		// `prerender.entries: ['*']` used to live here. It was inert once the last
		// `prerender = true` went (stage 9 of docs/migration-plan-delete-us.md) —
		// entries only expand for routes that opt in, and `['*']` is the default
		// anyway. Every page is now SSR + ISR; see the `config` exports on the
		// +page.server.ts loaders.
	}
};

export default config;
