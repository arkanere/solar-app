import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.title || !data.slug || !data.content) {
			return json(
				{ error: 'Title, slug, and content are required' },
				{ status: 400 }
			);
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		// Check if slug already exists
		const slugCheck = await pool.query(
			'SELECT id FROM in_blogs WHERE slug = $1',
			[data.slug]
		);

		if (slugCheck.rows.length > 0) {
			return json(
				{ error: 'Slug already exists. Please choose a different slug.' },
				{ status: 400 }
			);
		}

		// Prepare data
		const {
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

		// Set published_at to NOW if status is 'published' and not provided
		const finalPublishedAt =
			status === 'published' && !published_at ? new Date().toISOString() : published_at;

		// Insert blog into database
		const result = await pool.query(
			`INSERT INTO in_blogs (
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
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
				finalPublishedAt
			]
		);

		const newBlog = result.rows[0];

		return json(
			{
				success: true,
				message: 'Blog created successfully',
				blog: newBlog
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating blog:', error);

		// Handle unique constraint violation
		if (error.code === '23505') {
			return json(
				{ error: 'Slug already exists. Please choose a different slug.' },
				{ status: 400 }
			);
		}

		return json(
			{ error: 'Failed to create blog. Please try again.' },
			{ status: 500 }
		);
	}
}
