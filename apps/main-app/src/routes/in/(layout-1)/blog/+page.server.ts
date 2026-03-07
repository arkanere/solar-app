import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 86400 }
};

const PER_PAGE = 12;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const offset = (page - 1) * PER_PAGE;

	const [postsResult, countResult] = await Promise.all([
		pool.query(
			`SELECT bp.title, bp.slug, bp.excerpt, bp.featured_image, bp.published_at,
			        a.name as author_name, a.slug as author_slug, a.photo as author_photo
			 FROM in_blog_posts bp
			 LEFT JOIN authors a ON bp.author_slug = a.slug
			 WHERE bp.status = 'published'
			 ORDER BY bp.published_at DESC
			 LIMIT $1 OFFSET $2`,
			[PER_PAGE, offset]
		),
		pool.query(
			`SELECT COUNT(*) as total FROM in_blog_posts WHERE status = 'published'`
		)
	]);

	const totalPosts = parseInt(countResult.rows[0].total);
	const totalPages = Math.ceil(totalPosts / PER_PAGE);

	return {
		posts: postsResult.rows,
		pagination: { page, totalPages },
		totalPosts
	};
};
