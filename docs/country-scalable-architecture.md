# SolarVipani Overhaul: Country-Scalable Architecture (Phase 1 — main-app)

> **STATUS (2026-07-19): Phase 1 IMPLEMENTED + Phase 2.1 (business-app) + Phase 2.2
> (user-app + main-app writers) COMPLETE** on branch `refactor/country-scalable-architecture`.
> Migrations 042–047 are applied to the live DB. business-app, user-app, and main-app all
> read the unified tables and dual-write them (legacy-table write + explicit `sv_sync_*`
> call); the sync triggers now exist only for the external admin-app.
> See "Implementation status" and "Next steps" at the end of this document.
> Blogs feature removed entirely 2026-07-19 (see item 3); run `048-drop-blogs.sql` manually.
> **admin-app migrated 2026-07-19** (solar-app-internal repo, 3 commits on main): IN business
> reads/writes on the profile/account split tables, every legacy-table write followed by an
> explicit `sv_sync_*` call, blog management deleted. automation-scripts verified to write no
> legacy lead/business tables. **Phase 2.4 (drop the 040/043/045/046 triggers) is now
> unblocked** — every writer in every app projects its own writes into the unified tables.

## Context

The site is currently forked per country at every layer: `/in` and `/us` are separate route trees with different shapes (IN: nested `solar/[state]/[district]/[city]`; US: flat `state/`, `county/`, `solar-panel-installer-directory/` pages), duplicated component trees (`lib/in/` vs `lib/us/`), separate sitemap generators, and separate tables (`businesses_1`/`leaddata`/`locations` vs `us_businesses`/`us_leaddata`/`us_locations`). Adding a third country would mean forking everything again.

Goal: one country-scalable application — unified tables with a `country_code` column, one route tree `/[country]/...`, and a per-country config layer that resolves terminology differences (district vs county) at the abstraction level, not in forked code.

**Decisions made with user:**
- Scope: **main-app only** first; business-app/user-app migrate in a later phase.
- Geo model: **generic levels + per-country labels** (level1 = state, level2 = district/county); display words come from country config.
- URL scheme: **keep the `solar` segment** → `/[country]/solar/[state]/[level2]/[city]`. All indexed IN geo URLs stay identical (zero IN redirects); only US URLs change.
- Old US URLs: **301 redirects** to new structure.
- Data: **new tables via one-time SQL copy; old tables untouched** (business-app/user-app keep working against them).
- Lead coexistence: **dual-insert in app code** (new `leads` + old country table, one transaction).

## Key existing files (reuse/generalize, don't reinvent)

- `apps/main-app/src/lib/server/db.ts` — single `pool` (US pages currently call `createPool()` inline; unify on this)
- `apps/main-app/src/lib/server/queries.ts` — `getTopDistricts` etc. (generalize)
- `apps/main-app/src/lib/server/slug-resolver.ts` — `resolveGeoSlug` (IN-only; generalize), `resolveSubsidySlug`/`resolveBrandSlug` (keep)
- `apps/main-app/src/lib/server/sitemap.ts` — IN sitemap generator (parameterize by country)
- `apps/main-app/src/lib/server/migrations/039-business-profiles.sql` — pattern for copy + sync-trigger migrations
- `apps/main-app/src/lib/seo.ts` — `breadcrumbLD`, `faqLD`, `localBusinessLD` (extend for country)
- `apps/main-app/src/lib/us/stateAbbreviations.js` — `stateToAbbr`/reverse (move to `lib/countries/us-states.ts`, needed for redirects)
- `apps/main-app/src/routes/in/(layout-1)/solar/[state]/[district]/+page.server.ts` — template for unified geo pages
- `apps/main-app/src/routes/us/(layout-1)/county/[county_slug]/+page.server.js` — US slug-suffix parsing (`orange-ca`) the redirects must replicate
- `apps/main-app/src/hooks.server.ts` — redirect home (currently only `/business/` cross-domain redirect; vercel.json has NO redirects block despite the comment)

## Step 1 — DB migrations (new files, 042+; old tables never altered)

All in `apps/main-app/src/lib/server/migrations/`, run manually via psql, `BEGIN/COMMIT`, idempotent.

