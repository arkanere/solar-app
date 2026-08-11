import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
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
		// (reset_token_hash, reset_token_used) never existed on any of these tables.
		//
		// Since 062 the two halves of this lookup live in different tables: the
		// slug is a profile column and the token hash is an account column, so
		// what was one predicate is now a join on (country_code, source_id) — the
		// same join PasswordManager and TokenManager use.
		//
		// The token hash is half the lookup, not a comparison made afterwards.
		// `slug` is not unique — live IN data has ~25 duplicated slugs, the column
		// carries only a plain index, and next-steps.md item 1 explains why it
		// cannot take a constraint — so `WHERE slug = $1 LIMIT 1` could return a
		// namesake of the row the token was minted against and report the generic
		// error for a perfectly valid link. mintPasswordResetToken disambiguates
		// with country_code; that is not available here, because business-app URLs
		// carry no country segment and this handler only ever sees the slug.
		// Matching on the hash instead is country-free and unique in practice.
		//
		// Enumeration is unaffected: a missing business and a wrong token were
		// already answered identically, and now they are the same branch.
		const [business] = await db
			.select({
				id: businessAccounts.sourceId,
				countryCode: businessAccounts.countryCode,
				resetTokenExpires: businessAccounts.resetTokenExpires
			})
			.from(businessAccounts)
			.innerJoin(
				businessProfiles,
				and(
					eq(businessProfiles.countryCode, businessAccounts.countryCode),
					// 075: reach the account the slug's profile names. `id` stays
					// businessAccounts.sourceId here, unlike the lookups in
					// TokenManager — this one goes on to *write* the account, so it
					// wants the account's id and not the profile's.
					eq(businessProfiles.accountBusinessId, businessAccounts.sourceId)
				)
			)
			.where(
				and(eq(businessProfiles.slug, business_slug), eq(businessAccounts.resetToken, hashedToken))
			)
			.limit(1);

		if (!business) {
			// No such business, or no business under that slug holding this token.
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 5. Check if token has expired
		if (TokenSecurity.isTokenExpired(business.resetTokenExpires)) {
			return json({ success: false, error: genericError }, { status: 400 });
		}

		// 6. Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// 7. Update password and consume the token. Clearing it is what makes a
		// second use fail — there is no separate "already used" flag, so a reused
		// link reports the generic invalid/expired error.
		// This is the row login reads (PasswordManager.ts:25). Before 062 it was
		// written to businesses_1 and projected here by sv_sync_account, and
		// dropping that call was enough to leave a reset reporting success while
		// login kept accepting the old password. Writing the account row directly
		// removes the gap rather than closing it.
		await db
			.update(businessAccounts)
			.set({
				loginPassword: hashedPassword,
				resetToken: null,
				resetTokenExpires: null
			})
			.where(
				and(
					eq(businessAccounts.sourceId, business.id),
					eq(businessAccounts.countryCode, business.countryCode)
				)
			);

		// 8. Reset rate limit on successful password reset
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
