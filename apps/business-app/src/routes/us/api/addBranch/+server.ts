// src/routes/api/addBranch/+server.ts
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { BusinessAuthService } from '$lib/us/auth/business/index.ts';
import type { RequestHandler } from './$types';
import type { AddBranchRequest } from '$lib/types/business';
import type { BranchApiResponse } from '$lib/types/api';

// Function to generate branch slug using main business slug
function generateBranchSlug(mainBusinessSlug: string): string {
	// Add random string (8 characters) at the end
	const randomString = randomBytes(4).toString('hex');
	return `${mainBusinessSlug}-branch-${randomString}`;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json<BranchApiResponse>(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const data = (await request.json()) as AddBranchRequest;
		const {
			businessId, // ID of the main business
			state,
			county,
			city
		} = data;

		// Verify the logged-in business is creating branch for themselves
		if (sessionResult.session.businessId !== businessId) {
			return json<BranchApiResponse>(
				{ success: false, error: 'Forbidden - You can only add branches to your own business' },
				{ status: 403 }
			);
		}

		// 1. Fetch the main business data
		const fetchBusinessQuery = `
      SELECT * FROM us_businesses WHERE id = $1
    `;
		const businessResult = await pool.query(fetchBusinessQuery, [businessId]);

		if (businessResult.rows.length === 0) {
			return json<BranchApiResponse>(
				{ success: false, error: 'Main business not found' },
				{ status: 404 }
			);
		}

		const mainBusiness = businessResult.rows[0];

		// 2. Check if the business already has a presence in the specified city

		// 2.1 First, check if the main business is in the same city
		if (mainBusiness.city.toLowerCase() === city.toLowerCase()) {
			return json<BranchApiResponse>(
				{ success: false, error: 'Your business already has its main office in this city' },
				{ status: 400 }
			);
		}

		// 2.2 Next, check if any existing branches are in the same city
		const checkBranchesQuery = `
      SELECT b.id
      FROM us_businesses b
      JOIN us_branches br ON b.id = br.branch_id
      WHERE br.main_id = $1
      AND LOWER(b.city) = LOWER($2)
      AND b.isvisible = TRUE
    `;

		const branchesResult = await pool.query(checkBranchesQuery, [businessId, city]);

		if (branchesResult.rows.length > 0) {
			return json<BranchApiResponse>(
				{ success: false, error: 'Your business already has a branch office in this city' },
				{ status: 400 }
			);
		}

		// 3. If no presence in the city, create a new branch entry in us_businesses
		// Generate a unique slug for the branch using main business slug
		const branchSlug = generateBranchSlug(mainBusiness.slug);

		const insertBranchQuery = `
      INSERT INTO us_businesses (
        rscore, isvisible, pluscode, phonenumber, email, login_email,
        website, ein, state, county, tag, slug, notes, city,
        businessname, address, login_password, tier3, services, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING id
    `;

		// Use the main business values but update state, district, city, and add branch notes
		const branchResult = await pool.query(insertBranchQuery, [
			mainBusiness.rscore,
			mainBusiness.isvisible,
			mainBusiness.pluscode,
			mainBusiness.phonenumber,
			mainBusiness.email,
			mainBusiness.login_email,
			mainBusiness.website,
			mainBusiness.ein,
			state, // Use the provided state
			county, // Use the provided county
			mainBusiness.tag,
			branchSlug, // Use the generated branch slug
			`Branch office of ${mainBusiness.businessname}`, // Set notes to indicate it's a branch
			city, // Use the provided city
			mainBusiness.businessname, // Same business name
			mainBusiness.address, // Same address
			mainBusiness.login_password, // Same login password
			mainBusiness.tier3, // Copy tier3 status from main business
			mainBusiness.services, // Copy services array from main business
			mainBusiness.description || 'Solar panel installer' // Copy description or use default
		]);

		const branchId = branchResult.rows[0].id as number;

		// 4. Create an entry in the us_branches table to establish the relationship
		const insertBranchRelationQuery = `
      INSERT INTO us_branches (
        main_id, branch_id, isactive
      )
      VALUES ($1, $2, $3)
      RETURNING id
    `;

		await pool.query(insertBranchRelationQuery, [
			businessId, // Main business ID
			branchId, // Branch business ID
			true // Set as active by default
		]);

		return json<BranchApiResponse>({
			success: true,
			message: 'Branch office added successfully',
			branch: {
				id: branchId,
				state,
				county,
				city
			}
		});
	} catch (error) {
		console.error('❌ Error adding branch office:', error);
		return json<BranchApiResponse>(
			{ success: false, error: 'Failed to add branch office' },
			{ status: 500 }
		);
	} finally {
		// Release the pool connection
		await pool.end();
	}
};
