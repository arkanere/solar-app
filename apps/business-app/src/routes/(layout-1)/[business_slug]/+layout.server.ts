import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { businesses, leads } from '@solar/db/schema';
import { and, count, eq, gt, inArray, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import type { SessionData } from '$lib/types/auth';
import { SessionManager } from '$lib/auth/business';
import { countryForSlug } from '$lib/server/resolveCountry';
import type { AuthCountry } from '$lib/auth/business/countryTables';
import { branchTable, projectTable } from '$lib/server/writeTargets';

interface BusinessRow {
	id: number | null;
	businessname: string | null;
	slug: string | null;
	email: string | null;
	description?: string | null;
	website?: string | null;
	google_maps_link?: string | null;
	brands?: number[] | null;
}

export interface ClaimGateStatus {
	totalClaimedLeads: number;
	staleLeadsCount: number;
	staleLeadsPercent: number;
	projectsCount: number;
	recentProjectExists: boolean;
	profileComplete: boolean;
	isBlocked: boolean;
	reasons: string[];
}

interface LayoutServerData {
	business_session?: SessionData;
	business?: BusinessRow;
	/**
	 * The business's country, resolved from its slug. Descendants need it for
	 * cross-app links into main-app, which still carries a `[country]` segment —
	 * see `$lib/mainAppUrls`.
	 */
	country?: AuthCountry;
	setupProgress?: {
		projectsCount: number;
		claimedLeadsCount: number;
	};
	claimGate?: ClaimGateStatus;
}

export const prerender = false;

export const load: LayoutServerLoad<LayoutServerData> = async ({ cookies, params, url }) => {
	const sessionData: SessionData | undefined =
		SessionManager.getSessionFromCookie(cookies) ?? undefined;
	const { business_slug } = params;

	// Check if the URL matches claim, login, reset-password, or magic-link routes
	const isClaimPage = url.pathname === `/${business_slug}/claim`;
	const isLoginPage = url.pathname === `/${business_slug}/login`;
	const isResetPasswordPage = url.pathname.startsWith(`/${business_slug}/reset-password`);
	const isMagicLinkPage = url.pathname.startsWith(`/${business_slug}/signin-link`);

	// If no session and not on an allowed page, redirect to login
	if (
		!sessionData &&
		!isLoginPage &&
		!isClaimPage &&
		!isResetPasswordPage &&
		!isMagicLinkPage
	) {
		throw redirect(302, '/login');
	}

	// Ensure user is redirected to the correct business if they change the URL
	// Skip this validation for magic link pages to avoid conflicts during login
	if (sessionData && !isMagicLinkPage) {
		try {
			// If session's businessSlug does not match the URL, redirect to the correct business
			if (sessionData.businessSlug !== business_slug) {
				throw redirect(302, `/${sessionData.businessSlug}`);
			}

			// The route no longer carries an /in or /us segment, so the country comes
			// from the business itself. The reads below are unified and filtered by
			// it. Since 054 branches/projects are single tables for every country —
			// they key off business ids, which are globally unique.
			const country = await countryForSlug(business_slug);
			if (!country) {
				throw error(404, 'Business not found');
			}
			const branches = branchTable;
			const projects = projectTable;

			// Load basic business info for sidebar.
			//
			// Resolved by the session's businessId, never by the slug in the URL.
			// `businesses.slug` is not unique and cannot be made unique — see
			// next-steps.md item 1 — so a slug lookup returns an arbitrary row from
			// a duplicate group, and every count below would then be computed for
			// another company. The id came from the account's login email at login,
			// which is the only identifier here that is actually unique.
			try {
				const businessRows = await db
					.select({
						id: businesses.sourceId,
						businessname: businesses.businessname,
						slug: businesses.slug,
						email: businesses.email,
						description: businesses.description,
						website: businesses.website,
						google_maps_link: businesses.googleMapsLink,
						brands: businesses.brands
					})
					.from(businesses)
					.where(
						and(
							eq(businesses.countryCode, country),
							eq(businesses.sourceId, sessionData.businessId)
						)
					)
					.limit(1);

				if (businessRows.length > 0) {
					const business: BusinessRow = businessRows[0];
					const businessId = business.id as number;

					// Get all branch IDs so lead counts include branch-assigned leads
					const branchRows = await db
						.select({ branch_id: branches.branchId })
						.from(branches)
						.where(and(eq(branches.mainId, businessId), eq(branches.isactive, true)));
					const allBusinessIds = [businessId, ...branchRows.map((r) => r.branch_id)];

					const claimedLeadWhere = and(
						eq(leads.countryCode, country),
						inArray(leads.businessId, allBusinessIds),
						eq(leads.category, 2),
						eq(leads.isvisible, true)
					);

					const [claimedRes, staleRes, projectsRes, recentProjectRes] = await Promise.all([
						db.select({ count: count() }).from(leads).where(claimedLeadWhere),
						db
							.select({ count: count() })
							.from(leads)
							.where(and(claimedLeadWhere, eq(leads.stage, 0), eq(leads.status, true))),
						db
							.select({ count: count() })
							.from(projects)
							.where(and(eq(projects.businessSlug, business_slug), eq(projects.isvisible, true))),
						db
							.select({ count: count() })
							.from(projects)
							.where(
								and(
									eq(projects.businessSlug, business_slug),
									eq(projects.isvisible, true),
									gt(projects.createdAt, sql`NOW() - INTERVAL '60 days'`)
								)
							)
					]);

					const totalClaimed = claimedRes[0]?.count ?? 0;
					const staleClaimed = staleRes[0]?.count ?? 0;
					const projectsCount = projectsRes[0]?.count ?? 0;
					const recentProjectExists = (recentProjectRes[0]?.count ?? 0) > 0;
					const stalePercent = totalClaimed > 0 ? Math.round((staleClaimed / totalClaimed) * 100) : 0;
					const profileComplete = !!business.description
						&& Array.isArray(business.brands) && business.brands.length > 0
						&& !!business.google_maps_link;

					const gateApplies = totalClaimed >= 10;
					const reasons: string[] = [];

					if (gateApplies) {
						if (stalePercent > 50) reasons.push(`${staleClaimed} of ${totalClaimed} leads still at "Claimed" — update at least half to keep claiming`);
						if (projectsCount < 6) reasons.push(`${projectsCount}/6 projects posted — add ${6 - projectsCount} more`);
						if (!recentProjectExists) reasons.push('No project posted in the last 60 days');
						if (!profileComplete) {
							const missing: string[] = [];
							if (!business.description) missing.push('description');
							if (!Array.isArray(business.brands) || business.brands.length === 0) missing.push('brands');
							if (!business.google_maps_link) missing.push('Google Maps link');
							reasons.push(`Complete your profile: add ${missing.join(', ')}`);
						}
					}

					return {
						business_session: sessionData,
						business,
						country,
						setupProgress: {
							projectsCount,
							claimedLeadsCount: totalClaimed
						},
						claimGate: {
							totalClaimedLeads: totalClaimed,
							staleLeadsCount: staleClaimed,
							staleLeadsPercent: stalePercent,
							projectsCount,
							recentProjectExists,
							profileComplete,
							isBlocked: gateApplies && reasons.length > 0,
							reasons
						}
					};
				}
			} catch (dbError) {
				console.error('❌ Database error loading business:', dbError);
			}

			return { business_session: sessionData };
		} catch (error) {
			// If it's a redirect, let it through (don't treat it as an error)
			if (error instanceof Error && ('status' in error || 'location' in error)) {
				throw error;
			}
			console.error('❌ Invalid session data:', error);
			cookies.delete('business-session', { path: '/' });
			throw redirect(302, '/login');
		}
	}

	return { business_session: sessionData };
};
