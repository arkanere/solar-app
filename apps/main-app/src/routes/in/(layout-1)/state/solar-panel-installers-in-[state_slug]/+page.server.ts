import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const config = {
	isr: { expiration: 2592000 }
};

export const load: PageServerLoad = ({ params }) => {
	const stateSlug = params.state_slug.toLowerCase();
	redirect(301, `/in/solar/${stateSlug}`);
};
