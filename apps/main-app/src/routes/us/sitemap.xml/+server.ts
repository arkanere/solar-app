// US sitemap — now emitted by the unified generator against the unified
// tables, listing the new /us/solar/... and /us/installer/... URLs. Every
// URL family removed from the old self-contained generator has a 301
// redirect in place (hooks.server.ts + shims under routes/us).
import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import { generateSitemapEntries } from '$lib/server/sitemap';
import { getCountry } from '$lib/countries';

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
	const entries = await generateSitemapEntries(pool, getCountry('us'));

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
