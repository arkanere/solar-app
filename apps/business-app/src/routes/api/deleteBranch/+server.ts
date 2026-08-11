import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { branches, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
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

		// Verify this branch belongs to the logged-in business
		const existingBranch = await db
			.select({ id: branches.id, mainId: branches.mainId, branchId: branches.branchId })
			.from(branches)
			.where(
				and(
					eq(branches.branchId, branchId),
					eq(branches.mainId, sessionResult.session.businessId),
					eq(branches.isactive, true)
				)
			);

		if (existingBranch.length === 0) {
			return json(
				{ success: false, error: 'Branch not found or not authorized' },
				{ status: 403 }
			);
		}

		// Soft-delete: deactivate the branch relationship and hide from listings
		await db
			.update(branches)
			.set({ isactive: false })
			.where(
				and(
					eq(branches.branchId, branchId),
					eq(branches.mainId, sessionResult.session.businessId)
				)
			);

		// `isvisible` is carried by both halves of the split since 062 — profiles
		// feeds the public listing, accounts gates the auth layer — so hiding a
		// branch means writing both. Credentials are left alone: a branch shares
		// the main business's login, and clearing them here would lock the parent
		// out (which is why deleteAccount clears them and this does not).
		await db
			.update(businessProfiles)
			.set({ isvisible: false })
			.where(eq(businessProfiles.businessId, branchId));

		// The account write that used to stand here is gone, and must not come
		// back. It hid the branch's *own* account row, which existed only as a copy
		// of the parent's; since 075 the branch shares the parent's row outright, so
		// the same statement would now deactivate the parent's login — the exact
		// lockout the comment above says this endpoint exists to avoid.
		//
		// Branch visibility is therefore business_profiles.isvisible alone, which is
		// why the two slug lookups in TokenManager test the profile's flag as well
		// as the account's: without that, hiding a branch would stop listing it but
		// still let someone sign in at its slug.


		return json({ success: true, message: 'Branch deleted successfully' });
	} catch (error) {
		console.error('Error deleting branch:', error);
		return json(
			{ success: false, error: 'Failed to delete branch' },
			{ status: 500 }
		);
	}
};
