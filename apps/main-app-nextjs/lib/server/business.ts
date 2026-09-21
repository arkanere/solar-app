/**
 * Business signup: the two rows a new business is. Ported from
 * apps/main-app/src/routes/[country=country]/api/submitBusiness/+server.ts,
 * which is still the live implementation — a straight carry-across, not a
 * redesign, so the two stay comparable while both apps exist.
 *
 * The write lives here rather than in the route for the reason `leads.ts`
 * does: the route is the HTTP shape, this is the database contract, and the
 * comments below are about migrations rather than about status codes.
 *
 * **A business is exactly two rows**, and both must land:
 *
 *  - `business_profiles` — one LOCATION. This is what the directory lists.
 *  - `business_accounts` — one COMPANY, and the only thing that can log in.
 *    The auth layer reads it throughout, so a profile without an account is a
 *    business that can never sign in and can never be sent a magic link.
 *
 * Since migration 054 both countries write the same tables, keyed by
 * `country_code`, so there is no separate US path. 063 renamed the US-shaped
 * columns (ein/county/zipcode) to the country-neutral tax_id/level1/level2/
 * postal_code, which are now the only names. 079 then moved the country off
 * `business_profiles` entirely — a profile's country is its ACCOUNT's, which
 * is why the placeholder-then-UPDATE below matters: until that update lands
 * the profile points at account 0 and has no country at all.
 */
import { and, eq } from 'drizzle-orm';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { db } from '@/lib/server/db';
import type { CountryCode } from '@/lib/countries';

/**
 * 079: a profile's country is reached through account_business_id ->
 * business_accounts.source_id, so every country-scoped read of
 * `business_profiles` needs this join as well as the predicate. Copied from
 * lib/directory/data.ts, which copied it from the SvelteKit
 * `businessCountry.ts` — where the join and the predicate are kept together
 * so a call site cannot take one and forget the other.
 */
const accountOfProfile = eq(businessAccounts.sourceId, businessProfiles.accountBusinessId);

export type BusinessSignup = {
  businessName: string;
  address: string;
  plusCode?: string | null;
  phoneNumber: string;
  whatsappNumber?: string | null;
  email: string;
  loginEmail: string;
  website?: string | null;
  /** GSTN on IN. Empty on US, which does not collect one at signup. */
  taxId?: string | null;
  state: string;
  /** District (IN) or county (US) — the caller resolves which key it arrived under. */
  level2: string;
  city: string;
};

/**
 * Whether a visible-or-not business in this country already claims this tax id.
 *
 * **IN-only, and the caller enforces that.** US does not collect a tax id at
 * signup, so every US row would collide on an empty value. Scoping by country
 * is not optional either: since both countries share `business_profiles`, an
 * IN signup could otherwise collide with a US row's NULL or empty `tax_id`.
 */
export async function taxIdExists(country: CountryCode, taxId: string): Promise<boolean> {
  const rows = await db
    .select({ businessId: businessProfiles.businessId })
    .from(businessProfiles)
    .innerJoin(businessAccounts, accountOfProfile)
    .where(and(eq(businessAccounts.countryCode, country), eq(businessProfiles.taxId, taxId)))
    .limit(1);
  return rows.length > 0;
}

/** The new business's id — `business_profiles.business_id`, which is also its account's `source_id`. */
export async function insertBusiness(
  country: CountryCode,
  signup: BusinessSignup
): Promise<number> {
  // Defaults for the columns the form does not collect. `isvisible` false is
  // the point of the whole flow: a signup is a request to be listed, and an
  // operator verifies it before it appears.
  const rscore = 0;
  const isvisible = false;
  const tag = 'blank';

  // `businessfilled` DEFAULTED TO TRUE on the old businesses_1 table, and the
  // IN path always relied on that default while the old us_businesses insert
  // set it false explicitly. `business-listing` filters on this column, so the
  // two countries keep their existing values rather than converging on one.
  // `business_profiles` has no default, so it is passed explicitly.
  const businessfilled = country === 'in';

  // Since 062 `business_profiles` mints the id itself: businesses_1_id_seq was
  // reassigned to business_id and set as its DEFAULT, so ids stay continuous
  // with every id ever issued and (country_code, source_id) identity holds.
  const inserted = await db
    .insert(businessProfiles)
    .values({
      // 075: a main business owns its own account, so account_business_id is
      // its own business_id — which the DEFAULT does not hand out until the
      // row exists. Hence the placeholder and the UPDATE below. There is no FK
      // on the column, so the interim value is legal; 075's header explains
      // why claiming the id off the sequence instead is not safe.
      accountBusinessId: 0,
      rscore,
      isvisible,
      businessfilled,
      businessname: signup.businessName,
      address: signup.address,
      pluscode: signup.plusCode || null,
      phonenumber: signup.phoneNumber,
      whatsapp: signup.whatsappNumber || null,
      email: signup.email || null,
      website: signup.website || null,
      taxId: signup.taxId || null,
      level1: signup.state,
      level2: signup.level2,
      city: signup.city,
      tag,
      slug: null,
      notes: null
    })
    .returning({ businessId: businessProfiles.businessId });

  const businessId = inserted[0].businessId;

  // Point the profile at its own account now that it has an id.
  await db
    .update(businessProfiles)
    .set({ accountBusinessId: businessId })
    .where(eq(businessProfiles.businessId, businessId));

  // The account half. `sv_sync_account` used to write this row by reading
  // login_email back out of businesses_1; with that table archived, here is
  // the only place the address can come from.
  //
  // No ON CONFLICT: business_id is freshly minted above, so a conflict on
  // (country_code, source_id) would mean the sequence handed out a live id and
  // should fail loudly rather than overwrite an existing account.
  await db.insert(businessAccounts).values({
    countryCode: country,
    sourceId: businessId,
    loginEmail: signup.loginEmail,
    // 077 renamed this from `isvisible`. It gates the LOGIN; the profile's own
    // isvisible, set above, decides whether the location is listed. Both come
    // from the same value at signup — a new business is either live in both
    // senses or neither.
    isActive: isvisible
  });

  return businessId;
}
