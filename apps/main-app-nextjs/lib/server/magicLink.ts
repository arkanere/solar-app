/**
 * Customer magic links. Ported from
 * apps/main-app/src/routes/[country=country]/api/generateUserMagicLink/+server.ts,
 * with the minting lifted out of the route so the confirmation email can call
 * it in process instead of over HTTP.
 *
 * Customer accounts are IN-only: `sv_user` has no country column and there is
 * no unified equivalent, so the caller must check `features.userAccounts`
 * before calling. `mintUserMagicLink` throws if it is off rather than
 * silently writing an IN row for another country's lead.
 *
 * ONE DELIBERATE FIX, not a straight carry-across. The SvelteKit original
 * builds `${request origin}/user/signin-link/{token}` — i.e. a path on
 * main-app's own domain. Nothing serves it: main-app has no `/user` route and
 * no rewrite to one, and user-app's route is `/signin-link/{token}` at the
 * root. Both of the other producers of a customer magic link
 * (apps/user-app's own generateUserMagicLink, and business-app's claimLead)
 * emit `https://user.solarvipani.com/signin-link/{token}`, so main-app is the
 * outlier and its links are dead. This uses the working form. The host is an
 * env var so a preview deploy can point at a preview user-app; the default is
 * the production host the other two hardcode.
 */
import { createHash, randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { svUser } from '@solar/db/schema';
import { db } from '@/lib/server/db';
import { getCountry, type CountryCode } from '@/lib/countries';

/** Magic links expire 15 days after creation. */
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

const USER_APP_URL = process.env.USER_APP_URL ?? 'https://user.solarvipani.com';

/**
 * Upsert the customer by email, store a fresh token hash, return the link.
 * The raw token is emailed; only its SHA-256 is stored, so a database leak
 * does not hand out working sign-in links.
 */
export async function mintUserMagicLink(
  country: CountryCode,
  { email, name }: { email: string; name?: string | null }
): Promise<string> {
  if (!getCountry(country).features.userAccounts) {
    throw new Error(`User accounts are not enabled for ${country}`);
  }

  const rawToken = randomUUID();
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  // magic_link_token_expires_at is `timestamptz` and typed `mode: 'string'` by
  // the introspected schema, so an ISO (UTC) string is the right thing to
  // write. A plain `timestamp` column would need a local-naive string instead.
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const [existing] = await db
    .select({ id: svUser.id })
    .from(svUser)
    .where(eq(svUser.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(svUser)
      .set({
        magicLinkToken: tokenHash,
        magicLinkTokenExpiresAt: expiresAt,
        // Keep the name already on file when this lead did not send one.
        name: sql`COALESCE(${name ?? null}, ${svUser.name})`
      })
      .where(eq(svUser.id, existing.id));
  } else {
    await db.insert(svUser).values({
      email,
      name: name || null,
      magicLinkToken: tokenHash,
      magicLinkTokenExpiresAt: expiresAt
    });
  }

  return `${USER_APP_URL}/signin-link/${rawToken}`;
}
