/**
 * The data seam for the directory surface.
 *
 * Now wired to the live database through @solar/db. Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/solar/[state]/[district]/+page.server.ts
 * and the three `$lib/server` helpers it calls (`geo.ts`, `businesses.ts`,
 * `projects.ts`).
 *
 * The postal code, the lead count and the six-project gallery arrived with the
 * sections that render them (geo-listing.md §5 sections 4, 9 and the
 * LocalBusiness structured data in §10). The **subsidy row did not, and that
 * is deliberate**: the SvelteKit loader selects a `state_subsidies` row for
 * this page and never passes it to anything — `SubsidySection.svelte` takes
 * `city` and `pageUrl` only, and its content is hardcoded PM Surya Ghar copy.
 * It is a dead query, so it is not ported. If the section ever needs the row,
 * it comes back with a section that reads it.
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
import { cache } from 'react';
import { and, asc, count, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm';
import {
  businessAccounts,
  businessProfiles,
  geoLocations,
  leaddata,
  pincodeMapping,
  projects
} from '@solar/db/schema';
import { db } from '@/lib/server/db';
import { getCountry } from '@/lib/countries';
import type {
  CityLink,
  CountryHubData,
  DistrictPageData,
  InstallerProfile,
  InstallerRowData,
  LeafLoad,
  Level1Card,
  ProjectCard,
  ProjectDetail,
  ProjectListPage,
  ServiceArea,
  StateHubData,
  TopLevel2
} from './types';

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
 * The five page loaders, memoised for the life of one request.
 *
 * Every one of them is now called twice per page: once by `generateMetadata`
 * for the title and description, once by the page for the markup. React's
 * `cache` is what makes that one query rather than two — it keys on the
 * arguments and both callers pass the same ones, which is why the country and
 * slugs are lower-cased in the page before the call and not in here.
 *
 * Only these are wrapped. The helpers below them are called once, from
 * inside one of these, so a second entry would be a cache that never hits.
 */
export const getDistrict = cache(loadDistrict);
export const getLeaf = cache(loadLeaf);
export const getInstaller = cache(loadInstaller);
export const getCountryHub = cache(loadCountryHub);
export const getStateHub = cache(loadStateHub);
export const getProjectPage = cache(loadProjectPage);
export const getProjectList = cache(loadProjectList);

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
async function loadDistrict(
  country: string,
  level1Slug: string,
  level2Slug: string
): Promise<DistrictPageData | null> {
  // Throws on an unknown code. The page narrows with `isCountry` before
  // calling, so this is the internal invariant rather than the route guard.
  const { features } = getCountry(country);

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

  const [installers, cities, projectRows, leadCount, postalCode] = await Promise.all([
    loadInstallers(inLevel2, features.projects),
    getCities(country, level1Slug, level2Slug, inLevel2),
    features.projects ? getRecentProjects(level2) : Promise.resolve([]),
    getLeadCount(country, level2),
    features.pincodeLookup ? getPostalCode(level2) : Promise.resolve(null)
  ]);

  if (installers.length === 0) return null;

  return {
    country,
    level1,
    level1Slug,
    level2,
    level2Slug,
    installers,
    cities,
    projects: projectRows,
    leadCount,
    postalCode
  };
}

/**
 * The district's visible installers, ready to render, newest-work first.
 *
 * Extracted from `getDistrict` when the leaf page arrived, because the leaf
 * needs exactly this with one extra predicate — `LOWER(city) = LOWER(?)` for
 * the city variant, nothing for the size variant. `where` is the whole
 * predicate rather than an addition to a base one, so a caller cannot get the
 * country scoping by accident and then wonder why it is there.
 *
 * `withProjects` is `features.projects`: where it is off there is no project
 * table to summarise, so every row reports 0 and no thumbnail, which is what
 * the US rows already did.
 */
