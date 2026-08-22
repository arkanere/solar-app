export const prerender = false;
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BusinessAuthService } from '$lib/in/auth/business';

/**
 * Why the visitor was sent here, when something sent them. Keyed rather than
 * free text: the message must not be attacker-controlled, since anything in the
 * query string ends up rendered on a login form.
 */
const NOTICES: Record<string, string> = {
	'expired-link': 'That sign-in link has expired or is no longer valid. Sign in below, or request a new link.',
	'signin-error': 'Something went wrong signing you in. Please try again.'
};

export const load: PageServerLoad = async ({ cookies, url }) => {
	const authService = new BusinessAuthService();

	// Check if already logged in
	if (authService.isAuthenticated(cookies)) {
		const sessionResult = authService.validateSession(cookies);
		if (sessionResult.success && sessionResult.session) {
			// If already logged in, redirect to the business dashboard
			throw redirect(302, `/${sessionResult.session.businessSlug}`);
		}
	}

	// Allow access to the login page if not logged in
	return { notice: NOTICES[url.searchParams.get('reason') ?? ''] ?? null };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { errors: { message: 'Email and password are required' } });
		}

		try {
			const authService = new BusinessAuthService();

			// First, get the business by email to find their slug
			const businessResult = await authService.getBusinessByEmail(email as string);

			if (!businessResult.success || !businessResult.business) {
				return fail(401, { errors: { message: 'Invalid email or password' } });
			}

			const { business } = businessResult;

			// Now authenticate with the business slug
			const result = await authService.authenticateWithPassword(
				email as string,
				password as string,
				business.slug,
				cookies
			);

			if (result.success) {
				// Redirect to the business dashboard
				throw redirect(302, `/${business.slug}`);
			} else {
				return fail(401, { errors: { message: result.error || 'Invalid email or password' } });
			}
		} catch (error) {
			// If it's a redirect, let it through
			if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
				throw error;
			}
			console.error('❌ Error in business login:', error);
			return fail(500, { errors: { message: 'Internal server error' } });
		}
	}
};