**042-countries-and-geo.sql**
- `countries(code CHAR(2) PK, name, is_active)` — seed 'in', 'us'.
- `geo_locations(id, country_code FK, level1, level2, city, level1_slug, level2_slug, city_slug, UNIQUE(country_code, level1_slug, level2_slug, city_slug))` + index on `(country_code, level1_slug, level2_slug)`.
- SQL helper `sv_slugify(text)` matching the existing `LOWER(REPLACE(...))` convention in sitemap.ts.
- Copy: `locations` → 'in' rows; `us_locations` → 'us' rows (county → level2, **no `-ca` abbreviation suffix in slugs** — state is its own path segment now). `ON CONFLICT DO NOTHING` + post-copy count checks.
- Pre-check: run a duplicates query on `us_locations` (same county name in two states, same city in two counties) before finalizing.

**043-businesses.sql**
- `businesses(id, country_code, source_id, slug, businessname, email, phonenumber, whatsapp, description, website, instagram_id, google_maps_link, address, pluscode, services INT[], brands INT[], tax_id, level1, level2, city, postal_code, rscore, tag, notes, businessfilled, tier3, isvisible, created_at, updated_at, UNIQUE(country_code, source_id))`. Profile only — **no auth columns** (auth stays in old tables; business login is business-app scope).
- Copy IN from `in_business_profiles` (the clean projection, not `businesses_1`); copy US from `us_businesses` minus login columns (county → level2). **Verify `us_businesses` full column list against live DB (`\d us_businesses`) first** — it has no schema file.
- Sync triggers (old → new): `AFTER INSERT OR UPDATE` on `in_business_profiles` and `us_businesses` upserting into `businesses` keyed by `(country_code, source_id)` — same pattern as 039's `sync_business_profile()`. Business-app edits keep flowing in; main-app only reads.
- Slug uniqueness as a **partial unique index** on `(country_code, slug)` excluding known-bad values (039 found duplicate/'incorrect' IN slugs) — not a hard constraint.

**044-leads.sql**
- `leads(id, country_code, source_id, name, phone, email, postal_code, type, comment, urlparams, level1, level2, marketing_consent, svnotes, isvisible, created_at, UNIQUE(country_code, source_id))`.
- Copy from `leaddata` ('in': state→level1, district→level2, pin_code→postal_code) and `us_leaddata` ('us': county→level2). **Verify exact old column lists against live DB before writing SELECTs.**
- New submissions: dual-insert handled in app code (Step 4), not triggers.

**Deferred:** unified branches (only if main-app renders them — check), unified blogs (IN stays on `in_blogs`; US static blog folders stay as-is — content migration, not architecture).

## Step 2 — Country config abstraction

New `apps/main-app/src/lib/countries/`:
- `types.ts` — `CountryConfig`: code, name, locale, currency, `levels.level1/level2 {singular, plural}` ("State"/"District" vs "State"/"County"), `postalCode {label, pattern, length}` (PIN 6 vs ZIP 5), phone prefix/pattern, `features` flags (seoContentFamilies, subsidy, financing, tools, dynamicBlogs, authors, projects, chatbot), installer noun for SEO copy. Keep configs serializable (regexes as strings) so they can pass through load functions.
- `in.ts`, `us.ts`, `index.ts` (`COUNTRIES`, `getCountry`, `isCountry`), `urls.ts` (`geoUrl(country, l1, l2?, city?)` — single source of truth for URL building, used by pages, sitemap, redirects), `us-states.ts` (moved abbreviation maps).
- `apps/main-app/src/params/country.ts` param matcher: `match = (v) => v in COUNTRIES`.

## Step 3 — Unified data layer (`apps/main-app/src/lib/server/`)

- `geo.ts` (new): `resolveLevel1/resolveLevel2/resolveCity` (exact slug-column lookups on `geo_locations` — indexable, replaces `LOWER(REPLACE(...))` scans), `getLevel2sForLevel1`, `getCitiesForLevel2`, `getTopLevel2s` (generalizes `getTopDistricts`).
- `businesses.ts` (new): `getBusinessesByLevel2`, `getBusinessBySlug`, `getBusinessesByCity` — against new `businesses`.
- `leads.ts` (new): `insertLead(country, payload)` — transaction inserting into `leads` + old `leaddata`/`us_leaddata` (dual-insert; removable when business-app migrates).
- `slug-resolver.ts`: generalize `resolveGeoSlug` to take country; brand/size fallbacks gated on `features.seoContentFamilies` (so US city pages never resolve brand slugs).
- `sitemap.ts`: `generateSitemapEntries(pool, country)` — geo from `geo_locations` JOIN `businesses`, installers from `businesses`, IN-only sections behind feature flags. Both country sitemaps call it; delete the self-contained US generator.

