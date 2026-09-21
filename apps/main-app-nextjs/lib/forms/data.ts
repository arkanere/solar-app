/**
 * The data seam for the lead-forms surface: `/business-form`, `/partners/join`
 * and the two thank-you pages that read a row.
 *
 * Its own file rather than lib/directory/data.ts for the reason lib/stats.ts
 * and lib/tools/data.ts give: that seam's header says every query in it is
 * scoped to a country, a place or a profile, and renders a directory page.
 * These back FORMS — two of them serve a fetch from a client component
 * mid-typing rather than a render — and one of them reads `leaddata`, which
 * the directory seam never writes or reads by key.
 *
 * Ported from apps/main-app/src/lib/server/geo.ts (the two level lookups) and
 * the `thank-you` and `partners/join/{district_slug}` loaders.
 *
 * Two things carried across deliberately:
 *
 *  - **the level lookups are not filtered to places with installers.**
 *    `getLevel2sForLevel1` in SvelteKit takes a `withBusinessesOnly` option
 *    and the geo endpoints never pass it. A business signing up is telling us
 *    where it works; restricting the select to districts that already have a
 *    listing would make the first installer in a district unable to sign up.
 *  - **the partner-district counts key on LOWER().** `geo_locations` and
 *    `business_profiles` disagree on casing, the trap geo-listing.md §9
 *    records, so the nearby-district counts are a separate grouped query
 *    matched on a lower-cased key rather than a correlated subquery.
 */
import { cache } from 'react';
import { and, asc, count, countDistinct, eq, sql } from 'drizzle-orm';
import { businessProfiles, geoLocations, leaddata } from '@solar/db/schema';
import { db } from '@/lib/server/db';

/** A geo option as the two form endpoints return it: display name plus slug. */
export type GeoOption = { name: string; slug: string };

/**
 * The level2 areas (districts/counties) of a state, by its slug.
 *
 * `selectDistinct` because `geo_locations` is one row per CITY: a district
 * with 40 cities is 40 rows here, and the select would otherwise repeat it 40
 * times.
 */
export async function getLevel2sForLevel1(
  country: string,
  level1Slug: string
): Promise<GeoOption[]> {
  const rows = await db
    .selectDistinct({ name: geoLocations.level2, slug: geoLocations.level2Slug })
    .from(geoLocations)
    .where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level1Slug, level1Slug)))
    .orderBy(asc(geoLocations.level2));
  return rows;
}

/** The cities of a level2 area. One row per city already, so no DISTINCT. */
export async function getCitiesForLevel2(
  country: string,
  level1Slug: string,
  level2Slug: string
): Promise<GeoOption[]> {
  const rows = await db
    .select({ name: geoLocations.city, slug: geoLocations.citySlug })
    .from(geoLocations)
    .where(
      and(
        eq(geoLocations.countryCode, country),
        eq(geoLocations.level1Slug, level1Slug),
        eq(geoLocations.level2Slug, level2Slug)
      )
    )
    .orderBy(asc(geoLocations.city));
  return rows;
}

export type PartnerDistrict = {
  state: string;
  district: string;
  districtSlug: string;
  installerCount: number;
  recentLeadCount: number;
  cityCount: number;
  nearbyDistricts: { name: string; slug: string; installerCount: number }[];
};

/**
 * The recruiting figures for one district's partner landing. IN-only in
 * practice: the route is only linked from IN pages and the slug space is the
 * IN geo tree, but the country is a parameter rather than a constant so the
 * page's own guard is the only place that decides.
 *
 * Returns null rather than throwing on an unknown slug; the page 404s.
 */
