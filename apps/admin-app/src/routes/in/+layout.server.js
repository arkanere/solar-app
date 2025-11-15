export const prerender = false;
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
	const session = cookies.get('session');

	// Allow the user to access the login page without redirecting
	if (url.pathname === '/login' && !session) {
		return { session: null };
	}

	// If the user is not authenticated and tries to access protected routes
	if (!session) {
		throw redirect(302, '/login');
	}

	// If authenticated, return the session data
	return { session };
};
