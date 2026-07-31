import type { RequestHandler } from '@sveltejs/kit';
import { COUNTRIES } from '$lib/countries';

const BASE_URL = 'https://solarvipani.com';

export const GET: RequestHandler = async () => {
	const today = new Date().toISOString().split('T')[0];

	// One child per country, plus the country-less content sitemap added in
	// stage 13 — the 7 SEO pillars, tools, authors and the legal pages live
	// under no country prefix and would otherwise be unlisted.
	const children = [
		...Object.keys(COUNTRIES).map((code) => `${BASE_URL}/${code}/sitemap.xml`),
		`${BASE_URL}/content-sitemap.xml`
	]
		.map(
			(loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children}
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
