export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

// Function to filter out branch offices when their main business is present
// and enhance remaining branch offices with main business credentials
async function filterOutBranchOffices(businessDetails, pool) {
	if (!businessDetails || businessDetails.length <= 1) {
		return businessDetails;
	}

	// Separate businesses into main and branch offices based on slug format
	const mainBusinesses = [];
	const branchOffices = [];

	businessDetails.forEach(business => {
		const slug = business.slug || '';
		// Branch offices have '-branch-' in their slug
		const isBranchOffice = slug.includes('-branch-');

		if (isBranchOffice) {
			branchOffices.push(business);
		} else {
			mainBusinesses.push(business);
		}
	});

	// Create a map of main business slugs for matching
	const mainBusinessSlugs = new Set(
		mainBusinesses.map(b => b.slug).filter(slug => slug)
	);

	// Filter out branch offices whose main business is present
	const filteredBranchOffices = branchOffices.filter(branch => {
		if (!branch.slug) return true; // Keep if no slug

		// Extract main business slug from branch slug
		// Format: 'go-green-solar-surat-branch-a2405dcf' -> 'go-green-solar-surat'
		const branchSlugParts = branch.slug.split('-branch-');
		if (branchSlugParts.length >= 2) {
			const mainBusinessSlug = branchSlugParts[0];
			// Remove branch office if its main business is present
			return !mainBusinessSlugs.has(mainBusinessSlug);
		}

		// If we can't parse the branch slug, keep it
		return true;
	});

	// For remaining branch offices, fetch their main business credentials
	const enhancedBranchOffices = await Promise.all(
		filteredBranchOffices.map(async (branch) => {
			if (!branch.slug || !branch.slug.includes('-branch-')) {
				return { ...branch, is_branch: false };
			}

			const branchSlugParts = branch.slug.split('-branch-');
			if (branchSlugParts.length >= 2) {
				const mainBusinessSlug = branchSlugParts[0];

				// Fetch main business credentials
				try {
					const mainBusinessQuery = await pool.query(
						'SELECT slug, magic_link_token FROM businesses_1 WHERE slug = $1 AND isvisible = true',
						[mainBusinessSlug]
					);

					if (mainBusinessQuery.rows.length > 0) {
						const mainBusiness = mainBusinessQuery.rows[0];
						return {
							...branch,
							is_branch: true,
							main_business_slug: mainBusiness.slug,
							main_business_magic_link_token: mainBusiness.magic_link_token
						};
					}
				} catch (error) {
					console.error('Error fetching main business credentials:', error);
				}
			}

			return { ...branch, is_branch: true };
		})
	);

	// Mark main businesses as non-branches
	const enhancedMainBusinesses = mainBusinesses.map(business => ({
		...business,
		is_branch: false
	}));

	// Return main businesses + enhanced branch offices
	return [...enhancedMainBusinesses, ...enhancedBranchOffices];
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Get exclusive leads (leads that came through specific business pages)
		const exclusiveLeadsQuery = await pool.query(`
			SELECT DISTINCT
				l.*,
				l.district as mapped_district,
				COUNT(DISTINCT b.id) as business_count,
				STRING_AGG(DISTINCT b.businessname, ', ') as available_businesses,
				'exclusive' as lead_type
			FROM leaddata l
			LEFT JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			INNER JOIN businesses_1 b ON (l.district = b.district) AND b.isvisible = true
			WHERE l.isvisible = true
			AND l.urlparams LIKE '/solar-panel-installer/%'
			AND l.urlparams NOT LIKE '/solar-panel-installer-directory/%'
			AND (l.category IS NULL OR l.category != 2)
			GROUP BY l.id, l.name, l.phone, l.pin_code, l.type, l.comment, l.created_at,
					 l.svnotes, l.sv_comment_for_businesses, l.urlparams, l.isvisible, l.email, l.category, l.district,
					 l.stage, l.status, l.claim_count, l.original_id, l.business_id, l.email_invite_count, pm.district
			HAVING COUNT(DISTINCT b.id) > 0
			ORDER BY l.id DESC
		`);

		// Get business details for exclusive leads with lead counts
		const exclusiveBusinessesQuery = await pool.query(`
			SELECT DISTINCT
				l.id as lead_id,
				b.id,
				b.businessname,
				b.slug,
				b.magic_link_token,
				b.district,
				b.state,
				b.notes,
				-- Non-exclusive available: category=1 leads in same district, not already claimed by this business, and claim_count <= 4
				COUNT(DISTINCT CASE
					WHEN l_count.isvisible = true AND l_count.category = 1 AND l_count.district = b.district
					AND COALESCE(l_count.claim_count, 0) <= 4
					AND l_count.id NOT IN (
						SELECT DISTINCT original_id
						FROM leaddata l2
						WHERE l2.category = 2 AND l2.business_id = b.id AND l2.original_id IS NOT NULL
					)
					THEN l_count.id END
				) as non_exclusive_available_count,
				-- Non-exclusive claimed: category=2 leads claimed by this business
				COUNT(DISTINCT CASE
					WHEN l_count.isvisible = true AND l_count.category = 2 AND l_count.business_id = b.id
					THEN l_count.id END
				) as claimed_leads_count
			FROM leaddata l
			LEFT JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			INNER JOIN businesses_1 b ON (l.district = b.district) AND b.isvisible = true
			LEFT JOIN leaddata l_count ON (
				(l_count.isvisible = true AND l_count.category = 1 AND l_count.district = b.district) OR
				(l_count.isvisible = true AND l_count.category = 2 AND l_count.business_id = b.id)
			)
			WHERE l.isvisible = true
			AND l.urlparams LIKE '/solar-panel-installer/%'
			AND l.urlparams NOT LIKE '/solar-panel-installer-directory/%'
			AND (l.category IS NULL OR l.category != 2)
			GROUP BY l.id, b.id, b.businessname, b.slug, b.magic_link_token, b.district, b.state, b.notes
			ORDER BY l.id DESC, b.businessname ASC
		`);

		// Get non-exclusive leads (all leads that are NOT exclusive, shared among businesses)
		const nonExclusiveLeadsQuery = await pool.query(`
			SELECT DISTINCT
				l.*,
				l.district as mapped_district,
				COUNT(DISTINCT b.id) as business_count,
				STRING_AGG(DISTINCT b.businessname, ', ') as available_businesses,
				'non-exclusive' as lead_type
			FROM leaddata l
			LEFT JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			INNER JOIN businesses_1 b ON (l.district = b.district) AND b.isvisible = true
			WHERE l.isvisible = true
			AND (l.urlparams NOT LIKE '/solar-panel-installer/%'
				 OR l.urlparams LIKE '/solar-panel-installer-directory/%'
				 OR l.urlparams IS NULL)
			AND (l.category IS NULL OR l.category != 2)
			GROUP BY l.id, l.name, l.phone, l.pin_code, l.type, l.comment, l.created_at,
					 l.svnotes, l.sv_comment_for_businesses, l.urlparams, l.isvisible, l.email, l.category, l.district,
					 l.stage, l.status, l.claim_count, l.original_id, l.business_id, l.email_invite_count, pm.district
			HAVING COUNT(DISTINCT b.id) > 0
			ORDER BY l.id DESC
		`);

		// Get business details for non-exclusive leads with lead counts
		const nonExclusiveBusinessesQuery = await pool.query(`
			SELECT DISTINCT
				l.id as lead_id,
				b.id,
				b.businessname,
				b.slug,
				b.magic_link_token,
				b.district,
				b.state,
				b.notes,
				-- Non-exclusive available: category=1 leads in same district, not already claimed by this business, and claim_count <= 4
				COUNT(DISTINCT CASE
					WHEN l_count.isvisible = true AND l_count.category = 1 AND l_count.district = b.district
					AND COALESCE(l_count.claim_count, 0) <= 4
					AND l_count.id NOT IN (
						SELECT DISTINCT original_id
						FROM leaddata l2
						WHERE l2.category = 2 AND l2.business_id = b.id AND l2.original_id IS NOT NULL
					)
					THEN l_count.id END
				) as non_exclusive_available_count,
				-- Non-exclusive claimed: category=2 leads claimed by this business
				COUNT(DISTINCT CASE
					WHEN l_count.isvisible = true AND l_count.category = 2 AND l_count.business_id = b.id
					THEN l_count.id END
				) as claimed_leads_count
			FROM leaddata l
			LEFT JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			INNER JOIN businesses_1 b ON (l.district = b.district) AND b.isvisible = true
			LEFT JOIN leaddata l_count ON (
				(l_count.isvisible = true AND l_count.category = 1 AND l_count.district = b.district) OR
				(l_count.isvisible = true AND l_count.category = 2 AND l_count.business_id = b.id)
			)
			WHERE l.isvisible = true
			AND (l.urlparams NOT LIKE '/solar-panel-installer/%'
				 OR l.urlparams LIKE '/solar-panel-installer-directory/%'
				 OR l.urlparams IS NULL)
			AND (l.category IS NULL OR l.category != 2)
			GROUP BY l.id, b.id, b.businessname, b.slug, b.magic_link_token, b.district, b.state, b.notes
			ORDER BY l.id DESC, b.businessname ASC
		`);

		// Get claimed duplicates (category = 2) with business information and lead counts
		const claimedDuplicatesQuery = await pool.query(`
			SELECT
				l.*,
				pm.district as mapped_district,
				b.businessname as assigned_business_name,
				b.id as assigned_business_id,
				b.phonenumber as business_phonenumber,
				b.slug as business_slug,
				b.magic_link_token as business_magic_link_token,
				b.district as business_district,
				b.state as business_state,
				b.notes as business_notes,
				lcr.created_at as claim_created_at,
				lcr.isallotted,
				lcr.isresolved,
				-- Calculate lead counts for this business
				(SELECT COUNT(DISTINCT l_count.id)
				 FROM leaddata l_count
				 WHERE l_count.isvisible = true
				 AND l_count.category = 1
				 AND l_count.district = b.district
				 AND COALESCE(l_count.claim_count, 0) <= 4
				 AND l_count.id NOT IN (
					 SELECT DISTINCT original_id
					 FROM leaddata l2
					 WHERE l2.category = 2 AND l2.business_id = b.id AND l2.original_id IS NOT NULL
				 )
				) as business_non_exclusive_available_count,
				(SELECT COUNT(DISTINCT l_count.id)
				 FROM leaddata l_count
				 WHERE l_count.isvisible = true
				 AND l_count.category = 2
				 AND l_count.business_id = b.id
				) as business_claimed_leads_count
			FROM leaddata l
			LEFT JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			LEFT JOIN businesses_1 b ON l.business_id = b.id
			LEFT JOIN leaddata_claimrequests lcr ON l.id = lcr.claim_id
			WHERE l.isvisible = true
			AND l.category = 2
			AND l.business_id IS NOT NULL
			ORDER BY l.id DESC
		`);

		// Group claimed duplicates by their original lead (matching by phone, name, pin_code)
		const claimedDuplicatesMap = new Map();
		claimedDuplicatesQuery.rows.forEach(claimedLead => {
			const key = `${claimedLead.name}-${claimedLead.phone}-${claimedLead.pin_code}`;
			if (!claimedDuplicatesMap.has(key)) {
				claimedDuplicatesMap.set(key, []);
			}
			claimedDuplicatesMap.get(key).push(claimedLead);
		});

		// Create business details maps
		const exclusiveBusinessesMap = new Map();
		exclusiveBusinessesQuery.rows.forEach(business => {
			if (!exclusiveBusinessesMap.has(business.lead_id)) {
				exclusiveBusinessesMap.set(business.lead_id, []);
			}
			exclusiveBusinessesMap.get(business.lead_id).push({
				id: business.id,
				businessname: business.businessname,
				slug: business.slug,
				magic_link_token: business.magic_link_token,
				district: business.district,
				state: business.state,
				notes: business.notes,
				non_exclusive_available_count: parseInt(business.non_exclusive_available_count) || 0,
				claimed_leads_count: parseInt(business.claimed_leads_count) || 0
			});
		});

		const nonExclusiveBusinessesMap = new Map();
		nonExclusiveBusinessesQuery.rows.forEach(business => {
			if (!nonExclusiveBusinessesMap.has(business.lead_id)) {
				nonExclusiveBusinessesMap.set(business.lead_id, []);
			}
			nonExclusiveBusinessesMap.get(business.lead_id).push({
				id: business.id,
				businessname: business.businessname,
				slug: business.slug,
				magic_link_token: business.magic_link_token,
				district: business.district,
				state: business.state,
				notes: business.notes,
				non_exclusive_available_count: parseInt(business.non_exclusive_available_count) || 0,
				claimed_leads_count: parseInt(business.claimed_leads_count) || 0
			});
		});

		// Combine all original leads (exclusive + non-exclusive)
		const allOriginalLeads = [...exclusiveLeadsQuery.rows, ...nonExclusiveLeadsQuery.rows];

		// Sort combined leads by ID descending
		allOriginalLeads.sort((a, b) => b.id - a.id);

		// Combine original leads with their claimed duplicates and business details
		const combinedLeads = await Promise.all(
			allOriginalLeads.map(async (originalLead) => {
				const key = `${originalLead.name}-${originalLead.phone}-${originalLead.pin_code}`;
				const claimedDuplicates = claimedDuplicatesMap.get(key) || [];

				// Get business details based on lead type
				let businessDetails = [];
				if (originalLead.lead_type === 'exclusive') {
					businessDetails = exclusiveBusinessesMap.get(originalLead.id) || [];
				} else {
					businessDetails = nonExclusiveBusinessesMap.get(originalLead.id) || [];
				}

				// Filter out branch offices if their main business is present
				businessDetails = await filterOutBranchOffices(businessDetails, pool);

				return {
					...originalLead,
					claimed_duplicates: claimedDuplicates,
					has_claims: claimedDuplicates.length > 0,
					total_claims: claimedDuplicates.length,
					business_details: businessDetails
				};
			})
		);

		if (combinedLeads.length > 0) {
			const totalClaimedDuplicates = combinedLeads.reduce((sum, lead) => sum + lead.total_claims, 0);
			const leadsWithClaims = combinedLeads.filter(lead => lead.has_claims).length;
			const leadsWithoutClaims = combinedLeads.filter(lead => !lead.has_claims).length;
			const exclusiveCount = combinedLeads.filter(lead => lead.lead_type === 'exclusive').length;
			const nonExclusiveCount = combinedLeads.filter(lead => lead.lead_type === 'non-exclusive').length;

			return { 
				eligibleLeads: combinedLeads,
				totalCount: combinedLeads.length,
				unclaimedCount: leadsWithoutClaims,
				claimedCount: leadsWithClaims,
				exclusiveCount: exclusiveCount,
				nonExclusiveCount: nonExclusiveCount,
				totalClaimedDuplicates: totalClaimedDuplicates
			};
		} else {
			return { 
				eligibleLeads: [],
				totalCount: 0,
				unclaimedCount: 0,
				claimedCount: 0,
				exclusiveCount: 0,
				nonExclusiveCount: 0,
				totalClaimedDuplicates: 0,
				message: 'No eligible leads found (no businesses present in lead areas)' 
			};
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { 
			errorMessage: 'Failed to load eligible leads data',
			eligibleLeads: [],
			totalCount: 0
		};
	}
}