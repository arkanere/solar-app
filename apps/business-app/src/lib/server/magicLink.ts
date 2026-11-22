import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { businessAccounts, businessMagicLinks, businessProfiles, svUser } from '@solar/db/schema';
import { eq, sql } from 'drizzle-orm';

// Magic-link tokens are stored hashed at rest and expire after 15 days.
// Emitters mint a fresh token, persist its hash, and email/return the raw token.
//
// Business links: one business_magic_links row per link (088). A new link does
// not invalidate the ones sent before it, so a share mail, a WhatsApp reminder
// and the next mail all keep working until each expires.
//
// Consumer links (sv_user) still hold a single token column, so minting one
// invalidates the previous link for that user (last-write-wins).
export const MAGIC_LINK_TTL_DAYS = 15;
const TOKEN_TTL_MS = MAGIC_LINK_TTL_DAYS * 24 * 60 * 60 * 1000;

/** Forgot-password links are short-lived: they stand in for a password. */
export const FORGOT_PASSWORD_LINK_TTL_MS = 60 * 60 * 1000;

/** Why a business link was sent. Stored for audit on business_magic_links. */
export type BusinessLinkPurpose = 'lead_allotted' | 'forgot_password';

export interface MintBusinessLinkOptions {
	purpose: BusinessLinkPurpose;
	/** The lead the link is about. Sign-in lands the business on it. */
	leadId?: number | null;
	/** Defaults to 15 days. */
	ttlMs?: number;
}

export function newMagicToken(ttlMs: number = TOKEN_TTL_MS) {
	const raw = uuidv4();
	const hash = crypto.createHash('sha256').update(raw).digest('hex');
	const expiresAt = new Date(Date.now() + ttlMs);
	return { raw, hash, expiresAt };
}

// Keyed by business id alone: business_profiles.business_id is globally
// unique, and 071 states that on business_accounts.source_id directly, so the
// id names exactly one account with no country alongside it.
export async function mintBusinessTokenById(
	businessId: number,
	{ purpose, leadId = null, ttlMs = TOKEN_TTL_MS }: MintBusinessLinkOptions
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken(ttlMs);

	// 075: the caller passes a *profile* id, which may not be an account id — a
	// branch names its main's. Resolving here rather than at each call site means
	// a caller holding a branch id (claimLead, allotting to a branch it may have
	// just created) still gets a link on the right account.
	const [account] = await db
		.select({ id: businessAccounts.sourceId })
		.from(businessAccounts)
		.innerJoin(businessProfiles, eq(businessProfiles.accountBusinessId, businessAccounts.sourceId))
		.where(eq(businessProfiles.businessId, businessId))
		.limit(1);

	if (!account) return null;

	// expires_at is timestamptz, so it takes .toISOString() directly.
	await db.insert(businessMagicLinks).values({
		accountBusinessId: account.id,
		tokenHash: hash,
		purpose,
		leadId,
		expiresAt: expiresAt.toISOString()
	});

	return raw;
}

// Upserts the user by email and returns the raw token (sv_user has no slug).
export async function mintUserToken(
	email: string,
	name: string | null = null
): Promise<string> {
	const { raw, hash, expiresAt } = newMagicToken();

	// sv_user has a unique index on email, so this is a real upsert. The old
	// UPDATE-then-INSERT pair did the same thing with a race between the two.
	await db
		.insert(svUser)
		.values({
			email,
			name,
			magicLinkToken: hash,
			magicLinkTokenExpiresAt: expiresAt.toISOString()
		})
		.onConflictDoUpdate({
			target: svUser.email,
			set: {
				magicLinkToken: hash,
				magicLinkTokenExpiresAt: expiresAt.toISOString(),
				// COALESCE: a null name must not wipe an existing one.
				name: sql`COALESCE(${name}::varchar, ${svUser.name})`
			}
		});

	return raw;
}

/**
 * The sign-in link a minted business token belongs in.
 *
 * Same shape claimLead builds inline; named here because /api/forgotPassword
 * needs it too. business-app URLs carry no country segment — the slug implies
 * one — so this matches resetPasswordUrl in lib/server/passwordReset.ts.
 */
export function signInLinkUrl(slug: string, rawToken: string): string {
	return `https://business.solarvipani.com/${slug}/signin-link/${rawToken}`;
}
