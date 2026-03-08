import { json, type RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

interface PartnerData {
	businessName: string;
	contactName: string;
	phone: string;
	email: string;
	city: string;
	district: string;
	state: string;
	services: string;
	experience: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: PartnerData = await request.json();
		const { businessName, contactName, phone, email, city, district, state, services, experience } =
			data;

		if (!businessName?.trim()) {
			return json({ success: false, error: 'Business name is required' }, { status: 400 });
		}
		if (!contactName?.trim()) {
			return json({ success: false, error: 'Contact name is required' }, { status: 400 });
		}
		if (!phone?.trim()) {
			return json({ success: false, error: 'Phone number is required' }, { status: 400 });
		}
		if (!email?.trim()) {
			return json({ success: false, error: 'Email is required' }, { status: 400 });
		}
		if (!city?.trim()) {
			return json({ success: false, error: 'City is required' }, { status: 400 });
		}

		const duplicateCheck = await pool.query(
			'SELECT id FROM partner_leads WHERE LOWER(email) = LOWER($1)',
			[email]
		);

		if (duplicateCheck.rows.length > 0) {
			return json(
				{ success: false, error: 'This email is already registered. We will contact you soon.' },
				{ status: 400 }
			);
		}

		const result = await pool.query<{ id: number }>(
			`INSERT INTO partner_leads (business_name, contact_name, phone, email, city, district, state, services, experience, created_at)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
			 RETURNING id`,
			[
				businessName.trim(),
				contactName.trim(),
				phone.trim(),
				email.trim(),
				city.trim(),
				district?.trim() || city.trim(),
				state?.trim() || '',
				services?.trim() || '',
				experience?.trim() || ''
			]
		);

		return json({ success: true, id: result.rows[0].id });
	} catch (error) {
		console.error('Error submitting partner lead:', error);
		return json({ success: false, error: 'Failed to submit. Please try again.' }, { status: 500 });
	}
};
