import { db } from '$lib/server/db';
import { usBusinesses } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { TokenSecurity } from '$lib/auth/business';
import { passwordResetLimiter } from '$lib/auth/business';
import { parseBody, resetPasswordSchema } from '@solar/validation';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Generic error message to prevent account enumeration
	const genericError = 'Invalid or expired password reset link';

	try {
		// Parsing lives inside the try: this handler used to read the body
		// above it, so a malformed payload became an unhandled rejection.
		// The failure is reported generically for the same reason the checks
		// below are — a field-level message would confirm which slugs are
		// well-formed.
		const parsed = await parseBody(request, resetPasswordSchema);
		if (!parsed.ok) {
			return json({ success: false, error: genericError }, { status: 400 });
		}
		const { business_slug, token, newPassword } = parsed.data;

		// Get client IP for rate limiting
		const clientIp = getClientAddress();
		const rateLimitKey = `reset:${clientIp}:${business_slug}`;

		// 1. Rate limiting - max 5 attempts per 15 minutes per IP/business combo
		const rateLimit = await passwordResetLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000);
		if (!rateLimit.allowed) {
			return json(
				{
					success: false,
					error: 'Too many password reset attempts. Please try again later.',
					retryAfter: rateLimit.retryAfter
				},
				{
					status: 429,
					headers: {
						'Retry-After': rateLimit.retryAfter.toString()
					}
				}
			);
		}

		// 2. Validate password strength
		const passwordValidation = TokenSecurity.validatePasswordStrength(newPassword);
		if (!passwordValidation.valid) {
			return json(
				{
					success: false,
					error: 'Password does not meet security requirements',
					details: passwordValidation.errors
				},
				{ status: 400 }
			);
		}

		// 3. Hash the incoming token to compare with stored hash
		const hashedToken = TokenSecurity.hashToken(token);

		// 4. Verify the token. Reset tokens are stored hashed in `reset_token`, the
		// same way magic-link tokens are; the columns this handler used to read
		// (reset_token_hash, reset_token_used) do not exist on us_businesses.
		const [business] = await db
			.select({
				id: usBusinesses.id,
				resetToken: usBusinesses.resetToken,
				resetTokenExpires: usBusinesses.resetTokenExpires
			})
			.from(usBusinesses)
			.where(eq(usBusinesses.slug, business_slug))
			.limit(1);

		if (!business) {
			// Business doesn't exist, but don't reveal that
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 5. Check if token matches (compare hashes)
		if (business.resetToken !== hashedToken) {
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 6. Check if token has expired
		if (TokenSecurity.isTokenExpired(business.resetTokenExpires)) {
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 7. Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// 8. Update password and consume the token. Clearing it is what makes a
		// second use fail — there is no separate "already used" flag, so a reused
		// link reports the generic invalid/expired error.
		await db
			.update(usBusinesses)
			.set({
				loginPassword: hashedPassword,
				resetToken: null,
				resetTokenExpires: null
			})
			.where(eq(usBusinesses.id, business.id));

		// 9. Reset rate limit on successful password reset
		await passwordResetLimiter.reset(rateLimitKey);

		return json({
			success: true,
			message: 'Password has been reset successfully'
		});
	} catch (error) {
		console.error('Error resetting password:', error);
		// Generic error message for security
		return json(
			{ success: false, error: 'An error occurred. Please try again later.' },
			{ status: 500 }
		);
	}
};