async function loadInstallers(
  where: ReturnType<typeof and>,
  withProjects: boolean
): Promise<InstallerRowData[]> {
  const rows = await db
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
    .where(where);

  const slugs = rows.map((b) => b.slug).filter((x): x is string => x !== null);
  const projectsBySlug = withProjects
    ? await getProjectSummaries(slugs)
    : new Map<string, ProjectSummary>();

  return sortInstallers(
    rows
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
}

/**
 * The polymorphic leaf under a district — 356 pages. geo-listing.md §4.
 *
 * Resolution order is the SvelteKit `resolveLeafSlug`: city, then brand, then
 * the `{n}kw-solar-system` pattern, with the last two gated on
 * `features.seoContentFamilies` so a US slug can only ever be a city.
 *
 * **The brand step is not implemented**, deliberately, and it is not an
 * oversight to fix silently. `solar_brands` is empty on live — the table is a
 * provision — so the branch would query nothing 356 times a build to render a
 * page that has no design. `LeafLoad` names where it goes; adding it is a case
 * in that union plus a branch here, which is the whole reason this returns a
 * discriminated union instead of a city shape with flags.
 *
 * Returns `{ kind: 'redirect' }` rather than redirecting itself: this module
 * is the data seam and knows nothing about Next. The page turns it into a 301.
 */
async function loadLeaf(
  country: string,
  level1Slug: string,
  level2Slug: string,
  slug: string
): Promise<LeafLoad> {
  const { features } = getCountry(country);

  const place = await resolveLevel2(country, level1Slug, level2Slug);
  if (!place) return { kind: 'missing' };

  const { level1, level2 } = place;

  // Country + BOTH levels, for the reason getDistrict records: 438 US district
  // names occur in more than one state, so matching on level2 alone puts the
  // Arizona Yuma installer on the Colorado Yuma page. The SvelteKit leaf
  // loader has the same gap as the district loader had.
  const inLevel2 = and(
    eq(businessAccounts.countryCode, country),
    sql`LOWER(${businessProfiles.level1}) = LOWER(${level1})`,
    sql`LOWER(${businessProfiles.level2}) = LOWER(${level2})`,
    eq(businessProfiles.isvisible, true)
  );

  const common = { country, level1, level1Slug, level2, level2Slug };

  const city = await resolveCity(country, level1Slug, level2Slug, slug);
  if (city) {
    const inCity = and(inLevel2, sql`LOWER(${businessProfiles.city}) = LOWER(${city})`);

    const [installers, projectRows, postalCode] = await Promise.all([
      loadInstallers(inCity, features.projects),
      features.projects ? getRecentProjects(level2) : Promise.resolve([]),
      features.pincodeLookup ? getPostalCode(level2) : Promise.resolve(null)
    ]);

    // The city exists but has nothing of its own to list. 301 to the district,
    // which is the canonical listing — NOT a 404, and not a thin page.
    if (installers.length === 0) return { kind: 'redirect' };

    return {
      kind: 'city',
      ...common,
      city,
      citySlug: slug,
      installers,
      projects: projectRows,
      postalCode,
      siblingCities: await getSiblingCities(inLevel2, city)
    };
  }

  if (!features.seoContentFamilies) return { kind: 'missing' };

  // `brand` resolves here, between city and size. See the note above.

  const sizeMatch = slug.match(/^(\d+)kw-solar-system$/);
  if (sizeMatch) {
    const [installers, postalCode] = await Promise.all([
      // The size page lists the whole district: a 3 kW system is not a thing
      // an installer is filtered by, and the original does not pretend it is.
      loadInstallers(inLevel2, features.projects),
      features.pincodeLookup ? getPostalCode(level2) : Promise.resolve(null)
    ]);

    // A size page with no installers 404s rather than redirecting. There is no
    // "this size elsewhere" to send the reader to, and the district link in
    // the breadcrumb is the same destination a 301 would pick.
    if (installers.length === 0) return { kind: 'missing' };

    return { kind: 'size', ...common, sizeKw: Number(sizeMatch[1]), installers, postalCode };
  }

  return { kind: 'missing' };
}

/** Does this city slug exist in this district? Its display name if so. */
async function resolveCity(
  country: string,
  level1Slug: string,
  level2Slug: string,
  citySlug: string
): Promise<string | null> {
  const rows = await db
    .select({ city: geoLocations.city })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        eq(geoLocations.level1Slug, level1Slug),
        eq(geoLocations.level2Slug, level2Slug),
        eq(geoLocations.citySlug, citySlug)
      )
    )
    .limit(1);
  return rows[0]?.city ?? null;
}

/**
 * Up to 5 other cities in the district that have an installer, for the
 * "nearby areas" chips.
 *
 * Every chip is a link by construction — the query returns only cities with
 * businesses — so this needs none of the filtering §6 forced on the district's
 * chip row. The slug is derived from the business's city name rather than
 * joined back to geo_locations, which is what the SvelteKit original does; a
 * business city that has no geo_locations row therefore produces a chip
 * pointing at a slug that 404s. Carried across rather than fixed here: it
 * wants a join, and the join belongs with a measurement of how often it bites.
 */
