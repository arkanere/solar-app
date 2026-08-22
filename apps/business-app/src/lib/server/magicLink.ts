import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles, svUser } from '@solar/db/schema';
import { eq, inArray, sql } from 'drizzle-orm';

// Magic-link tokens are stored hashed at rest and expire after 15 days.
// Emitters mint a fresh token, persist its hash, and email/return the raw token.
// Each table holds a single token column, so minting invalidates any previously
// issued link for that account (last-write-wins, by design).
export const MAGIC_LINK_TTL_DAYS = 15;
const TOKEN_TTL_MS = MAGIC_LINK_TTL_DAYS * 24 * 60 * 60 * 1000;

export function newMagicToken() {
	const raw = uuidv4();
	const hash = crypto.createHash('sha256').update(raw).digest('hex');
	const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
	return { raw, hash, expiresAt };
}

// Keyed by business id alone. The signature used to take a country as well,
// because source_id was unique only per country — but business_profiles.business_id
// carries `business_profiles_business_id_key`, so the id it holds is globally
// unique, and 071 states that on business_accounts.source_id directly. A caller
// that has the id therefore identifies exactly one account with it, and the
// country it had to thread alongside was redundant. (It was also the failure
// mode: admin-app's welcome mail 400'd for months because one hop in the chain
// did not forward it.)
export async function mintBusinessTokenById(businessId: number): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();

	// 075: the caller passes a *profile* id, which since the account duplication
	// went may not be an account id — a branch names its main's. Resolving here
	// rather than at each call site means a caller holding a branch id cannot
	// silently mint nothing. claimLead is exactly that caller: it allots to a
	// branch it may have just created, and before this it would have got a null
	// token and emailed a link with `null` in it.
	const accountId = db
		.select({ id: businessProfiles.accountBusinessId })
		.from(businessProfiles)
		.where(eq(businessProfiles.businessId, businessId));

	// Since 062 this writes business_accounts directly rather than staging the
	// token in businesses_1 for sv_sync_account to pick up. TokenManager already
	// verified links against this table, so the mint and the check now agree by
	// construction instead of by a sync call.
	//
	// magic_link_token_expires_at is timestamptz, so it takes .toISOString()
	// directly — unlike reset_token_expires in passwordReset.ts, which is naive.
	const updated = await db
		.update(businessAccounts)
		.set({ magicLinkToken: hash, magicLinkTokenExpiresAt: expiresAt.toISOString() })
		.where(inArray(businessAccounts.sourceId, accountId))
		.returning({ sourceId: businessAccounts.sourceId });

	if (updated.length === 0) return null;
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
