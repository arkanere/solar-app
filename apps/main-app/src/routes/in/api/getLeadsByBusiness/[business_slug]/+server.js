import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function GET({ params }) {
	try {
		const { business_slug } = params;

		if (!business_slug) {
			return json({ 
				success: false, 
				message: 'Business slug is required' 
			}, { status: 400 });
		}

		// Query business details to get ID and district
		const businessResult = await pool.query(
			'SELECT id, district FROM businesses_1 WHERE slug = $1 LIMIT 1',
			[business_slug]
		);

		if (businessResult.rows.length === 0) {
			return json({ 
				success: false, 
				message: 'Business not found' 
			}, { status: 404 });
		}

		const business = businessResult.rows[0];
		const { district, id: businessId } = business;

		const client = await pool.connect();
		
		try {
			// ✅ Fetch exclusive leads for main business and all its branches
			const exclusiveLeadResult = await client.query(
				'SELECT * FROM leaddata WHERE isvisible = true AND urlparams LIKE $1 ORDER BY id DESC',
				[`/solar-panel-installer/${business_slug}%`]
			);

			// ✅ Fetch claimed leads from `leaddata_claimrequests`
			const claimedLeadResult = await client.query(
				'SELECT lead_id FROM leaddata_claimrequests WHERE business_id = $1',
				[businessId]
			);

			const claimedLeadIds = new Set(claimedLeadResult.rows.map((row) => row.lead_id));

			// ✅ Fetch non-exclusive claimed leads (category = 2 & business_id matches)
			const nonExclusiveClaimedResult = await client.query(
				'SELECT * FROM leaddata WHERE category = 2 AND business_id = $1 ORDER BY id DESC',
				[businessId]
			);

			// ✅ Extract original_id of claimed leads (i.e., leads that were originally non-exclusive)
			const claimedOriginalIds = new Set(
				nonExclusiveClaimedResult.rows.map((lead) => lead.original_id)
			);

			// ✅ Fetch non-exclusive leads (category = 1 & same district)
			const nonExclusiveLeadResult = await client.query(
				'SELECT * FROM leaddata WHERE category = 1 AND district = $1 ORDER BY id DESC',
				[district]
			);

			// ✅ Remove non-exclusive leads that have been claimed
			const filteredNonExclusiveLeads = nonExclusiveLeadResult.rows.filter(
				(lead) => !claimedOriginalIds.has(lead.id)
			);

			// ✅ Mask email and phone for non-exclusive leads
			const maskedNonExclusiveLeads = filteredNonExclusiveLeads.map((lead) => ({
				...lead,
				email: maskEmail(lead.email),
				phone: maskPhone(lead.phone)
			}));

			// ✅ Merge all lead lists
			const allLeads = [
				...exclusiveLeadResult.rows,
				...maskedNonExclusiveLeads,
				...nonExclusiveClaimedResult.rows
			];

			return json({
				success: true,
				leads: allLeads
			});

		} catch (error) {
			console.error('Database query error:', error);
			return json({ 
				success: false, 
				message: 'Internal server error' 
			}, { status: 500 });
		} finally {
			client.release();
		}

	} catch (error) {
		console.error('Get leads API error:', error);
		return json({ 
			success: false, 
			message: 'Invalid request' 
		}, { status: 400 });
	}
}

/**
 * Mask email for UI-friendly display (e.g., "br*****@gmail.com")
 */
function maskEmail(email) {
	if (!email || !email.includes('@')) return email;
	const [name, domain] = email.split('@');
	return name.slice(0, 2) + '*****' + '@' + domain;
}

/**
 * Mask phone number for UI-friendly display (e.g., "+91 *****6789")
 */
function maskPhone(phone) {
	if (!phone || phone.length < 4) return phone;
	return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}