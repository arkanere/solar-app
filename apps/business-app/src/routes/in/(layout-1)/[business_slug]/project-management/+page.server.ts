import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, leads, projectManagement } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

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

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessRows = await db
			.select({ id: businesses.sourceId, businessname: businesses.businessname })
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'in'), eq(businesses.slug, businessSlug)));

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
				and(eq(leads.countryCode, 'in'), eq(projectManagement.leadId, leads.sourceId))
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
		console.error('❌ Error loading projects:', err);
		throw error(500, 'Failed to load projects');
	}
};
