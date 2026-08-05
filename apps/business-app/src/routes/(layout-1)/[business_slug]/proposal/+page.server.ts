import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, inProposals } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

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

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessRows = await db
			.select({ id: businesses.sourceId, businessname: businesses.businessname, slug: businesses.slug })
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'in'), eq(businesses.slug, businessSlug)));

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;

		// Get proposals filtered by business slug
		const proposalRows = await db
			.select({
				id: inProposals.id,
				customer_name: inProposals.customerName,
				phone_number: inProposals.phoneNumber,
				address: inProposals.address,
				email: inProposals.email,
				system_capacity_kw: inProposals.systemCapacityKw,
				panels_brand_model: inProposals.panelsBrandModel,
				number_of_panels: inProposals.numberOfPanels,
				inverter_brand_model: inProposals.inverterBrandModel,
				notes: inProposals.notes,
				created_at: inProposals.createdAt,
				updated_at: inProposals.updatedAt
			})
			.from(inProposals)
			.where(eq(inProposals.businessSlug, businessSlug))
			.orderBy(desc(inProposals.createdAt));

		const proposals = proposalRows as unknown as Proposal[];

		return {
			business,
			proposals
		};
	} catch (err) {
		console.error('❌ Error loading proposals:', err);
		throw error(500, 'Failed to load proposals');
	}
};
