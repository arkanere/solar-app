import type { RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const BASE_URL = 'https://solarvipani.com';

const STATIC_PAGES = [
	{ path: '/in/', changefreq: 'monthly', priority: '1.0' },
	{ path: '/in/about-us', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/terms-of-use', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/privacy-policy', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/data-deletion', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/business-listing', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/business-form', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/solar-panel-installer-directory', changefreq: 'monthly', priority: '1.0' },
	{ path: '/in/blogs', changefreq: 'monthly', priority: '0.8' },
	{ path: '/in/recent-solar-installation-projects', changefreq: 'monthly', priority: '0.8' }
];

function cityToSlug(city: string): string {
	return city.toLowerCase().replace(/\s+/g, '-');
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
	return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: RequestHandler = async () => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const today = new Date().toISOString().split('T')[0];

	const [citiesResult, businessesResult] = await Promise.all([
		pool.query('SELECT DISTINCT city FROM locations ORDER BY city ASC'),
		pool.query('SELECT slug FROM businesses_1 WHERE isvisible = true ORDER BY slug ASC')
	]);

	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
	];

	for (const page of STATIC_PAGES) {
		parts.push(urlEntry(`${BASE_URL}${page.path}`, today, page.changefreq, page.priority));
	}

	for (const row of citiesResult.rows) {
		const slug = cityToSlug(row.city);
		parts.push(
			urlEntry(`${BASE_URL}/in/solar-panel-installer-directory/${slug}`, today, 'weekly', '0.7')
		);
	}

	for (const row of businessesResult.rows) {
		if (row.slug) {
			parts.push(
				urlEntry(`${BASE_URL}/in/solar-panel-installer/${row.slug}`, today, 'monthly', '0.8')
			);
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
