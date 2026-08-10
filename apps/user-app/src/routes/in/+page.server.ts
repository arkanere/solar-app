export const prerender = false;
import { redirect } from '@sveltejs/kit';
import { UserAuthService } from '$lib/auth/user';
import { SessionManager } from '$lib/auth/user/SessionManager';
import { aliasedTable, and, desc, eq, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { getSignedBillUrl } from '$lib/server/billStorage';
import type { PageServerLoad, Actions } from './$types';

/** A user's own inquiry, in the camelCase shape the dashboard renders. */
interface Lead {
	id: number;
	name: string | null;
	phone: string | null;
	pinCode: string | null;
	type: string | null;
	comment: string | null;
	email: string | null;
	district: string | null;
	submittedAt: Date | null;
	billUrl: string | null;
	billFormat: string | null;
}

/** An installer's claim on one of those inquiries. */
interface ClaimedBusiness {
	claimId: number;
	claimDate: Date | null;
	/** leads.stage is a smallint; leads.status a boolean. */
	stage: number | null;
	status: boolean | null;
	originalLeadId: number;
	leadName: string | null;
	leadPhone: string | null;
	leadPinCode: string | null;
	leadType: string | null;
	leadCreatedAt: Date | null;
	businessId: number | null;
	businessName: string | null;
	businessSlug: string | null;
	businessDistrict: string | null;
	businessState: string | null;
	businessPhone: string | null;
	interestReceivedAt: Date | null;
	isAllotted: boolean | null;
	isResolved: boolean | null;
}

// `created_at` is a `mode: 'string'` timestamp the driver returns as a Date;
// restating that keeps Lead/ClaimedBusiness' contract honest, and it renders as
// the bare column so the SQL is unchanged. The ids need no restatement since
// 066 — these read leaddata.id, the primary key, where leads.source_id was
// nullable in the schema.
const LEAD_CREATED_AT = sql<Date | null>`${schema.leaddata.createdAt}`;

export const load: PageServerLoad = async ({ cookies }) => {
	const authService = new UserAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return { user: null, leads: [] as Lead[], claimedBusinesses: [] as ClaimedBusiness[] };
	}

	let leads: Lead[] = [];
	let claimedBusinesses: ClaimedBusiness[] = [];

	// The user's own inquiries: category NULL or 1. Repeated for both queries.
	const isOriginalLead = (t: typeof schema.leaddata) =>
		and(
			eq(t.countryCode, 'in'),
			eq(t.email, sessionResult.user.email),
			eq(t.isvisible, true),
			or(isNull(t.category), eq(t.category, 1))
		);

	try {
		const leadRows = await db
			.select({
				id: schema.leaddata.id,
				name: schema.leaddata.name,
				phone: schema.leaddata.phone,
				pin_code: schema.leaddata.postalCode,
				type: schema.leaddata.type,
				comment: schema.leaddata.comment,
				email: schema.leaddata.email,
				district: schema.leaddata.level2,
				created_at: LEAD_CREATED_AT,
				bill_cloudinary_public_id: schema.leaddata.billCloudinaryPublicId,
				bill_format: schema.leaddata.billFormat
			})
			.from(schema.leaddata)
			.where(isOriginalLead(schema.leaddata))
			.orderBy(desc(schema.leaddata.createdAt));

		leads = leadRows.map((lead) => ({
			id: lead.id,
			name: lead.name,
			phone: lead.phone,
			pinCode: lead.pin_code,
			type: lead.type,
			comment: lead.comment,
			email: lead.email,
			district: lead.district,
			submittedAt: lead.created_at,
			billUrl: getSignedBillUrl(lead.bill_cloudinary_public_id, lead.bill_format),
			billFormat: lead.bill_format
		}));

		if (leads.length > 0) {
			// `leaddata` self-joins to itself, so the claimed side needs an alias —
			// same `aliasedTable` pattern business-app's Phase 5 introduced.
			const original = aliasedTable(schema.leaddata, 'l_original');
			const claimed = aliasedTable(schema.leaddata, 'l_claimed');

			const claimRows = await db
				.selectDistinct({
					claim_id: claimed.id,
					claim_date: sql<Date | null>`${claimed.createdAt}`,
					stage: claimed.stage,
					status: claimed.status,
					original_lead_id: original.id,
					lead_name: original.name,
					lead_phone: original.phone,
					lead_pin_code: original.postalCode,
					lead_type: original.type,
					lead_created_at: sql<Date | null>`${original.createdAt}`,
					business_id: schema.businessProfiles.businessId,
					businessname: schema.businessProfiles.businessname,
					business_slug: schema.businessProfiles.slug,
					business_district: schema.businessProfiles.level2,
					business_state: schema.businessProfiles.level1,
					business_phone: schema.businessProfiles.phonenumber,
					interest_received_at: sql<Date | null>`${schema.leaddataClaimrequests.createdAt}`,
					isallotted: schema.leaddataClaimrequests.isallotted,
					isresolved: schema.leaddataClaimrequests.isresolved
				})
				.from(original)
				.innerJoin(
					claimed,
					and(
						eq(claimed.countryCode, 'in'),
						eq(claimed.name, original.name),
						eq(claimed.phone, original.phone),
						eq(claimed.postalCode, original.postalCode),
						eq(claimed.category, 2),
						eq(claimed.isvisible, true),
						isNotNull(claimed.businessId)
					)
				)
				.leftJoin(
					schema.businessProfiles,
					and(
						eq(schema.businessProfiles.countryCode, 'in'),
						eq(schema.businessProfiles.businessId, claimed.businessId)
					)
				)
				.leftJoin(
					schema.leaddataClaimrequests,
					eq(claimed.id, schema.leaddataClaimrequests.claimId)
				)
				.where(isOriginalLead(original))
				.orderBy(desc(claimed.createdAt));

			claimedBusinesses = claimRows.map((claim) => ({
				claimId: claim.claim_id,
				claimDate: claim.claim_date,
				stage: claim.stage,
				status: claim.status,
				originalLeadId: claim.original_lead_id,
				leadName: claim.lead_name,
				leadPhone: claim.lead_phone,
				leadPinCode: claim.lead_pin_code,
				leadType: claim.lead_type,
				leadCreatedAt: claim.lead_created_at,
				businessId: claim.business_id,
				businessName: claim.businessname,
				businessSlug: claim.business_slug,
				businessDistrict: claim.business_district,
				businessState: claim.business_state,
				businessPhone: claim.business_phone,
				interestReceivedAt: claim.interest_received_at || claim.claim_date,
				isAllotted: claim.isallotted,
				isResolved: claim.isresolved
			}));
		}
	} catch (err) {
		console.error('Error fetching user leads:', err);
	}

	return { user: sessionResult.user, leads, claimedBusinesses };
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		SessionManager.clearSession(cookies);
		throw redirect(302, '/in');
	}
};