## Step 4 — New route tree

Build `routes/[country=country]/` **alongside** existing trees (literal `in/`/`us/` win over `[country]`, so nothing changes until old dirs are deleted):

```
routes/[country=country]/(layout-1)/
  +layout.server.ts        # resolve CountryConfig → data.country; hreflang/<html lang>
  +page.svelte             # country home
  solar/+page.server.ts    # geo hub
  solar/[state]/…/[district]/…/[district]/[slug]/…   # level2 + city leaf (IN brand/size fallback gated)
  installer/[installer_slug]/
  business-form, business-listing, get-quotes, thank-you*, about-us,
  privacy-policy, terms-of-use, write-for-us, unsubscribe,
  recent-solar-installation-projects/[page_slug], project/[project_id]
routes/[country=country]/api/
  submitLead (dual-insert), submitBusiness, getCities,
  getLevel2s (replaces getDistricts/getCounties),
  getLevel2ByPostalCode (IN pincode_mapping; gated per country)
routes/[country=country]/sitemap.xml/+server.ts
```

**IN-only content families stay physically under `routes/in/(layout-1)/`** (rooftop-solar, solar-panels, solar-inverters, solar-pumps, solar-subsidy, solar-financing, solar-installation, tools, blogs, authors, seo-index, partners, data-access, data-deletion). Rationale: literal routes coexist cleanly with `[country]`; feature-flag-404ing dozens of content routes adds risk for no benefit. Final state: `routes/[country]/` (shared marketplace core) + `routes/in/` (IN content) + `routes/us/` (redirect shims + static US blogs).

Carry over ISR configs (`isr.expiration`) onto new pages.

## Step 5 — Redirect layer

String-rewrite redirects in `hooks.server.ts` (no DB; preserve existing `/business/` redirect); DB-dependent ones as thin shims at the old route paths doing one `geo_locations` query then `redirect(301, …)`:

| Old | New | Where |
|---|---|---|
| `/in/solar/...`, `/in/installer/{slug}` | unchanged | — |
| `/us/state` | `/us/solar` | hooks |
| `/us/state/solar-panel-installers-in-{state}` | `/us/solar/{state}` | hooks |
| `/us/county/{county}-{abbr}` | `/us/solar/{stateName}/{county}` | hooks (abbr map); suffix-less legacy slugs → DB shim |
| `/us/solar-panel-installer-directory` | `/us/solar` | hooks |
| `/us/solar-panel-installer-directory/{city}-{abbr}` | `/us/solar/{state}/{level2}/{city}` | DB shim (needs county lookup) |
| `/us/solar-panel-installer/{slug}` | `/us/installer/{slug}` | hooks |
| `/in/district/{district_slug}` | `/in/solar/{state}/{district}` | keep existing DB shim, retarget if needed |

Root `routes/sitemap.xml/+server.ts`: generate index from `COUNTRIES` keys instead of hardcoding.

## Step 6 — Component unification

Merge `lib/in/components/` + `lib/us/` pairs into `apps/main-app/src/lib/components/`: BusinessDirectory, BusinessTilesList, LeadForm(+Modal), BusinessForm, AboutSolarVipani, RecentProjectsCity, RecommendedSolarSystems, SolarComparisonTable, SolarSizeCalculator, StoriesModal, ChatBot*. Each consumes `page.data.country` (labels, postal validation, phone prefix, currency, `geoUrl`). Diff each pair first; where structurally diverged, start from the IN version (newer, TS) and port US deltas. JSON-LD: extend `lib/seo.ts` with `addressCountry` and absorb `lib/us/city_jsonLD1.js` + inline US JSON-LD. IN-only components stay in `lib/in/components/`. Delete `lib/us/config.js` in favor of `geoUrl`.

## Step 7 — Ordering (each step deployable)

