/**
 * Lead insertion. Ported from apps/main-app/src/lib/server/leads.ts, which is
 * still the live implementation — this is a straight carry-across, not a
 * redesign, so the two stay comparable while both apps exist.
 *
 * `leaddata` is the lead table for every country, discriminated by
 * `country_code`. There is nothing to project alongside it: migration 067
 * dropped `leads`, so the insert below is the whole write.
 */
import { eq } from 'drizzle-orm';
import { leaddata, pincodeMapping } from '@solar/db/schema';
import { db } from '@/lib/server/db';
import type { CountryCode } from '@/lib/countries';

export type LeadPayload = {
  name: string;
  phone: string;
  postalCode: string;
  type?: string | null;
  comment?: string | null;
  urlParams?: string | null;
  email?: string | null;
  marketingConsent?: boolean;
};

export type InsertedLead = {
  /** leaddata.id — what confirmation emails reference. */
  sourceId: number;
  /** IN-only, per the contract below. */
  referenceUuid: string | null;
  level1: string | null;
  level2: string | null;
};

export async function insertLead(
  country: CountryCode,
  payload: LeadPayload
): Promise<InsertedLead> {
  const { name, phone, postalCode, type, comment, urlParams, email, marketingConsent } = payload;

  // IN resolves district/state from the pincode; `pincode_mapping` is IN-only.
  // A failed lookup must not lose the lead, so it is caught and the row goes
  // in with null levels — the same outcome US already has.
  let level1: string | null = null;
  let level2: string | null = null;
  if (country === 'in' && postalCode) {
    try {
      const [match] = await db
        .select({ district: pincodeMapping.district, state: pincodeMapping.state })
        .from(pincodeMapping)
        .where(eq(pincodeMapping.pincode, postalCode))
        .limit(1);
      if (match) {
        level2 = match.district;
        level1 = match.state;
      }
    } catch (lookupError) {
      console.error('District lookup failed for pincode:', postalCode, lookupError);
    }
  }

  // No transaction: the original's existed to hold this insert and a
  // sv_sync_lead() call on one connection, and with the sync gone this is a
  // single statement.
  const [inserted] = await db
    .insert(leaddata)
    .values({
      countryCode: country,
      name,
      phone,
      postalCode,
      type: type ?? null,
      comment: comment ?? null,
      urlparams: urlParams ?? null,
      email: email || null,
      level2,
      level1,
      marketingConsent: marketingConsent === true
    })
    .returning({ id: leaddata.id, referenceUuid: leaddata.referenceUuid });

  // `reference_uuid` stays IN-only in the RETURN VALUE. The column defaults to
  // gen_random_uuid() so US rows carry one too, but surfacing it would be a
  // US-visible change and belongs in its own commit.
  return {
    sourceId: inserted.id,
    referenceUuid: country === 'in' ? inserted.referenceUuid : null,
    level1,
    level2
  };
}
