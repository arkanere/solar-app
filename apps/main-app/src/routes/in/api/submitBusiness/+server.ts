import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { BusinessData } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, fetch }) => {
	// ✅ Added fetch from event
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data: BusinessData = await request.json();
		const {
			businessName,
			address,
			plusCode,
			phoneNumber,
			whatsappNumber,
			email,
			login_email,
			website,
			gstn,
			state,
			district,
			city
		} = data;

		// Server-side validation for required fields
		if (!businessName || businessName.trim() === '') {
			return json({ success: false, error: 'Business name is required' }, { status: 400 });
		}
		if (!address || address.trim() === '') {
			return json({ success: false, error: 'Address is required' }, { status: 400 });
		}
		if (!phoneNumber || phoneNumber.trim() === '') {
			return json({ success: false, error: 'Phone number is required' }, { status: 400 });
		}
		if (!email || email.trim() === '') {
			return json({ success: false, error: 'Business email is required' }, { status: 400 });
		}
		if (!login_email || login_email.trim() === '') {
			return json({ success: false, error: 'Login email is required' }, { status: 400 });
		}
		if (!gstn || gstn.trim() === '') {
			return json({ success: false, error: 'GSTN is required' }, { status: 400 });
		}
		if (!state || state.trim() === '') {
			return json({ success: false, error: 'State is required' }, { status: 400 });
		}
		if (!district || district.trim() === '') {
			return json({ success: false, error: 'District is required' }, { status: 400 });
		}
		if (!city || city.trim() === '') {
			return json({ success: false, error: 'City is required' }, { status: 400 });
		}

		// Check for duplicate GSTN
		const duplicateCheck = await pool.query<{ id: number }>(
			'SELECT id FROM businesses_1 WHERE gstn = $1',
			[gstn]
		);

		if (duplicateCheck.rows.length > 0) {
			return json(
				{
					success: false,
					error: 'A business with this GSTN already exists. Please check your GSTN or contact support if you believe this is an error.'
				},
				{ status: 400 }
			);
		}

		// Set default values for non-form fields
		const rscore = 0;
		const isvisible = 0;
		const tag = 'blank';
		const slug = null;
		const notes = null;

		const insertQuery = `
            INSERT INTO businesses_1 (
                rscore, isvisible, pluscode, phonenumber, whatsapp, email, login_email, website, gstn, state, district, tag, slug, notes, city, businessname, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING id
        `;

		const result = await pool.query<{ id: number }>(insertQuery, [
			rscore,
			isvisible,
			plusCode || null,
			phoneNumber,
			whatsappNumber || null,
			email || null,
			login_email || null,
			website || null,
			gstn || null,
			state,
			district,
			tag,
			slug,
			notes,
			city,
			businessName,
			address
		]);

		const businessId = result.rows[0].id;

		// Send confirmation email via the new endpoint
		await fetch('/api/sendBusinessSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: businessId,
				businessName,
				address,
				plusCode,
				phoneNumber,
				whatsappNumber,
				email,
				login_email,
				website,
				gstn,
				state,
				district,
				city
			})
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
};
