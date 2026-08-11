import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles, leaddata } from '@solar/db/schema';
import { and, count, eq, gt, inArray, ne, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import type { SessionData } from '$lib/types/auth';
import { SessionManager } from '$lib/auth/business';
import { countryForSlug } from '$lib/server/resolveCountry';
import type { AuthCountry } from '$lib/auth/business/countryTables';
import { accountOfProfile, businessInCountry, projectTable } from '$lib/server/writeTargets';

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
			// from the business itself. The leaddata reads below are filtered by it;
			// the profile reads are not, because business ids are globally unique.
			// Since 054 projects has been a single table for every country for the
			// same reason (branches was too, until 078 dropped it).
			const country = await countryForSlug(business_slug);
			if (!country) {
				throw error(404, 'Business not found');
			}
			const projects = projectTable;

			// Load basic business info for sidebar.
			//
			// Resolved by the session's businessId, never by the slug in the URL.
			// `businessProfiles.slug` is not unique and cannot be made unique — see
			// next-steps.md item 1 — so a slug lookup returns an arbitrary row from
			// a duplicate group, and every count below would then be computed for
			// another company. The id came from the account's login email at login,
			// which is the only identifier here that is actually unique.
			try {
				const businessRows = await db
					.select({
						id: businessProfiles.businessId,
						businessname: businessProfiles.businessname,
						slug: businessProfiles.slug,
						email: businessProfiles.email,
						description: businessProfiles.description,
						website: businessProfiles.website,
						google_maps_link: businessProfiles.googleMapsLink,
						brands: businessProfiles.brands
					})
					.from(businessProfiles)
					// The country predicate is NOT redundant beside the id — see
					// businessInCountry's doc comment in $lib/server/writeTargets.
					.innerJoin(businessAccounts, accountOfProfile)
					.where(
						and(businessInCountry(country), eq(businessProfiles.businessId, sessionData.businessId))
					)
					.limit(1);

				if (businessRows.length > 0) {
					const business: BusinessRow = businessRows[0];
					const businessId = business.id as number;

					// Get all branch IDs so lead counts include branch-assigned leads.
					// Since 078 the branches are the profiles naming this business in
					// account_business_id, minus the business itself, and the old
					// branches.isactive is each branch profile's own isvisible.
					const branchRows = await db
						.select({ branch_id: businessProfiles.businessId })
						.from(businessProfiles)
						.where(
							and(
								eq(businessProfiles.accountBusinessId, businessId),
								ne(businessProfiles.businessId, businessId),
								eq(businessProfiles.isvisible, true)
							)
						);
					const allBusinessIds = [businessId, ...branchRows.map((r) => r.branch_id)];

					const claimedLeadWhere = and(
						eq(leaddata.countryCode, country),
						inArray(leaddata.businessId, allBusinessIds),
						eq(leaddata.category, 2),
						eq(leaddata.isvisible, true)
					);

					const [claimedRes, staleRes, projectsRes, recentProjectRes] = await Promise.all([
						db.select({ count: count() }).from(leaddata).where(claimedLeadWhere),
						db
							.select({ count: count() })
							.from(leaddata)
							.where(and(claimedLeadWhere, eq(leaddata.stage, 0), eq(leaddata.status, true))),
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
