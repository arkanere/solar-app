import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, leads, projectManagement } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error, isHttpError } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
}

interface ProjectManagement {
	id: number;
	lead_id: number;
	stage: string;
	created_at: string;
	last_updated: string;
	customer_name: string;
	email?: string;
	phone?: string;
	district?: string;
	pin_code?: string;
}

interface PageData {
	business?: Business;
	business_id?: number;
	projects?: ProjectManagement[];
}

// Nothing here reads the slug any more — the business comes from the session's
// businessId, and the pipeline rows are keyed by that id.
export const load: PageServerLoad<PageData> = async ({ parent }) => {
	// The country comes from the layout, which resolved it from the slug. Both
	// reads below used to filter on a literal 'in', so a US business's project
	// pipeline 404'd. Not defaulted to 'in' when absent: the layout omits it only
	// on its DB-error fallback, and guessing there would show a US business an
	// India-shaped pipeline.
	//
	// Hoisted above the try because the catch below turns everything it sees into
	// a 500, this 404 included.
	const { business_session, country } = await parent();
	if (!country || !business_session) {
		throw error(404, 'Business not found');
	}

	try {
		// The business comes from the session's businessId, not from the slug:
		// slugs are not unique (next-steps.md item 1), and businessId keys every
		// project read below.
		const businessRows = await db
			.select({ id: businessProfiles.businessId, businessname: businessProfiles.businessname })
			.from(businessProfiles)
			.where(
				and(eq(businessProfiles.countryCode, country), eq(businessProfiles.businessId, business_session.businessId))
			);

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;
		const businessId = business.id;

		// Get all projects for this business with lead information
		const projectRows = await db
			.select({
				id: projectManagement.id,
				lead_id: projectManagement.leadId,
				stage: projectManagement.stage,
				created_at: projectManagement.createdAt,
				last_updated: projectManagement.lastUpdated,
				customer_name: leads.name,
				email: leads.email,
				phone: leads.phone,
				district: leads.level2,
				pin_code: leads.postalCode
			})
			.from(projectManagement)
			.innerJoin(
				leads,
				and(eq(leads.countryCode, country), eq(projectManagement.leadId, leads.sourceId))
			)
			.where(eq(leads.businessId, businessId))
			.orderBy(desc(projectManagement.lastUpdated));

		const projects = projectRows as unknown as ProjectManagement[];

		return {
			business,
			business_id: businessId,
			projects
		};
	} catch (err) {
		// The 404 above is thrown from inside this try, so without the rethrow the
		// catch reported a missing business as a server error. Only genuine
		// failures below become a 500.
		if (isHttpError(err)) throw err;
		console.error('❌ Error loading projects:', err);
		throw error(500, 'Failed to load projects');
	}
};
