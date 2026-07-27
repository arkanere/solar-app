import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// @ts-expect-error - Monorepo type conflict between root and app node_modules vite versions
	plugins: [sveltekit()],
	ssr: {
		// @solar/validation ships TypeScript source (workspace package), so it
		// must be bundled rather than externalized into the serverless output.
		noExternal: ['svelte-sonner', '@solar/validation']
	}
});
