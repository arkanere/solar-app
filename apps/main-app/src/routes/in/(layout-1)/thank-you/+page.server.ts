import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const referenceUuid = url.searchParams.get('ref');

	if (!referenceUuid) {
		return { customerDetails: null };
	}

	try {
		const result = await pool.query(
			`SELECT id, name, phone, pin_code, type, comment, email, district, created_at, isvisible
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

		let hasVerifiedBusinessInDistrict = false;
		if (lead.district) {
			try {
				const businessResult = await pool.query(
					`SELECT COUNT(*) as business_count
					FROM businesses_1
					WHERE district = $1 AND isvisible = true
					LIMIT 1`,
					[lead.district]
				);
				hasVerifiedBusinessInDistrict = businessResult.rows[0].business_count > 0;
			} catch (businessError) {
				console.error('Error checking businesses in district:', businessError);
				hasVerifiedBusinessInDistrict = true;
			}
		} else {
			hasVerifiedBusinessInDistrict = true;
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
				hasVerifiedBusinessInDistrict
			}
		};

	} catch (err) {
		console.error('Error fetching lead details:', err);
		return { customerDetails: null };
	}
}
