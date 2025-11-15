import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function GET({ url }) {
	try {
		const slug = url.searchParams.get('slug');
		const excludeId = url.searchParams.get('excludeId'); // For edit mode

		if (!slug) {
			return json({ error: 'Slug is required' }, { status: 400 });
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		let query;
		let params;

		if (excludeId) {
			// Check if slug exists, excluding the current blog being edited
			query = 'SELECT id FROM in_blogs WHERE slug = $1 AND id != $2';
			params = [slug, parseInt(excludeId)];
		} else {
			// Check if slug exists
			query = 'SELECT id FROM in_blogs WHERE slug = $1';
			params = [slug];
		}

		const result = await pool.query(query, params);

		return json({
			available: result.rows.length === 0,
			slug: slug
		});
	} catch (error) {
		console.error('Error validating slug:', error);
		return json({ error: 'Failed to validate slug' }, { status: 500 });
	}
}
