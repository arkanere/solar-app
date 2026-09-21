/**
 * Platform-wide counts. The only consumer today is /about-us.
 *
 * Its own file rather than lib/directory/data.ts because none of these is a
 * directory query: they are not scoped to a country, a place or a profile,
 * and the seam comment in that file says every query in it is one of those.
 * Same reason lib/editorial/data.ts is separate.
 *
 * Ported from two SvelteKit loaders, which is why it is one function here:
 * `(layout-1)/+layout.server.ts` supplied the installer and lead counts to
 * every page under that layout, and `about-us/+page.server.ts` added the
 * city count. Only /about-us ever rendered any of them, so the layout-wide
 * load is not carried across — this is called by the one page that uses it.
 *
 * Three things the SvelteKit versions settle, all kept:
 *
 *  - **installers are `business_accounts`, not `business_profiles`.** An
 *    account is a company; a profile is one of its branches. The page says
 *    "Installers on the Platform", so the account is the right unit.
 *  - **the counts are platform-wide, not per-country.** The country tree
 *    changed to match this on 2026-08-21, after /in and /about-us disagreed
 *    (3196 vs 3199).
 *  - **cities are counted from visible profiles**, not from `geo_locations`.
 *    The page once claimed "5,000+ Cities & Towns" off the reference table of
 *    every city in the country (8,043 IN / 20,940 US); what it means is
 *    places where someone can actually be matched, which is ~356.
 */
import { cache } from 'react';
import { and, count, countDistinct, eq, isNotNull, ne } from 'drizzle-orm';
import { businessAccounts, businessProfiles, leaddata } from '@solar/db/schema';
import { db } from '@/lib/server/db';

export type PlatformStats = {
  installerCount: number;
  citiesServed: number;
  leadsGenerated: number;
};

/**
 * `LEADS_BEFORE_LEADDATA` is carried across verbatim from the SvelteKit
 * loader, which returns `leadRows[0].count + 2000`. It is an offset for
 * enquiries handled before the table existed, and it is not derivable from
 * anything in the database — so it is named here rather than left as a bare
 * `+ 2000` in an expression. **It is a claim about history that only the
 * business can confirm**; if it cannot be sourced, the honest fix is to drop
 * it and let the page print the real row count.
 */
const LEADS_BEFORE_LEADDATA = 2000;

async function loadPlatformStats(): Promise<PlatformStats> {
  const [installerRows, leadRows, cityRows] = await Promise.all([
    db.select({ count: count() }).from(businessAccounts).where(eq(businessAccounts.isActive, true)),
    db.select({ count: count() }).from(leaddata),
    db
      .select({ count: countDistinct(businessProfiles.city) })
      .from(businessProfiles)
      .where(
        and(
          eq(businessProfiles.isvisible, true),
          isNotNull(businessProfiles.city),
          ne(businessProfiles.city, '')
        )
      )
  ]);

  return {
    installerCount: installerRows[0].count,
    citiesServed: cityRows[0].count,
    leadsGenerated: leadRows[0].count + LEADS_BEFORE_LEADDATA
  };
}

/** Memoised for the life of one request, as the directory loaders are. */
export const getPlatformStats = cache(loadPlatformStats);