async function getSiblingCities(
  inLevel2: ReturnType<typeof and>,
  currentCity: string
): Promise<{ name: string; slug: string }[]> {
  const rows = await db
    .selectDistinct({ city: sql<string>`${businessProfiles.city}` })
    .from(businessProfiles)
    .innerJoin(businessAccounts, accountOfProfile)
    .where(and(inLevel2, sql`LOWER(${businessProfiles.city}) != LOWER(${currentCity})`))
    .orderBy(businessProfiles.city)
    .limit(5);

  return rows
    .filter((r) => r.city)
    .map((r) => ({ name: r.city, slug: r.city.toLowerCase().replace(/\s+/g, '-') }));
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

/**
 * The district's six most recent installations, for the gallery.
 *
 * Note this keys on `projects.district`, a denormalised name on the project
 * row, not on the installers this page lists — so a project can appear here
 * whose business is not in the column above, and vice versa. That is the
 * SvelteKit behaviour and it is the right one for the section: it is "recent
 * work in this district", not "recent work by these installers".
 *
 * LOWER() on both sides for the usual casing reason. `level1` is NOT part of
 * the match, because the projects table has no state column to match on — a
 * project in Washington County, Oregon can surface on the Washington County,
 * Utah page. It affects the US only (features.projects is IN-only today) and
 * fixing it needs a column, not a predicate, so it is recorded rather than
 * papered over.
 */
async function getRecentProjects(level2: string): Promise<ProjectCard[]> {
  const rows = await db
    .select({
      id: projects.id,
      // business_slug and project_slug are nullable in the schema; the card
      // needs both, so rows missing either are dropped below rather than the
      // type widened. Same call CLAUDE.md asks for on the business columns.
      slug: projects.projectSlug,
      businessSlug: projects.businessSlug,
      title: projects.title,
      pincode: projects.pincode,
      projectDate: projects.projectDate,
      cloudinaryPublicId: projects.cloudinaryPublicId,
      imageUrl: projects.imageUrl
    })
    .from(projects)
    .where(and(sql`LOWER(${projects.district}) = LOWER(${level2})`, eq(projects.isvisible, true)))
    .orderBy(desc(projects.projectDate), desc(projects.createdAt))
    .limit(6);

  return rows.filter((r): r is ProjectCard => r.slug !== null && r.businessSlug !== null);
}

/**
 * Leads submitted from this district, for the social-proof line. Counted for
 * every country — the line is not feature-gated, only floored at 3.
 */
async function getLeadCount(country: string, level2: string): Promise<number> {
  const rows = await db
    .select({ total: count() })
    .from(leaddata)
    .where(
      and(eq(leaddata.countryCode, country), sql`LOWER(${leaddata.level2}) = LOWER(${level2})`)
    );
  return rows[0]?.total ?? 0;
}

/** One postal code in the district, for LocalBusiness structured data. */
async function getPostalCode(level2: string): Promise<string | null> {
  const rows = await db
    .select({ pincode: pincodeMapping.pincode })
    .from(pincodeMapping)
    .where(sql`LOWER(${pincodeMapping.district}) = LOWER(${level2})`)
    .limit(1);
  return rows[0]?.pincode ?? null;
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

/**
 * Archetype 1 — one installer profile. installer-profile.md §8.
 *
 * Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/installer/[installer_slug]/+page.server.ts:
 * one query for the business, then projects and service areas in parallel.
 *
 * Returns null where the SvelteKit loader throws 404 — the page turns it into
 * `notFound()`, for the same reason `getLeaf` returns `{ kind: 'redirect' }`
 * rather than redirecting: this module is the data seam and knows nothing
 * about Next.
 *
 * `postal_code` is selected here and is NOT the district lookup the geo pages
 * use: the business carries its own, which is what §10 asks for — the old page
 * passed `postalCode: ''` to LocalBusiness while the column sat in the table.
 */
async function loadInstaller(country: string, slug: string): Promise<InstallerProfile | null> {
  const { features } = getCountry(country);

  const rows = await db
    .select({
      // businessname, slug, city, services and brands are nullable in the
      // schema and restated non-null here, as the SvelteKit loader does:
      // every consumer treats them as required. `sql<T>` renders as the bare
      // column, so the SQL is unchanged. CLAUDE.md prefers restating the
      // existing contract over widening the components.
      name: sql<string>`${businessProfiles.businessname}`,
      slug: sql<string>`${businessProfiles.slug}`,
      description: businessProfiles.description,
      phone: businessProfiles.phonenumber,
      email: businessProfiles.email,
      website: businessProfiles.website,
      address: businessProfiles.address,
      city: sql<string>`${businessProfiles.city}`,
      level2: sql<string>`${businessProfiles.level2}`,
      level1: sql<string>`${businessProfiles.level1}`,
      postalCode: businessProfiles.postalCode,
      services: sql<number[]>`${businessProfiles.services}`,
      brands: sql<number[]>`${businessProfiles.brands}`,
      instagramId: businessProfiles.instagramId,
      googleMapsLink: businessProfiles.googleMapsLink
    })
    .from(businessProfiles)
    .innerJoin(businessAccounts, accountOfProfile)
    .where(
      and(
        eq(businessAccounts.countryCode, country),
        eq(businessProfiles.slug, slug),
        eq(businessProfiles.isvisible, true)
      )
    )
    // rscore is 0 on every row today, so this ordering picks arbitrarily among
    // duplicate slugs and the choice changes between deploys. businessname is
    // the tiebreaker that makes it stable — the same decision §8 and
    // `sortInstallers` above both record, for the same reason.
    .orderBy(sql`${businessProfiles.rscore} DESC NULLS LAST`, businessProfiles.businessname)
    .limit(1);

  const business = rows[0];
  if (!business) return null;

  // A branch office shows the parent company's work: `acme-solar-branch-12`
  // reads projects filed under `acme-solar`. Ported exactly — projects are
  // filed against the parent slug, so without this every branch page renders
  // an empty gallery.
  const mainSlug = slug.replace(/-branch-[a-zA-Z0-9]+$/, '');

  const [projectRows, serviceAreas] = await Promise.all([
    features.projects ? getBusinessProjects(mainSlug) : Promise.resolve([]),
    getServiceAreas(country, business.level1, business.level2)
  ]);

  return {
    country,
    ...business,
    services: business.services ?? [],
    brands: business.brands ?? [],
    // The district's own slugs, taken from the service-area rows rather than
    // derived from the name. Every one of those rows is in this district, so
    // they all carry the same pair, and they are the real slugs the geo routes
    // answer on. The SvelteKit page lowercases the district name and replaces
    // spaces instead, which is a guess that happens to be right most of the
    // time; null here means no geo row matched and the back link is simply not
    // rendered, rather than pointing at a 404.
    level1Slug: serviceAreas[0]?.level1Slug ?? null,
    level2Slug: serviceAreas[0]?.level2Slug ?? null,
    projects: projectRows,
    serviceAreas
  };
}

/**
 * This installer's most recent work, up to 12. Gated on `features.projects`
 * by the caller, which is IN-only today.
 *
 * Unlike the district gallery this keys on `business_slug`, so it really is
 * "work by this company" rather than "work in this place".
 */
async function getBusinessProjects(businessSlug: string): Promise<ProjectCard[]> {
  const rows = await db
    .select({
      id: projects.id,
      // Nullable in the schema, and the card needs both — rows missing either
      // are dropped rather than the type widened, as getRecentProjects does.
      slug: projects.projectSlug,
      businessSlug: projects.businessSlug,
      title: projects.title,
      pincode: projects.pincode,
      projectDate: projects.projectDate,
      cloudinaryPublicId: projects.cloudinaryPublicId,
      imageUrl: projects.imageUrl
    })
    .from(projects)
    .where(and(eq(projects.businessSlug, businessSlug), eq(projects.isvisible, true)))
    .orderBy(desc(projects.projectDate), desc(projects.createdAt))
    .limit(12);

  return rows.filter((r): r is ProjectCard => r.slug !== null && r.businessSlug !== null);
}

/**
 * Up to 20 cities in the installer's district, each linking to its city leaf.
 *
 * LOWER() on both sides of both names, because geo_locations and
 * business_profiles disagree on casing — the usual trap at the top of this
 * file. level1 is part of the match as well as level2, for the reason
 * `getDistrict` records: 438 US district names occur in more than one state.
 */
async function getServiceAreas(
  country: string,
  level1: string,
  level2: string
): Promise<ServiceArea[]> {
  return db
    .selectDistinct({
      city: geoLocations.city,
      level1Slug: geoLocations.level1Slug,
      level2Slug: geoLocations.level2Slug,
      citySlug: geoLocations.citySlug
    })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        sql`LOWER(${geoLocations.level1}) = LOWER(${level1})`,
        sql`LOWER(${geoLocations.level2}) = LOWER(${level2})`
      )
    )
    .orderBy(geoLocations.city)
    .limit(20);
}

