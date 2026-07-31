import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parseBody, submitBusinessSchema } from '@solar/validation';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';
import { isCountry } from '$lib/countries';

// US writes a single legacy table (us_businesses) where IN writes three. Both
// table sets stay exactly as they were: de-countrying these writes belongs to
// the write cutover in docs/country-scalable-architecture.md, not to this
// migration (plan §3.4).
async function insertUsBusiness(
	pool: VercelPool,
	b: {
		businessName: string;
		address: string;
		plusCode: string | null;
		phoneNumber: string;
		whatsappNumber: string | null;
		email: string;
		login_email: string;
		website: string | null;
		ein: string | null;
		state: string;
		county: string;
		city: string;
	}
): Promise<number> {
	const result = await pool.query<{ id: number }>(
		`INSERT INTO us_businesses (
                rscore, isvisible, businessfilled, pluscode, phonenumber, whatsapp, email, login_email, website, ein, state, county, city, tag, slug, notes, businessname, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id`,
		[
			0, // rscore
			0, // isvisible
			false, // businessfilled
			b.plusCode || null,
			b.phoneNumber,
			b.whatsappNumber || null,
			b.email || null,
			b.login_email || null,
			b.website || null,
			b.ein || null,
			b.state,
			b.county,
			b.city,
			'blank', // tag
			null, // slug
			null, // notes
			b.businessName,
			b.address
		]
	);

	const businessId = result.rows[0].id;

	// Idempotent with the us_businesses sync triggers (043/046); keeps the
	// unified tables fresh once those triggers drop (phase 2.4). 'us' is tied to
	// the table written above, exactly as 'in' is on the IN path below.
	await syncBusinessToUnified(pool, 'us', businessId);
	await syncAccountToUnified(pool, 'us', businessId);

	return businessId;
}

async function sendConfirmation(
	fetch: typeof globalThis.fetch,
	country: string,
	id: number,
	body: Record<string, unknown>
): Promise<void> {
	await fetch(`/${country}/api/sendBusinessSubmissionConfirmation`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id, ...body })
	});
}

export const POST: RequestHandler = async ({ request, fetch, params }) => {
	// No layout runs for a +server.ts, so the country is validated here.
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}

	// ✅ Added fetch from event
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	const country = params.country;

	try {
		const parsed = await parseBody(request, submitBusinessSchema(country));
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
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
			city
		} = parsed.data;

		// The form keys level2 by the country's own noun; the schema guarantees
		// the matching one is present. Reading the wrong key drops the value
		// silently, which is the trap stage 15c of the /in plan documented.
		const level2 = (country === 'in' ? parsed.data.district : parsed.data.county) as string;

		if (country === 'us') {
			const businessId = await insertUsBusiness(pool, {
				businessName,
				address,
				plusCode,
				phoneNumber,
				whatsappNumber,
				email,
				login_email,
				website,
				ein: gstn,
				state,
				county: level2,
				city
			});
			await sendConfirmation(fetch, country, businessId, {
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
				county: level2,
				city
			});
			return json({ success: true, id: businessId });
		}

		const district = level2;

		// Check for duplicate GSTN. IN-only: US does not collect a tax id on
		// signup, so every US row would collide on an empty value.
		const duplicateCheck = await pool.query<{ business_id: number }>(
			'SELECT business_id FROM in_business_profiles WHERE gstn = $1',
			[gstn]
		);

		if (duplicateCheck.rows.length > 0) {
			return json(
				{
					success: false,
					error:
						'A business with this GSTN already exists. Please check your GSTN or contact support if you believe this is an error.'
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
		//
		// 'in' is tied to the tables written above and must NOT become
		// params.country: every INSERT on this path targets the IN-only legacy
		// tables (businesses_1, in_business_profiles, in_business_accounts), so
		// the synced row is an IN row whatever prefix the request arrived on. A
		// US request never reaches here — it returned from the us_businesses
		// branch above.
		await syncBusinessToUnified(pool, 'in', businessId);
		await syncAccountToUnified(pool, 'in', businessId);

		await sendConfirmation(fetch, country, businessId, {
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
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
};
