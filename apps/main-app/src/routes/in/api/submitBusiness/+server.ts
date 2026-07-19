import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { BusinessData } from '$lib/types/api';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';

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
		const duplicateCheck = await pool.query<{ business_id: number }>(
			'SELECT business_id FROM in_business_profiles WHERE gstn = $1',
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

		// TODO(remove after admin-app migrates; needs id-minting moved to
		// in_business_profiles): businesses_1 still mints the business id and keeps
		// the legacy table fresh for admin-app. The explicit upserts below are the
		// forward-facing writes; the sync triggers on businesses_1 upsert the same
		// values, so both paths are idempotent.
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

		// Forward-facing writes: the new tables are the source of truth for the
		// /in side. ON CONFLICT keeps them idempotent against the businesses_1
		// sync triggers, which upsert the same rows.
		await pool.query(
			`INSERT INTO in_business_profiles (
                business_id, rscore, isvisible, pluscode, phonenumber, whatsapp, email, website, gstn, state, district, tag, slug, notes, city, businessname, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ON CONFLICT (business_id) DO UPDATE SET
                rscore = EXCLUDED.rscore, isvisible = EXCLUDED.isvisible,
                pluscode = EXCLUDED.pluscode, phonenumber = EXCLUDED.phonenumber,
                whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email,
                website = EXCLUDED.website, gstn = EXCLUDED.gstn,
                state = EXCLUDED.state, district = EXCLUDED.district,
                tag = EXCLUDED.tag, slug = EXCLUDED.slug, notes = EXCLUDED.notes,
                city = EXCLUDED.city, businessname = EXCLUDED.businessname,
                address = EXCLUDED.address, updated_at = NOW()`,
			[
				businessId,
				rscore,
				isvisible,
				plusCode || null,
				phoneNumber,
				whatsappNumber || null,
				email || null,
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
			]
		);

		await pool.query(
			`INSERT INTO in_business_accounts (business_id, login_email, isvisible)
            VALUES ($1, $2, $3)
            ON CONFLICT (business_id) DO UPDATE SET
                login_email = EXCLUDED.login_email, isvisible = EXCLUDED.isvisible,
                updated_at = NOW()`,
			[businessId, login_email || null, isvisible]
		);

		// Idempotent with the businesses_1/in_business_profiles sync triggers;
		// keeps the unified tables fresh once those triggers drop (phase 2.4).
		await syncBusinessToUnified(pool, 'in', businessId);
		await syncAccountToUnified(pool, 'in', businessId);

		// Send confirmation email via the unified endpoint
		await fetch('/in/api/sendBusinessSubmissionConfirmation', {
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
