export const prerender = false;
import { redirect } from '@sveltejs/kit';
import { UserAuthService } from '$lib/auth/user/index.js';
import { SessionManager } from '$lib/auth/user/SessionManager.js';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { getSignedBillUrl } from '$lib/server/billStorage.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const authService = new UserAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return { user: null, leads: [], claimedBusinesses: [] };
	}

	const pool = createPool({ connectionString: POSTGRES_URL });
	let leads = [];
	let claimedBusinesses = [];

	try {
		const result = await pool.query(
			`SELECT source_id AS id, name, phone, postal_code AS pin_code, type, comment, email, level2 AS district, created_at, bill_cloudinary_public_id, bill_format
			FROM leads
			WHERE country_code = 'in' AND email = $1 AND isvisible = true AND (category IS NULL OR category = 1)
			ORDER BY created_at DESC`,
			[sessionResult.user.email]
		);
		leads = result.rows.map((lead) => ({
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
			const claimedResult = await pool.query(
				`SELECT DISTINCT
					l_claimed.source_id as claim_id,
					l_claimed.created_at as claim_date,
					l_claimed.stage,
					l_claimed.status,
					l_original.source_id as original_lead_id,
					l_original.name as lead_name,
					l_original.phone as lead_phone,
					l_original.postal_code as lead_pin_code,
					l_original.type as lead_type,
					l_original.created_at as lead_created_at,
					b.source_id as business_id,
					b.businessname,
					b.slug as business_slug,
					b.level2 as business_district,
					b.level1 as business_state,
					b.phonenumber as business_phone,
					lcr.created_at as interest_received_at,
					lcr.isallotted,
					lcr.isresolved
				FROM leads l_original
				INNER JOIN leads l_claimed ON (
					l_claimed.country_code = 'in'
					AND l_claimed.name = l_original.name
					AND l_claimed.phone = l_original.phone
					AND l_claimed.postal_code = l_original.postal_code
					AND l_claimed.category = 2
					AND l_claimed.isvisible = true
					AND l_claimed.business_id IS NOT NULL
				)
				LEFT JOIN businesses b ON b.country_code = 'in' AND b.source_id = l_claimed.business_id
				LEFT JOIN leaddata_claimrequests lcr ON l_claimed.source_id = lcr.claim_id
				WHERE l_original.country_code = 'in'
				AND l_original.email = $1
				AND l_original.isvisible = true
				AND (l_original.category IS NULL OR l_original.category = 1)
				ORDER BY l_claimed.created_at DESC`,
				[sessionResult.user.email]
			);
			claimedBusinesses = claimedResult.rows.map((claim) => ({
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
}

/** @type {import('./$types').Actions} */
export const actions = {
	logout: async ({ cookies }) => {
		SessionManager.clearSession(cookies);
		throw redirect(302, '/in');
	}
};