1. Run migrations 042–044 in prod (nothing reads new tables yet; zero risk). Validate row-count parity.
2. Add `lib/countries/`, param matcher, new server modules (unused code; safe deploy).
3. Build `routes/[country]/` pages + merged components (unreachable while literal trees exist; test load functions directly / in dev by temporary rename).
4. Cutovers, one deploy each:
   a. Delete `routes/in/(layout-1)/solar/` → `[country]` serves `/in/solar/...` (URLs identical, backend now reads new tables — SEO-invisible).
   b. IN installer + forms + submitLead dual-insert.
   c. US: delete old US geo/directory/installer pages, install shims + hooks rules; `[country]` serves `/us/solar/...`, `/us/installer/...`; US dual-insert.
   d. Sitemaps → unified generator; root index from `COUNTRIES`.
   e. Delete dead code (`lib/us/*` duplicates, merged `lib/in` components, old US APIs, inline `createPool` calls).
5. Dual-insert + sync triggers remain until business-app/user-app phase 2. Nothing dropped.

## Verification

- **Data parity**: `count(*)` old vs new per country/table; spot-check slugs against live sitemap URLs.
- **IN sitemap diff**: `/in/sitemap.xml` before vs after — geo/installer sections should be byte-identical.
- **Key URLs in dev**: `/in/solar/tamil-nadu/chennai/{city}`, `/in/installer/{slug}`, `/in/rooftop-solar` (untouched), `/us/solar/california/orange/anaheim`, `/us/installer/{slug}`.
- **Redirects**: `curl -sI` each old US URL family → exactly one 301 hop to a 200; no chains. Every URL removed from the US sitemap must appear as a redirect source.
- **Leads e2e**: submit IN + US lead in dev → row in `leads` AND old table; business-app (locally, same DB) sees it.
- **JSON-LD**: validate city + installer pages both countries (`addressCountry` correct).
- `npm run check` + build pass.

## Risks / open items

- `us_businesses` and `us_leaddata` exact columns must be verified against the live DB before writing copy SQL (no schema files exist).
- Duplicate geo names in `us_locations` could collide in the unique index — pre-check.
- Stale ISR caches for deleted US routes serve until expiration (~86400s); redeploy invalidates.
- `getDistrictByPincode` is IN-only (`pincode_mapping`) — gate per country.

---

# Implementation status (2026-07-18)

## Done — database (migrations 042–045, ALREADY APPLIED to the live DB)

- `042-countries-and-geo.sql` — `countries` + `geo_locations` (generic level1/level2/city with precomputed slugs; `sv_slugify()` matches the legacy `toSlug` exactly). Backfilled: 8,392 IN / 31,253 US rows (dedup as predicted: 3 + 61 duplicate groups dropped). US city slugs use `city_ascii`; state-abbreviation suffixes dropped.
- `043-businesses.sql` — unified `businesses` (profile only, no auth columns; `tax_id` = gstn/ein, `postal_code` = pincode/zipcode). Backfilled 6,688 IN / 12 US. Old→new sync triggers on `in_business_profiles` and `us_businesses`.
- `044-leads.sql` — unified `leads` (full superset incl. CRM pipeline columns so the business-app migration is a drop-in). Backfilled 1,144 IN / 3 US.
- `045-leads-sync.sql` — **deviation from the original "dual-insert in app code" decision**: IN lead forms post to user-app (not main-app), so app-level dual-insert could never cover all writers. Instead, old→new sync triggers on `leaddata`/`us_leaddata` (same pattern as 043). Every lead writer (user-app, main-app, business-app pipeline edits) now flows into `leads` automatically. Verified live with a rolled-back transaction test.
- Old tables completely untouched; business-app/user-app/admin-app unaffected.

## Done — application (apps/main-app)

