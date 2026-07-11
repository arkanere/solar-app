export const prerender = false;
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { getSignedBillUrl } from '$lib/server/billStorage.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const pincode = url.searchParams.get('pincode');
	const referenceUuid = url.searchParams.get('ref');

	const pool = createPool({ connectionString: POSTGRES_URL });

	let customerDetails = null;
	let installers = [];

	// Look up lead details if ref is provided
	if (referenceUuid) {
		try {
			const result = await pool.query(
				`SELECT id, name, phone, pin_code, type, comment, email, district, state, urlparams, created_at, isvisible, bill_cloudinary_public_id, bill_format
				FROM LeadData
				WHERE reference_uuid = $1
				LIMIT 1`,
				[referenceUuid]
			);

			if (result.rows.length > 0 && result.rows[0].isvisible) {
				const lead = result.rows[0];
				customerDetails = {
					id: lead.id,
					name: lead.name,
					phone: lead.phone,
					pinCode: lead.pin_code,
					type: lead.type,
					comment: lead.comment,
					email: lead.email,
					district: lead.district,
					submittedAt: lead.created_at,
					billUrl: getSignedBillUrl(lead.bill_cloudinary_public_id, lead.bill_format),
					billFormat: lead.bill_format
				};
			}
		} catch (err) {
			console.error('Error fetching lead details:', err);
		}
	}

	// Look up businesses by pincode (or fall back to lead's district)
	const lookupPincode = pincode || customerDetails?.pinCode;

	if (lookupPincode) {
		try {
			const districtResult = await pool.query(
				'SELECT district FROM pincode_mapping WHERE pincode = $1 LIMIT 1',
				[lookupPincode]
			);

			if (districtResult.rows.length > 0) {
				const district = districtResult.rows[0].district;
				const bizResult = await pool.query(
					`SELECT businessname, address, phonenumber
					 FROM in_business_profiles
					 WHERE LOWER(district) = LOWER($1) AND isvisible = true
					 ORDER BY rscore DESC NULLS LAST
					 LIMIT 5`,
					[district]
				);
				installers = bizResult.rows;
			}
		} catch {
			// ignore
		}
	}

	return { customerDetails, installers, referenceUuid };
}
