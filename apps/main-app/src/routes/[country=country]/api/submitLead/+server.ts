import { json, type RequestHandler } from '@sveltejs/kit';
import { getCountry, isCountry } from '$lib/countries';
import { insertLead } from '$lib/server/leads';

export const POST: RequestHandler = async ({ request, params, fetch }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ success: false, error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	try {
		const data = await request.json();
		// Forms send pinCode (IN legacy name) or zipCode (US legacy name).
		const postalCode = data.pinCode ?? data.zipCode ?? data.postalCode ?? '';
		const { name, phone, type, comment, urlParam, email, marketing_consent } = data;

		const lead = await insertLead(country.code, {
			name,
			phone,
			postalCode,
			type,
			comment,
			urlParams: urlParam,
			email,
			marketingConsent: marketing_consent === true
		});

		// Confirmation mail flows are still per-country endpoints.
		const confirmationUrl =
			country.code === 'in'
				? '/in/api/sendLeadSubmissionConfirmation'
				: '/us/api/sendLeadSubmissionConfirmation';
		await fetch(confirmationUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: lead.sourceId,
				name,
				phone,
				pinCode: postalCode,
				zipCode: postalCode,
				type,
				comment,
				urlParam,
				email
			})
		}).catch((mailError) => {
			console.error('Lead confirmation mail failed:', mailError);
		});

		return json({
			success: true,
			id: lead.sourceId,
			reference_uuid: lead.referenceUuid
		});
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
};
