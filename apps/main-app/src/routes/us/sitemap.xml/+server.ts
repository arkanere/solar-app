import type { RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { stateToAbbr } from '$lib/us/stateAbbreviations';

const BASE_URL = 'https://solarvipani.com';

const STATIC_PAGES = [
	{ path: '/us/', changefreq: 'monthly', priority: '1.0' },
	{ path: '/us/about-us', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/terms-of-use', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/privacy-policy', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/data-deletion', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/business-listing', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/business-form', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/solar-panel-installer-directory', changefreq: 'monthly', priority: '1.0' },
	{ path: '/us/blogs', changefreq: 'monthly', priority: '0.8' },
	{ path: '/us/recent-solar-installation-projects', changefreq: 'monthly', priority: '0.8' }
];

function cityStateSlug(city: string, state: string): string {
	const citySlug = city.toLowerCase().replace(/\s+/g, '-');
	const stateAbbr = stateToAbbr[state as keyof typeof stateToAbbr] || state.toLowerCase();
	return `${citySlug}-${stateAbbr}`;
}

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
	return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: RequestHandler = async () => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const today = new Date().toISOString().split('T')[0];

	const [citiesResult, businessesResult, blogsResult] = await Promise.all([
		pool.query(`SELECT DISTINCT l.city, l.state FROM us_locations l
			INNER JOIN us_businesses b ON LOWER(b.county) = LOWER(l.county) AND b.state = l.state AND b.isvisible = true
			ORDER BY l.state ASC, l.city ASC`),
		pool.query('SELECT slug FROM us_businesses WHERE isvisible = true ORDER BY slug ASC'),
		pool.query(
			"SELECT slug, updated_at FROM us_blogs WHERE status = 'published' ORDER BY updated_at DESC"
		)
	]);

	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
	];

	for (const page of STATIC_PAGES) {
		parts.push(urlEntry(`${BASE_URL}${page.path}`, today, page.changefreq, page.priority));
	}

	for (const row of citiesResult.rows) {
		const slug = cityStateSlug(row.city, row.state);
		parts.push(
			urlEntry(
				`${BASE_URL}/us/solar-panel-installer-directory/${slug}`,
				today,
				'weekly',
				'0.7'
			)
		);
	}

	for (const row of businessesResult.rows) {
		if (row.slug) {
			parts.push(
				urlEntry(`${BASE_URL}/us/solar-panel-installer/${row.slug}`, today, 'monthly', '0.8')
			);
		}
	}

	for (const row of blogsResult.rows) {
		if (row.slug) {
			const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
			parts.push(urlEntry(`${BASE_URL}/us/blogs/${row.slug}`, lastmod, 'monthly', '0.6'));
		}
	}

	parts.push('</urlset>');

	return new Response(parts.join('\n'), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
