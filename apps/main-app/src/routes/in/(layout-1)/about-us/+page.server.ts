import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7
	}
} as const;

export const load: PageServerLoad = async () => {
	return {};
}