- `src/lib/countries/` — `CountryConfig` (levels labels, postal validation, currency, locale, feature flags, `installerNoun`), `in.ts`/`us.ts`, `urls.ts` (`geoUrl`/`installerUrl`/`toSlug` — single URL source of truth), `us-states.ts`; `src/params/country.ts` matcher.
- `src/lib/server/` — new `geo.ts`, `businesses.ts`, `leads.ts` (insertLead writes old table, reads trigger-synced row in same tx); `sitemap.ts` generalized to `generateSitemapEntries(pool, country)`; `slug-resolver.ts` gained country-aware `resolveLeafSlug` (brand/size fallbacks feature-gated).
- `src/routes/[country=country]/` — layout (feature-gated nav/footer/chatbot), solar hub, `[state]`, `[state]/[district]`, `[state]/[district]/[slug]` (city/brand/size leaf), `installer/[installer_slug]`, `api/{submitLead,getLevel2s,getCities}`, `sitemap.xml`.
- Components parameterized in place (not yet physically merged): `LeadForm`/`LeadFormSection` (optional `country` prop — IN behavior unchanged, other countries use same-site submit + thank-you), `InstallerCard` (`countryCode` prop).
- **Cutover done in this branch**: deleted `routes/in/(layout-1)/{solar,installer}` and all old US geo/directory/installer pages. `hooks.server.ts` string-rewrites 4 legacy US URL families; DB-backed 301 shims at `routes/us/county/[county_slug]` and `routes/us/solar-panel-installer-directory/[city]`. Root sitemap index generated from `COUNTRIES`; `/us/sitemap.xml` swapped to the unified generator.

## Verified

- Build passes (prerender log confirms installer 301s). All key IN+US URLs return 200 in dev; all 7 legacy US redirect families 301 in one hop.
- IN sitemap geo section (581 URLs) and installer section identical to old-table output — zero SEO change for India.
- svelte-check: no new errors (the 43 `Property 'user' is missing` errors are pre-existing, from `app.d.ts` declaring `PageData.user/session` required with no root layout providing them).

# Next steps

## Immediate (deploy window)
1. Deploy the branch. Migrations are already applied, so deploy order is safe either way.
2. After deploy: spot-check prod `/in/sitemap.xml` (should be unchanged), `/us/sitemap.xml` (new URLs), and `curl -I` each legacy US URL family.
3. Redeploy once more (or wait ~24h) so stale ISR caches of deleted US routes expire.
4. Submit a real lead on an IN district page and a US page; confirm rows land in both old table and `leads`, and business-app sees them.

## Phase 1 cleanup (main-app, low risk) — DONE except where noted
- ~~Update `/us` home + US layout links~~ — done: nav Directory → `/us/solar`, home `BusinessDirectory` navigates to `/us/solar/{state}/{county}`, business-listing installer cards → `/us/installer/{slug}`, welcome-email link → `/us/installer/{slug}`, recent-projects page links fixed (they were missing the `/us` prefix entirely; project detail links now point at the installer page since US project pages no longer exist).
- ~~Delete dead code~~ — done: `resolveGeoSlug`, `lib/us/config.js`, `lib/us/stateAbbreviations.js` removed.
- ~~Fix `app.d.ts`~~ — done: `PageData.user`/`session` optional; svelte-check 60 → 17 errors (all 17 pre-existing, unrelated files).
- ~~Localize FAQ copy for US~~ — done: `lib/us/faqData.ts` (US copy is incentive-neutral — no hardcoded tax-credit claims) + per-country dispatcher `lib/countries/faq.ts`; geo pages no longer gate FAQ on `seoContentFamilies`. A 3rd country without FAQ copy simply renders no FAQ section.
- ~~Consider a generic `[country]` home page~~ — **decided against (2026-07-19)**: no new country is planned at the moment; revisit only if one is actually added.
- ~~`/us` home county dropdown 404 issue~~ — **resolved by removal (2026-07-19, user decision)**: both home-page directory dropdowns deleted (`lib/us/BusinessDirectory.svelte` and `lib/in/components/BusinessDirectory.svelte` plus their home-page sections). Neither filtering nor installer-less county pages wanted. The `getDistricts`/`getCounties` APIs stay — business forms and AddBranch still use them.

