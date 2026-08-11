import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { accountOfProfile, businessInCountry } from '$lib/server/writeTargets';
import { and, eq, ne } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

const BRANCH_BUSINESS_SELECTION = {
	id: businessProfiles.businessId,
	slug: businessProfiles.slug,
	businessname: businessProfiles.businessname,
	email: businessProfiles.email,
	phonenumber: businessProfiles.phonenumber,
	whatsapp: businessProfiles.whatsapp,
	description: businessProfiles.description,
	website: businessProfiles.website,
	instagram_id: businessProfiles.instagramId,
	google_maps_link: businessProfiles.googleMapsLink,
	address: businessProfiles.address,
	pluscode: businessProfiles.pluscode,
	services: businessProfiles.services,
	brands: businessProfiles.brands,
	gstn: businessProfiles.taxId,
	state: businessProfiles.level1,
	district: businessProfiles.level2,
	city: businessProfiles.city,
	pincode: businessProfiles.postalCode,
	rscore: businessProfiles.rscore,
	tag: businessProfiles.tag,
	businessfilled: businessProfiles.businessfilled,
	isvisible: businessProfiles.isvisible
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
			.from(businessProfiles)
			// The country predicate is NOT redundant beside the id — see
			// businessInCountry's doc comment in $lib/server/writeTargets. It asserts
			// that the session's business and the country the layout resolved from the
			// slug agree, which they can fail to do when a slug exists in both
			// countries.
			.innerJoin(businessAccounts, accountOfProfile)
			.where(and(businessInCountry(country), eq(businessProfiles.businessId, parentData.business_session.businessId)));

		if (mainBusinessRows.length === 0) {
			return {
				errorMessage: 'Business not found',
				branches: []
			};
		}

		const mainBusiness = mainBusinessRows[0] as unknown as Business;
		const mainBusinessId = mainBusiness.id;

		// Get all branch offices linked to this main business. Since 078 that is
		// one predicate on the profiles themselves: every branch names this
		// business in account_business_id, the main names itself (hence the `ne`),
		// and the old branches.isactive is the branch profile's own isvisible.
		const branchRows = await db
			.select(BRANCH_BUSINESS_SELECTION)
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.accountBusinessId, mainBusinessId),
					ne(businessProfiles.businessId, mainBusinessId),
					eq(businessProfiles.isvisible, true)
				)
			);
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
