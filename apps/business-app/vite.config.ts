import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// @solar/validation ships TypeScript source (workspace package), so it
		// must be bundled rather than externalized into the serverless output.
		noExternal: ['svelte-sonner', '@solar/validation']
	}
});
