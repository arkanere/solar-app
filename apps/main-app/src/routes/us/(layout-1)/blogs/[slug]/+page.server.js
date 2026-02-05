import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const pool = createPool({ connectionString: POSTGRES_URL });

		// Fetch the blog post by slug
		const result = await pool.query(
			`
			SELECT
				id,
				title,
				slug,
				content,
				excerpt,
				featured_image,
				seo_metadata,
				tags,
				categories,
				author_name,
				status,
				published_at,
				created_at,
				updated_at,
				view_count
			FROM us_blogs
			WHERE slug = $1 AND status = 'published'
		`,
			[params.slug]
		);

		if (result.rows.length === 0) {
			throw error(404, 'Blog post not found');
		}

		const blog = result.rows[0];

		// Increment view count asynchronously (don't await to avoid blocking)
		pool
			.query('UPDATE us_blogs SET view_count = view_count + 1 WHERE slug = $1', [params.slug])
			.catch((err) => console.error('Error updating view count:', err));

		return {
			blog
		};
	} catch (err) {
		console.error('Error loading blog:', err);
		if (err.status === 404) {
			throw err;
		}
		throw error(500, 'Failed to load blog post');
	}
}
