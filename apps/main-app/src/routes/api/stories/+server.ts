export const config = {
	isr: {
		expiration: 86400 // 24 hours cache (86400 seconds)
	}
};

import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '@solar/db/schema';
import { and, desc, eq, isNotNull, or } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const limit = 5; // Only 5 projects for stories

	try {
		// Query to get 5 most recent visible projects for stories
		const projectRows = await db
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
			.where(
				and(
					eq(projects.isvisible, true),
					isNotNull(projects.businessSlug),
					or(isNotNull(projects.cloudinaryPublicId), isNotNull(projects.imageUrl))
				)
			)
			.orderBy(desc(projects.projectDate))
			.limit(limit);

		return json({
			success: true,
			projects: projectRows,
			debug: {
				timestamp: new Date().toISOString(),
				projectCount: projectRows.length
			}
		});
	} catch (queryError) {
		console.error('Database query error:', queryError);
		return json(
			{
				success: false,
				error: 'Failed to fetch projects: ' + (queryError as Error).message
			},
			{ status: 500 }
		);
	}
};
