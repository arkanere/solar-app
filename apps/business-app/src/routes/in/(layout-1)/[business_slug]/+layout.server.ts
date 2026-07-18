import { redirect } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import type { SessionData } from '$lib/types/auth';
import { SessionManager } from '$lib/in/auth/business';

interface BusinessRow {
	id: number;
	businessname: string;
	slug: string;
	email: string;
	description?: string;
	website?: string;
	google_maps_link?: string;
	brands?: number[];
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
	const isClaimPage = url.pathname === `/in/${business_slug}/claim`;
	const isLoginPage = url.pathname === `/in/${business_slug}/login`;
	const isResetPasswordPage = url.pathname.startsWith(`/in/${business_slug}/reset-password`);
	const isMagicLinkPage = url.pathname.startsWith(`/in/${business_slug}/signin-link`);

	// If no session and not on an allowed page, redirect to login
	if (
		!sessionData &&
		!isLoginPage &&
		!isClaimPage &&
		!isResetPasswordPage &&
		!isMagicLinkPage
	) {
		throw redirect(302, '/in/login');
	}

	// Ensure user is redirected to the correct business if they change the URL
	// Skip this validation for magic link pages to avoid conflicts during login
	if (sessionData && !isMagicLinkPage) {
		try {
			// If session's businessSlug does not match the URL, redirect to the correct business
			if (sessionData.businessSlug !== business_slug) {
				throw redirect(302, `/in/${sessionData.businessSlug}`);
			}

			// Load basic business info for sidebar
			const pool = createPool({ connectionString: POSTGRES_URL });
			try {
				const businessResult = await pool.query(
					`SELECT source_id AS id, businessname, slug, email, description, website, google_maps_link, brands
					 FROM businesses WHERE country_code = 'in' AND slug = $1 LIMIT 1`,
					[business_slug]
				);

				if (businessResult.rows.length > 0) {
					const business = businessResult.rows[0] as BusinessRow;
					const businessId = business.id;

					// Get all branch IDs so lead counts include branch-assigned leads
					const branchesRes = await pool.query(
						`SELECT branch_id FROM branches WHERE main_id = $1 AND isactive = true`,
						[businessId]
					);
					const allBusinessIds = [businessId, ...branchesRes.rows.map((r: { branch_id: number }) => r.branch_id)];

					const [claimedRes, staleRes, projectsRes, recentProjectRes] = await Promise.all([
						pool.query(
							`SELECT COUNT(*) as count FROM leads
							 WHERE country_code = 'in' AND business_id = ANY($1) AND category = 2 AND isvisible = true`,
							[allBusinessIds]
						),
						pool.query(
							`SELECT COUNT(*) as count FROM leads
							 WHERE country_code = 'in' AND business_id = ANY($1) AND category = 2 AND isvisible = true AND stage = 0 AND status = true`,
							[allBusinessIds]
						),
						pool.query(
							'SELECT COUNT(*) as count FROM projects WHERE business_slug = $1 AND isvisible = true',
							[business_slug]
						),
						pool.query(
							`SELECT COUNT(*) as count FROM projects
							 WHERE business_slug = $1 AND isvisible = true AND created_at > NOW() - INTERVAL '60 days'`,
							[business_slug]
						)
					]);

					const totalClaimed = parseInt(claimedRes.rows[0]?.count || '0');
					const staleClaimed = parseInt(staleRes.rows[0]?.count || '0');
					const projectsCount = parseInt(projectsRes.rows[0]?.count || '0');
					const recentProjectExists = parseInt(recentProjectRes.rows[0]?.count || '0') > 0;
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
			throw redirect(302, '/in/login');
		}
	}

	return { business_session: sessionData };
};
