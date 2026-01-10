import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the session cookie
	cookies.delete('business-session', { path: '/' });

	// Redirect to the US business login page
	throw redirect(302, `/us/login`);
};