/* ------------------------------------------------------------------------- *
 * Archetype 3 — the geo index. archetype/geo-index.md §6.
 *
 * Ported from apps/main-app/src/routes/[country=country]/(layout-1)/solar/
 * +page.server.ts and solar/[state]/+page.server.ts.
 *
 * Three things did NOT come across, each for a reason worth keeping:
 *
 *  - **`lastUpdated`.** The state loader computes a real `max()` over installer
 *    and project dates; the country loader sets `new Date().toISOString()`,
 *    which is "now", not a last-updated date. Neither page has ever rendered
 *    it. §9 question 5 asked compute-or-drop, and dropping is what the data
 *    supports — it takes the state hub's fifth query with it.
 *  - **The subsidy row.** §3 lists a subsidy callout on the state hub, gated on
 *    `features.subsidy` plus a published `state_subsidies` row. The table is
 *    EMPTY on live — 0 rows in any status, verified 2026-09-18 — so the gate
 *    can never open and the query would run on all 27 state pages to render
 *    nothing. Not ported, exactly as the district page's dead subsidy query
 *    was not (see the header of this file). It comes back with a populated
 *    table.
 *  - **The state hub's aggregate count query.** It returned `count()` over the
 *    same rows the per-level2 grouped query already covers, so the total is
 *    that query's counts summed. One query instead of two, same number.
 * ------------------------------------------------------------------------- */

