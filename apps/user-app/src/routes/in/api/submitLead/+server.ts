import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const { name, phone, pinCode, type, comment, urlParam, email, marketing_consent } =
			await request.json();

		let district: string | null = null;
		let state: string | null = null;
		if (pinCode) {
			try {
				const districtRows = await db
					.select({
						district: schema.pincodeMapping.district,
						state: schema.pincodeMapping.state
					})
					.from(schema.pincodeMapping)
					.where(eq(schema.pincodeMapping.pincode, pinCode))
					.limit(1);
				if (districtRows.length > 0) {
					district = districtRows[0].district;
					state = districtRows[0].state;
				}
			} catch (districtError) {
				console.log('District lookup failed for pincode:', pinCode, districtError);
			}
		}

		const [inserted] = await db
			.insert(schema.leaddata)
			.values({
				name,
				phone,
				postalCode: pinCode,
				type,
				comment,
				urlparams: urlParam,
				email: email || null,
				level2: district,
				level1: state,
				marketingConsent: marketing_consent === true
			})
			.returning({
				id: schema.leaddata.id,
				referenceUuid: schema.leaddata.referenceUuid
			});

		const leadId = inserted.id;
		const referenceUuid = inserted.referenceUuid;

		await syncLeadToUnified(db, 'in', leadId);

		await fetch('/in/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: leadId, name, phone, pinCode, type, comment, urlParam, email, district, state })
		});

		return json({ success: true, reference_uuid: referenceUuid });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
};
