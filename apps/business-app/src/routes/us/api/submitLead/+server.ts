// src/routes/api/submitLead/+server.ts
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';
import { pincodeMapping, usLeaddata } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

interface SubmitLeadRequest {
	name: string;
	phone: string;
	pinCode: string;
	type: string;
	comment: string;
	urlParam: string;
	email?: string;
}

export const POST: RequestHandler = async ({ request, fetch }) => {

	try {
		const data = (await request.json()) as SubmitLeadRequest;
		const { name, phone, pinCode, type, comment, urlParam, email } = data;

		// Get county from pincode mapping
		let county: string | null = null;
		if (pinCode) {
			try {
				const countyResult = await db
					.select({ district: pincodeMapping.district })
					.from(pincodeMapping)
					.where(eq(pincodeMapping.pincode, pinCode))
					.limit(1);
				if (countyResult.length > 0) {
					county = countyResult[0].district;
				}
			} catch (countyError) {
				console.log('County lookup failed for pincode:', pinCode, countyError);
				// Continue with null county if lookup fails
			}
		}

		const result = await db
			.insert(usLeaddata)
			.values({
				name,
				phone,
				zipcode: pinCode,
				type,
				comment,
				urlparams: urlParam,
				email: email || null,
				county
			})
			.returning({ id: usLeaddata.id });

		const leadId = result[0].id;
		// us_leaddata has no reference_uuid column (the old RETURNING made this
		// endpoint fail outright); the unified leads table owns that concept.
		const referenceUuid = null;

		await syncLeadToUnified(db, 'us', leadId);

		// Use `fetch` from event
		await fetch('/us/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: leadId,
				name,
				phone,
				pinCode,
				type,
				comment,
				urlParam,
				email
			})
		});

		return json({ success: true, reference_uuid: referenceUuid });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
};
