import { json, type RequestHandler } from '@sveltejs/kit';
import { inspectBody, leadSchema } from '@solar/validation';
import { getCountry, isCountry } from '$lib/countries';
import { insertLead } from '$lib/server/leads';

export const POST: RequestHandler = async ({ request, params, fetch }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ success: false, error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	try {
		const data = await request.json();

		// Log-only for now. The forms feeding this endpoint validate with three
		// different phone rules, so the real distribution of what arrives here
		// isn't known — rejecting on a guess would silently drop leads. Watch
		// `[validation] submitLead` in the logs, then swap this for parseBody
		// once the failures are understood.
		inspectBody('submitLead', leadSchema(country.code), data);

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

		await fetch(`/${country.code}/api/sendLeadSubmissionConfirmation`, {
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
