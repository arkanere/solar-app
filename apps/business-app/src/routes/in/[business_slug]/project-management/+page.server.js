import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessResult = await pool.query('SELECT id, businessname FROM businesses_1 WHERE slug = $1', [businessSlug]);

		if (businessResult.rows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessResult.rows[0];
		const businessId = business.id;

		// Get all projects for this business with lead information
		const projectsResult = await pool.query(`
			SELECT
				pm.id,
				pm.lead_id,
				pm.stage,
				pm.created_at,
				pm.last_updated,
				l.name as customer_name,
				l.email,
				l.phone,
				l.district,
				l.pin_code
			FROM project_management pm
			INNER JOIN leaddata l ON pm.lead_id = l.id
			WHERE l.business_id = $1
			ORDER BY pm.last_updated DESC
		`, [businessId]);

		const projects = projectsResult.rows;

		return {
			business: business,
			business_id: businessId,
			projects: projects
		};

	} catch (err) {
		console.error('Error loading projects:', err);
		throw error(500, 'Failed to load projects');
	}
}
