import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

function seoRedirect(pathname: string): string | null | 'needs-db' {
	// Static redirects
	if (pathname === '/in/solar-panel-installer-directory/') return '/in/solar/';
	if (pathname === '/in/solar-panel-installer-directory') return '/in/solar/';
	if (pathname === '/in/state/') return '/in/solar/';
	if (pathname === '/in/state') return '/in/solar/';

	// /in/solar-panel-installer/[slug]/project/[project_slug] → /in/project/[project_slug]
	const projectMatch = pathname.match(/^\/in\/solar-panel-installer\/[^/]+\/project\/(.+)$/);
	if (projectMatch) return `/in/project/${projectMatch[1]}`;

	// /in/solar-panel-installer/[slug] → /in/installer/[slug]
	const installerMatch = pathname.match(/^\/in\/solar-panel-installer\/(.+)$/);
	if (installerMatch) return `/in/installer/${installerMatch[1]}`;

	// /in/blogs/[slug] → /in/blog/[slug]
	const blogMatch = pathname.match(/^\/in\/blogs\/(.+)$/);
	if (blogMatch) return `/in/blog/${blogMatch[1]}`;

	// /in/state/solar-panel-installers-in-[state] → /in/solar/[state]/
	const stateMatch = pathname.match(/^\/in\/state\/solar-panel-installers-in-(.+)$/);
	if (stateMatch) return `/in/solar/${stateMatch[1]}/`;

	// Patterns needing DB lookup
	if (pathname.match(/^\/in\/solar-panel-installer-directory\/.+$/)) return 'needs-db';
	if (pathname.match(/^\/in\/district\/.+$/)) return 'needs-db';

	return null;
}

async function resolveDbRedirect(pathname: string): Promise<string | null> {
	const pool = createPool({ connectionString: POSTGRES_URL });

	// /in/solar-panel-installer-directory/[city] → /in/solar/[state]/[district]/[city]
	const cityMatch = pathname.match(/^\/in\/solar-panel-installer-directory\/(.+)$/);
	if (cityMatch) {
		const citySlug = cityMatch[1];
		const result = await pool.query(
			`SELECT LOWER(REPLACE(state, ' ', '-')) as state_slug,
			        LOWER(REPLACE(district, ' ', '-')) as district_slug,
			        LOWER(REPLACE(city, ' ', '-')) as city_slug
			 FROM locations
			 WHERE LOWER(REPLACE(city, ' ', '-')) = LOWER($1)
			 LIMIT 1`,
			[citySlug]
		);
		if (result.rows.length > 0) {
			const { state_slug, district_slug, city_slug } = result.rows[0];
			return `/in/solar/${state_slug}/${district_slug}/${city_slug}`;
		}
	}

	// /in/district/[district] → /in/solar/[state]/[district]/
	const districtMatch = pathname.match(/^\/in\/district\/(.+)$/);
	if (districtMatch) {
		const districtSlug = districtMatch[1];
		const result = await pool.query(
			`SELECT LOWER(REPLACE(state, ' ', '-')) as state_slug,
			        LOWER(REPLACE(district, ' ', '-')) as district_slug
			 FROM locations
			 WHERE LOWER(REPLACE(district, ' ', '-')) = LOWER($1)
			 LIMIT 1`,
			[districtSlug]
		);
		if (result.rows.length > 0) {
			return `/in/solar/${result.rows[0].state_slug}/${result.rows[0].district_slug}/`;
		}
	}

	return null;
}

export const handle: Handle = async ({ event, resolve }) => {
	// REDIRECT: Business paths to business.solarvipani.com
	if (event.url.pathname.startsWith('/business/')) {
		const businessPath = event.url.pathname.replace('/business/', '');
		const targetUrl = `https://business.solarvipani.com/${businessPath}`;
		console.log('BUSINESS REDIRECT:', {
			from: event.url.href,
			to: targetUrl,
			method: event.request.method,
			timestamp: new Date().toISOString()
		});
		return new Response(null, {
			status: 301,
			headers: { location: targetUrl }
		});
	}

	// SEO redirects — gated by feature flag
	if (env.SEO_REDIRECTS_ENABLED === 'true') {
		const result = seoRedirect(event.url.pathname);
		if (result && result !== 'needs-db') {
			return new Response(null, {
				status: 301,
				headers: { location: result }
			});
		}
		if (result === 'needs-db') {
			const target = await resolveDbRedirect(event.url.pathname);
			if (target) {
				return new Response(null, {
					status: 301,
					headers: { location: target }
				});
			}
		}
	}

	const response = await resolve(event);
	return response;
};
