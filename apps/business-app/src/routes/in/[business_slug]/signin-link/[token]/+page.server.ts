export const prerender = false;
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BusinessAuthService } from '$lib/in/auth/business/index.ts';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { business_slug, token } = params;
	const authService = new BusinessAuthService();

	try {
		// Authenticate using centralized service
		const result = await authService.authenticateWithMagicLink(token, business_slug, cookies);

		if (result.success) {
			// Redirect to the business dashboard
			throw redirect(302, `/in/${business_slug}`);
		} else {
			return {
				error: result.error || 'Invalid or expired magic link. Please request a new one.'
			};
		}
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
			// This is a redirect, let it through
			throw error;
		}
		console.error('Authentication error:', error);
		return {
			error: 'An error occurred during authentication. Please try again.'
		};
	}
};