## Phase 2 (separate efforts, in rough order)
1. **business-app** → read/write unified `businesses` + `leads` (+ move auth off `businesses_1`/`us_businesses` into a unified accounts table). At cutover: re-copy lead pipeline columns (business-app edits old rows today; `leads` pipeline state becomes authoritative only then), then drop the 043/045 sync triggers.

   **Progress (2026-07-18):**
   - `046-business-accounts.sql` written — unified `business_accounts` keyed by `(country_code, source_id)`, backfill from `businesses_1`/`us_businesses`, old→new sync triggers (same pattern as 040/043/045; auth column types verified against live DB). **NOT YET APPLIED** — run manually: `psql "$POSTGRES_URL_NON_POOLING" -f apps/main-app/src/lib/server/migrations/046-business-accounts.sql`, then check `SELECT country_code, count(*) FROM business_accounts GROUP BY country_code` (expect 6,688 in / count(us_businesses) us).
   - business-app auth READS switched to `business_accounts` JOIN `businesses` (TokenManager, PasswordManager, LoginTracker read-side, both countries; `source_id AS id` preserves old-id semantics for branches/CRM). Auth WRITES (last_login, token minting, password reset) still hit the old tables and flow through the 046 triggers — same read-switch-first strategy as 040. **Do not deploy business-app before 046 is applied.**
   - `046-business-accounts.sql` **APPLIED** 2026-07-18: 6,688 in / 12 us, zero field mismatches, triggers verified live (rolled-back test).
   - (a)+(b) **DONE**: all business-app read paths (page/layout loads, `ownsBusinessSlug`, lead-claim notification) now read `businesses` / `leads` / `business_accounts` with legacy column aliases (`src/lib/server/unifiedRead.ts`; `source_id AS id` preserves old-id semantics). Write endpoints (`api/*`, `magicLink.ts`) untouched — still old tables, synced by triggers. Verified: full old↔new parity on both lead and business tables (one drifted `leads` row found and resynced via trigger touch; cause was a write in the 044→045 apply window), every converted query executed verbatim against live DB, old-vs-new counts identical on populated filters, svelte-check unchanged (84 pre-existing). Bonus fixes: US open-inquiries lead query selected nonexistent `l.pin_code` (was failing at runtime; now `postal_code AS pin_code`); US branch/project pages no longer `SELECT *` credential columns into page data.
   - (c) **DONE** (2026-07-19) as app-level dual-write, not trigger-drop: a full authoritative cutover would break unmigrated writers (user-app lead inserts, main-app IN token/signup APIs, admin-app), so instead `047-unified-sync-functions.sql` (**APPLIED**) extracts the 043/045/046 trigger bodies into callable `sv_sync_lead/business/account(country, source_id)` functions (triggers are now thin wrappers over them), and every business-app write endpoint calls the matching function after its legacy-table write (`src/lib/server/unifiedSync.ts`). Idempotent with the triggers today; keeps business-app correct by itself once the triggers drop (phase 2.4, after user-app/admin-app migrate). Wired: updateLeadByBusiness, claimLead, deleteLeadByBusiness, fixClaimedLead, deleteAccount, deleteBranch, addBranch, updateBusinessDetails, submitLead(us), magicLink minting, LoginTracker.updateLastLogin — both countries.
   - (d) **DONE** (2026-07-19): auth modules deduplicated into shared `src/lib/auth/business/` (TokenManager/PasswordManager/LoginTracker/BusinessAuthService parameterized by country; SessionManager/TokenSecurity/RateLimiter/AuthTypes shared verbatim; legacy table names in `countryTables.ts`). `$lib/in|us/auth/business` are now thin country-binding shims exporting the same names, so no route imports changed. ~660 duplicated lines removed.
   - **Pre-existing bugs found & fixed during (c)**: US deleteAccount soft-deleted from `businesses_1`/`branches` (IN tables!) with a US id — could hide an unrelated Indian business; now targets `us_businesses`/`us_branches`. US submitLead and US claimLead's claimed-copy INSERT used nonexistent `pin_code` (real column `zipcode`) and submitLead RETURNED nonexistent `reference_uuid` — both endpoints 500'd on every call; fixed (submitLead now returns `reference_uuid: null`).
   - **Known-dead code, deliberately untouched**: both business-app resetPassword endpoints query nonexistent `reset_token_hash`/`reset_token_used` columns and fail before writing (the working reset flow lives in main-app against raw `reset_token`). Decide later: delete them or rebuild against `business_accounts`.
   - Remaining for business-app: nothing until phase 2.4 (drop 040/043/045/046 triggers + remove `unifiedSync` calls + retire legacy writes) — gated on ~~user-app (lead inserts) and~~ admin-app migrating (user-app done 2026-07-19, see item 2).
