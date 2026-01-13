import { createPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

// Initialize the Postgres connection pool
const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Extract the email from the request body
		const { email } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Query the database for the latest original non-exclusive lead matching the email 
		// (exclude duplicates created when claimed and exclude exclusive leads)
		const leadQuery = `
			SELECT * FROM leaddata 
			WHERE email = $1 
			AND original_id IS NULL 
			AND (urlparams IS NULL OR urlparams NOT LIKE '%/solar-panel-installer/%')
			ORDER BY created_at DESC 
			LIMIT 1
		`;
		const leadResult = await pool.query(leadQuery, [email]);

		if (leadResult.rows.length === 0) {
			return json({ error: 'No lead found for the provided email' }, { status: 404 });
		}

		const lead = leadResult.rows[0];

		// Query for claim requests related to this lead with business details
		const claimQuery = `
			SELECT 
				lcr.*,
				b.businessname as business_name,
				b.phonenumber as business_phone,
				b.email as business_email,
				b.website as business_website,
				b.slug as business_slug,
				b.district as business_district
			FROM leaddata_claimrequests lcr
			LEFT JOIN businesses_1 b ON lcr.business_id = b.id
			WHERE lcr.lead_id = $1
			ORDER BY lcr.created_at DESC
		`;
		const claimResult = await pool.query(claimQuery, [lead.id]);
		
		// Add claim information to lead data
		lead.claim_requests_count = claimResult.rows.length;
		lead.claimed_businesses = claimResult.rows;

		// Return the lead details with claim information
		return json({ lead });
	} catch (error) {
		console.error('Error fetching lead data:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
