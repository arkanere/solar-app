import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { microfrontends } from '@vercel/microfrontends/experimental/vite';

export default defineConfig({
	plugins: [sveltekit(), microfrontends({
		configPath: '../../microfrontends.json'
	})]
});