/** Shape of the raw CTE below. Postgres COUNT(*) arrives as a string. */
type Level1Row = {
  level1: string;
  level1_slug: string;
  level2_count: string;
  covered_level2_count: string;
  installer_count: string;
};

/**
 * The country hub: every state with installers, plus the page's own totals.
 *
 * No null return and no 404 — `isCountry` in the page is the whole gate, since
 * a country either exists in the registry or it does not. A country with no
 * installers at all renders an empty grid rather than 404ing; that is a real
 * state of the directory, not a missing page.
 */
async function loadCountryHub(country: string): Promise<CountryHubData> {
  // Throws on an unknown code, like every other function here. The page
  // narrows with `isCountry` first.
  getCountry(country);

  const [level1Result, totalRows, topLevel2s] = await Promise.all([
    // A CTE, COUNT(*) FILTER and a correlated scalar subquery: kept verbatim
    // on the `sql` escape hatch rather than rebuilt with `$with`, because the
    // coverage arithmetic IS what the page displays (§2). CLAUDE.md asks for
    // each use of the hatch to be noted; this is the largest one in the app.
    //
    // `covered` is per level2 and `installer_count` per level1, which is why
    // the two cannot collapse into one aggregate: the first counts PLACES with
    // at least one installer, the second counts INSTALLERS.
    //
    // Both subqueries carry the account join by hand. Being raw SQL, this is
    // the one place the country predicate cannot be expressed through the
    // shared `accountOfProfile` helper above.
    db.execute<Level1Row>(sql`
      WITH level2s AS (
        SELECT g.level1, g.level1_slug, g.level2,
               EXISTS (
                 SELECT 1 FROM business_profiles b
                 JOIN business_accounts a ON a.source_id = b.account_business_id
                 WHERE a.country_code = ${country}
                   AND LOWER(b.level1) = LOWER(g.level1)
                   AND LOWER(b.level2) = LOWER(g.level2)
                   AND b.isvisible = true
               ) as covered
        FROM geo_locations g
        WHERE g.country_code = ${country}
        GROUP BY g.level1, g.level1_slug, g.level2
      )
      SELECT level1, level1_slug,
             COUNT(*) as level2_count,
             COUNT(*) FILTER (WHERE covered) as covered_level2_count,
             (SELECT COUNT(*) FROM business_profiles b
              JOIN business_accounts a ON a.source_id = b.account_business_id
              WHERE a.country_code = ${country}
                AND LOWER(b.level1) = LOWER(level2s.level1) AND b.isvisible = true) as installer_count
      FROM level2s
      GROUP BY level1, level1_slug
      ORDER BY level1 ASC
    `),
    db
      .select({ total: count() })
      .from(businessProfiles)
      .innerJoin(businessAccounts, accountOfProfile)
      .where(and(eq(businessAccounts.countryCode, country), eq(businessProfiles.isvisible, true))),
    getTopLevel2s(country)
  ]);

  const rows = level1Result.rows;

  // Zero-installer states are dropped from the grid but stay in the totals:
  // `totalLevel1Count` is the denominator of "22 of 36", so it has to count
  // the states that are not shown. Same for the two level2 sums.
  const level1s: Level1Card[] = rows
    .filter((r) => parseInt(r.installer_count) > 0)
    .map((r) => ({
      name: r.level1,
      slug: r.level1_slug,
      level2Count: parseInt(r.level2_count),
      coveredLevel2Count: parseInt(r.covered_level2_count),
      installerCount: parseInt(r.installer_count)
    }));

  const sum = (key: 'level2_count' | 'covered_level2_count') =>
    rows.reduce((total, r) => total + parseInt(r[key]), 0);

  return {
    country,
    level1s,
    topLevel2s,
    totalInstallers: totalRows[0]?.total ?? 0,
    level1Count: level1s.length,
    totalLevel1Count: rows.length,
    coveredLevel2Count: sum('covered_level2_count'),
    totalLevel2Count: sum('level2_count')
  };
}

