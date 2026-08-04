import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, geoLocations, leads } from '@solar/db/schema';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
}

interface Lead {
	id: number;
	name: string;
	county: string;
	pin_code: string;
	created_at: string;
	claim_count: number;
	sv_comment_for_businesses?: string;
	state: string;
}

interface PageData {
	business?: Business;
	business_id?: number;
	leads?: Lead[];
}

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessRows = await db
			.select({ id: businesses.sourceId, businessname: businesses.businessname })
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'us'), eq(businesses.slug, businessSlug)));

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;
		const businessId = business.id;

		// Get Non-Exclusive-Available-to-Claim leads with state information
		// Only show leads that are at least 10 days old and within the last 90 days
		const leadRows = await db
			.selectDistinct({
				id: leads.sourceId,
				name: leads.name,
				county: leads.level2,
				pin_code: leads.postalCode,
				created_at: leads.createdAt,
				claim_count: leads.claimCount,
				sv_comment_for_businesses: leads.svCommentForBusinesses,
				state: sql<string>`COALESCE(${geoLocations.level1}, 'Unknown')`
			})
			.from(leads)
			.leftJoin(
				geoLocations,
				and(eq(geoLocations.countryCode, 'us'), eq(geoLocations.level2, leads.level2))
			)
			.where(
				and(
					eq(leads.countryCode, 'us'),
					eq(leads.category, 1),
					lte(leads.claimCount, 4),
					eq(leads.isvisible, true),
					lte(leads.createdAt, sql`NOW() - INTERVAL '10 days'`),
					gte(leads.createdAt, sql`NOW() - INTERVAL '90 days'`)
				)
			)
			.orderBy(desc(leads.createdAt));

		const openLeads = leadRows as unknown as Lead[];

		return {
			business,
			business_id: businessId,
			leads: openLeads
		};
	} catch (err) {
		console.error('❌ Error loading open inquiries:', err);
		throw error(500, 'Failed to load open inquiries');
	}
};
