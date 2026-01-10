import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the session cookie
	cookies.delete('business-session', { path: '/' });

	// Redirect to the general business login page
	throw redirect(302, `/in/login`);
};
