// src/routes/api/submitLead/+server.ts
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { leaddata, pincodeMapping } from '@solar/db/schema';
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

		// Get district from pincode mapping
		let district: string | null = null;
		if (pinCode) {
			try {
				const districtResult = await db
					.select({ district: pincodeMapping.district })
					.from(pincodeMapping)
					.where(eq(pincodeMapping.pincode, pinCode))
					.limit(1);
				if (districtResult.length > 0) {
					district = districtResult[0].district;
				}
			} catch (districtError) {
				console.log('District lookup failed for pincode:', pinCode, districtError);
				// Continue with null district if lookup fails
			}
		}

		const result = await db
			.insert(leaddata)
			.values({
				name,
				phone,
				pinCode,
				type,
				comment,
				urlparams: urlParam,
				email: email || null,
				district
			})
			.returning({ id: leaddata.id, referenceUuid: leaddata.referenceUuid });

		const leadId = result[0].id;
		const referenceUuid = result[0].referenceUuid;

		// Use `fetch` from event
		await fetch('/api/sendLeadSubmissionConfirmation', {
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
