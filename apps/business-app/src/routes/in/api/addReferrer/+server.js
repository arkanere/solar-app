import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business/index.js';

export async function POST({ request, cookies }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const data = await request.json();
		const { businessId, name, email, phone, notes } = data;

		// Verify the logged-in business is adding referrer for themselves
		if (sessionResult.session.businessId !== businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only add referrers to your own business' },
				{ status: 403 }
			);
		}

		// Validate required fields
		if (!name || !phone) {
			return json({ success: false, error: 'Name and phone are required' }, { status: 400 });
		}

		// Validate phone number format (10 digits)
		const phoneRegex = /^[6-9]\d{9}$/;
		if (!phoneRegex.test(phone)) {
			return json({ success: false, error: 'Invalid phone number format' }, { status: 400 });
		}

		// Validate email format if provided
		if (email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return json({ success: false, error: 'Invalid email format' }, { status: 400 });
			}
		}

		// Check if referrer with same phone already exists for this business
		const checkQuery = `
			SELECT id FROM referrers_in
			WHERE business_id = $1 AND phone = $2
		`;
		const checkResult = await pool.query(checkQuery, [businessId, phone]);

		if (checkResult.rows.length > 0) {
			return json(
				{ success: false, error: 'A referrer with this phone number already exists' },
				{ status: 400 }
			);
		}

		// Insert referrer into database
		const insertQuery = `
			INSERT INTO referrers_in (
				business_id,
				name,
				phone,
				email,
				notes
			)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, business_id, name, phone, email, notes, created_at, updated_at
		`;

		const insertResult = await pool.query(insertQuery, [
			businessId,
			name,
			phone,
			email || null,
			notes || null
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
		if (error.message && error.message.includes('relation "referrers_in" does not exist')) {
			return json(
				{ success: false, error: 'Referrers table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to add referrer' }, { status: 500 });
	} finally {
		await pool.end();
	}
}
