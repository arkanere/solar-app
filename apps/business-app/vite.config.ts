import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// @ts-expect-error - Monorepo type conflict between root and app node_modules vite versions
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['svelte-sonner']
	}
});
