import { redirect } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 2592000 }
};

export const load = () => {
	redirect(301, '/in/solar');
};
