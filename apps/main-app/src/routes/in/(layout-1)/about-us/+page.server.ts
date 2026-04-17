import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 1296000
	}
} as const;

export const load: PageServerLoad = async () => {
	return {};
}
