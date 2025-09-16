export const prerender = false;

import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	// Clear the session cookie
	cookies.delete('session', { path: '/' });

	throw redirect(302, '/login');
};
