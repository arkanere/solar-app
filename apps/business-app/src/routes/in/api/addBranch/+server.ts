// src/routes/api/addBranch/+server.ts
import { pool, db } from '$lib/server/db';
import { branches, businesses1, inBusinessProfiles } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { BusinessAuthService } from '$lib/in/auth/business';
import { syncBusinessToUnified, syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';
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
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
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

		// 1. Fetch the main business data
		const [mainBusiness] = await db
			.select()
			.from(businesses1)
			.where(eq(businesses1.id, businessId))
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
			.select({ id: inBusinessProfiles.businessId })
			.from(inBusinessProfiles)
			.innerJoin(branches, eq(inBusinessProfiles.businessId, branches.branchId))
			.where(
				and(
					eq(branches.mainId, businessId),
					sql`LOWER(${inBusinessProfiles.city}) = LOWER(${city})`,
					eq(inBusinessProfiles.isvisible, true)
				)
			);

		if (existingBranches.length > 0) {
			return json(
				{ success: false, error: 'Your business already has a branch office in this city' },
				{ status: 400 }
			);
		}

		// 3. If no presence in the city, create a new branch entry in businesses_1
		// Generate a unique slug for the branch using main business slug
		const branchSlug = generateBranchSlug(mainBusiness.slug ?? '');

		// Use the main business values but update state, district, city, and add branch notes
		const [insertedBranch] = await db
			.insert(businesses1)
			.values({
				rscore: mainBusiness.rscore,
				isvisible: mainBusiness.isvisible,
				pluscode: mainBusiness.pluscode,
				phonenumber: mainBusiness.phonenumber,
				email: mainBusiness.email,
				loginEmail: mainBusiness.loginEmail,
				website: mainBusiness.website,
				gstn: mainBusiness.gstn,
				state, // Use the provided state
				district, // Use the provided district
				tag: mainBusiness.tag,
				slug: branchSlug, // Use the generated branch slug
				notes: `Branch office of ${mainBusiness.businessname}`, // Mark it as a branch
				city, // Use the provided city
				businessname: mainBusiness.businessname, // Same business name
				address: mainBusiness.address, // Same address
				loginPassword: mainBusiness.loginPassword, // Same login password
				services: mainBusiness.services, // Copy services array from main business
				description: mainBusiness.description || 'Solar panel installer'
			})
			.returning({ id: businesses1.id });

		const branchId = insertedBranch.id;

		// 4. Create an entry in the branches table to establish the relationship
		await db.insert(branches).values({
			mainId: businessId, // Main business ID
			branchId, // Branch business ID
			isactive: true // Set as active by default
		});

		await syncInSplitTables(pool, branchId);
		await syncBusinessToUnified(pool, 'in', branchId);
		await syncAccountToUnified(pool, 'in', branchId);

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
