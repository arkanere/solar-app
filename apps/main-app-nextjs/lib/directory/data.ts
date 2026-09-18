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
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
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
  DistrictPageData,
  InstallerProfile,
  InstallerRowData,
  LeafLoad,
  ProjectCard,
  ServiceArea
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
export async function getLeaf(
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

  return rows.filter(
    (r): r is ProjectCard => r.slug !== null && r.businessSlug !== null
  );
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
export async function getInstaller(
  country: string,
  slug: string
): Promise<InstallerProfile | null> {
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
