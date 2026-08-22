// Issue a password-reset link, and a sign-in (magic) link alongside it, in one
// email. This is the entry point `resetPassword` always
// needed: before it existed, nothing in the app ever set `reset_token`, so the
// reset flow could not be started by a user at all.
//
// Account enumeration is the whole design constraint here. Every outcome that
// depends on whether the address is registered — found, not found, no slug —
// returns the same 200 and the same message. Only shape errors (not an email)
// and rate limiting can say anything different.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/in/sendEmail';
import { passwordResetLimiter } from '$lib/auth/business';
import {
	findResetTargetByEmail,
	mintPasswordResetToken,
	resetPasswordEmail,
	resetPasswordUrl
} from '$lib/server/passwordReset';
import { mintBusinessTokenById, signInLinkUrl } from '$lib/server/magicLink';
import { countryForLoginEmail } from '$lib/server/resolveCountry';
import { forgotPasswordSchema, parseBody } from '@solar/validation';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Said on every path that could otherwise distinguish a registered address
	// from an unregistered one.
	const genericSuccess = {
		success: true,
		message: 'If that email is registered, a reset link and a sign-in link are on their way.'
	};

	try {
		const parsed = await parseBody(request, forgotPasswordSchema);
		if (!parsed.ok) {
			return json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
		}
		const { email } = parsed.data;

		// Rate limit on IP alone — keying on the email would let an attacker
		// probe addresses one at a time without ever tripping a limit, and would
		// leak which addresses are worth retrying.
		const rateLimitKey = `forgot:${getClientAddress()}`;
		const rateLimit = await passwordResetLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000);
		if (!rateLimit.allowed) {
			return json(
				{
					success: false,
					error: 'Too many password reset requests. Please try again later.',
					retryAfter: rateLimit.retryAfter
				},
				{ status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
			);
		}

		// /api/forgotPassword takes an email rather than a slug, so the country
		// cannot come off the path the way it does everywhere else in the
		// country-less route tree. Resolve it from the account instead — this is
		// the same problem /login has, and it uses the same lookup.
		//
		// Resolved *after* the rate limit deliberately: an unlimited lookup keyed
		// on an attacker-supplied address is exactly the probe the limiter exists
		// to stop, and null is folded into the same generic success as every other
		// not-found path so it stays out of the response.
		const country = await countryForLoginEmail(email);
		if (!country) return json(genericSuccess);

		const target = await findResetTargetByEmail(country, email);
		if (!target) return json(genericSuccess);

		const rawToken = await mintPasswordResetToken(country, target.businessId);
		if (!rawToken) return json(genericSuccess);

		const url = resetPasswordUrl(target.slug, rawToken);

		// A sign-in link alongside the reset link, so a partner who cannot manage a
		// password change on a phone still gets in. Minted after the same rate-limit
		// check the reset token is — this endpoint is the only public way to ask for
		// one, so its 5-per-IP-per-15-minutes bucket covers both links, and there is
		// no second endpoint that could be used to get around it.
		//
		// Null when the mint matched no row (a profile whose account is missing).
		// That is not a reason to withhold the reset link, so the email drops the
		// sign-in section and goes out anyway.
		const signInToken = await mintBusinessTokenById(target.businessId);
		const signInUrl = signInToken ? signInLinkUrl(target.slug, signInToken) : null;

		const { subject, message } = resetPasswordEmail(target.businessname, url, signInUrl);

		// Only to the account holder: unlike the allotment mails, this one is not
		// copied to admin@, because the link in it resets a password.
		const result = await sendEmail(target.loginEmail, subject, message, { isHtml: true });
		if (!result.success) {
			console.error('❌ Failed to send password reset email:', result.error);
		}

		return json(genericSuccess);
	} catch (error) {
		console.error('Error issuing password reset:', error);
		return json(
			{ success: false, error: 'An error occurred. Please try again later.' },
			{ status: 500 }
		);
	}
};
