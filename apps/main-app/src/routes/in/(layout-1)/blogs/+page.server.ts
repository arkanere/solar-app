import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	throw redirect(302, '/in/blogs/page/1');
};