/**
 * The districts with the deepest choice nationally — the country hub's second
 * way in, for a reader who does not know their state but wants somewhere with
 * real options.
 *
 * **Returns empty where the block would lie.** On US every covered county has
 * exactly one installer (verified on live 2026-09-18: six counties, all at 1),
 * so "where choice is deepest" would be six ties at one — a heading making a
 * claim the rows disprove. Districts at 1 are therefore dropped and the block
 * needs three survivors to exist at all. This is the same call §2 of the spec
 * makes about coverage generally: report it honestly or not at all.
 *
 * Grouping happens on LOWER() in SQL rather than in JS, because the sum across
 * casings has to be complete BEFORE the limit — business_profiles holds several
 * casings of one district name, and taking the top 8 of the unmerged rows would
 * split a district's installers across two entries and rank both too low.
 *
 * The slugs are a second query matched in JS on the level1+level2 pair, not on
 * level2 alone: 'jasper' is a county in Indiana, Illinois AND Missouri, so the
 * pair is the only key that identifies a place. The usual trap, one level up.
 */
async function getTopLevel2s(country: string): Promise<TopLevel2[]> {
  const level1Key = sql<string>`LOWER(${businessProfiles.level1})`;
  const level2Key = sql<string>`LOWER(${businessProfiles.level2})`;

  const counted = await db
    .select({ level1: level1Key, level2: level2Key, installerCount: count() })
    .from(businessProfiles)
    .innerJoin(businessAccounts, accountOfProfile)
    .where(and(eq(businessAccounts.countryCode, country), eq(businessProfiles.isvisible, true)))
    .groupBy(level1Key, level2Key)
    .having(sql`COUNT(*) > 1`)
    .orderBy(sql`COUNT(*) DESC`, level2Key)
    .limit(8);

  if (counted.length < 3) return [];

  // Both display names and both slugs, for the pairs that survived. geo rows
  // are per city, so this groups to one row per district.
  const geo = await db
    .select({
      level1: geoLocations.level1,
      level1Slug: geoLocations.level1Slug,
      level2: geoLocations.level2,
      level2Slug: geoLocations.level2Slug
    })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        inArray(
          sql`LOWER(${geoLocations.level2})`,
          counted.map((r) => r.level2)
        )
      )
    )
    .groupBy(
      geoLocations.level1,
      geoLocations.level1Slug,
      geoLocations.level2,
      geoLocations.level2Slug
    );

  const bySlugPair = new Map(
    geo.map((g) => [`${g.level1.toLowerCase()}|${g.level2.toLowerCase()}`, g])
  );

  return counted.flatMap((r) => {
    const place = bySlugPair.get(`${r.level1}|${r.level2}`);
    // No geo row means no slug, and a guessed slug is a 404. The district is
    // dropped rather than linked to one — the same call `getInstaller` makes
    // about its back link.
    if (!place) return [];
    return [
      {
        name: place.level2,
        slug: place.level2Slug,
        level1: place.level1,
        level1Slug: place.level1Slug,
        installerCount: r.installerCount
      }
    ];
  });
}

/**
 * The state hub: every district with installers, deepest first, plus the
 * coverage ratio the page states and draws.
 *
 * Returns null where the SvelteKit loader 404s — an unknown state slug. Note
 * this does NOT 404 a state with no installers, unlike the district page:
 * `/in/solar/sikkim` is a real place in the geography with an honest empty
 * answer, where a district page with no businesses is a thin page (§4 of
 * geo-listing.md). The empty state renders as a stated zero, not a 404.
 */
