import adapter from '@sveltejs/adapter-auto';

// const prerenderedCities = ['los-angeles', 'san-francisco', 'san-diego',
// 	'houston', 'dallas', 'austin',
// 	'new-york-city', 'buffalo', 'rochester'
// ];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		// Add pre rendering here
		// prerender: {
		// 	entries: prerenderedCities.map(city => `/directory/${city}`),
		// }

	}
};

export default config;
