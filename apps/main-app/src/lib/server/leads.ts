// Lead insertion. `leaddata` is the lead table for every country, discriminated
// by country_code, and since 066 it carries the country-neutral column names.
//
// There is nothing to project: 067 dropped `leads`, so the insert below is the
// whole write. What used to follow it was a sv_sync_lead() call and a read-back
// of the projected row, the latter only ever filling an InsertedLead.id no
// caller read.

import { db } from './db';
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

	// No transaction: it existed to hold the insert and the sv_sync_lead() call
	// on one connection, and with the sync gone this is a single statement.
	//
	// Both countries write `leaddata`, discriminated by country_code (054).
	// level1/level2 are resolved from pincode_mapping, which is IN-only, so they
	// are already null for US — the same values the separate us_leaddata insert
	// produced, and next-steps.md item 3 is what that costs.
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

	// `reference_uuid` stays IN-only in the *return value*, per InsertedLead's
	// contract. The column defaults to gen_random_uuid() so US rows now carry
	// one, but surfacing it would be a US-visible change (the confirmation path
	// keys off this being null) and belongs in its own commit.
	return {
		sourceId: inserted.id,
		referenceUuid: country === 'in' ? inserted.referenceUuid : null,
		level1,
		level2
	};
}
