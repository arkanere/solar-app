import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, projects } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { getCountry } from '$lib/countries';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	// Projects are IN-only today (features.projects). No layout does this gate, so
	// each loader carries it — a moved route that is not gated silently serves
	// India's project data under every country prefix.
	const country = getCountry(params.country);
	if (!country.features.projects) {
		error(404, 'Not found');
	}

	const projectSlug = params.project_id.toLowerCase();

	// Several of these columns are nullable in the schema but the page
	// dereferences them as required strings; the raw driver's `any` hid that, so
	// they are restated rather than the page rewritten.
	const rows = await db
		.select({
			project_id: projects.id,
			project_title: projects.title,
			pincode: projects.pincode,
			project_district: sql<string>`${projects.district}`,
			project_city: sql<string>`${projects.city}`,
			project_date: projects.projectDate,
			cloudinary_public_id: sql<string>`${projects.cloudinaryPublicId}`,
			image_url: sql<string>`${projects.imageUrl}`,
			project_slug: sql<string>`${projects.projectSlug}`,
			businessname: sql<string>`${businessProfiles.businessname}`,
			business_slug: sql<string>`${businessProfiles.slug}`,
			business_city: sql<string>`${businessProfiles.city}`,
			business_district: sql<string>`${businessProfiles.level2}`,
			business_state: sql<string>`${businessProfiles.level1}`,
			phonenumber: sql<string>`${businessProfiles.phonenumber}`
		})
		.from(projects)
		.innerJoin(businessProfiles, eq(projects.businessSlug, businessProfiles.slug))
		.where(
			and(
				eq(projects.projectSlug, projectSlug),
				eq(projects.isvisible, true),
				eq(businessProfiles.isvisible, true)
			)
		);

	if (rows.length === 0) {
		error(404, 'Project not found');
	}

	const row = rows[0];

	const district = row.project_district || row.business_district;
	const stateSlug = row.business_state?.toLowerCase().replace(/ /g, '-') || '';
	const districtSlug = district?.toLowerCase().replace(/ /g, '-') || '';

	return {
		project: {
			id: row.project_id,
			title: row.project_title,
			pincode: row.pincode,
			district,
			city: row.project_city,
			project_date: row.project_date,
			cloudinary_public_id: row.cloudinary_public_id,
			image_url: row.image_url,
			slug: row.project_slug
		},
		business: {
			businessname: row.businessname,
			slug: row.business_slug,
			city: row.business_city,
			district: row.business_district,
			state: row.business_state,
			phonenumber: row.phonenumber
		},
		stateSlug,
		districtSlug
	};
};
