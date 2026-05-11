import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

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

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const { business_slug } = params;

	try {
		// Query business details
		const businessResult = await pool.query(
			'SELECT id, businessname, description, phonenumber, email, address, website, district, state FROM businesses_1 WHERE slug = $1 LIMIT 1',
			[business_slug]
		);

		if (businessResult.rows.length === 0) {
			return { errorMessage: 'Business not found' };
		}

		const business = businessResult.rows[0] as Business;
		const { id: businessId, state } = business; // Extract state & business ID

		// ✅ Get all branch business IDs and slugs for this main business
		const branchesResult = await pool.query(
			`SELECT b.id, b.slug, b.district, b.state
			FROM branches br
			JOIN businesses_1 b ON br.branch_id = b.id
			WHERE br.main_id = $1 AND br.isactive = true`,
			[businessId]
		);

		// Create arrays of all business IDs (main + branches) and slugs for queries
		const allBusinessIds = [businessId, ...branchesResult.rows.map((branch: Branch) => branch.id)];
		const allSlugs = [business_slug, ...branchesResult.rows.map((branch: Branch) => branch.slug)];
		const allStates = [state, ...branchesResult.rows.map((branch: Branch) => branch.state)];
		const uniqueStates = [...new Set(allStates.filter((s: string | null) => s))];

		// ✅ Fetch exclusive leads for main business and all its branches
		let exclusiveLeadResult = { rows: [] as Lead[] };
		if (allSlugs.length > 0) {
			const conditions = allSlugs.flatMap((_, index) => {
				const i = index * 2;
				return [`urlparams LIKE $${i + 1}`, `urlparams LIKE $${i + 2}`];
			});
			exclusiveLeadResult = await pool.query(
				`SELECT * FROM leaddata
				WHERE isvisible = true
				AND (${conditions.join(' OR ')})
				ORDER BY id DESC`,
				allSlugs.flatMap((slug) => [`/solar-panel-installer/${slug}%`, `%/installer/${slug}%`])
			);
		}

		// ✅ Fetch claimed leads from `leaddata_claimrequests` for main business and all branches
		const claimedLeadResult = await pool.query(
			`SELECT lead_id FROM leaddata_claimrequests
			WHERE business_id = ANY($1)`,
			[allBusinessIds]
		);

		const claimedLeadIds = new Set(claimedLeadResult.rows.map((row: { lead_id: number }) => row.lead_id));

		// ✅ Fetch non-exclusive claimed leads for main business and all branches
		const nonExclusiveClaimedResult = await pool.query(
			`SELECT * FROM leaddata
			WHERE category = 2
			AND business_id = ANY($1)
			AND isvisible = true
			ORDER BY id DESC`,
			[allBusinessIds]
		);

		// ✅ Extract original_id of claimed leads (i.e., leads that were originally non-exclusive)
		const claimedOriginalIds = new Set(
			nonExclusiveClaimedResult.rows.map((lead: Lead) => lead.original_id)
		);

		// ✅ Fetch non-exclusive leads from all states where main business and branches operate
		// Only exclude leads that are unavailable (claim_count > 4) AND older than 60 days
		let nonExclusiveLeadResult = { rows: [] as Lead[] };
		if (uniqueStates.length > 0) {
			nonExclusiveLeadResult = await pool.query(
				`SELECT *, COALESCE(claim_count, 0) as claim_count
				FROM leaddata
				WHERE category = 1
				AND state = ANY($1)
				AND isvisible = true
				AND created_at >= NOW() - INTERVAL '15 days'
				AND NOT (COALESCE(claim_count, 0) > 4)
				ORDER BY id DESC`,
				[uniqueStates]
			);
		}

		// ✅ Remove non-exclusive leads that have been claimed
		const filteredNonExclusiveLeads = nonExclusiveLeadResult.rows.filter(
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
			...exclusiveLeadResult.rows,
			...maskedNonExclusiveLeads,
			...nonExclusiveClaimedResult.rows
		].sort((a: Lead, b: Lead) => {
			// Sort by created_at date in descending order (latest first)
			const dateA = new Date(a.created_at || a.id);
			const dateB = new Date(b.created_at || b.id);
			return dateB.getTime() - dateA.getTime();
		});

		return {
			business,
			branches: branchesResult.rows as Branch[], // Include branch information for debugging/UI
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
