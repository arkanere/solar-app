import { db } from './db';
import {
	authors,
	businessProfiles,
	discoms,
	geoLocations,
	seoPages,
	solarBrands,
	solarFinancingBanks,
	stateSubsidies
} from '@solar/db/schema';
import { and, asc, eq, exists, sql } from 'drizzle-orm';
import type { CountryConfig } from '$lib/countries';
import { geoUrl, installerUrl } from '$lib/countries/urls';

export interface SitemapEntry {
	loc: string;
	lastmod: string;
	changefreq: string;
	priority: string;
}

const BASE_URL = 'https://solarvipani.com';

// Section order and priorities are load-bearing: the per-country sitemap must
// stay byte-identical across the unified-tables cutover so search engines see no
// change. Do not reorder sections or tweak priorities casually.
//
// Every loc here is written WITHOUT a trailing slash. trailingSlash is 'never',
// so a trailing slash costs a normalization redirect — before stage 13 this file
// advertised ~1200 geo URLs in a form that 301'd, each contradicting the
// canonical tag on the page it pointed at.
//
// Stage 13 removed the legal pages (about-us, terms-of-use, privacy-policy,
// data-deletion) from here: they are country-less since stage 4 and every
// /{c}/... form now 301s. They live in contentStaticPages() below.
function staticPages(country: CountryConfig): SitemapEntry[] {
	const c = country.code;
	const pages: SitemapEntry[] = [
		{ loc: `${BASE_URL}/${c}`, lastmod: '', changefreq: 'monthly', priority: '1.0' },
		{ loc: `${BASE_URL}/${c}/solar`, lastmod: '', changefreq: 'weekly', priority: '1.0' },
		{
			loc: `${BASE_URL}/${c}/business-listing`,
			lastmod: '',
			changefreq: 'monthly',
			priority: '0.8'
		},
		{ loc: `${BASE_URL}/${c}/business-form`, lastmod: '', changefreq: 'monthly', priority: '0.8' }
	];
	// Gated for the same reason stage 10 gated the route itself: with
	// features.projects false the page 404s, so advertising it is a dead URL.
	if (country.features.projects) {
		pages.push({
			loc: `${BASE_URL}/${c}/recent-solar-installation-projects`,
			lastmod: '',
			changefreq: 'monthly',
			priority: '0.8'
		});
	}
	return pages;
}

// `EXISTS (... LOWER(b.col) = LOWER(g.col) ...)` compares LOWER() on both
// sides, which the query builder cannot express — the correlated subquery
// stays on the sql escape hatch.
function businessesExistFor(...matches: ReturnType<typeof sql>[]) {
	return exists(
		db
			.select({ one: sql`1` })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.countryCode, geoLocations.countryCode),
					...matches,
					eq(businessProfiles.isvisible, true)
				)
			)
	);
}

export async function generateSitemapEntries(country: CountryConfig): Promise<SitemapEntry[]> {
	const code = country.code;
	const today = new Date().toISOString().split('T')[0];
	const entries: SitemapEntry[] = staticPages(country).map((p) => ({
		...p,
		lastmod: p.lastmod || today
	}));

	const [businessRows, geoLevel1Rows, geoLevel2Rows, geoCityRows] = await Promise.all([
		db
			.select({ slug: businessProfiles.slug })
			.from(businessProfiles)
			.where(and(eq(businessProfiles.countryCode, code), eq(businessProfiles.isvisible, true)))
			.orderBy(asc(businessProfiles.slug)),
		db
			.selectDistinct({ level1: geoLocations.level1, level1_slug: geoLocations.level1Slug })
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, code),
					businessesExistFor(sql`LOWER(${businessProfiles.level1}) = LOWER(${geoLocations.level1})`)
				)
			)
			.orderBy(asc(geoLocations.level1)),
		db
			.selectDistinct({
				level1: geoLocations.level1,
				level1_slug: geoLocations.level1Slug,
				level2: geoLocations.level2,
				level2_slug: geoLocations.level2Slug
			})
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, code),
					businessesExistFor(sql`LOWER(${businessProfiles.level2}) = LOWER(${geoLocations.level2})`)
				)
			)
			.orderBy(asc(geoLocations.level1), asc(geoLocations.level2)),
		db
			.selectDistinct({
				level1: geoLocations.level1,
				level1_slug: geoLocations.level1Slug,
				level2: geoLocations.level2,
				level2_slug: geoLocations.level2Slug,
				city: geoLocations.city,
				city_slug: geoLocations.citySlug
			})
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, code),
					businessesExistFor(
						sql`LOWER(${businessProfiles.city}) = LOWER(${geoLocations.city})`,
						sql`LOWER(${businessProfiles.level2}) = LOWER(${geoLocations.level2})`
					)
				)
			)
			.orderBy(asc(geoLocations.level1), asc(geoLocations.level2), asc(geoLocations.city))
	]);

	// Business pages — priority 0.8
	for (const row of businessRows) {
		if (row.slug) {
			entries.push({
				loc: `${BASE_URL}${installerUrl(code, row.slug)}`,
				lastmod: today,
				changefreq: 'monthly',
				priority: '0.8'
			});
		}
	}

	// Geographic level1 hubs (states) — priority 0.9
	for (const row of geoLevel1Rows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug)}`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.9'
		});
	}

	// Geographic level2 pillars (districts/counties) — priority 1.0
	for (const row of geoLevel2Rows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug, row.level2_slug)}`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '1.0'
		});
	}

	// Geographic city pages — priority 0.7
	for (const row of geoCityRows) {
		entries.push({
			loc: `${BASE_URL}${geoUrl(code, row.level1_slug, row.level2_slug, row.city_slug)}`,
			lastmod: today,
			changefreq: 'weekly',
			priority: '0.7'
		});
	}

	return entries;
}

