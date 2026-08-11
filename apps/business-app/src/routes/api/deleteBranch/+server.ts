import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { businessProfiles } from '@solar/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
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

		const { branchId } = await request.json();

		if (!branchId) {
			return json(
				{ success: false, error: 'Branch ID is required' },
				{ status: 400 }
			);
		}

		// Verify this branch belongs to the logged-in business.
		//
		// Since 078 that is a property of the branch's own profile rather than a
		// row in `branches`: it names the session's business in
		// `account_business_id`, and `isvisible` carries what `isactive` used to.
		// The `ne` is what `branches` used to give for free — a main names itself,
		// so without it a business could pass its own id here and delete itself
		// through the branch endpoint.
		const existingBranch = await db
			.select({ businessId: businessProfiles.businessId })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.businessId, branchId),
					eq(businessProfiles.accountBusinessId, sessionResult.session.businessId),
					ne(businessProfiles.businessId, sessionResult.session.businessId),
					eq(businessProfiles.isvisible, true)
				)
			);

		if (existingBranch.length === 0) {
			return json(
				{ success: false, error: 'Branch not found or not authorized' },
				{ status: 403 }
			);
		}

		// Soft-delete: hide the location. This is now the whole operation — 078
		// folded branches.isactive into this column, because the two were always
		// written together and a branch has no other state to carry.
		//
		// Credentials are still left alone, and the reason is unchanged: a branch
		// shares the main business's account row outright (076), so touching it
		// here would lock the parent out. That is why deleteAccount clears
		// credentials and this does not, and why TokenManager's slug lookups test
		// the profile's isvisible as well as the account's is_active — without
		// that, hiding a branch would stop listing it but still let someone sign in
		// at its slug.
		await db
			.update(businessProfiles)
			.set({ isvisible: false })
			.where(eq(businessProfiles.businessId, branchId));

		return json({ success: true, message: 'Branch deleted successfully' });
	} catch (error) {
		console.error('Error deleting branch:', error);
		return json(
			{ success: false, error: 'Failed to delete branch' },
			{ status: 500 }
		);
	}
};
