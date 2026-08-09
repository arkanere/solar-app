# Next Steps

> This file tracks **open work only**. Finished work is deleted, not archived here — the Drizzle
> migration, the TypeScript conversion and Phase 7's business-app route consolidation all came out
> once they were done. Git history has the full record.

## Open

1. **Phase 7 smoke test.** The phase is code-complete; only the manual pass is left, and it needs a
   running app. Check that `/` renders the landing page; that an **IN** login and a **US** login both
   land on `/[slug]`; that a bogus slug 404s without rendering an IN-shaped shell; and that a
   forgot-password round trip for one business of each country produces
   `business.solarvipani.com/[slug]/reset-password/[token]` with no country segment.

2. **Country-resolution leftovers.** The sweep itself is **done** — no `[business_slug]` page load
   filters on a literal `countryCode = 'in'` any more (`f8eaa73`, `86bec48`, `87ddc19`, `bc24d16`,
   `5c9881b`, and the last four in one commit). `tests/routing/pageCountry.test.ts` covers all nine
   loads, 32 cases, each verified red against its literal first. Both of the things it left behind are
   now closed:

   **Do not switch the loads to the `US_*` selections.** This was filed as an open task on the theory
   that the dashboard, `/crm` and `/recent-projects` selecting `IN_*` unconditionally makes the UI
   label a US county "District". Checked against the components on 2026-08-06: it does not. The lead
   list's only location line is `LeadTile.svelte:179`, labelled **"Location"**, rendering
   `{lead.pin_code} ({lead.district})` — a US business already sees `94601 (Alameda)`, which is right.
   No component reads `businessInfo.district`, `.pincode` or `.gstn`; the only `gstn` reader is
   `api/addBranch/+server.ts:116`, server-side. The swap would be a **regression**, twice over:

   - `US_LEAD_SELECTION` aliases `level2` to `county`, but `LeadTile` reads `lead.district` and types
     `lead` as `any` — so the location line would silently render `94601` with no name, and `check`
     would not catch it.
   - `US_LEAD_SELECTION` omits `business_notes`, `qualification_score`, `reference_uuid` and the four
     `bill_*` columns. `CustomerInquiry.svelte` declares `business_notes` and `qualification_score` on
     its `Lead` type (lines 11, 16). That selection was shaped to mimic the narrow legacy
     `us_leaddata` table; since 054 unified `leads` carries these for both countries, so narrowing
     buys nothing.

   The real IN-only leakage is in the **write forms**, which is a different task and a live US bug —
   see item 8.

   **The category-1 (non-exclusive) lead read is now tested on the US side** — `createUsLead()` took a
   `state` option and both loads got a positive case, a wrong-state case and a null-state case, all
   three verified red against a restored literal. That surfaced item 7, which is the real problem.

3. **Drop the `us_*` tables.** They have no writer and no reader in the sync path, in the deployed
   app as well as on `main` — `694faea` (the commit repointing business-app's and main-app's `us_*`
   writers at the united tables) shipped on 2026-08-09, so code and DB now agree for both countries.
   The drop is still its own migration, and is still gated on confirming main-app's remaining direct
   reads (`business-listing`, the thank-you page) and the **external admin-app** are off them.

4. **The referral page's referrer link points at a route that does not exist.**
   `referral/+page.svelte` emits `…/solar-panel-installer/{slug}/referrer/{ref}`, and main-app has no
   `/referrer/` route in either country and no rewrite that produces one. Phase 7 made its country
   segment dynamic and deliberately left the shape alone rather than guessing. Note also that
   `/{country}/installer/{slug}` is the canonical profile URL for both countries —
   `/us/solar-panel-installer/{slug}` is only a legacy 301, and there is no `/in` equivalent at all.

5. **Duplicate `businesses.slug` values in live IN data.** `spectrum-solar-power-kasaragod` ×5,
   `spectrum-solar-power-kannur` ×4, `spectrum-solar-power-kozhikode` ×3 and ~22 more ×2. The
   `/[business_slug]` lookup does `.limit(1)`, so those businesses render a **non-deterministic**
   dashboard — whichever row Postgres returns first. Fixing means de-duplicating live rows, which is
   its own task. It is also why `businesses` cannot take a `UNIQUE (slug)` constraint, and why
   `api/resetPassword` matches on the token hash rather than on the slug alone (`cdeff73`) — any new
   slug lookup has to assume duplicates.

