import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, geoLocations, projects } from '@solar/db/schema';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);
	const slug = params.installer_slug.toLowerCase();

	// Shipped straight to the client, so the wire shape stays snake_case.
	// slug/phonenumber/city/services/brands are nullable in the schema but the
	// page dereferences them as required (businessname too) (`b.slug`, `b.services?.length > 0`) —
	// restated non-null to keep the raw driver's `any` contract rather than
	// rewriting the page.
	const businessRows = await db
		.select({
			businessname: sql<string>`${businessProfiles.businessname}`,
			description: businessProfiles.description,
			phonenumber: sql<string>`${businessProfiles.phonenumber}`,
			email: businessProfiles.email,
			website: businessProfiles.website,
			slug: sql<string>`${businessProfiles.slug}`,
			address: businessProfiles.address,
			district: businessProfiles.level2,
			state: businessProfiles.level1,
			city: sql<string>`${businessProfiles.city}`,
			tag: businessProfiles.tag,
			rscore: businessProfiles.rscore,
			businessfilled: businessProfiles.businessfilled,
			services: sql<number[]>`${businessProfiles.services}`,
			brands: sql<number[]>`${businessProfiles.brands}`,
			instagram_id: businessProfiles.instagramId,
			google_maps_link: businessProfiles.googleMapsLink
		})
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country.code),
				eq(businessProfiles.slug, slug),
				eq(businessProfiles.isvisible, true)
			)
		)
		.orderBy(sql`${businessProfiles.rscore} DESC NULLS LAST`)
		.limit(1);

	if (businessRows.length === 0) {
		error(404, 'Installer not found');
	}

	const business = businessRows[0];

	// Projects, service area cities in parallel (projects are IN-only today)
	let mainSlug = slug;
	const branchPattern = /-branch-[a-zA-Z0-9]+$/;
	if (branchPattern.test(slug)) {
		mainSlug = slug.replace(branchPattern, '');
	}

	const [projectRows, locationRows] = await Promise.all([
		country.features.projects
			? db
					.select({
						id: projects.id,
						business_slug: projects.businessSlug,
						project_slug: projects.projectSlug,
						title: projects.title,
						pincode: projects.pincode,
						district: projects.district,
						project_date: projects.projectDate,
						created_at: projects.createdAt,
						image_url: projects.imageUrl,
						cloudinary_public_id: projects.cloudinaryPublicId
					})
					.from(projects)
					.where(and(eq(projects.businessSlug, mainSlug), eq(projects.isvisible, true)))
					.orderBy(desc(projects.projectDate), desc(projects.createdAt))
					.limit(12)
			: Promise.resolve([]),
		db
			.selectDistinct({
				city: geoLocations.city,
				state_slug: geoLocations.level1Slug,
				district_slug: geoLocations.level2Slug,
				city_slug: geoLocations.citySlug
			})
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, country.code),
					sql`LOWER(${geoLocations.level2}) = LOWER(${business.district})`,
					sql`LOWER(${geoLocations.level1}) = LOWER(${business.state})`
				)
			)
			.orderBy(asc(geoLocations.city))
			.limit(20)
	]);

	return {
		business,
		projects: projectRows,
		serviceAreas: locationRows
	};
};
