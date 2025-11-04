export const prerender = false;
import { redirect } from '@sveltejs/kit';
import { UserAuthService } from '$lib/auth/user/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
	const { token } = params;
	const authService = new UserAuthService();

	try {
		// Authenticate using centralized service
		const result = await authService.authenticateWithMagicLink(token, cookies);

		if (result.success) {
			// Redirect to the user dashboard
			throw redirect(302, '/in');
		} else {
			return {
				error: result.error || 'Invalid or expired magic link. Please request a new one.'
			};
		}
	} catch (error) {
		if (error.status === 302) {
			// This is a redirect, let it through
			throw error;
		}
		console.error('Authentication error:', error);
		return {
			error: 'An error occurred during authentication. Please try again.'
		};
	}
}
