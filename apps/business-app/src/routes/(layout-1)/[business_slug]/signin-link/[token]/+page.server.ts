export const prerender = false;
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BusinessAuthService } from '$lib/auth/business';
import { countryForSlug } from '$lib/server/resolveCountry';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { business_slug, token } = params;

	// Every path out of here is a redirect, so the page component never renders.
	// It used to return an error for the page to display, which put a
	// "your link is invalid" message inside the *dashboard* shell — sidebar,
	// Logout and all — for someone who is by definition not signed in. The only
	// way on from there was a link to /{slug}/login, a stub page whose whole
	// content was <p>Hello</p> — since deleted.
	let reason: 'expired-link' | 'signin-error';

	try {
		// The country comes from the slug, as it does for the dashboard layout.
		// This used the India-bound service, whose token lookup filters on
		// country_code = 'in' — so every US sign-in link was reported expired.
		// An unknown slug has no token worth checking and gets the same answer.
		const country = await countryForSlug(business_slug);
		const result = country
			? await new BusinessAuthService(country).authenticateWithMagicLink(
					token,
					business_slug,
					cookies
				)
			: { success: false };

		// Redirect on success is thrown below rather than here: `redirect()`
		// works by throwing, so thrown inside this try it would land in the catch
		// and rely on it being recognised and re-thrown.
		if (result.success) throw redirect(302, `/${business_slug}`);

		reason = 'expired-link';
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
			throw error;
		}
		console.error('Authentication error:', error);
		reason = 'signin-error';
	}

	// /login is the only sign-in page there is, and it carries the link on to
	// /forgot-password for a fresh sign-in link.
	// The slug is deliberately not passed along — it names a business, and this
	// request just proved the sender does not hold a valid token for it.
	throw redirect(302, `/login?reason=${reason}`);
};
