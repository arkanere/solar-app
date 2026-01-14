import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

// Home page doesn't need data loading, but we export the config for ISR
export const load: PageServerLoad = async () => {
	return {
		user: null
	};
};