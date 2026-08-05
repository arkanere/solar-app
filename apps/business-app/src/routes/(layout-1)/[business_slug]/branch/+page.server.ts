import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { branches as branchesTable, businesses } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

const BRANCH_BUSINESS_SELECTION = {
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
};

export const prerender = false;

interface Business {
	id: number;
	slug: string;
	[key: string]: unknown;
}

interface PageData {
	mainBusiness?: Business;
	branches?: Business[];
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
		// First, get the main business profile using the slug
		const mainBusinessRows = await db
			.select(BRANCH_BUSINESS_SELECTION)
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'in'), eq(businesses.slug, businessSlug)));

		if (mainBusinessRows.length === 0) {
			return {
				errorMessage: 'Business not found',
				branches: []
			};
		}

		const mainBusiness = mainBusinessRows[0] as unknown as Business;
		const mainBusinessId = mainBusiness.id;

		// Get all branch offices linked to this main business
		const branchRows = await db
			.select(BRANCH_BUSINESS_SELECTION)
			.from(branchesTable)
			.innerJoin(
				businesses,
				and(eq(businesses.countryCode, 'in'), eq(branchesTable.branchId, businesses.sourceId))
			)
			.where(and(eq(branchesTable.mainId, mainBusinessId), eq(branchesTable.isactive, true)));
		const branches = branchRows as unknown as Business[];

		// Also include the main business in the response
		return {
			mainBusiness,
			branches,
			businessSlug
		};
	} catch (error) {
		console.error('❌ Error fetching branches:', error);
		return {
			errorMessage: 'Failed to load branches',
			branches: []
		};
	}
};
