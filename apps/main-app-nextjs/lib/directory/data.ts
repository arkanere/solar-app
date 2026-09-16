/**
 * The data seam for the directory surface.
 *
 * Now wired to the live database through @solar/db. Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/solar/[state]/[district]/+page.server.ts
 * and the three `$lib/server` helpers it calls (`geo.ts`, `businesses.ts`,
 * `projects.ts`), trimmed to the sections the sparse district page actually
 * renders — geo-listing.md §5. The subsidy row, the postal code, the lead
 * count and the six-project gallery are not read here because nothing on the
 * page renders them yet; they come back with the sections that need them.
 *
 * Nothing above this file knows where the rows come from, which was the point
 * of the seam: the page, the components and the sort are unchanged.
 *
 * Two traps geo-listing.md §9 records, both carried across:
 *
 *  - per-level2 counts must be a separate grouped query, not a correlated
 *    subquery, or Drizzle renders the correlation unqualified and every
 *    district reports the state total. The `hasBusiness` city flag below is
 *    that separate query;
 *  - counts key on LOWER(level2) and LOWER(city), because geo_locations and
 *    business_profiles disagree on casing.
 */
import { and, eq, inArray, sql } from 'drizzle-orm';
import { businessAccounts, businessProfiles, geoLocations, projects } from '@solar/db/schema';
import { db } from '@/lib/server/db';
import type { CityLink, DistrictPageData, InstallerRowData } from './types';

/**
 * 079 moved country off business_profiles: a location's country is its
 * account's, reached through account_business_id -> business_accounts.source_id.
 * So every country-scoped read of business_profiles needs this join as well as
 * the predicate. Copied from apps/main-app/src/lib/server/businessCountry.ts,
 * where the two are kept together so a call site cannot take one and forget
 * the other.
 */
const accountOfProfile = eq(businessAccounts.sourceId, businessProfiles.accountBusinessId);

/**
 * Countries where `projects` is on. The SvelteKit app reads this from
 * `$lib/countries` (`features.projects` — true for IN, false for US), which
 * this app has not ported yet. One constant until it does; the port replaces
 * this line and nothing else in the file.
 */
const PROJECTS_ENABLED = new Set(['in']);

/**
 * geo-listing.md §3, decided 2026-09-06: projects DESC, then rscore DESC NULLS
 * LAST, then businessname ASC.
 *
 * rscore is 0 on all 643 rows today, so the tiebreaker is what actually orders
 * the page — which is the point of adding it. Without it the order is whatever
 * Postgres happens to return, and it changes between deploys. rscore is not in
 * the row type yet because nothing can render it; it enters this comparator
 * when it is populated.
 */
export function sortInstallers(rows: InstallerRowData[]): InstallerRowData[] {
  return [...rows].sort(
    (a, b) => b.projects - a.projects || a.name.trim().localeCompare(b.name.trim())
  );
}

/**
 * Returns null where the real loader 404s: a district page with no businesses
 * is not a thin page worth indexing (§4). Note the city leaf does the opposite
 * and 301s to the district — that difference is deliberate, and it is the leaf
 * route's job when it is built.
 */
export async function getDistrict(
  country: string,
  level1Slug: string,
  level2Slug: string
): Promise<DistrictPageData | null> {
  const place = await resolveLevel2(country, level1Slug, level2Slug);
  if (!place) return null;

  const { level1, level2 } = place;

  // The district's visible businesses. LOWER() on both sides because
  // business_profiles holds several casings of one district name and does not
  // agree with geo_locations on them.
  //
  // level1 is part of the match, which the SvelteKit loader's predicate is
  // missing. 438 US district names occur in more than one state, so matching
  // on level2 alone puts the Arizona Yuma installer on the Colorado Yuma page.
  // geo-listing.md §9 already records this for the per-level2 counts; it
  // applies here for the same reason. Verified on live 2026-09-16: adding it
  // drops no rows — exactly one visible profile fails to match geo_locations,
  // with or without the state.
  const inLevel2 = and(
    eq(businessAccounts.countryCode, country),
    sql`LOWER(${businessProfiles.level1}) = LOWER(${level1})`,
    sql`LOWER(${businessProfiles.level2}) = LOWER(${level2})`,
    eq(businessProfiles.isvisible, true)
  );

  const [businessRows, cities] = await Promise.all([
    db
      .select({
        // businessname, slug and city are nullable in the schema but every
        // consumer treats them as required, and the row type says so. CLAUDE.md
        // prefers restating the existing contract over widening components, so
        // they are restated here — `sql<T>` renders as the bare column, leaving
        // the SQL unchanged. Rows with a null slug are dropped below instead,
        // because the slug is a URL.
        name: sql<string>`${businessProfiles.businessname}`,
        slug: sql<string | null>`${businessProfiles.slug}`,
        address: businessProfiles.address,
        city: sql<string>`${businessProfiles.city}`,
        phone: businessProfiles.phonenumber,
        services: businessProfiles.services
      })
      .from(businessProfiles)
      .innerJoin(businessAccounts, accountOfProfile)
      .where(inLevel2),
    getCities(country, level1Slug, level2Slug, inLevel2)
  ]);

  const slugs = businessRows.map((b) => b.slug).filter((s): s is string => s !== null);
  const projectsBySlug = PROJECTS_ENABLED.has(country)
    ? await getProjectSummaries(slugs)
    : new Map<string, ProjectSummary>();

  const installers = sortInstallers(
    businessRows
      .filter((b): b is typeof b & { slug: string } => b.slug !== null)
      .map((b) => {
        const summary = projectsBySlug.get(b.slug);
        return {
          name: b.name,
          slug: b.slug,
          address: b.address,
          city: b.city,
          phone: b.phone,
          services: b.services ?? [],
          projects: summary?.count ?? 0,
          thumb: summary?.thumb ?? null
        };
      })
  );

  if (installers.length === 0) return null;

  return {
    country,
    level1,
    level1Slug,
    level2,
    level2Slug,
    installers,
    cities
  };
}

