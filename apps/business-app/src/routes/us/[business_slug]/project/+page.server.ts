import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { US_BUSINESS_SELECTION } from '$lib/server/unifiedRead';
import { businesses, usProjects } from '@solar/db/schema';
import { and, desc, eq, isNull, or } from 'drizzle-orm';

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
	county?: string;
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


	try {
		// First, get the main business using the slug (unified table: profile
		// columns only, so credentials can never reach page data)
		const mainBusinessRows = await db
			.select(US_BUSINESS_SELECTION)
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'us'), eq(businesses.slug, businessSlug)));

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
				id: usProjects.id,
				business_slug: usProjects.businessSlug,
				project_slug: usProjects.projectSlug,
				title: usProjects.title,
				pincode: usProjects.zipcode,
				county: usProjects.county,
				project_date: usProjects.projectDate,
				created_at: usProjects.createdAt,
				image_url: usProjects.imageUrl,
				cloudinary_public_id: usProjects.cloudinaryPublicId,
				image_width: usProjects.imageWidth,
				image_height: usProjects.imageHeight,
				image_format: usProjects.imageFormat
			})
			.from(usProjects)
			.where(
				and(
					eq(usProjects.businessSlug, businessSlug),
					or(eq(usProjects.isvisible, true), isNull(usProjects.isvisible))
				)
			)
			.orderBy(desc(usProjects.projectDate), desc(usProjects.createdAt));
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
