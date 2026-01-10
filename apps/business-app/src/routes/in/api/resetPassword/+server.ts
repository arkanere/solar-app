import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { TokenSecurity } from '$lib/in/auth/business/TokenSecurity.ts';
import { passwordResetLimiter } from '$lib/in/auth/business/RateLimiter.ts';

interface ResetPasswordRequest {
	business_slug: string;
	token: string;
	newPassword: string;
}

interface BusinessResetRow {
	reset_token_hash: string | null;
	reset_token_expires: Date | null;
	reset_token_used: boolean;
	id: number;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const { business_slug, token, newPassword }: ResetPasswordRequest = await request.json();

	// Get client IP for rate limiting
	const clientIp = getClientAddress();
	const rateLimitKey = `reset:${clientIp}:${business_slug}`;

	try {
		// 1. Rate limiting - max 5 attempts per 15 minutes per IP/business combo
		const rateLimit = passwordResetLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000);
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
      FROM businesses_1
      WHERE slug = $1;
    `;
		const result = await pool.query<BusinessResetRow>(query, [business_slug]);

		// Generic error message to prevent account enumeration
		const genericError = 'Invalid or expired password reset link';

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
      UPDATE businesses_1
      SET
        login_password = $1,
        reset_token_used = TRUE,
        reset_token_hash = NULL,
        reset_token_expires = NULL
      WHERE id = $2;
    `;
		await pool.query(updateQuery, [hashedPassword, business.id]);

		// 10. Reset rate limit on successful password reset
		passwordResetLimiter.reset(rateLimitKey);

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
