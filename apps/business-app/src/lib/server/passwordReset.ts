// Password-reset token minting.
//
// The counterpart to lib/server/magicLink.ts, and it follows the same rules:
// tokens are stored **hashed** at rest and the raw token is emailed. Each
// account holds a single reset token, so minting invalidates any previously
// issued link (last-write-wins, by design), and `resetPassword` consumes the
// token by clearing it — which is what makes a second use fail.
//
// Writes go to the legacy table, the same as mintBusinessTokenById: that is
// still the write side, and the sv_sync_* projection carries the change into
// business_accounts, which the auth layer reads. Since 054 that is one table
// for every country, scoped by country_code rather than by table choice.

import { db } from '$lib/server/db';
import { businessAccounts, businesses, businesses1 } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { TokenSecurity } from '$lib/auth/business';
import { syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';
import type { AuthCountry } from '$lib/auth/business/countryTables';

/** How long a reset link stays valid. */
const RESET_TTL_HOURS = 1;

/**
 * Format a Date as a naive local timestamp string ("YYYY-MM-DD HH:MM:SS").
 *
 * `reset_token_expires` is `timestamp` **without** time zone — unlike
 * `magic_link_token_expires_at`, which is timestamptz and takes `.toISOString()`
 * directly. A naive column read back through node-postgres is interpreted in
 * the process's local zone, so writing UTC would shift the expiry by the
 * offset (and expire every link immediately anywhere east of UTC). Writing
 * local-naive round-trips exactly, whatever zone the app runs in.
 */
function toNaiveLocal(date: Date): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return (
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
		`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
	);
}

export interface ResetTarget {
	businessId: number;
	slug: string;
	businessname: string | null;
	loginEmail: string;
}

/**
 * Find the account a reset request is for, by login email.
 *
 * Reads the unified tables — the same (country_code, source_id) join
 * PasswordManager and TokenManager use — so the caller never has to know which
 * per-country table the row came from. Returns null when there is no such
 * account; the caller must not let that difference reach the response.
 */
export async function findResetTargetByEmail(
	country: AuthCountry,
	email: string
): Promise<ResetTarget | null> {
	const [row] = await db
		.select({
			businessId: businessAccounts.sourceId,
			slug: businesses.slug,
			businessname: businesses.businessname,
			loginEmail: businessAccounts.loginEmail
		})
		.from(businessAccounts)
		.innerJoin(
			businesses,
			and(
				eq(businesses.countryCode, businessAccounts.countryCode),
				eq(businesses.sourceId, businessAccounts.sourceId)
			)
		)
		.where(and(eq(businessAccounts.countryCode, country), eq(businessAccounts.loginEmail, email)))
		.limit(1);

	// `slug` and `login_email` are both nullable on the unified tables. A row
	// missing either cannot be sent a working link, so treat it as not found.
	if (!row || !row.slug || !row.loginEmail) return null;

	return {
		businessId: row.businessId,
		slug: row.slug,
		businessname: row.businessname,
		loginEmail: row.loginEmail
	};
}

/**
 * Mint a reset token for this business and persist its hash. Returns the raw
 * token to email, or null if the write matched no row.
 */
export async function mintPasswordResetToken(
	country: AuthCountry,
	businessId: number
): Promise<string | null> {
	const raw = TokenSecurity.generateSecureToken();
	const hash = TokenSecurity.hashToken(raw);
	const expiresAt = TokenSecurity.getTokenExpiration(RESET_TTL_HOURS);

	// Since 054 both countries live in businesses_1, discriminated by
	// country_code. The filter is what keeps a US id from matching an IN row —
	// it replaces the table choice that used to do that job.
	const updated = await db
		.update(businesses1)
		.set({
			resetToken: hash,
			resetTokenExpires: toNaiveLocal(expiresAt)
		})
		.where(and(eq(businesses1.id, businessId), eq(businesses1.countryCode, country)))
		.returning({ id: businesses1.id });

	if (updated.length === 0) return null;

	// Both countries now have in_business_profiles rows, so the split sync is no
	// longer IN-only. sv_sync_account reads businesses_1 directly, but keeping
	// the profile row fresh matters for sv_sync_business.
	await syncInSplitTables(db, businessId);
	await syncAccountToUnified(db, country, businessId);

	return raw;
}

/** The reset link a minted token belongs in. */
export function resetPasswordUrl(country: AuthCountry, slug: string, rawToken: string): string {
	return `https://business.solarvipani.com/${country}/${slug}/reset-password/${rawToken}`;
}

/** Subject + HTML body for the reset email. */
export function resetPasswordEmail(
	businessname: string | null,
	url: string
): { subject: string; message: string } {
	return {
		subject: 'Reset Your Password - Solar Vipani',
		message: `
    <p>Dear ${businessname ?? 'Solar Vipani partner'},</p>
    <p>We received a request to reset the password for your Solar Vipani business account.</p>

    <p style="margin-bottom: 2rem;">
        <a href="${url}" style="color: blue; text-decoration: underline;">Reset your password</a>
    </p>

    <p>This link expires in ${RESET_TTL_HOURS} hour${RESET_TTL_HOURS === 1 ? '' : 's'} and can be used once.</p>
    <p>If you did not request this, you can ignore this email — your password will not change.</p>

    <p>Best Regards,</p>
    <p><strong>Solar Vipani Team</strong></p>
    `
	};
}
