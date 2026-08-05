// Issue a password-reset link. This is the entry point `resetPassword` always
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
import { forgotPasswordSchema, parseBody } from '@solar/validation';

const COUNTRY = 'in';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Said on every path that could otherwise distinguish a registered address
	// from an unregistered one.
	const genericSuccess = {
		success: true,
		message: 'If that email is registered, a reset link is on its way.'
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

		const target = await findResetTargetByEmail(COUNTRY, email);
		if (!target) return json(genericSuccess);

		const rawToken = await mintPasswordResetToken(COUNTRY, target.businessId);
		if (!rawToken) return json(genericSuccess);

		const url = resetPasswordUrl(target.slug, rawToken);
		const { subject, message } = resetPasswordEmail(target.businessname, url);

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
