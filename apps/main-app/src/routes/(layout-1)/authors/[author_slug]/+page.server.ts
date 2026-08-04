import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { authors, inBlogPosts, seoPages } from '@solar/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.author_slug.toLowerCase();

	// Was `SELECT *`; spelled out so the wire shape is explicit. Kept snake_case
	// because the page reads `data.author.social_links` directly.
	//
	// NOTE: the page also reads `data.author.photo`, which no query has ever
	// returned — the column is `photo_url`, so the avatar has always been
	// skipped by its `{#if}` guard. Behaviour preserved here; see next-steps.md.
	const authorRows = await db
		.select({
			id: authors.id,
			slug: authors.slug,
			name: authors.name,
			photo_url: sql<string | undefined>`${authors.photoUrl}`,
			credentials: sql<string | undefined>`${authors.credentials}`,
			expertise: authors.expertise,
			bio: authors.bio,
			social_links: authors.socialLinks,
			status: authors.status
		})
		.from(authors)
		.where(eq(authors.slug, slug));

	const author = authorRows[0];
	if (!author) {
		error(404, 'Author not found');
	}

	const [blogPostRows, seoPageRows] = await Promise.all([
		// BUG FIX: this selected `excerpt` and `featured_image`, neither of which
		// exists on in_blog_posts in any schema or migration — the SELECT failed,
		// so the whole author page 500'd. Both columns are dropped: nothing in the
		// app reads `blogPosts` at all, so no rendered output changes.
		db
			.select({
				title: inBlogPosts.title,
				slug: inBlogPosts.slug,
				published_at: inBlogPosts.publishedAt
			})
			.from(inBlogPosts)
			.where(and(eq(inBlogPosts.authorSlug, slug), eq(inBlogPosts.status, 'published')))
			.orderBy(desc(inBlogPosts.publishedAt)),
		db
			.select({
				title: seoPages.h1,
				slug: seoPages.slug,
				pillar_slug: sql<string>`${seoPages.pillarSlug}`,
				page_type: seoPages.pageType,
				updated_at: sql<string>`${seoPages.updatedAt}`
			})
			.from(seoPages)
			.where(and(eq(seoPages.authorSlug, slug), eq(seoPages.status, 'published')))
			.orderBy(desc(seoPages.updatedAt))
	]);

	return {
		author,
		blogPosts: blogPostRows,
		seoPages: seoPageRows
	};
};
