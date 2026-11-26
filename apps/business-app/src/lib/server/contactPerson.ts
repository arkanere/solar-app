import { db } from '$lib/server/db';
import { businessContactPersons, businessProfiles } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

export type ContactPersonRole = 'proprietor' | 'employee' | 'third_party';

export interface ContactPerson {
	full_name: string;
	role: ContactPersonRole;
	description: string | null;
}

/**
 * The account a profile belongs to. Branches name their main in
 * account_business_id, so a branch and its main share one contact person.
 */
export async function accountIdOf(businessId: number): Promise<number> {
	const [row] = await db
		.select({ accountId: businessProfiles.accountBusinessId })
		.from(businessProfiles)
		.where(eq(businessProfiles.businessId, businessId))
		.limit(1);
	return row?.accountId ?? businessId;
}

/** The account's contact person, or null if it has not added one yet. */
export async function getContactPerson(businessId: number): Promise<ContactPerson | null> {
	const accountId = await accountIdOf(businessId);
	const [row] = await db
		.select({
			full_name: businessContactPersons.fullName,
			role: businessContactPersons.role,
			description: businessContactPersons.description
		})
		.from(businessContactPersons)
		.where(eq(businessContactPersons.accountBusinessId, accountId))
		.limit(1);
	return row ? { ...row, role: row.role as ContactPersonRole } : null;
}
