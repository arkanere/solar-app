/**
 * The data seam for the three calculators. Ported from
 * apps/main-app/src/lib/server/queries.ts (`getDistrictsWithInstallerCounts`,
 * `getVisibleInstallerCount`) and the EMI calculator's own loader.
 *
 * Its own file rather than lib/directory/data.ts for the reason lib/stats.ts
 * gives: that seam's comment says every query in it is scoped to a country, a
 * place or a profile. These are not. `districtsWithInstallerCounts` is the
 * whole IN geo tree flattened into one select list, and the bank list has no
 * geography at all.
 *
 * Two things carried across as they are, both worth knowing:
 *
 *  - **the installer count is not country-scoped.** `business_profiles` alone,
 *    no join to `business_accounts`, so a US profile is in the number the IN
 *    pages print. That is what the SvelteKit loader does and what the live
 *    site shows; narrowing it here would silently change a published figure.
 *    lib/directory/data.ts documents the join (`accountOfProfile`) that a
 *    country-scoped version would need.
 *  - **counts key on LOWER().** `geo_locations` and `business_profiles`
 *    disagree on casing — the same trap geo-listing.md §9 records — so the
 *    district list comes from one table, the counts from the other, and they
 *    are matched on a lower-cased composite key rather than joined.
 */
import { cache } from 'react';
import { asc, count, eq, sql } from 'drizzle-orm';
import { businessProfiles, geoLocations, solarFinancingBanks } from '@solar/db/schema';
import { db } from '@/lib/server/db';

/** One district, and how many visible installers sit in it. */
export type DistrictOption = {
  state: string;
  district: string;
  slug: string;
  stateSlug: string;
  installerCount: number;
};

/**
 * One row of `solar_financing_banks`. `interest_rate`, `max_amount` and
 * `tenure` are nullable `text` in the schema and free-form in practice, so
 * they arrive as strings and the page parses what it needs.
 */
export type FinancingBank = {
  slug: string;
  name: string;
  interestRate: string | null;
};

async function loadDistricts(): Promise<DistrictOption[]> {
  const [districtRows, countRows] = await Promise.all([
    db
      .selectDistinct({
        state: geoLocations.level1,
        district: geoLocations.level2,
        stateSlug: geoLocations.level1Slug,
        districtSlug: geoLocations.level2Slug
      })
      .from(geoLocations)
      .where(eq(geoLocations.countryCode, 'in'))
      .orderBy(asc(geoLocations.level1), asc(geoLocations.level2)),
    db
      .select({
        state: sql<string>`LOWER(${businessProfiles.level1})`,
        district: sql<string>`LOWER(${businessProfiles.level2})`,
        total: count()
      })
      .from(businessProfiles)
      .where(eq(businessProfiles.isvisible, true))
      .groupBy(sql`LOWER(${businessProfiles.level1})`, sql`LOWER(${businessProfiles.level2})`)
  ]);

  const counts = new Map(countRows.map((r) => [`${r.state}|${r.district}`, Number(r.total)]));

  return districtRows.map((r) => ({
    state: r.state,
    district: r.district,
    slug: r.districtSlug,
    stateSlug: r.stateSlug,
    installerCount: counts.get(`${r.state.toLowerCase()}|${r.district.toLowerCase()}`) ?? 0
  }));
}

async function loadInstallerCount(): Promise<number> {
  const rows = await db
    .select({ total: count() })
    .from(businessProfiles)
    .where(eq(businessProfiles.isvisible, true));
  return rows[0]?.total ?? 0;
}

/**
 * **`solar_financing_banks` is empty** — 0 rows in every status, measured
 * 2026-09-21. So the EMI page's bank comparison never renders today. The
 * query is still ported, and the table still built, because unlike the dead
 * `state_subsidies` read in lib/directory/data.ts this one HAS a consumer:
 * the comparison is the only reason that page loads anything at all. It
 * starts working the day a row lands.
 */
async function loadBanks(): Promise<FinancingBank[]> {
  return db
    .select({
      slug: solarFinancingBanks.slug,
      name: solarFinancingBanks.name,
      interestRate: solarFinancingBanks.interestRate
    })
    .from(solarFinancingBanks)
    .where(eq(solarFinancingBanks.status, 'published'))
    .orderBy(asc(solarFinancingBanks.name));
}

export const getDistrictOptions = cache(loadDistricts);
export const getVisibleInstallerCount = cache(loadInstallerCount);
export const getFinancingBanks = cache(loadBanks);
