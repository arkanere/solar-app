import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const pool = createPool({ connectionString: POSTGRES_URL });

		// Fetch blog by ID
		const result = await pool.query(
			`SELECT
				id,
				title,
				slug,
				content,
				excerpt,
				featured_image,
				seo_metadata,
				custom_fields,
				tags,
				categories,
				author_name,
				status,
				published_at,
				created_at,
				updated_at,
				view_count
			FROM in_blogs
			WHERE id = $1`,
			[params.id]
		);

		if (result.rows.length === 0) {
			throw error(404, 'Blog not found');
		}

		const blog = result.rows[0];

		// Parse JSONB fields
		if (blog.featured_image && typeof blog.featured_image === 'string') {
			blog.featured_image = JSON.parse(blog.featured_image);
		}
		if (blog.seo_metadata && typeof blog.seo_metadata === 'string') {
			blog.seo_metadata = JSON.parse(blog.seo_metadata);
		}
		if (blog.custom_fields && typeof blog.custom_fields === 'string') {
			blog.custom_fields = JSON.parse(blog.custom_fields);
		}

		return {
			blog
		};
	} catch (err) {
		console.error('Error loading blog:', err);
		if (err.status === 404) {
			throw err;
		}
		throw error(500, 'Failed to load blog');
	}
}
