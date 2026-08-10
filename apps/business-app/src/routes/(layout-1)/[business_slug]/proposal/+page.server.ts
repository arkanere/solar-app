import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, svProposals } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error, isHttpError } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
	slug: string;
}

interface Proposal {
	id: number;
	customer_name: string;
	phone_number: string;
	address?: string;
	email?: string;
	system_capacity_kw?: number;
	panels_brand_model?: string;
	number_of_panels?: number;
	inverter_brand_model?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
}

interface PageData {
	business?: Business;
	proposals?: Proposal[];
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const businessSlug = params.business_slug;

	// The country comes from the layout, which resolved it from the slug — not a
	// literal, and not defaulted to 'in' when absent. Hoisted above the try
	// because the catch below turns everything it sees into a 500.
	//
	// The proposals themselves stay IN-shaped: `sv_proposals` has no US
	// counterpart, so a US business gets an empty list, which is the correct
	// answer rather than a gap.
	const { business_session, country } = await parent();
	if (!country || !business_session) {
		throw error(404, 'Business not found');
	}

	try {
		// Resolved by the session's businessId, not by the slug — slugs are not
		// unique (next-steps.md item 1).
		const businessRows = await db
			.select({ id: businessProfiles.businessId, businessname: businessProfiles.businessname, slug: businessProfiles.slug })
			.from(businessProfiles)
			.where(
				and(eq(businessProfiles.countryCode, country), eq(businessProfiles.businessId, business_session.businessId))
			);

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;

		// Get proposals filtered by business slug
		const proposalRows = await db
			.select({
				id: svProposals.id,
				customer_name: svProposals.customerName,
				phone_number: svProposals.phoneNumber,
				address: svProposals.address,
				email: svProposals.email,
				system_capacity_kw: svProposals.systemCapacityKw,
				panels_brand_model: svProposals.panelsBrandModel,
				number_of_panels: svProposals.numberOfPanels,
				inverter_brand_model: svProposals.inverterBrandModel,
				notes: svProposals.notes,
				created_at: svProposals.createdAt,
				updated_at: svProposals.updatedAt
			})
			.from(svProposals)
			.where(eq(svProposals.businessSlug, businessSlug))
			.orderBy(desc(svProposals.createdAt));

		const proposals = proposalRows as unknown as Proposal[];

		return {
			business,
			proposals
		};
	} catch (err) {
		// The 404 above is thrown from inside this try, so without the rethrow the
		// catch reported a missing business as a server error. Only genuine
		// failures below become a 500.
		if (isHttpError(err)) throw err;
		console.error('❌ Error loading proposals:', err);
		throw error(500, 'Failed to load proposals');
	}
};
