import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { IN_LEAD_SELECTION } from '$lib/server/unifiedRead';
import { businessAccounts, businessProfiles, leaddata, leaddataClaimrequests } from '@solar/db/schema';
import { accountOfProfile, businessInCountry } from '$lib/server/writeTargets';
import { and, desc, eq, gte, inArray, like, ne, not, or, sql } from 'drizzle-orm';

export const prerender = false;

interface Business {
	id: number;
	slug: string;
	district: string;
	state: string;
	[key: string]: unknown;
}

interface Branch {
	id: number;
	slug: string;
	district: string;
	state: string;
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

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const { business_slug } = params;

	// The country comes from the layout, which resolved it from the slug. These
	// reads used to filter on a literal 'in', so a US business opening its CRM
	// was told its own profile did not exist. Not defaulted to 'in' when absent:
	// the layout omits it only on its DB-error fallback, and guessing there
	// would show a US business an India-shaped lead list.
	const { business_session, country } = await parent();
	if (!country || !business_session) {
		return { errorMessage: 'Business not found' };
	}

	try {
		// Query business details, by the session's businessId rather than the slug
		// — slugs are not unique (next-steps.md item 1), and this list is the lead
		// data of whichever business the lookup lands on.
		const businessRows = await db
			.select({
				id: businessProfiles.businessId,
				businessname: businessProfiles.businessname,
				description: businessProfiles.description,
				phonenumber: businessProfiles.phonenumber,
				email: businessProfiles.email,
				address: businessProfiles.address,
				website: businessProfiles.website,
				district: businessProfiles.level2,
				state: businessProfiles.level1
			})
			.from(businessProfiles)
			// The country predicate is NOT redundant beside the id — see
			// businessInCountry's doc comment in $lib/server/writeTargets. It asserts
			// that the session's business and the country the layout resolved from the
			// slug agree, which they can fail to do when a slug exists in both
			// countries.
			.innerJoin(businessAccounts, accountOfProfile)
			.where(and(businessInCountry(country), eq(businessProfiles.businessId, business_session.businessId)))
			.limit(1);

		if (businessRows.length === 0) {
			return { errorMessage: 'Business not found' };
		}

		const business = businessRows[0] as unknown as Business;
		const { id: businessId, state } = business; // Extract state & business ID

		// ✅ Get all branch business IDs and slugs for this main business.
		//
		// Since 078 the branches of a business are the profiles naming it in
		// account_business_id, minus the business itself, with the old
		// branches.isactive read off each branch profile's own isvisible. The
		// country filter that sat on the join went with 079 and was redundant
		// anyway — business_id is globally unique, so the id predicate scopes this
		// to one country by itself.
		const branchRows = (await db
			.select({
				id: businessProfiles.businessId,
				slug: businessProfiles.slug,
				district: businessProfiles.level2,
				state: businessProfiles.level1
			})
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.accountBusinessId, businessId),
					ne(businessProfiles.businessId, businessId),
					eq(businessProfiles.isvisible, true)
				)
			)) as unknown as Branch[];

		// Create arrays of all business IDs (main + branches) and slugs for queries
		const allBusinessIds = [businessId, ...branchRows.map((branch) => branch.id)];
		const allSlugs = [business_slug, ...branchRows.map((branch) => branch.slug)];
		const allStates = [state, ...branchRows.map((branch) => branch.state)];
		const uniqueStates = [...new Set(allStates.filter((s: string | null) => s))];

		// ✅ Fetch exclusive leads for main business and all its branches
		let exclusiveLeads: Lead[] = [];
		if (allSlugs.length > 0) {
			exclusiveLeads = (await db
				.select(IN_LEAD_SELECTION)
				.from(leaddata)
				.where(
					and(
						eq(leaddata.countryCode, country),
						eq(leaddata.isvisible, true),
						or(
							...allSlugs.flatMap((slug) => [
								like(leaddata.urlparams, `/solar-panel-installer/${slug}%`),
								like(leaddata.urlparams, `%/installer/${slug}%`)
							])
						)
					)
				)
				.orderBy(desc(leaddata.id))) as unknown as Lead[];
		}

		// ✅ Fetch claimed leads from `leaddata_claimrequests` for main business and all branches
		const claimedLeadRows = await db
			.select({ lead_id: leaddataClaimrequests.leadId })
			.from(leaddataClaimrequests)
			.where(inArray(leaddataClaimrequests.businessId, allBusinessIds));

		const claimedLeadIds = new Set(claimedLeadRows.map((row) => row.lead_id));

		// ✅ Fetch non-exclusive claimed leads for main business and all branches
		const nonExclusiveClaimedLeads = (await db
			.select(IN_LEAD_SELECTION)
			.from(leaddata)
			.where(
				and(
					eq(leaddata.countryCode, country),
					eq(leaddata.category, 2),
					inArray(leaddata.businessId, allBusinessIds),
					eq(leaddata.isvisible, true)
				)
			)
			.orderBy(desc(leaddata.id))) as unknown as Lead[];

		// ✅ Extract original_id of claimed leads (i.e., leads that were originally non-exclusive)
		const claimedOriginalIds = new Set(nonExclusiveClaimedLeads.map((lead) => lead.original_id));

		// ✅ Fetch non-exclusive leads from all states where main business and branches operate
		// Only exclude leads that are unavailable (claim_count > 4) AND older than 60 days
		let nonExclusiveLeads: Lead[] = [];
		if (uniqueStates.length > 0) {
			nonExclusiveLeads = (await db
				.select({ ...IN_LEAD_SELECTION, claim_count: sql<number>`COALESCE(${leaddata.claimCount}, 0)` })
				.from(leaddata)
				.where(
					and(
						eq(leaddata.countryCode, country),
						eq(leaddata.category, 1),
						inArray(leaddata.level1, uniqueStates as string[]),
						eq(leaddata.isvisible, true),
						gte(leaddata.createdAt, sql`NOW() - INTERVAL '15 days'`),
						not(sql`COALESCE(${leaddata.claimCount}, 0) > 4`)
					)
				)
				.orderBy(desc(leaddata.id))) as unknown as Lead[];
		}

		// ✅ Remove non-exclusive leads that have been claimed
		const filteredNonExclusiveLeads = nonExclusiveLeads.filter(
			(lead: Lead) => !claimedOriginalIds.has(lead.id)
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