2. **user-app** → submit leads via unified endpoint/table; then the IN lead flow no longer depends on `leaddata`.

   **DONE (2026-07-19)** — same read-switch + app-level dual-write pattern as business-app 2.1:
   - Reads switched to unified tables with legacy column aliases (`source_id AS id`, `postal_code AS pin_code`, `level2 AS district`, `level1 AS state`): dashboard lead list + claimed-businesses join (`/in/+page.server.js`; `leaddata_claimrequests` stays legacy, joined via `l_claimed.source_id = lcr.claim_id`), thank-you page lead-by-`reference_uuid` + installers-by-district, uploadBill lead lookups (by ref and by id+email), sendLeadSubmissionConfirmation installer lookups (by slug and district) — all now `leads`/`businesses` with `country_code = 'in'`.
   - Writes stay legacy-first (`INSERT/UPDATE leaddata`) + explicit `sv_sync_lead('in', id)` via new `user-app/src/lib/server/unifiedSync.js`: submitLead insert, uploadBill bill-column update. Idempotent with the 045 trigger today; user-app stays correct once triggers drop.
   - **main-app's own legacy writers wired the same way** (new `main-app/src/lib/server/unifiedSync.ts`): `lib/server/leads.ts` insertLead (in-tx, both countries), legacy `in|us/api/submitLead`, `in|us/api/submitBusiness` (+`sv_sync_account`), `in|us/api/createMagicLinkToken`, `us/api/triggerPasswordReset`, `us/api/resetPassword` (the last two gained `RETURNING id` to feed the sync call). **The only writer still depending on the sync triggers is the external admin-app.**
   - Verified against live DB: every converted read query diffed old-vs-new with real params — 0 row differences (dashboard leads, claimed-businesses join, thank-you by ref, installers by district/slug); rolled-back e2e test of submitLead insert + uploadBill update + `sv_sync_lead` (unified row present with bill columns); all five `sv_sync_*` call shapes execute cleanly. user-app: svelte-check 0 errors, build passes. main-app: svelte-check 17 errors (identical count with changes stashed — all pre-existing), build passes.
   - Not switched (out of lead-flow scope): user-app's `in_user`/`in_user_feedback` tables (user accounts are not part of the unified schema) and `pincode_mapping` lookups (IN-only by design).
3. ~~**Blogs unification**~~ — **OBSOLETE: blogs feature REMOVED entirely (2026-07-19, user decision)** instead of unified. Deleted: `routes/in/(layout-1)/blogs/` (dynamic, `in_blogs`-backed) and `routes/us/(layout-1)/blogs/` (9 static folders); blog sections/links on IN+US home pages, both footer navs, IN services mega-menu, seo-index (sections renumbered), US `AboutSolarVipani` inline link; sitemap blog entries (static `/blogs` + per-country `in_blogs`/`us_blogs` query); unused `articleLD` in `seo.ts`; `dynamicBlogs` feature flag. `hooks.server.ts` 301s `/{in|us}/blogs(/*)` → country home (`legacyUsRedirect` renamed `legacyRedirect`). `048-drop-blogs.sql` drops `in_blogs`/`us_blogs` — **NOT YET APPLIED** (destructive; take the pg_dump archive in the migration header first if the articles might be wanted). `in_blog_posts` kept (separate empty table, `/in/authors` reads it). Verified in dev: all four blog URL shapes 301 to country home in one hop, homes 200, both sitemaps blog-free; svelte-check unchanged (17 pre-existing), build passes.
4. **Retire old tables** — only after all apps (incl. the external admin-app) migrate: drop triggers, keep old tables as archive or drop.

   **Gate cleared (2026-07-19):** admin-app (solar-app-internal) now calls `sv_sync_lead/business/account` after every legacy write (lead edits/claim copies/pincode backfills/invite counts, business profile edits, magic-link mints, password resets — both countries), and automation-scripts write no legacy lead/business tables. Remaining 2.4 work when ready: write migration 049 dropping the 040/043/045/046 triggers (keep the `sv_sync_*` functions — every app calls them); afterwards optionally remove the `TODO(remove after legacy businesses_1 is dropped)` dual-writes and legacy-first writes app by app, re-copy `leads` pipeline columns is NOT needed (business-app already treats unified as read source and all pipeline writes sync). Old tables then freeze and can be archived/dropped in a final migration.
5. **Adding a new country** = insert into `countries`, load `geo_locations` rows, add a `CountryConfig` in `lib/countries/`, done — routes, sitemaps, APIs, and redirects all derive from it. (No new country planned at the moment — this is the recipe for whenever one is.)
