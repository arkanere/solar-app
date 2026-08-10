// Lead insertion. `leaddata` is the lead table for every country, discriminated
// by country_code, and since 066 it carries the country-neutral column names.
//
// The sv_sync_lead() projection into `leads` is still driven here through the
// 066 deploy so that table stays correct while it is on its way out; 067 drops
// it and this call goes with it. Nothing reads `leads` here any more — the
// read-back that used to follow the sync existed only to fill an `id` field on
// InsertedLead that no caller ever read.

import { db } from './db';
import { syncLeadToUnified } from './unifiedSync';
import type { CountryCode } from '$lib/countries';
import { leaddata, pincodeMapping } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

export interface LeadPayload {
	name: string;
	phone: string;
	postalCode: string;
	type?: string | null;
	comment?: string | null;
	urlParams?: string | null;
	email?: string | null;
	marketingConsent?: boolean;
}

export interface InsertedLead {
	sourceId: number; // leaddata.id (what confirmation emails reference)
	referenceUuid: string | null; // IN-only, from old leaddata
	level1: string | null;
	level2: string | null;
}

export async function insertLead(
	country: CountryCode,
	payload: LeadPayload
): Promise<InsertedLead> {
	const { name, phone, postalCode, type, comment, urlParams, email, marketingConsent } = payload;

	// IN resolves district/state from the pincode (pincode_mapping is IN-only).
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
			console.log('District lookup failed for pincode:', postalCode, lookupError);
		}
	}

	// One transaction for the insert and the sv_sync_lead() projection.
	// syncLeadToUnified takes the same tx handle, so the projection runs on this
	// connection rather than a second one — that is what the hand-rolled
	// BEGIN/COMMIT on a checked-out client was doing before.
	return db.transaction(async (tx) => {
		let sourceId: number;
		let referenceUuid: string | null = null;

		// Both countries write `leaddata`, discriminated by country_code (054).
		// level1/level2 are resolved from pincode_mapping, which is IN-only, so
		// they are already null for US — the same values the separate us_leaddata
		// insert produced, and next-steps.md item 3 is what that costs.
		const [inserted] = await tx
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
		sourceId = inserted.id;

		// `reference_uuid` stays IN-only in the *return value*, per InsertedLead's
		// contract. The column defaults to gen_random_uuid() so US rows now carry
		// one, but surfacing it would be a US-visible change (the confirmation
		// path keys off this being null) and belongs in its own commit.
		if (country === 'in') {
			referenceUuid = inserted.referenceUuid;
		}

		await syncLeadToUnified(tx, country, sourceId);

		return {
			sourceId,
			referenceUuid,
			level1,
			level2
		};
	});
}
