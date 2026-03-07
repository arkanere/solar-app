import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 86400 }
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	const [postResult, relatedResult] = await Promise.all([
		pool.query(
			`SELECT bp.*, a.name as author_name, a.slug as author_slug, a.photo as author_photo,
			        a.credentials as author_credentials, a.bio as author_bio
			 FROM in_blog_posts bp
			 LEFT JOIN authors a ON bp.author_slug = a.slug
			 WHERE bp.slug = $1 AND bp.status = 'published'`,
			[slug]
		),
		pool.query(
			`SELECT title, slug, published_at
			 FROM in_blog_posts
			 WHERE status = 'published' AND slug != $1
			 ORDER BY published_at DESC LIMIT 2`,
			[slug]
		)
	]);

	const post = postResult.rows[0];
	if (!post) {
		error(404, 'Blog post not found');
	}

	let parentCluster = null;
	if (post.parent_cluster_slug) {
		const clusterResult = await pool.query(
			`SELECT slug, h1, pillar_slug FROM seo_pages WHERE slug = $1 AND status = 'published'`,
			[post.parent_cluster_slug]
		);
		parentCluster = clusterResult.rows[0] || null;
	}

	return {
		post,
		parentCluster,
		relatedPosts: relatedResult.rows
	};
};
