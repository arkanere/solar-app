import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, svReferrers } from '@solar/db/schema';
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

	// Get the parent layout data which contains authentication info. Hoisted out
	// of the try because the `sv_referrers` fallback in the catch needs `country`
	// too; parent()'s own redirect/403 still propagates, as the catch re-throws
	// anything carrying a status.
	const parentData = await parent();

	// Check if we have the session data
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	// Resolved by the layout from the slug, not hardcoded: this read used to
	// filter on a literal 'in', so a US business 404'd on its own referral page.
	// Absent only on the layout's DB-error fallback, and a fallback to 'in' would
	// be a wrong answer rather than no answer.
	//
	// The referrer read below is country-agnostic (057 renamed in_referrers ->
	// sv_referrers): it filters on business_id alone, which is globally unique
	// across businesses_1 since 054, so a business of either country sees its own
	// referrers and there is no cross-country collision. `country` is still
	// needed here — it scopes the *business* lookup, which is keyed by
	// (country_code, slug) and where duplicate slugs are a live problem.
	const { country } = parentData;
	if (!country) {
		throw error(404, 'Business not found');
	}

	try {
		// First get the business information from slug
		const businessRows = await db
			.select({ id: businesses.sourceId, businessname: businesses.businessname, slug: businesses.slug })
			.from(businesses)
			.where(and(eq(businesses.countryCode, country), eq(businesses.slug, businessSlug)));

		if (businessRows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessRows[0] as unknown as Business;

		// Get all referrers for this business from the sv_referrers table
		const referrerRows = await db
			.select({
				id: svReferrers.id,
				business_id: svReferrers.businessId,
				name: svReferrers.name,
				slug: svReferrers.slug,
				phone: svReferrers.phone,
				email: svReferrers.email,
				notes: svReferrers.notes,
				created_at: svReferrers.createdAt,
				updated_at: svReferrers.updatedAt
			})
			.from(svReferrers)
			.where(eq(svReferrers.businessId, business.id))
			.orderBy(desc(svReferrers.createdAt));

		const referrers = (referrerRows || []) as unknown as Referrer[];

		return {
			business,
			referrers
		};
	} catch (err) {
		// If table doesn't exist yet, return empty referrers with a warning
		if (err instanceof Error && err.message.includes('relation "sv_referrers" does not exist')) {
			console.warn('Referrers table does not exist yet. Please run the SQL schema.');

			// Still try to get business info
			try {
				const fallbackRows = await db
					.select({ id: businesses.sourceId, businessname: businesses.businessname, slug: businesses.slug })
					.from(businesses)
					.where(and(eq(businesses.countryCode, country), eq(businesses.slug, businessSlug)));

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