/** The 404 gate: does this country/state/district exist in geo_locations? */
async function resolveLevel2(
  country: string,
  level1Slug: string,
  level2Slug: string
): Promise<{ level1: string; level2: string } | null> {
  const rows = await db
    .select({ level1: geoLocations.level1, level2: geoLocations.level2 })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        eq(geoLocations.level1Slug, level1Slug),
        eq(geoLocations.level2Slug, level2Slug)
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Every city in the district, flagged with whether it has a business — which
 * is what makes a chip a link. Both halves matter to the page: CityChips
 * renders the linked ones (p50 is 1 of 9, geo-listing.md §6) and PlaceHeader
 * states the ratio, so the unlinked cities are still counted.
 *
 * The flag is a separate grouped query rather than a correlated subquery, per
 * the trap at the top of this file, and it compares LOWER(city) on both sides.
 */
async function getCities(
  country: string,
  level1Slug: string,
  level2Slug: string,
  inLevel2: ReturnType<typeof and>
): Promise<CityLink[]> {
  const cityRows = await db
    .select({ city: geoLocations.city, citySlug: geoLocations.citySlug })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        eq(geoLocations.level1Slug, level1Slug),
        eq(geoLocations.level2Slug, level2Slug)
      )
    )
    .orderBy(geoLocations.city);
  if (cityRows.length === 0) return [];

  const withBusiness = await db
    .selectDistinct({ city: sql<string>`LOWER(${businessProfiles.city})` })
    .from(businessProfiles)
    .innerJoin(businessAccounts, accountOfProfile)
    .where(inLevel2);
  const linked = new Set(withBusiness.map((r) => r.city));

  return cityRows.map((c) => ({
    name: c.city,
    slug: c.citySlug,
    linked: linked.has(c.city.toLowerCase())
  }));
}

type ProjectSummary = {
  /** Total visible projects. Max on live is 14, so it is not capped at 3. */
  count: number;
  /** Newest project that has a photograph, if any. */
  thumb: string | null;
};

/**
 * Project count and lead photograph per business, in one pass.
 *
 * The SvelteKit loader reused `getTopProjectsPerBusiness()`, which returns the
 * top three rows per business because the old row rendered up to three
 * thumbnails. The new row renders one thumbnail and one number, and a count
 * capped at 3 would misreport the businesses that have up to 14 — so this
 * counts over the whole partition and takes a single row.
 *
 * `ROW_NUMBER()`/`COUNT() OVER` are window functions with no query-builder
 * equivalent, so they stay on the `sql` escape hatch. The ordering puts rows
 * that have a photograph first, so rn = 1 is the newest *photographed*
 * project rather than the newest project, which may have no image.
 */
async function getProjectSummaries(slugs: string[]): Promise<Map<string, ProjectSummary>> {
  const byBusiness = new Map<string, ProjectSummary>();
  if (slugs.length === 0) return byBusiness;

  const ranked = db
    .select({
      businessSlug: sql<string>`${projects.businessSlug}`.as('business_slug'),
      thumb: projects.cloudinaryPublicId,
      total: sql<number>`COUNT(*) OVER (PARTITION BY ${projects.businessSlug})`.as('total'),
      rn: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${projects.businessSlug} ORDER BY ${projects.cloudinaryPublicId} IS NULL, ${projects.projectDate} DESC, ${projects.createdAt} DESC)`.as(
        'rn'
      )
    })
    .from(projects)
    .where(and(inArray(projects.businessSlug, slugs), eq(projects.isvisible, true)))
    .as('ranked');

  const rows = await db
    .select({ businessSlug: ranked.businessSlug, thumb: ranked.thumb, total: ranked.total })
    .from(ranked)
    .where(sql`${ranked.rn} = 1`);

  for (const row of rows) {
    byBusiness.set(row.businessSlug, { count: Number(row.total), thumb: row.thumb });
  }
  return byBusiness;
}