async function loadStateHub(country: string, level1Slug: string): Promise<StateHubData | null> {
  getCountry(country);

  const level1 = await resolveLevel1(country, level1Slug);
  if (!level1) return null;

  const [level2Rows, countRows] = await Promise.all([
    db
      .select({ level2: geoLocations.level2, level2Slug: geoLocations.level2Slug })
      .from(geoLocations)
      .where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level1Slug, level1Slug)))
      // geo rows are per city; this is the district list.
      .groupBy(geoLocations.countryCode, geoLocations.level2, geoLocations.level2Slug)
      .orderBy(asc(geoLocations.level2)),
    // A SEPARATE grouped query, not a correlated subquery in the select list
    // above. §6 records what happens otherwise: Drizzle renders an interpolated
    // column unqualified, so the correlation resolved inside business_profiles
    // and became `b.level2 = b.level2` — every district reported the state
    // total and the `> 0` filter stopped filtering.
    //
    // level1 is part of the match because district names repeat across states.
    db
      .select({ level2: businessProfiles.level2, installerCount: count() })
      .from(businessProfiles)
      .innerJoin(businessAccounts, accountOfProfile)
      .where(
        and(
          eq(businessAccounts.countryCode, country),
          sql`LOWER(${businessProfiles.level1}) = LOWER(${level1})`,
          eq(businessProfiles.isvisible, true)
        )
      )
      .groupBy(businessProfiles.level2)
  ]);

  // Keyed on LOWER(level2) because geo_locations and business_profiles do not
  // agree on casing, and SUMMED because business_profiles holds several
  // casings of one name — two rows that are one district.
  const countByLevel2 = new Map<string, number>();
  for (const row of countRows) {
    if (!row.level2) continue;
    const key = row.level2.toLowerCase();
    countByLevel2.set(key, (countByLevel2.get(key) ?? 0) + row.installerCount);
  }

  const level2s = level2Rows
    .map((r) => ({
      name: r.level2,
      slug: r.level2Slug,
      installerCount: countByLevel2.get(r.level2.toLowerCase()) ?? 0
    }))
    .filter((r) => r.installerCount > 0)
    .sort((a, b) => b.installerCount - a.installerCount || a.name.localeCompare(b.name));

  return {
    country,
    level1,
    level1Slug,
    level2s,
    // Summed over the RAW rows, not over `level2s`: a business whose level2
    // matches no geo row is still an installer in this state, and it would
    // vanish from the headline number if the cards were the source. This is
    // exactly what the aggregate query the port dropped used to return.
    installerCount: countRows.reduce((total, r) => total + r.installerCount, 0),
    level2Count: level2s.length,
    totalLevel2Count: level2Rows.length
  };
}

/** The 404 gate for the state hub: does this country/state exist in geo_locations? */
async function resolveLevel1(country: string, level1Slug: string): Promise<string | null> {
  const rows = await db
    .select({ level1: geoLocations.level1 })
    .from(geoLocations)
    .where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level1Slug, level1Slug)))
    .limit(1);
  return rows[0]?.level1 ?? null;
}

/* ------------------------------------------------------------------------- *
 * The projects surface.
 *
 * Ported from apps/main-app/src/lib/server/projects.ts (`listVisibleProjects`)
 * and the project detail loader. Both live here rather than in a seam of
 * their own: they read `projects`, which this file already reads twice for
 * the two galleries, and the row they return is the same `ProjectCard`.
 * ------------------------------------------------------------------------- */

/**
 * Nine per page, from the SvelteKit loaders. At 144 visible rows that is 16
 * pages. It is exported because the route builds `generateStaticParams` and
 * the pager from the same number, and two copies of a page size is how an
 * off-by-one page appears at the end of a list.
 */
export const PROJECTS_PER_PAGE = 9;

/**
 * Visible projects with a business, newest first.
 *
 * `isNotNull(businessSlug)` is in the predicate rather than a filter after
 * the fact, and that matters here in a way it does not for the galleries: the
 * count query has to apply the same rule as the page query, or the last page
 * of the pager is short or empty. The galleries drop such rows in JS because
 * they take a fixed six and have no total to agree with.
 */
async function loadProjectList(page: number): Promise<ProjectListPage> {
  const visible = and(eq(projects.isvisible, true), isNotNull(projects.businessSlug));

  const [rows, countRows] = await Promise.all([
    db
      .select({
        id: projects.id,
        slug: projects.projectSlug,
        businessSlug: projects.businessSlug,
        title: projects.title,
        pincode: projects.pincode,
        projectDate: projects.projectDate,
        cloudinaryPublicId: projects.cloudinaryPublicId,
        imageUrl: projects.imageUrl
      })
      .from(projects)
      .where(visible)
      // createdAt breaks the tie, as the galleries do. project_date is a date
      // with no time, so same-day rows are otherwise in whatever order
      // Postgres returns — which reshuffles the pager between deploys.
      .orderBy(desc(projects.projectDate), desc(projects.createdAt))
      .limit(PROJECTS_PER_PAGE)
      .offset((page - 1) * PROJECTS_PER_PAGE),
    db.select({ total: count() }).from(projects).where(visible)
  ]);

  const total = countRows[0]!.total;

  return {
    // projectSlug is nullable in the schema and the card needs it. The
    // predicate above cannot express that without also changing the count, so
    // the rows are narrowed here; a project with no slug has no URL to be a
    // link to, so there is nothing to render anyway.
    projects: rows.filter((r): r is ProjectCard => r.slug !== null && r.businessSlug !== null),
    page,
    totalPages: Math.ceil(total / PROJECTS_PER_PAGE),
    total
  };
}

/** "Maharashtra" -> "maharashtra", "Pimpri Chinchwad" -> "pimpri-chinchwad". */
function slugify(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toLowerCase().replace(/\s+/g, '-') : null;
}

