// src/routes/api/us/submitBusiness/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';

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
		const rscore = 0;
		const isvisible = 0;
		const businessfilled = false;
		const tag = 'blank';
		const slug = null;
		const notes = null;

		// Insert query for US businesses table
		const insertQuery = `
            INSERT INTO us_businesses (
                rscore, isvisible, businessfilled, pluscode, phonenumber, whatsapp, email, login_email, website, ein, state, county, city, tag, slug, notes, businessname, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id
        `;

		const result = await pool.query(insertQuery, [
			rscore,
			isvisible,
			businessfilled,
			plusCode || null,
			phoneNumber,
			whatsappNumber || null,
			email || null,
			login_email || null,
			website || null,
			gstn || null,
			state,
			county,
			city,
			tag,
			slug,
			notes,
			businessName,
			address
		]);

		const businessId = result.rows[0].id;

		// Idempotent with the us_businesses sync triggers (043/046); keeps the
		// unified tables fresh once those triggers drop (phase 2.4).
		await syncBusinessToUnified(pool, 'us', businessId);
		await syncAccountToUnified(pool, 'us', businessId);

		// Send confirmation email via the unified endpoint
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
