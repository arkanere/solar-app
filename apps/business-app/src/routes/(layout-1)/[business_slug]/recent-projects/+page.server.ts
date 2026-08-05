import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, projects as projectsTable } from '@solar/db/schema';
import { and, desc, eq, isNull, or } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id?: number;
	slug?: string;
	[key: string]: unknown;
}

interface Project {
	id: number;
	business_slug: string;
	project_slug: string;
	title: string;
	pincode?: string;
	district?: string;
	project_date?: string;
	created_at: string;
	image_url?: string;
	cloudinary_public_id?: string;
	image_width?: number;
	image_height?: number;
	image_format?: string;
}

interface PageData {
	mainBusiness?: Business;
	projects?: Project[];
	businessSlug?: string;
	errorMessage?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const businessSlug = params.business_slug;

	// Get the parent layout data which contains authentication info
	const parentData = await parent();

	// The parent layout already handles authentication and redirects
	// We just need to check if we have the session data
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	// The country comes from the layout, which resolved it from the slug. The
	// business lookup used to filter on a literal 'in', so a US business was told
	// its own profile did not exist. Not defaulted to 'in' when absent: the
	// layout omits it only on its DB-error fallback.
	const { country } = parentData;
	if (!country) {
		return { errorMessage: 'Business not found', projects: [] };
	}

	try {
		// First, get the main business profile using the slug
		const mainBusinessRows = await db
			.select({
				id: businesses.sourceId,
				slug: businesses.slug,
				businessname: businesses.businessname,
				email: businesses.email,
				phonenumber: businesses.phonenumber,
				whatsapp: businesses.whatsapp,
				description: businesses.description,
				website: businesses.website,
				instagram_id: businesses.instagramId,
				google_maps_link: businesses.googleMapsLink,
				address: businesses.address,
				pluscode: businesses.pluscode,
				services: businesses.services,
				brands: businesses.brands,
				gstn: businesses.taxId,
				state: businesses.level1,
				district: businesses.level2,
				city: businesses.city,
				pincode: businesses.postalCode,
				rscore: businesses.rscore,
				tag: businesses.tag,
				businessfilled: businesses.businessfilled,
				isvisible: businesses.isvisible
			})
			.from(businesses)
			.where(and(eq(businesses.countryCode, country), eq(businesses.slug, businessSlug)));

		if (mainBusinessRows.length === 0) {
			return {
				errorMessage: 'Business not found',
				projects: []
			};
		}

		const mainBusiness = mainBusinessRows[0] as unknown as Business;

		// Get all visible projects for this business
		const projectRows = await db
			.select({
				id: projectsTable.id,
				business_slug: projectsTable.businessSlug,
				project_slug: projectsTable.projectSlug,
				title: projectsTable.title,
				pincode: projectsTable.pincode,
				district: projectsTable.district,
				project_date: projectsTable.projectDate,
				created_at: projectsTable.createdAt,
				image_url: projectsTable.imageUrl,
				cloudinary_public_id: projectsTable.cloudinaryPublicId,
				image_width: projectsTable.imageWidth,
				image_height: projectsTable.imageHeight,
				image_format: projectsTable.imageFormat
			})
			.from(projectsTable)
			.where(
				and(
					eq(projectsTable.businessSlug, businessSlug),
					or(eq(projectsTable.isvisible, true), isNull(projectsTable.isvisible))
				)
			)
			.orderBy(desc(projectsTable.projectDate), desc(projectsTable.createdAt));
		const projects = projectRows as unknown as Project[];

		return {
			mainBusiness,
			projects,
			businessSlug
		};
	} catch (err) {
		console.error('❌ Error fetching projects:', err);
		return {
			errorMessage: 'Failed to load projects',
			projects: []
		};
	}
};
