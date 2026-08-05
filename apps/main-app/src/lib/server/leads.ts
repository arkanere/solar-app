// Unified lead insertion during the coexistence window.
//
// The old country table (leaddata / us_leaddata) is written because
// business-app still reads leads from it; migration 045's sync triggers
// mirror the row into the unified leads table synchronously in the same
// transaction, so the leads row is read back immediately after the insert.
// When business-app migrates to leads, this switches to a direct insert
// and the triggers are dropped.

import { db } from './db';
import { syncLeadToUnified } from './unifiedSync';
import type { CountryCode } from '$lib/countries';
import { leaddata, leads, pincodeMapping } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

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
	id: number; // leads.id
	sourceId: number; // old-table id (what confirmation emails reference)
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

	// One transaction for the legacy insert, the sv_sync_lead() projection and
	// the read-back of the unified row. syncLeadToUnified takes the same tx
	// handle, so the projection runs on this connection rather than a second
	// one — that is what the hand-rolled BEGIN/COMMIT on a checked-out client
	// was doing before.
	return db.transaction(async (tx) => {
		let sourceId: number;
		let referenceUuid: string | null = null;

		// Since migration 054 both countries write `leaddata`, discriminated by
		// country_code. level1/level2 are resolved from pincode_mapping, which is
		// IN-only, so they are already null for US — the same values the separate
		// us_leaddata insert produced.
		const [inserted] = await tx
			.insert(leaddata)
			.values({
				countryCode: country,
				name,
				phone,
				pinCode: postalCode,
				type: type ?? null,
				comment: comment ?? null,
				urlparams: urlParams ?? null,
				email: email || null,
				district: level2,
				state: level1,
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

		// Idempotent with migration 045's sync trigger; keeps this write
		// self-sufficient once the triggers drop (phase 2.4).
		await syncLeadToUnified(tx, country, sourceId);

		const [unified] = await tx
			.select({ id: leads.id })
			.from(leads)
			.where(and(eq(leads.countryCode, country), eq(leads.sourceId, sourceId)));

		return {
			id: unified?.id ?? sourceId,
			sourceId,
			referenceUuid,
			level1,
			level2
		};
	});
}
