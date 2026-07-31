import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async () => {
	return {};
};