6. **Drift between `leaddata` and unified `leads`.** **3** `leaddata` rows have no unified row at all
   (a `sv_sync_lead` call that never happened), and **156** unified `leads` have no surviving
   `leaddata` source (the sync never deletes, so removing a source row orphans its projection).
   `businesses` is clean — 0 in either direction. Consequence: a full resync *raises* the unified
   lead count, so "counts unmoved" only holds for a **targeted** resync. Reconciling these is its own
   task; `apps/main-app/src/lib/server/migrations/check-unified-drift.sql` is the existing tool.

7. **No US lead ever gets a `state`, so the US non-exclusive lead pool is permanently empty.** The
   dashboard's and `/crm`'s category-1 read matches `leads.level1 IN (business states)`, but every
   writer of a US lead leaves `leaddata.state` null: `insertLead()` resolves level1/level2 from
   `pincode_mapping` behind a `country === 'in'` guard (`apps/main-app/src/lib/server/leads.ts:44`),
   `business-app/api/submitLead` sets `district` alone, and `claimLead:358` copies `district` from
   the original lead. 055's header records the same on live data ("For US rows state … are NULL").
   So a US business sees its exclusive and claimed leads but never a non-exclusive one. Two tests in
   `pageCountry.test.ts` pin the current behaviour ("matches no US lead when state is null"), and the
   positive cases only pass because their fixture sets a state by hand. Closing it needs a US
   postal-code-to-state source — `pincode_mapping` is IN-only — which is a data question, not a code
   one. Whoever fixes it should flip those two tests rather than delete them.

8. **India-shaped write forms that US businesses now reach.** Found while checking item 2's
    read-side claim, which turned out to be the wrong place to look.

    **The branch form is done** (`d418a08`, `0a8351a`). It was broken three ways, not one: the
    State dropdown offered `INDIAN_STATES` only, so the cascade could never start; `/api/getDistricts`
    and `/api/getCities` read `locations`, which is India-only; and `api/addBranch` never set
    `country_code` on its `businesses_1` insert, which defaults to `'in'` — so even a completed US
    submission would have been written IN-tagged and its `sv_sync_business('us', …)` would have been a
    silent no-op. The dropdowns now read **`geo_locations`**, which is populated for both countries
    (31,253 US rows / 52 states / 1,910 counties; 8,392 IN) and is the same table main-app's `geo.ts`
    already uses. `getCities` now requires the state as well as the county, because US county names
    repeat across states — "Washington" is in 31 of them.

    **`PostRecentProject.svelte:395-419` is still open**, and is the harder half: it labels its fields
    **"Pincode:"** and **"District (Auto-filled):"** and auto-fills from `/api/getDistrictByPincode`,
    which queries `pincode_mapping`. That is the one lookup `geo_locations` cannot replace — it has no
    postal-code column, and a live schema sweep found no US zip source anywhere. So this is blocked on
    the same missing data as item 7, and the two should be solved together.

    Note `locations` and `us_locations` now have no reader in business-app; main-app's own geo code
    was already on `geo_locations`. Worth folding into item 3's drop if a sweep confirms it.

---

## Standing constraints

**Unified tables are a projection, not a store.** `sv_sync_business` is
`INSERT INTO businesses ... SELECT FROM in_business_profiles ... ON CONFLICT DO UPDATE`. Anything
written directly to `businesses`/`leads`/`business_accounts` is clobbered by the next sync — which
is why main-app has **zero** unified writes anywhere. The rule is: **read unified** (filtered by the
resolved country), **write the legacy table** (one set for every country since 054, discriminated by
`country_code`), then call `sync*ToUnified`.

**`SessionManager` is country-free.** `validateSession`, `isAuthenticated` and `logout` all delegate
to it, so an endpoint doing only those needs no country-bound `BusinessAuthService`. Only `login`
and `signin-link` genuinely need one.