async function loadPartnerDistrict(
  country: string,
  districtSlug: string
): Promise<PartnerDistrict | null> {
  // geo_locations carries the precomputed slug, so this is an indexed lookup
  // and not the LOWER(REPLACE(...)) scan the pre-042 version needed.
  const locationRows = await db
    .selectDistinct({ state: geoLocations.level1, district: geoLocations.level2 })
    .from(geoLocations)
    .where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level2Slug, districtSlug)))
    .limit(1);

  if (locationRows.length === 0) return null;
  const { state, district } = locationRows[0];

  const [installerRows, leadRows, cityRows, nearbyRows] = await Promise.all([
    db
      .select({ total: count() })
      .from(businessProfiles)
      .where(
        and(
          sql`LOWER(${businessProfiles.level2}) = LOWER(${district})`,
          eq(businessProfiles.isvisible, true)
        )
      ),
    db
      .select({ total: count() })
      .from(leaddata)
      .where(
        and(
          sql`LOWER(${leaddata.level2}) = LOWER(${district})`,
          sql`${leaddata.createdAt} > NOW() - INTERVAL '30 days'`
        )
      ),
    db
      .select({ total: countDistinct(geoLocations.city) })
      .from(geoLocations)
      .where(
        and(
          eq(geoLocations.countryCode, country),
          sql`LOWER(${geoLocations.level2}) = LOWER(${district})`
        )
      ),
    db
      .selectDistinct({ name: geoLocations.level2, slug: geoLocations.level2Slug })
      .from(geoLocations)
      .where(
        and(
          eq(geoLocations.countryCode, country),
          sql`LOWER(${geoLocations.level1}) = LOWER(${state})`,
          sql`LOWER(${geoLocations.level2}) != LOWER(${district})`
        )
      )
      .orderBy(asc(geoLocations.level2))
      .limit(6)
  ]);

  // Its own grouped query, not a correlated subquery in the select list
  // above: Drizzle renders an interpolated column unqualified there, so
  // `LOWER(b.level2) = LOWER(level2)` resolves both sides against
  // business_profiles and every district reports the state total.
  const nearbyCountRows = await db
    .select({ district: businessProfiles.level2, total: count() })
    .from(businessProfiles)
    .where(
      and(
        sql`LOWER(${businessProfiles.level1}) = LOWER(${state})`,
        eq(businessProfiles.isvisible, true)
      )
    )
    .groupBy(businessProfiles.level2);

  const nearbyCounts = new Map<string, number>();
  for (const row of nearbyCountRows) {
    if (!row.district) continue;
    const key = row.district.toLowerCase();
    nearbyCounts.set(key, (nearbyCounts.get(key) ?? 0) + row.total);
  }

  return {
    state,
    district,
    districtSlug,
    installerCount: installerRows[0]?.total ?? 0,
    recentLeadCount: leadRows[0]?.total ?? 0,
    cityCount: cityRows[0]?.total ?? 0,
    nearbyDistricts: nearbyRows.map((r) => ({
      name: r.name,
      slug: r.slug,
      installerCount: nearbyCounts.get(r.name.toLowerCase()) ?? 0
    }))
  };
}

export type LeadReceipt = {
  name: string;
  phone: string;
  email: string | null;
  postalCode: string;
  district: string | null;
  type: string | null;
  comment: string | null;
  /**
   * Nullable because `leaddata.created_at` is: it has a CURRENT_TIMESTAMP
   * default but no NOT NULL, so the column can hold one. The page drops the
   * row rather than printing "Invalid Date".
   */
  submittedAt: string | null;
  /** Whether anyone visible can actually be matched to this lead's district. */
  hasVerifiedInstaller: boolean;
};

/**
 * The lead behind `/{cc}/thank-you?ref={uuid}`.
 *
 * **IN-only, and the caller enforces that.** `reference_uuid` is returned by
 * `insertLead` for IN alone (lib/server/leads.ts records why), so a US visitor
 * never has a `ref` to present.
 *
 * `isvisible` is the gate: the column is the operator's "this lead is real"
 * flag, and a hidden lead reads as not found rather than as a receipt. The
 * uuid is unguessable, which is the whole access control here — there is no
 * session, so anyone holding the link sees the row. That is what the
 * SvelteKit page does and the link only ever reaches the person who submitted.
 */
async function loadLeadReceipt(referenceUuid: string): Promise<LeadReceipt | null> {
  const leadRows = await db
    .select({
      name: leaddata.name,
      phone: leaddata.phone,
      email: leaddata.email,
      postalCode: leaddata.postalCode,
      district: leaddata.level2,
      type: leaddata.type,
      comment: leaddata.comment,
      createdAt: leaddata.createdAt,
      isvisible: leaddata.isvisible
    })
    .from(leaddata)
    .where(eq(leaddata.referenceUuid, referenceUuid))
    .limit(1);

  const lead = leadRows[0];
  if (!lead || !lead.isvisible) return null;

  // No district means nothing to check, and the SvelteKit loader treats both
  // that and a failed check as "yes" — the page's fallback copy promises a
  // call either way, so the optimistic default is the one that matches it.
  let hasVerifiedInstaller = true;
  if (lead.district) {
    try {
      const businessRows = await db
        .select({ total: count() })
        .from(businessProfiles)
        .where(
          and(eq(businessProfiles.level2, lead.district), eq(businessProfiles.isvisible, true))
        );
      hasVerifiedInstaller = (businessRows[0]?.total ?? 0) > 0;
    } catch (error) {
      console.error('Error checking installers in district:', error);
    }
  }

  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    postalCode: lead.postalCode,
    district: lead.district,
    type: lead.type,
    comment: lead.comment,
    submittedAt: lead.createdAt,
    hasVerifiedInstaller
  };
}

/**
 * Memoised for the life of one request, as the directory loaders are: each is
 * called once by `generateMetadata` and once by the page.
 *
 * The two geo lookups above are NOT wrapped. Their only callers are the two
 * route handlers, which call one of them once and return — a cache with no
 * second caller to hit it.
 */
export const getPartnerDistrict = cache(loadPartnerDistrict);
export const getLeadReceipt = cache(loadLeadReceipt);
