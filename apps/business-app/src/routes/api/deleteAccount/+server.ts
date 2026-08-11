import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ cookies }) => {

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

		const businessId = sessionResult.session.businessId;

		// Soft-delete the account: hide every location the business has, and
		// disable re-login by clearing credentials.
		//
		// Still two writes, but they now answer two different questions rather than
		// the same one twice. business_accounts.is_active (077) gates the login;
		// business_profiles.isvisible decides whether a location is listed. Both
		// have to be written — clearing only the account leaves the listings up,
		// clearing only the profiles leaves a working login pointing at nothing.
		//
		// One statement covers the main and every branch: since 075 each of them
		// names this business in account_business_id, and since 078 that is the
		// only place the relationship is recorded. The three statements that used
		// to walk `branches` to reach the same rows are gone with the table.
		await db
			.update(businessProfiles)
			.set({ isvisible: false })
			.where(eq(businessProfiles.accountBusinessId, businessId));

		await db
			.update(businessAccounts)
			.set({ isActive: false, loginPassword: null, magicLinkToken: null })
			.where(
				and(
					eq(businessAccounts.sourceId, businessId),
					eq(businessAccounts.countryCode, country)
				)
			);

		// No sync loop here any more. Both halves are stores since 062/064, so the
		// two updates above are the entire soft-delete; the loop existed only to
		// drive sv_sync_business over the business and each of its branches, and
		// `hiddenBranches` existed only to feed it.

		// End the session
		SessionManager.clearSession(cookies);

		return json({ success: true, message: 'Account deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting account:', error);
		return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
	}
};
