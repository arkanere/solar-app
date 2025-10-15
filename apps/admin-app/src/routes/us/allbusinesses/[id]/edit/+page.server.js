export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export const load = async ({ params }) => {
	const { id } = params;

	try {
		const result = await pool.query('SELECT * FROM us_businesses WHERE id = $1', [id]);

		if (result.rows.length > 0) {
			return { business: result.rows[0] };
		} else {
			return { errorMessage: 'Business not found' };
		}
	} catch (error) {
		console.error('Error loading business:', error);
		return { errorMessage: 'Failed to load business data' };
	}
};

export const actions = {
	default: async ({ request, params }) => {
		const { id } = params;
		const data = await request.formData(); // Get form-encoded data

		// Handle services as a comma-separated string and convert to integer array
		const servicesStr = data.get('services');
		let services = [];
		if (servicesStr) {
			// Split by comma, convert to numbers, and filter out any NaN values
			services = servicesStr
				.split(',')
				.map((s) => s.trim())
				.map(Number)
				.filter((n) => !isNaN(n));
		}

		// Convert form data to the appropriate types
		const updatedBusiness = {
			businessname: data.get('businessname'),
			description: data.get('description'),
			services: services, // Use our processed array here
			address: data.get('address'),
			pluscode: data.get('pluscode'),
			phonenumber: data.get('phonenumber'),
			email: data.get('email'),
			login_email: data.get('login_email'),
			website: data.get('website'),
			state: data.get('state'),
			county: data.get('county'),
			tag: data.get('tag'),
			slug: data.get('slug'),
			notes: data.get('notes'),
			city: data.get('city'),
			rscore: parseInt(data.get('rscore'), 10), // Convert rscore to integer
			isvisible: data.get('isvisible') === 'true', // Convert isvisible to boolean
			businessfilled: data.get('businessfilled') === 'true', // Convert businessfilled to boolean
			tier3: data.get('tier3') === 'true' // Convert tier3 to boolean
		};

		try {
			const updateQuery = `
        UPDATE us_businesses
        SET businessname = $1, description = $2, services = $3::integer[], address = $4, pluscode = $5, phonenumber = $6,
            email = $7, login_email = $8, website = $9, state = $10, county = $11,
            tag = $12, slug = $13, notes = $14, city = $15, rscore = $16, isvisible = $17, businessfilled = $18, tier3 = $19
        WHERE id = $20
      `;

			const values = [
				updatedBusiness.businessname,
				updatedBusiness.description,
				updatedBusiness.services,
				updatedBusiness.address,
				updatedBusiness.pluscode,
				updatedBusiness.phonenumber,
				updatedBusiness.email,
				updatedBusiness.login_email,
				updatedBusiness.website,
				updatedBusiness.state,
				updatedBusiness.county,
				updatedBusiness.tag,
				updatedBusiness.slug,
				updatedBusiness.notes,
				updatedBusiness.city,
				updatedBusiness.rscore,
				updatedBusiness.isvisible,
				updatedBusiness.businessfilled,
				updatedBusiness.tier3,
				id
			];

			await pool.query(updateQuery, values);
			return { success: true };
		} catch (error) {
			console.error('Error updating business:', error);
			return { errorMessage: 'Failed to update business', details: error.message };
		}
	}
};
