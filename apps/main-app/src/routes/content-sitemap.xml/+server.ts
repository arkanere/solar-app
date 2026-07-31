// Sitemap for the country-less content surface — the 7 SEO pillars and their
// clusters, brand and product pages, subsidy/discom/financing pages, authors,
// tools and the legal pages. These left the country prefix in stages 4 and 7–9
// (docs/migration-plan-in-country.md §5b), so they belong to no country sitemap.
//
// The per-country sitemaps at /{cc}/sitemap.xml keep geo, installers and the
// genuinely per-country static pages. Both are listed by /sitemap.xml.
import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import { generateContentSitemapEntries } from '$lib/server/sitemap';

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
	const entries = await generateContentSitemapEntries(pool);

	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
	];

	for (const entry of entries) {
		parts.push(urlEntry(entry.loc, entry.lastmod, entry.changefreq, entry.priority));
	}

	parts.push('</urlset>');

	return new Response(parts.join('\n'), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
