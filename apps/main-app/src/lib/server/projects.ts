// Project selections and lookups shared by the geo directory pages.
//
// The keys are snake_case: these pages ship the rows straight to the client,
// so the table's column names are the wire shape.

import { db } from './db';
import { projects } from '@solar/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export const PROJECT_CARD_SELECTION = {
	id: projects.id,
	// business_slug and project_slug are nullable in the schema, but the Project
	// type ProjectGallery declares requires both and the raw driver's `any` hid
	// the difference — restated here rather than widening the component.
	business_slug: sql<string>`${projects.businessSlug}`,
	project_slug: sql<string>`${projects.projectSlug}`,
	title: projects.title,
	pincode: projects.pincode,
	project_date: projects.projectDate,
	created_at: projects.createdAt,
	image_url: projects.imageUrl,
	cloudinary_public_id: projects.cloudinaryPublicId,
	image_width: projects.imageWidth,
	image_height: projects.imageHeight,
	image_format: projects.imageFormat
};

export type BusinessProject = {
	business_slug: string;
	project_slug: string;
	title: string;
	cloudinary_public_id: string | null;
};

// Top 3 visible projects per business, keyed by business slug. ROW_NUMBER()
// over a derived table is a window function, so it stays on the sql escape
// hatch.
export async function getTopProjectsPerBusiness(
	businessSlugs: string[]
): Promise<Map<string, BusinessProject[]>> {
	const byBusiness = new Map<string, BusinessProject[]>();
	if (businessSlugs.length === 0) return byBusiness;

	const ranked = db
		.select({
			business_slug: sql<string>`${projects.businessSlug}`.as('business_slug'),
			project_slug: sql<string>`${projects.projectSlug}`.as('project_slug'),
			title: projects.title,
			cloudinary_public_id: projects.cloudinaryPublicId,
			rn: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${projects.businessSlug} ORDER BY ${projects.projectDate} DESC, ${projects.createdAt} DESC)`.as(
				'rn'
			)
		})
		.from(projects)
		.where(and(inArray(projects.businessSlug, businessSlugs), eq(projects.isvisible, true)))
		.as('ranked');

	const rows = await db
		.select({
			business_slug: ranked.business_slug,
			project_slug: ranked.project_slug,
			title: ranked.title,
			cloudinary_public_id: ranked.cloudinary_public_id
		})
		.from(ranked)
		.where(sql`${ranked.rn} <= 3`);

	for (const row of rows) {
		const list = byBusiness.get(row.business_slug) ?? [];
		list.push(row);
		byBusiness.set(row.business_slug, list);
	}
	return byBusiness;
}
