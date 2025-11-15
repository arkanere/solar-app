import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.id || !data.title || !data.slug || !data.content) {
			return json(
				{ error: 'ID, title, slug, and content are required' },
				{ status: 400 }
			);
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		// Check if blog exists
		const blogCheck = await pool.query('SELECT id FROM us_blogs WHERE id = $1', [data.id]);

		if (blogCheck.rows.length === 0) {
			return json({ error: 'Blog not found' }, { status: 404 });
		}

		// Check if slug is taken by another blog
		const slugCheck = await pool.query(
			'SELECT id FROM us_blogs WHERE slug = $1 AND id != $2',
			[data.slug, data.id]
		);

		if (slugCheck.rows.length > 0) {
			return json(
				{ error: 'Slug already exists. Please choose a different slug.' },
				{ status: 400 }
			);
		}

		// Prepare data
		const {
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
			published_at
		} = data;

		// If status changed to 'published' and no published_at, set it now
		const existingBlog = await pool.query(
			'SELECT status, published_at FROM us_blogs WHERE id = $1',
			[id]
		);
		const wasPublished = existingBlog.rows[0].status === 'published';
		const isNowPublished = status === 'published';

		let finalPublishedAt = published_at;
		if (!wasPublished && isNowPublished && !published_at) {
			finalPublishedAt = new Date().toISOString();
		} else if (!isNowPublished) {
			// If unpublishing, clear published_at
			finalPublishedAt = null;
		}

		// Update blog in database
		const result = await pool.query(
			`UPDATE us_blogs SET
				title = $1,
				slug = $2,
				content = $3,
				excerpt = $4,
				featured_image = $5,
				seo_metadata = $6,
				custom_fields = $7,
				tags = $8,
				categories = $9,
				author_name = $10,
				status = $11,
				published_at = $12
			WHERE id = $13
			RETURNING id, slug`,
			[
				title,
				slug,
				content,
				excerpt || null,
				featured_image ? JSON.stringify(featured_image) : null,
				seo_metadata ? JSON.stringify(seo_metadata) : '{}',
				custom_fields ? JSON.stringify(custom_fields) : '{}',
				tags || [],
				categories || [],
				author_name || 'SolarVipani Admin',
				status || 'draft',
				finalPublishedAt,
				id
			]
		);

		const updatedBlog = result.rows[0];

		return json({
			success: true,
			message: 'Blog updated successfully',
			blog: updatedBlog
		});
	} catch (error) {
		console.error('Error updating blog:', error);

		// Handle unique constraint violation
		if (error.code === '23505') {
			return json(
				{ error: 'Slug already exists. Please choose a different slug.' },
				{ status: 400 }
			);
		}

		return json(
			{ error: 'Failed to update blog. Please try again.' },
			{ status: 500 }
		);
	}
}
