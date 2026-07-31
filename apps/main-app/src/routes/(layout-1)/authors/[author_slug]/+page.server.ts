import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.author_slug.toLowerCase();

	const authorResult = await pool.query(
		`SELECT * FROM authors WHERE slug = $1`,
		[slug]
	);

	const author = authorResult.rows[0];
	if (!author) {
		error(404, 'Author not found');
	}

	const [blogPostsResult, seoPagesResult] = await Promise.all([
		pool.query(
			`SELECT title, slug, excerpt, published_at, featured_image
			 FROM in_blog_posts
			 WHERE author_slug = $1 AND status = 'published'
			 ORDER BY published_at DESC`,
			[slug]
		),
		pool.query(
			`SELECT h1 as title, slug, pillar_slug, page_type, updated_at
			 FROM seo_pages
			 WHERE author_slug = $1 AND status = 'published'
			 ORDER BY updated_at DESC`,
			[slug]
		)
	]);

	return {
		author,
		blogPosts: blogPostsResult.rows,
		seoPages: seoPagesResult.rows
	};
};
