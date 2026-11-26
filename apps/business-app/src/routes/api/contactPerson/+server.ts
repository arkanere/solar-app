import { db } from '$lib/server/db';
import { businessContactPersons } from '@solar/db/schema';
import { sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { contactPersonSchema, parseBody } from '@solar/validation';
import { SessionManager } from '$lib/auth/business';
import { accountIdOf } from '$lib/server/contactPerson';
import type { RequestHandler } from './$types';

/**
 * Save the account's contact person (insert or replace the one row).
 * The account comes from the session, never from the body.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const sessionResult = SessionManager.validateSession(cookies);
		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const parsed = await parseBody(request, contactPersonSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const { full_name, role, description } = parsed.data;

		const accountId = await accountIdOf(sessionResult.session.businessId);

		await db
			.insert(businessContactPersons)
			.values({ accountBusinessId: accountId, fullName: full_name, role, description })
			.onConflictDoUpdate({
				target: businessContactPersons.accountBusinessId,
				set: { fullName: full_name, role, description, updatedAt: sql`now()` }
			});

		return json({ success: true });
	} catch (error) {
		console.error('Error saving contact person:', error);
		return json({ success: false, error: 'Could not save contact person' }, { status: 500 });
	}
};