/**
 * One project and the installer that built it.
 *
 * An inner join on `business_slug`, and both sides must be visible: a project
 * whose installer has been hidden is not a project the site can attribute, and
 * the page is almost entirely attribution.
 */
async function loadProjectPage(slug: string): Promise<ProjectDetail | null> {
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.projectSlug,
      businessSlug: projects.businessSlug,
      title: projects.title,
      pincode: projects.pincode,
      projectDate: projects.projectDate,
      cloudinaryPublicId: projects.cloudinaryPublicId,
      imageUrl: projects.imageUrl,
      projectDistrict: projects.district,
      projectCity: projects.city,
      businessName: businessProfiles.businessname,
      businessCity: businessProfiles.city,
      businessLevel1: businessProfiles.level1,
      businessLevel2: businessProfiles.level2
    })
    .from(projects)
    .innerJoin(businessProfiles, eq(projects.businessSlug, businessProfiles.slug))
    .where(
      and(
        eq(projects.projectSlug, slug),
        eq(projects.isvisible, true),
        eq(businessProfiles.isvisible, true)
      )
    )
    .limit(1);

  const row = rows[0];
  // `businessname` is nullable in the schema, and this page is almost entirely
  // attribution — the h1 credits it, the breadcrumb names it and two links
  // point at its profile. A row without one has no page to render, so it 404s
  // rather than the type being widened to let "null" reach the markup. The
  // SvelteKit loader forced it with `sql<string>` instead, which is the same
  // trap CLAUDE.md's note on the business columns warns about.
  if (!row || row.slug === null || row.businessSlug === null || row.businessName === null) {
    return null;
  }

  // The project's own district where it has one, the installer's otherwise —
  // the SvelteKit loader's fallback. The geo links below are built from the
  // BUSINESS's state either way, because `projects` has no state column.
  const district = row.projectDistrict || row.businessLevel2;

  return {
    project: {
      id: row.id,
      slug: row.slug,
      businessSlug: row.businessSlug,
      title: row.title,
      pincode: row.pincode,
      projectDate: row.projectDate,
      cloudinaryPublicId: row.cloudinaryPublicId,
      imageUrl: row.imageUrl,
      district,
      city: row.projectCity
    },
    business: {
      name: row.businessName,
      slug: row.businessSlug,
      city: row.businessCity,
      level1: row.businessLevel1,
      level2: row.businessLevel2
    },
    level1Slug: slugify(row.businessLevel1),
    level2Slug: slugify(district)
  };
}

/**
 * Geography lookups for the legacy redirect shims, ported from
 * apps/main-app/src/lib/server/geo.ts.
 *
 * They live here rather than in the shims because they read geo_locations,
 * and every query against it belongs in this seam. They are separate from
 * `resolveLevel2` above on purpose: that one is a 404 gate and returns the
 * display names a page prints, while these return the precomputed slugs a
 * redirect target is built from.
 *
 * None are wrapped in `cache`: a redirect handler calls one of them once and
 * then returns, so there is no second caller to hit the cache.
 */

/** The canonical slugs for a state/county pair, or null if the pair does not exist. */
export async function findLevel2(
  country: string,
  level1Slug: string,
  level2Slug: string
): Promise<{ level1Slug: string; level2Slug: string } | null> {
  const rows = await db
    .select({ level1Slug: geoLocations.level1Slug, level2Slug: geoLocations.level2Slug })
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
 * The state for a bare level2 slug. Legacy URLs carry no state segment
 * ("/us/county/orange"), so the first match wins — the slug is not unique
 * across states and the old URL has no way to say which one it meant.
 */
export async function findLevel1ForLevel2(
  country: string,
  level2Slug: string
): Promise<{ level1Slug: string; level2Slug: string } | null> {
  const rows = await db
    .select({ level1Slug: geoLocations.level1Slug, level2Slug: geoLocations.level2Slug })
    .from(geoLocations)
    .where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level2Slug, level2Slug)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * A city by slug, optionally scoped to a state. The legacy city directory URL
 * never carried the county, so the full path has to be rebuilt from the row.
 */
export async function findCity(
  country: string,
  citySlug: string,
  level1Slug?: string
): Promise<{ level1Slug: string; level2Slug: string; citySlug: string } | null> {
  const rows = await db
    .select({
      level1Slug: geoLocations.level1Slug,
      level2Slug: geoLocations.level2Slug,
      citySlug: geoLocations.citySlug
    })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        eq(geoLocations.citySlug, citySlug),
        level1Slug ? eq(geoLocations.level1Slug, level1Slug) : undefined
      )
    )
    .limit(1);
  return rows[0] ?? null;
}
