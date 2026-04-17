import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 1296000
	}
};

// Home page doesn't need data loading, but we export the config for ISR
export const load: PageServerLoad = async () => {
	return {
		user: null
	};
};