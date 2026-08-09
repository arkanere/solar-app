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

	// The country comes from the layout, which resolved it from the slug. These
	// reads used to filter on a literal 'in', so a US business loaded this page
	// and was told its own profile did not exist. Not defaulted to 'in' when
	// absent: the layout only omits it on its DB-error fallback, and guessing
	// there would show a US business an India-shaped branch list.
	const { country } = parentData;
	if (!country) {
		return {
			errorMessage: 'Business not found',
			branches: []
		};
	}

	try {
		// The main business comes from the session's businessId, not from the slug:
		// slugs are not unique (next-steps.md item 1), and the branch list below is
		// keyed by this id, so landing on a twin lists another company's branches.
		const mainBusinessRows = await db
			.select(BRANCH_BUSINESS_SELECTION)
			.from(businesses)
			.where(
				and(
					eq(businesses.countryCode, country),
					eq(businesses.sourceId, parentData.business_session.businessId)
				)
			);

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
				and(eq(businesses.countryCode, country), eq(branchesTable.branchId, businesses.sourceId))
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
