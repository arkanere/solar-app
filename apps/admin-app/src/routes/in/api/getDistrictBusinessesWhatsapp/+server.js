import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	try {
		const { district, lead_id } = await request.json();

		if (!district || district.trim() === '') {
			return json({ success: false, error: 'District is required.' }, { status: 400 });
		}

		const result = await pool.query(
			`SELECT b.id, b.businessname, b.whatsapp, b.login_email,
			        CASE WHEN cr.id IS NOT NULL THEN true ELSE false END AS has_claimed
			 FROM businesses_1 b
			 LEFT JOIN leaddata_claimrequests cr
			   ON cr.business_id = b.id AND cr.lead_id = $2
			 WHERE b.district = $1
			   AND b.isvisible = true
			   AND b.whatsapp IS NOT NULL
			   AND b.whatsapp <> ''
			 ORDER BY b.businessname`,
			[district, lead_id]
		);

		return json({ success: true, businesses: result.rows });
	} catch (error) {
		console.error('Error fetching businesses:', error);
		return json({ success: false, error: 'Failed to fetch businesses.' }, { status: 500 });
	}
}
