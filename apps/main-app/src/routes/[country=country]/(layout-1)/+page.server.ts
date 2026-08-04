import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '@solar/db/schema';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { getCountry } from '$lib/countries';

export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// `projects` is an IN-only legacy table with no country_code column at all,
	// so there is nothing to scope the query by. Countries without the feature
	// skip it entirely rather than rendering Indian projects on their home
	// (stage 9 of docs/migration-plan-delete-us.md, §4.1).
	const dateModified = new Date().toISOString().split('T')[0];
	if (!getCountry(params.country).features.projects) {
		return { recentProjects: [], dateModified };
	}

	try {
		const recentProjects = await db
			.select({
				id: projects.id,
				business_slug: projects.businessSlug,
				title: projects.title,
				pincode: projects.pincode,
				project_date: projects.projectDate,
				created_at: projects.createdAt,
				image_url: projects.imageUrl,
				cloudinary_public_id: projects.cloudinaryPublicId,
				image_width: projects.imageWidth,
				image_height: projects.imageHeight,
				image_format: projects.imageFormat,
				project_slug: projects.projectSlug
			})
			.from(projects)
			.where(and(eq(projects.isvisible, true), isNotNull(projects.businessSlug)))
			.orderBy(desc(projects.projectDate))
			.limit(6);

		return {
			recentProjects,
			dateModified: new Date().toISOString().split('T')[0]
		};
	} catch (error) {
		console.error('Database query error:', error);
		return {
			recentProjects: [],
			dateModified: new Date().toISOString().split('T')[0]
		};
	}
};
