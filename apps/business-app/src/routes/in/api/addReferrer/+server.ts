import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { addReferrerSchema, parseBody } from '@solar/validation';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { RequestHandler } from './$types';

interface ReferrerIdResult {
	id: number;
}

interface ReferrerResult {
	id: number;
	business_id: number;
	name: string;
	slug: string;
	phone: string;
	email: string | null;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const parsed = await parseBody(request, addReferrerSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const { businessId, name, slug, email, phone, notes } = parsed.data;

		// Verify the logged-in business is adding referrer for themselves
		if (sessionResult.session.businessId !== businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only add referrers to your own business' },
				{ status: 403 }
			);
		}

		// Check if referrer with same phone already exists for this business
		const checkPhoneQuery = `
			SELECT id FROM in_referrers
			WHERE business_id = $1 AND phone = $2
		`;
		const checkPhoneResult = await pool.query<ReferrerIdResult>(checkPhoneQuery, [
			businessId,
			phone
		]);

		if (checkPhoneResult.rows.length > 0) {
			return json(
				{ success: false, error: 'A referrer with this phone number already exists' },
				{ status: 400 }
			);
		}

		// Check if referrer with same slug already exists for this business
		const checkSlugQuery = `
			SELECT id FROM in_referrers
			WHERE business_id = $1 AND slug = $2
		`;
		const checkSlugResult = await pool.query<ReferrerIdResult>(checkSlugQuery, [businessId, slug]);

		if (checkSlugResult.rows.length > 0) {
			return json(
				{
					success: false,
					error: 'A referrer with this slug already exists. Please choose a different slug.'
				},
				{ status: 400 }
			);
		}

		// Insert referrer into database
		const insertQuery = `
			INSERT INTO in_referrers (
				business_id,
				name,
				slug,
				phone,
				email,
				notes
			)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, business_id, name, slug, phone, email, notes, created_at, updated_at
		`;

		const insertResult = await pool.query<ReferrerResult>(insertQuery, [
			businessId,
			name,
			slug,
			phone,
			email,
			notes
		]);

		const newReferrer = insertResult.rows[0];

		return json({
			success: true,
			message: 'Referrer added successfully',
			referrer: newReferrer
		});
	} catch (error) {
		console.error('Error adding referrer:', error);

		// Handle specific database errors
		if (
			error instanceof Error &&
			error.message.includes('relation "in_referrers" does not exist')
		) {
			return json(
				{ success: false, error: 'Referrers table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to add referrer' }, { status: 500 });
	} finally {
		await pool.end();
	}
};
