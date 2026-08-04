import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { US_BUSINESS_SELECTION } from '$lib/server/unifiedRead';
import { businesses, usBranches } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

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
		// First, get the main business using the slug (unified table: profile
		// columns only, so credentials can never reach page data)
		const mainBusinessRows = await db
			.select(US_BUSINESS_SELECTION)
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'us'), eq(businesses.slug, businessSlug)));

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
			.select(US_BUSINESS_SELECTION)
			.from(usBranches)
			.innerJoin(
				businesses,
				and(eq(businesses.countryCode, 'us'), eq(usBranches.branchId, businesses.sourceId))
			)
			.where(and(eq(usBranches.mainId, mainBusinessId), eq(usBranches.isactive, true)));
		const branches = branchRows as unknown as Business[];

		// Also include the main business in the response
		return {
			mainBusiness,
			branches,
			businessSlug
		};
	} catch (err) {
		console.error('❌ Error fetching branches:', err);
		return {
			errorMessage: 'Failed to load branches',
			branches: []
		};
	}
};
