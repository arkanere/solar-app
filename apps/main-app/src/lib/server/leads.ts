// Unified lead insertion during the coexistence window.
//
// The old country table (leaddata / us_leaddata) is written because
// business-app still reads leads from it; migration 045's sync triggers
// mirror the row into the unified leads table synchronously in the same
// transaction, so the leads row is read back immediately after the insert.
// When business-app migrates to leads, this switches to a direct insert
// and the triggers are dropped.

import { db, pool } from './db';
import { syncLeadToUnified } from './unifiedSync';
import type { CountryCode } from '$lib/countries';
import { createDb } from '@solar/db';
import { leaddata, usLeaddata, leads, pincodeMapping } from '@solar/db/schema';
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

	const client = await pool.connect();
	// Drizzle bound to the checked-out client, so these statements run inside
	// the BEGIN/COMMIT below alongside the raw sv_sync_lead() call.
	const tx = createDb(client);
	try {
		await client.query('BEGIN');

		let sourceId: number;
		let referenceUuid: string | null = null;

		if (country === 'in') {
			const [inserted] = await tx
				.insert(leaddata)
				.values({
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
			referenceUuid = inserted.referenceUuid;
		} else {
			const [inserted] = await tx
				.insert(usLeaddata)
				.values({
					name,
					phone,
					zipcode: postalCode,
					type: type ?? null,
					comment: comment ?? null,
					urlparams: urlParams ?? null,
					email: email || null,
					marketingConsent: marketingConsent === true
				})
				.returning({ id: usLeaddata.id });
			sourceId = inserted.id;
		}

		// Idempotent with migration 045's sync trigger; keeps this write
		// self-sufficient once the triggers drop (phase 2.4).
		await syncLeadToUnified(client, country, sourceId);

		const [unified] = await tx
			.select({ id: leads.id })
			.from(leads)
			.where(and(eq(leads.countryCode, country), eq(leads.sourceId, sourceId)));

		await client.query('COMMIT');

		return {
			id: unified?.id ?? sourceId,
			sourceId,
			referenceUuid,
			level1,
			level2
		};
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}
