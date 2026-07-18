import type { Pool } from '@vercel/postgres';
import type { CountryConfig } from '$lib/countries';
import { geoUrl, installerUrl } from '$lib/countries/urls';

export interface SitemapEntry {
	loc: string;
	lastmod: string;
	changefreq: string;
	priority: string;
}

const BASE_URL = 'https://solarvipani.com';

// Section order and priorities are load-bearing: the IN sitemap must stay
// byte-identical across the unified-tables cutover so search engines see no
// change. Do not reorder sections or tweak priorities casually.
function staticPages(country: CountryConfig): SitemapEntry[] {
	const c = country.code;
	const pages: SitemapEntry[] = [
		{ loc: `${BASE_URL}/${c}/`, lastmod: '', changefreq: 'monthly', priority: '1.0' },
		{ loc: `${BASE_URL}/${c}/solar/`, lastmod: '', changefreq: 'weekly', priority: '1.0' },
		{ loc: `${BASE_URL}/${c}/about-us`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
		{ loc: `${BASE_URL}/${c}/terms-of-use`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
		{ loc: `${BASE_URL}/${c}/privacy-policy`, lastmod: '', changefreq: 'monthly', priority: '0.8' }
	];
	if (c === 'in') {
		pages.push({
			loc: `${BASE_URL}/${c}/data-deletion`,
			lastmod: '',
			changefreq: 'monthly',
			priority: '0.8'
		});
	}
	pages.push(
		{ loc: `${BASE_URL}/${c}/business-listing`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
		{ loc: `${BASE_URL}/${c}/business-form`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
		{ loc: `${BASE_URL}/${c}/blogs`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
		{
			loc: `${BASE_URL}/${c}/recent-solar-installation-projects`,
			lastmod: '',
			changefreq: 'monthly',
			priority: '0.8'
		}
	);
	return pages;
}

export async function generateSitemapEntries(
	pool: Pool,
	country: CountryConfig
): Promise<SitemapEntry[]> {
	const code = country.code;
	const today = new Date().toISOString().split('T')[0];
	const entries: SitemapEntry[] = staticPages(country).map((p) => ({
		...p,
		lastmod: p.lastmod || today
	}));

	const { features } = country;
	const blogsTable = code === 'in' ? 'in_blogs' : 'us_blogs'; // blog unification is deferred
	const emptyResult = Promise.resolve({ rows: [] as Record<string, string>[] });

	const [
		businessesResult,
		blogsResult,
		seoPagesResult,
		brandsResult,
		subsidiesResult,
		discomsResult,
		banksResult,
		geoLevel1Result,
		geoLevel2Result,
		geoCitiesResult,
		authorsResult
	] = await Promise.all([
		pool.query(
			`SELECT slug FROM businesses WHERE country_code = $1 AND isvisible = true ORDER BY slug ASC`,
			[code]
		),
		pool.query(
			`SELECT slug, updated_at FROM ${blogsTable} WHERE status = 'published' ORDER BY updated_at DESC`
		),
		features.seoContentFamilies
			? pool.query(
					"SELECT slug, pillar_slug, page_type, updated_at FROM seo_pages WHERE status = 'published' ORDER BY slug"
				)
			: emptyResult,
		features.seoContentFamilies
			? pool.query(
					"SELECT slug, product_category FROM solar_brands WHERE status = 'published' ORDER BY slug"
				)
			: emptyResult,
		features.subsidy
			? pool.query(
					"SELECT state_slug FROM state_subsidies WHERE status = 'published' ORDER BY state_slug"
				)
			: emptyResult,
		features.subsidy
			? pool.query("SELECT slug FROM discoms WHERE status = 'published' ORDER BY slug")
			: emptyResult,
		features.financing
			? pool.query(
					"SELECT slug FROM solar_financing_banks WHERE status = 'published' ORDER BY slug"
				)
			: emptyResult,
		pool.query(
			`SELECT DISTINCT g.level1, g.level1_slug FROM geo_locations g
			 WHERE g.country_code = $1 AND EXISTS (
			   SELECT 1 FROM businesses b
			   WHERE b.country_code = g.country_code
			     AND LOWER(b.level1) = LOWER(g.level1) AND b.isvisible = true
			 )
			 ORDER BY g.level1 ASC`,
			[code]
		),
		pool.query(
			`SELECT DISTINCT g.level1, g.level1_slug, g.level2, g.level2_slug FROM geo_locations g
			 WHERE g.country_code = $1 AND EXISTS (
			   SELECT 1 FROM businesses b
			   WHERE b.country_code = g.country_code
			     AND LOWER(b.level2) = LOWER(g.level2) AND b.isvisible = true
			 )
			 ORDER BY g.level1, g.level2 ASC`,
			[code]
		),
		pool.query(
			`SELECT DISTINCT g.level1, g.level1_slug, g.level2, g.level2_slug, g.city, g.city_slug
			 FROM geo_locations g
			 WHERE g.country_code = $1 AND EXISTS (
			   SELECT 1 FROM businesses b
			   WHERE b.country_code = g.country_code
			     AND LOWER(b.city) = LOWER(g.city)
			     AND LOWER(b.level2) = LOWER(g.level2) AND b.isvisible = true
			 )
			 ORDER BY g.level1, g.level2, g.city ASC`,
			[code]
		),
		features.authors ? pool.query(`SELECT slug FROM authors ORDER BY slug`) : emptyResult
	]);

	// Business pages — priority 0.8
	for (const row of businessesResult.rows) {
		if (row.slug) {
			entries.push({
				loc: `${BASE_URL}${installerUrl(code, row.slug)}`,
				lastmod: today,
				changefreq: 'monthly',
				priority: '0.8'
			});
		}
	}

	// Blog pages — priority 0.6
	for (const row of blogsResult.rows) {
		if (row.slug) {
			const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
			entries.push({
				loc: `${BASE_URL}/${code}/blogs/${row.slug}`,
				lastmod,
				changefreq: 'monthly',
				priority: '0.6'
			});
		}
	}

	// SEO pages — pillar landing at /{code}/{pillar_slug}, clusters below it
	for (const row of seoPagesResult.rows) {
		const isPillar = row.page_type === 'pillar';
		const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
		entries.push({
			loc: isPillar
				? `${BASE_URL}/${code}/${row.pillar_slug}`
				: `${BASE_URL}/${code}/${row.pillar_slug}/${row.slug}`,
			lastmod,
			changefreq: 'weekly',
			priority: isPillar ? '0.9' : '0.8'
		});
	}

	// Brand pages — /{code}/solar-{product_category}/{slug} — priority 0.7
	for (const row of brandsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/${code}/solar-${row.product_category}/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// State subsidy pages — priority 0.9
	for (const row of subsidiesResult.rows) {
		entries.push({
			loc: `${BASE_URL}/${code}/solar-subsidy/${row.state_slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.9'
		});
	}

	// Discom pages — priority 0.7
	for (const row of discomsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/${code}/solar-subsidy/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// Financing bank pages — priority 0.7
	for (const row of banksResult.rows) {
		entries.push({
			loc: `${BASE_URL}/${code}/solar-financing/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// Geographic level1 hubs (states) — priority 0.9
	for (const row of geoLevel1Result.rows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.9'
		});
	}

	// Geographic level2 pillars (districts/counties) — priority 1.0
	for (const row of geoLevel2Result.rows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug, row.level2_slug)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '1.0'
		});
	}

	// Geographic city pages — priority 0.7
	for (const row of geoCitiesResult.rows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug, row.level2_slug, row.city_slug)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.7'
		});
	}

	// Author profiles — priority 0.5
	for (const row of authorsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/${code}/authors/${row.slug}/`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.5'
		});
	}

	return entries;
}
