// src/routes/api/addBranch/+server.ts
import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { branches, businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
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

		// URLs no longer carry the country, so it comes from the acting
		// business. Writes below target that country's legacy tables.
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
				description: businessProfiles.description,
				loginEmail: businessAccounts.loginEmail,
				loginPassword: businessAccounts.loginPassword
			})
			.from(businessProfiles)
			.innerJoin(
				businessAccounts,
				and(
					eq(businessAccounts.countryCode, businessProfiles.countryCode),
					eq(businessAccounts.sourceId, businessProfiles.businessId)
				)
			)
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

		// 2.2 Next, check if any existing branches are in the same city
		// `sql` escape hatch: case-insensitive city compare (LOWER() = LOWER()).
		const existingBranches = await db
			.select({ id: businessProfiles.businessId })
			.from(businessProfiles)
			.innerJoin(branches, eq(businessProfiles.businessId, branches.branchId))
			.where(
				and(
					eq(branches.mainId, businessId),
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
				// business_profiles holds both countries and country_code defaults
				// to 'in'. Without this a US business's branch was written IN-tagged,
				// so the sv_sync_business('us', ...) below matched nothing and
				// returned silently — success reported, branch never projected.
				countryCode: country,
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

		// The branch logs in with the parent's credentials, which is why the
		// select above joins them out of the parent's account row rather than
		// minting new ones.
		await db.insert(businessAccounts).values({
			countryCode: country,
			sourceId: branchId,
			loginEmail: mainBusiness.loginEmail,
			loginPassword: mainBusiness.loginPassword,
			isvisible: mainBusiness.isvisible
		});

		// 4. Create an entry in the branches table to establish the relationship
		await db.insert(branches).values({
			mainId: businessId, // Main business ID
			branchId, // Branch business ID
			isactive: true // Set as active by default
		});


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
