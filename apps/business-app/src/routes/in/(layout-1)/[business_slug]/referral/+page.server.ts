import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, inReferrers } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
	slug: string;
}

interface Referrer {
	id: number;
	business_id: number;
	name: string;
	slug: string;
	phone?: string;
	email?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
}

interface PageData {
	business?: Business;
	referrers?: Referrer[];
	error?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const businessSlug = params.business_slug;

	try {
		// Get the parent layout data which contains authentication info
		const parentData = await parent();

		// Check if we have the session data
		if (!parentData.business_session) {
			throw error(403, 'Not authorized');
		}

		// First get the business information from slug
		const businessRows = await db
			.select({ id: businesses.sourceId, businessname: businesses.businessname, slug: businesses.slug })
			.from(businesses)
			.where(and(eq(businesses.countryCode, 'in'), eq(businesses.slug, businessSlug)));

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;

		// Get all referrers for this business from in_referrers table
		const referrerRows = await db
			.select({
				id: inReferrers.id,
				business_id: inReferrers.businessId,
				name: inReferrers.name,
				slug: inReferrers.slug,
				phone: inReferrers.phone,
				email: inReferrers.email,
				notes: inReferrers.notes,
				created_at: inReferrers.createdAt,
				updated_at: inReferrers.updatedAt
			})
			.from(inReferrers)
			.where(eq(inReferrers.businessId, business.id))
			.orderBy(desc(inReferrers.createdAt));

		const referrers = (referrerRows || []) as unknown as Referrer[];

		return {
			business,
			referrers
		};
	} catch (err) {
		// If table doesn't exist yet, return empty referrers with a warning
		if (err instanceof Error && err.message.includes('relation "in_referrers" does not exist')) {
			console.warn('Referrers table does not exist yet. Please run the SQL schema.');

			// Still try to get business info
			try {
				const fallbackRows = await db
					.select({ id: businesses.sourceId, businessname: businesses.businessname, slug: businesses.slug })
					.from(businesses)
					.where(and(eq(businesses.countryCode, 'in'), eq(businesses.slug, businessSlug)));

				return {
					business: (fallbackRows[0] as unknown as Business) || undefined,
					referrers: [],
					error: 'Referrers table not created. Please contact administrator.'
				};
			} catch (e) {
				console.error('❌ Error loading business:', e);
				throw error(500, 'Failed to load business information');
			}
		}

		// Re-throw SvelteKit errors
		if (err instanceof Error && (err as unknown as { status?: number }).status) {
			throw err;
		}

		console.error('❌ Error loading referrers:', err);
		throw error(500, 'Failed to load referrers');
	}
};
