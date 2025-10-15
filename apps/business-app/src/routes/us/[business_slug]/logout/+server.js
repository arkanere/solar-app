import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	// Clear the session cookie
	cookies.delete('business-session', { path: '/' });

	// Redirect to the US business login page
	throw redirect(302, `/us/login`);
};
