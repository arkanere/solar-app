import { pool } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { TokenSecurity } from '$lib/auth/business';
import { passwordResetLimiter } from '$lib/auth/business';
import { parseBody, resetPasswordSchema } from '@solar/validation';

interface BusinessResetRow {
	reset_token_hash: string | null;
	reset_token_expires: Date | null;
	reset_token_used: boolean;
	id: number;
}

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

		// 4. Verify the token (now comparing hashed versions)
		const query = `
      SELECT reset_token_hash, reset_token_expires, reset_token_used, id
      FROM us_businesses
      WHERE slug = $1;
    `;
		const result = await pool.query<BusinessResetRow>(query, [business_slug]);

		if (result.rows.length === 0) {
			// Business doesn't exist, but don't reveal that
			return json({ success: false, error: genericError }, { status: 400 });
		}

		const business = result.rows[0];

		// 5. Check if token matches (compare hashes)
		if (business.reset_token_hash !== hashedToken) {
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 6. Check if token has expired
		if (TokenSecurity.isTokenExpired(business.reset_token_expires)) {
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 7. Check if token has already been used
		if (business.reset_token_used) {
			return json(
				{ success: false, error: 'This password reset link has already been used' },
				{ status: 400 }
			);
		}

		// 8. Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// 9. Update password and mark token as used (don't delete, mark as used)
		const updateQuery = `
      UPDATE us_businesses
      SET
        login_password = $1,
        reset_token_used = TRUE,
        reset_token_hash = NULL,
        reset_token_expires = NULL
      WHERE id = $2;
    `;
		await pool.query(updateQuery, [hashedPassword, business.id]);

		// 10. Reset rate limit on successful password reset
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
