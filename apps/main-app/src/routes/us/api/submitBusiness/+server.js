// src/routes/api/us/submitBusiness/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	// ✅ Added fetch from event
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const {
			businessName,
			address,
			plusCode,
			phoneNumber,
			whatsappNumber,
			email,
			login_email,
			website,
			gstn, // This will be EIN for US
			state,
			county,
			city
		} = data;

		// Set default values for non-form fields
		const rscore = 0; // Default value for rscore
		const isvisible = 0; // Assuming 1 means visible
		const businessfilled = false; // Default to false
		const tag = 'blank'; // Default tag
		const slug = null; // Empty slug for now
		const notes = null; // Empty notes for now
		const login_password = 'businessadminzpassword';

		// Insert query for US businesses table
		const insertQuery = `
            INSERT INTO us_businesses (
                rscore, isvisible, businessfilled, pluscode, phonenumber, whatsapp, email, login_email, website, ein, state, county, city, tag, slug, notes, businessname, address, login_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING id
        `;

		// Use NULL for optional fields if they are not provided or empty
		const result = await pool.query(insertQuery, [
			rscore,
			isvisible,
			businessfilled,
			plusCode || null, // If plusCode is not provided, insert NULL
			phoneNumber,
			whatsappNumber || null, // If whatsappNumber is not provided, insert NULL
			email || null, // If email is not provided, insert NULL
			login_email || 'admin@example.com',
			website || null, // If website is not provided, insert NULL
			gstn || null, // EIN for US
			state,
			county,
			city,
			tag,
			slug,
			notes,
			businessName,
			address,
			login_password
		]);

		const businessId = result.rows[0].id;

		// Send confirmation email via the US-specific endpoint
		await fetch('/us/api/sendBusinessSubmissionConfirmation', {
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
				county,
				city
			})
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting US business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
}
