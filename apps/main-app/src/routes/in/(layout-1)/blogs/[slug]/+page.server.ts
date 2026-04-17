import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

interface Blog {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	featured_image: string;
	seo_metadata: string;
	tags: string[];
	categories: string[];
	author_name: string;
	status: string;
	published_at: string;
	created_at: string;
	updated_at: string;
	view_count: number;
}

export const config = {
	isr: { expiration: 5184000 }
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		const result = await pool.query<Blog>(
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
			FROM in_blogs
			WHERE slug = $1 AND status = 'published'
		`,
			[params.slug]
		);

		if (result.rows.length === 0) {
			throw error(404, 'Blog post not found');
		}

		const blog = result.rows[0];

		pool
			.query('UPDATE in_blogs SET view_count = view_count + 1 WHERE slug = $1', [params.slug])
			.catch((err) => console.error('Error updating view count:', err));

		return { blog };
	} catch (err) {
		console.error('Error loading blog:', err);
		if (err instanceof Error && 'status' in err && err.status === 404) {
			throw err;
		}
		throw error(500, 'Failed to load blog post');
	}
};
