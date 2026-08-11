// src/routes/api/addBranch/+server.ts
import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';
import type { AddBranchRequest } from '$lib/types/business';

// Function to generate branch slug using main business slug
function generateBranchSlug(mainBusinessSlug: string): string {
	// Add random string (8 characters) at the end
	const randomString = randomBytes(4).toString('hex');
	return `${mainBusinessSlug}-branch-${randomString}`;
}

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		// Nothing written below is country-scoped any more — 079 moved country onto
		// the account the branch inherits — so this is now purely the check that
		// the acting business exists and is visible. It stays for that: a session
		// whose business has since been hidden should not be able to add branches.
		const country = await countryForSlug(sessionResult.session.businessSlug);
		if (!country) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const data = (await request.json()) as AddBranchRequest;
		const {
			businessId, // ID of the main business
			state,
			district,
			city
		} = data;

		// Verify the logged-in business is creating branch for themselves
		if (sessionResult.session.businessId !== businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only add branches to your own business' },
				{ status: 403 }
			);
		}

		// 1. Fetch the main business data. Since 062 it comes from both halves of
		// the split: the profile columns cloned onto the branch below, and the
		// credentials the branch shares with its parent.
		const [mainBusiness] = await db
			.select({
				slug: businessProfiles.slug,
				businessname: businessProfiles.businessname,
				city: businessProfiles.city,
				rscore: businessProfiles.rscore,
				isvisible: businessProfiles.isvisible,
				pluscode: businessProfiles.pluscode,
				phonenumber: businessProfiles.phonenumber,
				email: businessProfiles.email,
				website: businessProfiles.website,
				taxId: businessProfiles.taxId,
				tag: businessProfiles.tag,
				address: businessProfiles.address,
				services: businessProfiles.services,
				description: businessProfiles.description
			})
			.from(businessProfiles)
			// 079 took country_code off business_profiles, so the join is on the
			// account link alone. It loses nothing: business_id is globally unique
			// across both countries, which is what made the country half of this
			// condition redundant even before the column moved.
			.innerJoin(businessAccounts, eq(businessAccounts.sourceId, businessProfiles.accountBusinessId))
			.where(eq(businessProfiles.businessId, businessId))
			.limit(1);

		if (!mainBusiness) {
			return json(
				{ success: false, error: 'Main business not found' },
				{ status: 404 }
			);
		}

		// 2. Check if the business already has a presence in the specified city

		// 2.1 First, check if the main business is in the same city
		if (mainBusiness.city?.toLowerCase() === city.toLowerCase()) {
			return json(
				{ success: false, error: 'Your business already has its main office in this city' },
				{ status: 400 }
			);
		}

		// 2.2 Next, check if any existing branches are in the same city.
		//
		// Since 078 the branches of a business are the profiles that name it in
		// account_business_id, minus the business itself — the join to `branches`
		// this replaces is exactly that set. `isvisible` also stands in for the old
		// `branches.isactive`, which is why only one flag is tested now.
		//
		// `sql` escape hatch: case-insensitive city compare (LOWER() = LOWER()).
		const existingBranches = await db
			.select({ id: businessProfiles.businessId })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.accountBusinessId, businessId),
					ne(businessProfiles.businessId, businessId),
					sql`LOWER(${businessProfiles.city}) = LOWER(${city})`,
					eq(businessProfiles.isvisible, true)
				)
			);

		if (existingBranches.length > 0) {
			return json(
				{ success: false, error: 'Your business already has a branch office in this city' },
				{ status: 400 }
			);
		}

		// 3. If no presence in the city, create the branch. Since 062 that is a row
		// in each half of the split rather than one businesses_1 row: the profile
		// mints the id from the reassigned sequence, and the account carries the
		// credentials the branch shares with its parent.
		// Generate a unique slug for the branch using main business slug
		const branchSlug = generateBranchSlug(mainBusiness.slug ?? '');

		// Use the main business values but update level1, level2, city, and add branch notes
		const [insertedBranch] = await db
			.insert(businessProfiles)
			.values({
				// The countryCode that used to lead this list is gone with 079. The
				// branch's country is its account's, and accountBusinessId below is
				// what points at that account — so a US business's branch is US
				// because it shares the US account, not because a column repeats it.
				// That removes the failure the old comment here described, where a
				// missing countryCode silently wrote a US branch as IN.
				//
				// 075: the branch's account is the main's. This is the column that
				// says so, replacing the '-branch-' slug convention that admin-app
				// used to reverse with SPLIT_PART to find its way back here.
				accountBusinessId: businessId,
				rscore: mainBusiness.rscore,
				isvisible: mainBusiness.isvisible,
				pluscode: mainBusiness.pluscode,
				phonenumber: mainBusiness.phonenumber,
				email: mainBusiness.email,
				website: mainBusiness.website,
				taxId: mainBusiness.taxId,
				level1: state, // Use the provided state
				level2: district, // Use the provided district
				tag: mainBusiness.tag,
				slug: branchSlug, // Use the generated branch slug
				notes: `Branch office of ${mainBusiness.businessname}`, // Mark it as a branch
				city, // Use the provided city
				businessname: mainBusiness.businessname, // Same business name
				address: mainBusiness.address, // Same address
				services: mainBusiness.services, // Copy services array from main business
				description: mainBusiness.description || 'Solar panel installer'
			})
			.returning({ businessId: businessProfiles.businessId });

		const branchId = insertedBranch.businessId;

		// No account row for the branch. It logs in with the parent's credentials,
		// and since 075 it says so — accountBusinessId above points at the parent,
		// so every auth lookup reaches the parent's account directly. Copying the
		// parent's login_email and login_password into a second row is what this
		// replaces; that copy went stale whenever the parent changed its password,
		// and it is how the seeded plaintext password (074) spread.

		// No `branches` row either. 078 dropped that table: accountBusinessId above
		// already states the relationship it existed to record, and its `isactive`
		// is the branch profile's own `isvisible`, which is copied from the main a
		// few lines up. The insert that used to stand here was the second of two
		// writes that had to agree, and nothing enforced that they did.

		return json({
			success: true,
			message: 'Branch office added successfully',
			branch: {
				id: branchId,
				state,
				district,
				city
			}
		});
	} catch (error) {
		console.error('❌ Error adding branch office:', error);
		return json(
			{ success: false, error: 'Failed to add branch office' },
			{ status: 500 }
		);
	}
};
