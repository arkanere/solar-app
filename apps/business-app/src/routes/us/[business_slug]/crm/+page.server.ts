import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { US_LEAD_SELECTION } from '$lib/server/unifiedRead';
import { businesses, leads, usBranches, usLeaddataClaimrequests } from '@solar/db/schema';
import { and, desc, eq, inArray, like, not, or, sql } from 'drizzle-orm';

export const prerender = false;

interface Business {
	id: number;
	slug: string;
	county: string;
	[key: string]: unknown;
}

interface Branch {
	id: number;
	slug: string;
	county: string;
}

interface Lead {
	id: number;
	created_at: string;
	claim_count?: number;
	email?: string;
	phone?: string;
	original_id?: number;
	urlparams?: string;
	isvisible: boolean;
	category: number;
	[key: string]: unknown;
}

interface PageData {
	business?: Business;
	branches?: Branch[];
	leads?: Lead[];
	leadClaims?: number[];
	errorMessage?: string;
}

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const { business_slug } = params;

	try {
		// Query business details
		const businessRows = await db
			.select({
				id: businesses.sourceId,
				businessname: businesses.businessname,
				description: businesses.description,
				phonenumber: businesses.phonenumber,
				email: businesses.email,
				address: businesses.address,
				website: businesses.website,
				county: businesses.level2
			})
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'us'), eq(businesses.slug, business_slug)))
			.limit(1);

		if (businessRows.length === 0) {
			return { errorMessage: 'Business not found' };
		}

		const business = businessRows[0] as unknown as Business;
		const { county, id: businessId } = business; // Extract county & business ID

		// ✅ Get all branch business IDs and slugs for this main business
		const branchRows = (await db
			.select({ id: businesses.sourceId, slug: businesses.slug, county: businesses.level2 })
			.from(usBranches)
			.innerJoin(
				businesses,
				and(eq(businesses.countryCode, 'us'), eq(usBranches.branchId, businesses.sourceId))
			)
			.where(and(eq(usBranches.mainId, businessId), eq(usBranches.isactive, true)))) as unknown as Branch[];

		// Create arrays of all business IDs (main + branches) and slugs for queries
		const allBusinessIds = [businessId, ...branchRows.map((branch) => branch.id)];
		const allSlugs = [business_slug, ...branchRows.map((branch) => branch.slug)];
		const allCounties = [county, ...branchRows.map((branch) => branch.county)];
		const uniqueCounties = [...new Set(allCounties.filter((d: string | null) => d))]; // Remove duplicates and nulls

		// ✅ Fetch exclusive leads for main business and all its branches
		let exclusiveLeads: Lead[] = [];
		if (allSlugs.length > 0) {
			exclusiveLeads = (await db
				.select(US_LEAD_SELECTION)
				.from(leads)
				.where(
					and(
						eq(leads.countryCode, 'us'),
						eq(leads.isvisible, true),
						or(...allSlugs.map((slug) => like(leads.urlparams, `/solar-panel-installer/${slug}%`)))
					)
				)
				.orderBy(desc(leads.id))) as unknown as Lead[];
		}

		// ✅ Fetch claimed leads from `us_leaddata_claimrequests` for main business and all branches
		const claimedLeadRows = await db
			.select({ lead_id: usLeaddataClaimrequests.leadId })
			.from(usLeaddataClaimrequests)
			.where(inArray(usLeaddataClaimrequests.businessId, allBusinessIds));

		const claimedLeadIds = new Set(claimedLeadRows.map((row) => row.lead_id));

		// ✅ Fetch non-exclusive claimed leads for main business and all branches
		const nonExclusiveClaimedLeads = (await db
			.select(US_LEAD_SELECTION)
			.from(leads)
			.where(
				and(
					eq(leads.countryCode, 'us'),
					eq(leads.category, 2),
					inArray(leads.businessId, allBusinessIds),
					eq(leads.isvisible, true)
				)
			)
			.orderBy(desc(leads.id))) as unknown as Lead[];

		// ✅ Extract original_id of claimed leads (i.e., leads that were originally non-exclusive)
		const claimedOriginalIds = new Set(nonExclusiveClaimedLeads.map((lead) => lead.original_id));

		// ✅ Fetch non-exclusive leads from all counties where main business and branches operate
		// Only exclude leads that are unavailable (claim_count > 4) AND older than 60 days
		let nonExclusiveLeads: Lead[] = [];
		if (uniqueCounties.length > 0) {
			nonExclusiveLeads = (await db
				.select({ ...US_LEAD_SELECTION, claim_count: sql<number>`COALESCE(${leads.claimCount}, 0)` })
				.from(leads)
				.where(
					and(
						eq(leads.countryCode, 'us'),
						eq(leads.category, 1),
						inArray(leads.level2, uniqueCounties as string[]),
						eq(leads.isvisible, true),
						not(
							sql`(COALESCE(${leads.claimCount}, 0) > 4 AND ${leads.createdAt} < NOW() - INTERVAL '60 days')`
						)
					)
				)
				.orderBy(desc(leads.id))) as unknown as Lead[];
		}

		// ✅ Remove non-exclusive leads that have been claimed
		const filteredNonExclusiveLeads = nonExclusiveLeads.filter(
			(lead: Lead) => !claimedOriginalIds.has(lead.original_id)
		);

		// ✅ Mask email and phone for non-exclusive leads
		const maskedNonExclusiveLeads = filteredNonExclusiveLeads.map((lead: Lead) => ({
			...lead,
			email: maskEmail(lead.email),
			phone: maskPhone(lead.phone)
		}));

		// ✅ Merge all lead lists and sort by latest first
		const allLeads = [
			...exclusiveLeads,
			...maskedNonExclusiveLeads,
			...nonExclusiveClaimedLeads
		].sort((a: Lead, b: Lead) => {
			// Sort by created_at date in descending order (latest first)
			const dateA = new Date(a.created_at || a.id);
			const dateB = new Date(b.created_at || b.id);
			return dateB.getTime() - dateA.getTime();
		});

		return {
			business,
			branches: branchRows, // Include branch information for debugging/UI
			leads: allLeads.length > 0 ? allLeads : [],
			leadClaims: Array.from(claimedLeadIds) // ✅ Export leadClaims as an array of claimed lead IDs
		};
	} catch (error) {
		console.error('❌ Database query error:', error);
		return { errorMessage: 'Failed to load data' };
	}
};

/**
 * Mask email for UI-friendly display (e.g., "br*****@gmail.com")
 */
function maskEmail(email?: string): string | undefined {
	if (!email || !email.includes('@')) return email;
	const [name, domain] = email.split('@');
	return name.slice(0, 2) + '*****' + '@' + domain;
}

/**
 * Mask phone number for UI-friendly display (e.g., "+91 *****6789")
 */
function maskPhone(phone?: string): string | undefined {
	if (!phone || phone.length < 4) return phone;
	return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}
