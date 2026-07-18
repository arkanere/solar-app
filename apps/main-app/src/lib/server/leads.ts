// Unified lead insertion during the coexistence window.
//
// The old country table (leaddata / us_leaddata) is written because
// business-app still reads leads from it; migration 045's sync triggers
// mirror the row into the unified leads table synchronously in the same
// transaction, so the leads row is read back immediately after the insert.
// When business-app migrates to leads, this switches to a direct insert
// and the triggers are dropped.

import { pool } from './db';
import { syncLeadToUnified } from './unifiedSync';
import type { CountryCode } from '$lib/countries';

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
			const result = await pool.query(
				'SELECT district, state FROM pincode_mapping WHERE pincode = $1 LIMIT 1',
				[postalCode]
			);
			if (result.rows.length > 0) {
				level2 = result.rows[0].district;
				level1 = result.rows[0].state;
			}
		} catch (lookupError) {
			console.log('District lookup failed for pincode:', postalCode, lookupError);
		}
	}

	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		let sourceId: number;
		let referenceUuid: string | null = null;

		if (country === 'in') {
			const oldResult = await client.query(
				`INSERT INTO leaddata (name, phone, pin_code, type, comment, urlparams, email, district, state, marketing_consent)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
				 RETURNING id, reference_uuid`,
				[
					name,
					phone,
					postalCode,
					type ?? null,
					comment ?? null,
					urlParams ?? null,
					email || null,
					level2,
					level1,
					marketingConsent === true
				]
			);
			sourceId = oldResult.rows[0].id;
			referenceUuid = oldResult.rows[0].reference_uuid;
		} else {
			const oldResult = await client.query(
				`INSERT INTO us_leaddata (name, phone, zipcode, type, comment, urlparams, email, marketing_consent)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				 RETURNING id`,
				[
					name,
					phone,
					postalCode,
					type ?? null,
					comment ?? null,
					urlParams ?? null,
					email || null,
					marketingConsent === true
				]
			);
			sourceId = oldResult.rows[0].id;
		}

		// Idempotent with migration 045's sync trigger; keeps this write
		// self-sufficient once the triggers drop (phase 2.4).
		await syncLeadToUnified(client, country, sourceId);

		const newResult = await client.query(
			`SELECT id FROM leads WHERE country_code = $1 AND source_id = $2`,
			[country, sourceId]
		);

		await client.query('COMMIT');

		return {
			id: newResult.rows[0]?.id ?? sourceId,
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
