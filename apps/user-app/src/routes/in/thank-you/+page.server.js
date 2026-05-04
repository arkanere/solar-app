export const prerender = false;
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const referenceUuid = url.searchParams.get('ref');

	if (!referenceUuid) {
		return { customerDetails: null };
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			`SELECT id, name, phone, pin_code, type, comment, email, district, state, urlparams, created_at, isvisible
			FROM LeadData
			WHERE reference_uuid = $1
			LIMIT 1`,
			[referenceUuid]
		);

		if (result.rows.length === 0) {
			return { customerDetails: null, error: 'Details not found' };
		}

		const lead = result.rows[0];

		if (!lead.isvisible) {
			return { customerDetails: null, error: 'Details not found' };
		}

		let installers = [];
		const isExclusiveLead = lead.urlparams && (lead.urlparams.includes('/solar-panel-installer/') || lead.urlparams.includes('/installer/'));

		try {
			if (isExclusiveLead) {
				const slugMatch = lead.urlparams.match(/\/(?:solar-panel-installer|installer)\/([^/?#]+)/);
				if (slugMatch) {
					const bizResult = await pool.query(
						`SELECT businessname, address, phonenumber
						 FROM businesses_1
						 WHERE slug = $1 AND isvisible = true
						 LIMIT 1`,
						[slugMatch[1]]
					);
					installers = bizResult.rows;
				}
			} else if (lead.district) {
				const bizResult = await pool.query(
					`SELECT businessname, address, phonenumber
					 FROM businesses_1
					 WHERE LOWER(district) = LOWER($1) AND isvisible = true
					 ORDER BY rscore DESC NULLS LAST
					 LIMIT 5`,
					[lead.district]
				);
				installers = bizResult.rows;
			}
		} catch {
			// ignore
		}

		return {
			customerDetails: {
				id: lead.id,
				name: lead.name,
				phone: lead.phone,
				pinCode: lead.pin_code,
				type: lead.type,
				comment: lead.comment,
				email: lead.email,
				district: lead.district,
				submittedAt: lead.created_at,
				isExclusiveLead
			},
			installers
		};
	} catch (err) {
		console.error('Error fetching lead details:', err);
		return { customerDetails: null };
	}
}
