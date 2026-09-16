/**
 * The data seam for the directory surface.
 *
 * THIS IS THE FILE THAT CHANGES WHEN THE DATABASE IS WIRED. Right now it
 * answers every district from the specimen fixtures, so the page, the
 * components and the sort can be built and reviewed before @solar/db is a
 * dependency of this app. Nothing above this file knows where the rows come
 * from; when the real queries land, only this module is rewritten.
 *
 * What the real implementation has to do is already known — geo-listing.md §9
 * documents the loader it is ported from, including two traps that were fixed
 * upstream and are easy to reintroduce:
 *
 *  - per-level2 counts must be a separate grouped query, not a correlated
 *    subquery, or Drizzle renders the correlation unqualified and every
 *    district reports the state total;
 *  - counts key on LOWER(level2) and sum, because geo_locations and
 *    business_profiles disagree on casing.
 */
import { LONE, PUNE, PUNE_CITIES } from '@/lib/fixtures/directory';
import type { DistrictPageData, InstallerRowData } from './types';

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
  // Fixture stand-in. Pune is the 22-installer case the column layout is
  // designed for; every other slug renders the single-installer case, which is
  // 108 of 221 real district pages and needs at least as much review.
  const isPune = level2Slug === 'pune';

  const installers = sortInstallers(isPune ? PUNE : [LONE]);
  if (installers.length === 0) return null;

  return {
    country,
    level1: titleCase(level1Slug),
    level1Slug,
    level2: titleCase(level2Slug),
    level2Slug,
    installers,
    cities: isPune ? PUNE_CITIES : []
  };
}

/** Slug → display name, until the real loader returns the stored name. */
function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
