export const prerender = false;
import { redirect } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const load = async ({ cookies, params, url }) => {
	const business_session = cookies.get('business-session');
	const { business_slug } = params; // Extract business slug from URL params

	// Check if the URL matches claim, login, reset-password, or magic-link routes
	const isClaimPage = url.pathname === `/in/${business_slug}/claim`;
	const isLoginPage = url.pathname === `/in/${business_slug}/login`;
	const isResetPasswordPage = url.pathname.startsWith(`/in/${business_slug}/reset-password`);
	const isMagicLinkPage = url.pathname.startsWith(`/in/${business_slug}/signin-link`);

	// If no session and not on an allowed page, redirect to login
	if (
		!business_session &&
		!isLoginPage &&
		!isClaimPage &&
		!isResetPasswordPage &&
		!isMagicLinkPage
	) {
		throw redirect(302, '/in/login');
	}

	// **Fix: Ensure user is redirected to the correct business if they change the URL**
	// But skip this validation for magic link pages to avoid conflicts during login
	if (business_session && !isMagicLinkPage) {
		try {
			const sessionData = JSON.parse(business_session);

			// If session's businessSlug does not match the URL, redirect to the correct business
			if (sessionData.businessSlug !== business_slug) {
				throw redirect(302, `/in/${sessionData.businessSlug}`); // Redirect back to the correct business
			}

			// Load basic business info for sidebar
			const pool = createPool({ connectionString: POSTGRES_URL });
			try {
				const businessResult = await pool.query(
					'SELECT id, businessname, slug FROM businesses_1 WHERE slug = $1 LIMIT 1',
					[business_slug]
				);

				if (businessResult.rows.length > 0) {
					return {
						business_session: sessionData,
						business: businessResult.rows[0]
					};
				}
			} catch (dbError) {
				console.error('Database error loading business:', dbError);
			}

			return { business_session: sessionData };
		} catch (error) {
			// If it's a redirect, let it through (don't treat it as an error)
			if (error?.status === 302 || error?.location) {
				throw error;
			}
			console.error('Invalid session data:', error);
			cookies.delete('business-session', { path: '/' }); // Delete corrupt session
			throw redirect(302, '/in/login'); // Redirect to login page
		}
	}

	return { business_session };
};