// ---------------------------------------------------------------------------
// Country-less content sitemap (stage 13, plan §5b)
//
// The SEO content families left the country prefix in stages 4 and 7–9, so they
// have no home in a per-country sitemap any more. They are listed once, here.
//
// There is deliberately no CountryConfig and no feature flag in this function:
// features.seoContentFamilies / subsidy / financing / authors used to gate these
// rows *per country*, but the content now exists exactly once at the root. The
// flags still gate nav links and slug-resolver, which is why §2 says narrow them
// rather than delete them.
// ---------------------------------------------------------------------------

// Country-less pages with no database row of their own. Kept in the same order
// and at the same priorities they had under /{c}/ before stage 4 moved them.
function contentStaticPages(): SitemapEntry[] {
	const at = (path: string, priority: string, changefreq = 'monthly'): SitemapEntry => ({
		loc: `${BASE_URL}${path}`,
		lastmod: '',
		changefreq,
		priority
	});
	return [
		at('/about-us', '0.8'),
		at('/terms-of-use', '0.8'),
		at('/privacy-policy', '0.8'),
		at('/data-deletion', '0.8'),
		at('/data-access', '0.5'),
		at('/write-for-us', '0.5'),
		at('/seo-index', '0.5'),
		// Tools moved to the root in stage 8 and were never in any sitemap.
		at('/tools', '0.8'),
		at('/tools/solar-calculator', '0.7'),
		at('/tools/emi-calculator', '0.7'),
		at('/tools/subsidy-checker', '0.7')
	];
}

export async function generateContentSitemapEntries(): Promise<SitemapEntry[]> {
	const today = new Date().toISOString().split('T')[0];
	const entries: SitemapEntry[] = contentStaticPages().map((p) => ({
		...p,
		lastmod: p.lastmod || today
	}));

	const [seoPageRows, brandRows, subsidyRows, discomRows, bankRows, authorRows] = await Promise.all(
		[
			db
				.select({
					slug: seoPages.slug,
					pillar_slug: seoPages.pillarSlug,
					page_type: seoPages.pageType,
					// The schema types this timestamptz as `mode: 'string'`, so Drizzle
					// hands back a string where the raw driver handed back a Date and
					// this function called .toISOString(). Formatting in SQL keeps the
					// output identical (and explicitly UTC) instead of depending on the
					// session timezone of the string rendering.
					updated_at: sql<
						string | null
					>`to_char(${seoPages.updatedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`
				})
				.from(seoPages)
				.where(eq(seoPages.status, 'published'))
				.orderBy(asc(seoPages.slug)),
			db
				.select({ slug: solarBrands.slug, product_category: solarBrands.productCategory })
				.from(solarBrands)
				.where(eq(solarBrands.status, 'published'))
				.orderBy(asc(solarBrands.slug)),
			db
				.select({ state_slug: stateSubsidies.stateSlug })
				.from(stateSubsidies)
				.where(eq(stateSubsidies.status, 'published'))
				.orderBy(asc(stateSubsidies.stateSlug)),
			db
				.select({ slug: discoms.slug })
				.from(discoms)
				.where(eq(discoms.status, 'published'))
				.orderBy(asc(discoms.slug)),
			db
				.select({ slug: solarFinancingBanks.slug })
				.from(solarFinancingBanks)
				.where(eq(solarFinancingBanks.status, 'published'))
				.orderBy(asc(solarFinancingBanks.slug)),
			db.select({ slug: authors.slug }).from(authors).orderBy(asc(authors.slug))
		]
	);

	// SEO pages — pillar landing at /{pillar}, clusters at /{pillar}/{slug}.
	//
	// A pillar row carries its own slug in `slug` and leaves `pillar_slug` NULL;
	// only cluster rows populate `pillar_slug`. Reading pillar_slug for pillars
	// (as this did before stage 13) emitted seven literal ".../null" URLs — every
	// pillar landing page was advertised as a 404 and no real one was listed.
	for (const row of seoPageRows) {
		const isPillar = row.page_type === 'pillar';
		const lastmod = row.updated_at ?? today;
		const path = isPillar ? `/${row.slug}` : `/${row.pillar_slug}/${row.slug}`;
		if (path.includes('/null')) continue;
		entries.push({
			loc: `${BASE_URL}${path}`,
			lastmod,
			changefreq: 'weekly',
			priority: isPillar ? '0.9' : '0.8'
		});
	}

	// Brand pages — /solar-{product_category}/{slug} — priority 0.7
	for (const row of brandRows) {
		entries.push({
			loc: `${BASE_URL}/solar-${row.product_category}/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// State subsidy pages — priority 0.9
	for (const row of subsidyRows) {
		entries.push({
			loc: `${BASE_URL}/solar-subsidy/${row.state_slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.9'
		});
	}

	// Discom pages — priority 0.7
	for (const row of discomRows) {
		entries.push({
			loc: `${BASE_URL}/solar-subsidy/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// Financing bank pages — priority 0.7
	for (const row of bankRows) {
		entries.push({
			loc: `${BASE_URL}/solar-financing/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	// Author profiles — priority 0.5
	for (const row of authorRows) {
		entries.push({
			loc: `${BASE_URL}/authors/${row.slug}`,
			lastmod: today,
			changefreq: 'monthly',
			priority: '0.5'
		});
	}

	return entries;
}