**business-app URLs carry no country; main-app URLs still do.** A business belongs to exactly one
country, so `[business_slug]` implies it and business-app's own paths are country-less. main-app is
still under `[country=country]`, so every link leaving business-app needs the **resolved** country —
use `$lib/mainAppUrls.ts`, and take the country from `[business_slug]/+layout.server.ts`'s data
rather than from a literal.

**A migration that changes where a sync reads from must enumerate every writer of the old location.**
055's dry run proved the collapsed functions reproduce the projection for existing rows, which is
necessary but not sufficient — it was still rolled back once, because `us_*` had five live writers
that the planning missed. Finding them is a **code grep, not a SQL check**, so a rolled-back
transaction can never surface it.

---

## Reference

### Dependency advisories — not tracked here

**The 4 dependabot alerts GitHub reports on every push are stale, and are deliberately not an open
item.** Checked 2026-08-06: `cc8862b`'s dependency-tree dedupe (2026-08-05) carried brace-expansion,
both postcss advisories and `@sveltejs/kit` past their patched versions, and a scan of every
`packages` entry in the lockfile found no copy left in any vulnerable range. The alerts were created
2026-07-27…07-31 and their `updated_at` has never moved, so dependabot has not re-evaluated them;
pushing a lockfile change (`162a0cb`) did not wake it. There is nothing to upgrade.

**`npm audit` is a different, wider set** — jsPDF, `langsmith`, `uuid <11.1.1` via langchain
transitives, and one critical. None of them are the four dependabot alerts. That confusion is what
led `162a0cb` to upgrade bcrypt believing it addressed them; the upgrade stood on its own merits but
closed none of the four. `uuid <11.1.1` (`GHSA-w5hq-g745-h8pq`, missing buffer bounds check in
v3/v5/v6 when `buf` is passed) is the one entry worth a look eventually — it needs a langchain major
and no first-party code passes `buf`.

Before touching any dependency on advisory grounds, check what is actually open:
`gh api repos/arkanere/solar-app/dependabot/alerts -q '.[]|select(.state=="open")'`.

### Baselines

`npm run check` is on svelte-check v4, which prints **machine format** to a non-TTY: grep
`COMPLETED n FILES x ERRORS`, *not* `found x errors`. A change passes if the count does not rise.

| app | errors | warnings | notes |
| --- | --- | --- | --- |
| main-app | 10 | 1 | pre-existing, UI components |
| business-app | 32 | 0 | over 5269 files; 14 of the 32 are in `src/lib/components/ui` |
| user-app | 0 | 2 | clean; warnings are a11y + unused CSS |

business-app's check covers `.ts` as well as `.svelte`, so no separate
`npx tsc --noEmit -p apps/business-app/tsconfig.json` pass is needed.

`npm test -w solarvipani-business` — **green: 174 passed, 0 skipped.**

**Also run `npm run build -w <app>`** when you touch imports. `check` cannot see server code reaching
a browser bundle, and that is a hard build failure — it left business-app undeployable for an unknown
stretch before it was caught. business-app's `$lib/server/resolveCountry` is the current live example:
server-only, and must never reach a component.

### Running the tests

**Docker is not installed on this machine**, so `docker compose -f docker-compose.test.yml up -d`
does not work. Build a throwaway cluster from the EDB binaries instead:

```sh
export PATH=/System/Volumes/Data/Library/PostgreSQL/16/bin:$PATH
initdb -D pgdata -U solar --auth=trust
pg_ctl -D pgdata -o "-p 5544 -k /tmp" -l pg.log start
psql -h localhost -p 5544 -U solar -d postgres \
  -c "create database solar_test;" -c "alter role solar with password 'solar' superuser;"

export TEST_POSTGRES_URL="postgres://solar:solar@localhost:5544/solar_test"
npm test -w solarvipani-business
```

The suite rebuilds its schema per run, so a fresh empty database is fine. Port 5433 answers but is
the EDB install, which has no `solar` role — do not point the suite at it.

### Live database

`apps/main-app/.env.local` holds the credentials. Use **`POSTGRES_URL_NON_POOLING`** for DDL and for
`npm run pull -w @solar/db`. **Never pull from a test cluster** — its baseline omits three
`loc_key(...)` expression indexes, so a pull from there silently drops them.

All migrations through **055** are applied to live.
