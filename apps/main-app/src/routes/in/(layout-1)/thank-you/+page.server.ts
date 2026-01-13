// src/routes/(layout-1)/thank-you/+page.server.js
import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	
	// Get the reference UUID from URL parameters
	const referenceUuid = url.searchParams.get('ref');
	
	// If no reference UUID provided, return null (show generic thank you)
	if (!referenceUuid) {
		return {
			customerDetails: null
		};
	}

	try {
		// Query the database for lead details using the UUID
		const query = `
			SELECT id, name, phone, pin_code, type, comment, email, district, created_at, isvisible
			FROM LeadData 
			WHERE reference_uuid = $1
			LIMIT 1
		`;
		
		const result = await pool.query(query, [referenceUuid]);
		
		if (result.rows.length === 0) {
			// Lead not found, return error
			return {
				customerDetails: null,
				error: 'Details not found'
			};
		}

		const lead = result.rows[0];
		
		// Check if lead is visible
		if (!lead.isvisible) {
			// Lead exists but is not visible, return error
			return {
				customerDetails: null,
				error: 'Details not found'
			};
		}
		
		// Check if there are verified businesses in the customer's district
		let hasVerifiedBusinessInDistrict = false;
		if (lead.district) {
			try {
				const businessCheckQuery = `
					SELECT COUNT(*) as business_count
					FROM businesses_1 
					WHERE district = $1 AND isvisible = true
					LIMIT 1
				`;
				const businessResult = await pool.query(businessCheckQuery, [lead.district]);
				hasVerifiedBusinessInDistrict = businessResult.rows[0].business_count > 0;
			} catch (businessError) {
				console.error('Error checking businesses in district:', businessError);
				// Default to true if we can't check (assume businesses exist)
				hasVerifiedBusinessInDistrict = true;
			}
		} else {
			// If no district info, assume businesses exist
			hasVerifiedBusinessInDistrict = true;
		}
		
		// Return sanitized customer details with business availability info
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
		// On database error, return null to show generic thank you
		return {
			customerDetails: null
		};
	}
}