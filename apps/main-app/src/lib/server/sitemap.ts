import type { Pool } from '@vercel/postgres';

export interface SitemapEntry {
	loc: string;
	lastmod: string;
	changefreq: string;
	priority: string;
}

const BASE_URL = 'https://solarvipani.com';

const STATIC_PAGES: SitemapEntry[] = [
	{ loc: `${BASE_URL}/in/`, lastmod: '', changefreq: 'monthly', priority: '1.0' },
	{ loc: `${BASE_URL}/in/solar/`, lastmod: '', changefreq: 'weekly', priority: '1.0' },
	{ loc: `${BASE_URL}/in/about-us`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/terms-of-use`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/privacy-policy`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/data-deletion`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/business-listing`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/business-form`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{
		loc: `${BASE_URL}/in/solar-panel-installer-directory`,
		lastmod: '',
		changefreq: 'monthly',
		priority: '1.0'
	},
	{ loc: `${BASE_URL}/in/blogs`, lastmod: '', changefreq: 'monthly', priority: '0.8' },
	{ loc: `${BASE_URL}/in/blog/`, lastmod: '', changefreq: 'weekly', priority: '0.8' },
	{
		loc: `${BASE_URL}/in/recent-solar-installation-projects`,
		lastmod: '',
		changefreq: 'monthly',
		priority: '0.8'
	}
];

function toSlug(str: string): string {
	return str.toLowerCase().replace(/\s+/g, '-');
}

export async function generateSitemapEntries(pool: Pool): Promise<SitemapEntry[]> {
	const today = new Date().toISOString().split('T')[0];
	const entries: SitemapEntry[] = STATIC_PAGES.map((p) => ({ ...p, lastmod: p.lastmod || today }));

	const [
		citiesResult,
		businessesResult,
		blogsResult,
		seoPagesResult,
		brandsResult,
		subsidiesResult,
		discomsResult,
		banksResult,
		blogPostsResult,
		geoStatesResult,
		geoDistrictsResult,
		geoCitiesResult,
		authorsResult
	] = await Promise.all([
		pool.query(`SELECT DISTINCT l.city FROM locations l
			INNER JOIN businesses_1 b ON LOWER(b.district) = LOWER(l.district) AND b.isvisible = true
			ORDER BY l.city ASC`),
		pool.query('SELECT slug FROM businesses_1 WHERE isvisible = true ORDER BY slug ASC'),
		pool.query(
			"SELECT slug, updated_at FROM in_blogs WHERE status = 'published' ORDER BY updated_at DESC"
		),
		pool.query(
			"SELECT slug, page_type, updated_at FROM seo_pages WHERE status = 'published' ORDER BY slug"
		),
		pool.query("SELECT slug FROM solar_brands WHERE status = 'published' ORDER BY slug"),
		pool.query(
			"SELECT state_slug FROM state_subsidies WHERE status = 'published' ORDER BY state_slug"
		),
		pool.query("SELECT slug FROM discoms WHERE status = 'published' ORDER BY slug"),
		pool.query(
			"SELECT slug FROM solar_financing_banks WHERE status = 'published' ORDER BY slug"
		),
		pool.query(
			"SELECT slug, updated_at FROM in_blog_posts WHERE status = 'published' ORDER BY updated_at DESC"
		),
		pool.query(
			`SELECT DISTINCT l.state FROM locations l
			 INNER JOIN businesses_1 b ON LOWER(b.state) = LOWER(l.state) AND b.isvisible = true
			 ORDER BY l.state ASC`
		),
		pool.query(
			`SELECT DISTINCT l.state, l.district FROM locations l
			 INNER JOIN businesses_1 b ON LOWER(b.district) = LOWER(l.district) AND b.isvisible = true
			 ORDER BY l.state, l.district ASC`
		),
		pool.query(
			`SELECT DISTINCT l.state, l.district, l.city FROM locations l
			 INNER JOIN businesses_1 b ON LOWER(b.district) = LOWER(l.district) AND b.isvisible = true
			 ORDER BY l.state, l.district, l.city ASC`
		),
		pool.query(`SELECT slug FROM authors ORDER BY slug`)
	]);

	// Existing city pages — priority 0.7
	for (const row of citiesResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar-panel-installer-directory/${toSlug(row.city)}`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.7'
		});
	}

	// Existing business pages — priority 0.8
	for (const row of businessesResult.rows) {
		if (row.slug) {
			entries.push({
				loc: `${BASE_URL}/in/solar-panel-installer/${row.slug}`,
				lastmod: today,
				changefreq: 'monthly',
				priority: '0.8'
			});
		}
	}

	// Existing blog pages — priority 0.6
	for (const row of blogsResult.rows) {
		if (row.slug) {
			const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
			entries.push({
				loc: `${BASE_URL}/in/blogs/${row.slug}`,
				lastmod,
				changefreq: 'monthly',
				priority: '0.6'
			});
		}
	}

	// SEO pages — priority by type
	for (const row of seoPagesResult.rows) {
		const priority = row.page_type === 'pillar' ? '0.9' : '0.8';
		const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
		entries.push({
			loc: `${BASE_URL}/in/solar/${row.slug}`,
			lastmod,
			changefreq: 'weekly',
			priority
		});
	}

	// Brand pages — priority 0.7
	for (const row of brandsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/brands/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// State subsidy pages — priority 0.9
	for (const row of subsidiesResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/subsidy/${row.state_slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.9'
		});
	}

	// Discom pages — priority 0.7
	for (const row of discomsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/discom/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// Financing bank pages — priority 0.7
	for (const row of banksResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/financing/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// New blog posts — priority 0.5
	for (const row of blogPostsResult.rows) {
		if (row.slug) {
			const lastmod = row.updated_at ? row.updated_at.toISOString().split('T')[0] : today;
			entries.push({
				loc: `${BASE_URL}/in/blog/${row.slug}`,
				lastmod,
				changefreq: 'monthly',
				priority: '0.5'
			});
		}
	}

	// Geographic state hubs — priority 0.9
	for (const row of geoStatesResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/${toSlug(row.state)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.9'
		});
	}

	// Geographic district pillars — priority 1.0
	for (const row of geoDistrictsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/${toSlug(row.state)}/${toSlug(row.district)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '1.0'
		});
	}

	// Geographic city pages — priority 0.7
	for (const row of geoCitiesResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/solar/${toSlug(row.state)}/${toSlug(row.district)}/${toSlug(row.city)}/`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.7'
		});
	}

	// Author profiles — priority 0.5
	for (const row of authorsResult.rows) {
		entries.push({
			loc: `${BASE_URL}/in/authors/${row.slug}/`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.5'
		});
	}

	return entries;
}
