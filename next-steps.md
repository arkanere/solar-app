# Next Steps

> This file tracks **open work only**. Finished work is deleted, not archived here — the Drizzle
> migration, the TypeScript conversion and Phase 7's business-app route consolidation all came out
> once they were done. Git history has the full record.

## Open

1. **Duplicate `businesses.slug` values in live IN data.** Surveyed 2026-08-09; the picture is worse
   and more specific than this item used to say.

   **6708 profiles, 6518 distinct slugs, 36 NULL.** Unified `businesses` mirrors it exactly.

   **The largest offender is not a duplicate at all.** The literal slug `incorrect` is on **125
   rows** spanning 117 distinct business names and 90 cities — a sentinel, not a collision. 124 of
   the 125 are `isvisible = f`. Those businesses have no usable URL, which is arguably a bigger gap
   than the collisions. Nobody has traced which writer produces it; do that before fixing, or it
   comes back.

   **The genuine collisions are 24 slugs / 54 rows**, and they have a consistent shape: in every
   group **at most one row is `isvisible = t AND businessfilled = t`**. Eight groups have exactly one
   live row plus invisible twins; sixteen are entirely invisible. The Spectrum groups (×5, ×4, ×3)
   are identical in name, city and phone — true duplicate records. Every one of the 54 has an account
   row with a password set, but only **5 have ever logged in**, all of them the visible row.

   **The code bug is more specific than "`.limit(1)` is non-deterministic".** `SessionData` carries
   an authoritative `businessId` (`lib/types/auth.ts:83`) set at login, and **no route uses it** —
   all eight page loads under `[business_slug]` re-derive the id from the slug, with no `isvisible`
   filter and no ordering (`+layout.server.ts:108`, `+page.server.ts:68`, `crm:73`,
   `project-management`, `branch`, `proposal`, `recent-projects`, `compliance`). So a logged-in
   business can be served its twin's `businessId`, and lead counts, CRM and the claim gate are then
   computed for the wrong row; layout and page issue separate queries, so nothing guarantees they
   even agree within one request. `api/updateBusinessDetails` is worse — it updates
   `business_profiles` *and* `businesses_1` by slug with no id filter, so one business saving its
   profile overwrites its twin's row in both tables, then syncs an arbitrary one of the returned ids.

   **Recommended order:** repoint those loads (and `updateBusinessDetails`) at `session.businessId`
   first — code-only, reversible, testable, and it removes the wrong-tenant risk without deciding
   anything about live rows. Then de-duplicate, then `UNIQUE (slug)`. Open question before
   de-duplicating: whether `isvisible = f` is a soft-delete you intend to keep, which decides whether
   the losing rows get deleted or re-slugged.

   The duplicates are also why `businesses` cannot take a `UNIQUE (slug)` constraint, and why
   `api/resetPassword` matches on the token hash rather than on the slug alone (`cdeff73`) — any new
   slug lookup has to assume duplicates until this is closed.

2. **Drift between `leaddata` and unified `leads`.** **3** `leaddata` rows have no unified row at all
   (a `sv_sync_lead` call that never happened), and **156** unified `leads` have no surviving
   `leaddata` source (the sync never deletes, so removing a source row orphans its projection).
   `businesses` is clean — 0 in either direction. Consequence: a full resync *raises* the unified
   lead count, so "counts unmoved" only holds for a **targeted** resync. Reconciling these is its own
   task; `apps/main-app/src/lib/server/migrations/check-unified-drift.sql` is the existing tool.

3. **No US lead ever gets a `state`, so the US non-exclusive lead pool is permanently empty.** The
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

4. **`PostRecentProject.svelte:395-419` is India-shaped and US businesses reach it.** It labels its
   fields **"Pincode:"** and **"District (Auto-filled):"** and auto-fills from
   `/api/getDistrictByPincode`, which queries `pincode_mapping`. That is the one lookup
   `geo_locations` cannot replace — it has no postal-code column, and a live schema sweep found no US
   zip source anywhere. Blocked on the same missing data as item 3; solve the two together.

   The sibling branch form was the same bug and is fixed (`d418a08`, `0a8351a`) — its dropdowns now
   read `geo_locations`, which is populated for both countries. Use it as the model, but note
   `getCities` there needs state *and* county, because US county names repeat across states.

5. **Leftovers from the 060/061 cleanup, none urgent.**
   - `sv_sync_in_business_profile` has been an orphan since 054 inlined the profile upsert into
     `sv_sync_in_split` — nothing calls it in the database or in any app. 061 recreated it against
     the renamed table rather than dropping it, to keep the rename a rename. Dropping it is a
     one-liner whenever someone wants it gone.
   - `sv_sync_in_split` is now a misnomer for the same reason the table was: it has written both
     countries since 054. Renaming it is a code change too (three call sites via
     `syncInSplitTables`), so it did not belong in 061.
   - **`check-unified-drift.sql` is already broken and was before 060.** Its `leads_us`,
     `businesses_us` and `accounts_us` scopes read `us_leaddata` and `us_businesses`, which 056
     dropped, so the file errors partway through as written. Fixing it means deciding what a US
     drift check even means now that both countries share one set of legacy tables.

---

## Standing constraints

**Unified tables are a projection, not a store.** `sv_sync_business` is
`INSERT INTO businesses ... SELECT FROM business_profiles ... ON CONFLICT DO UPDATE`. Anything
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

**Do not switch the `[business_slug]` page loads to the `US_*` selections.** The dashboard, `/crm`
and `/recent-projects` select `IN_*` unconditionally, which looks like it would label a US county
"District". Checked against the components on 2026-08-06: it does not. The lead list's only location
line is `LeadTile.svelte:179`, labelled "Location", rendering `{lead.pin_code} ({lead.district})` — a
US business already sees `94601 (Alameda)`. No component reads `businessInfo.district`, `.pincode` or
`.gstn`. The swap would be a regression twice over: `US_LEAD_SELECTION` aliases `level2` to `county`
while `LeadTile` reads `lead.district` and types `lead` as `any`, so the location line would silently
lose its name and `check` would not catch it; and it omits `business_notes`, `qualification_score`,
`reference_uuid` and the four `bill_*` columns, two of which `CustomerInquiry.svelte` declares on its
`Lead` type. That selection was shaped for the narrow legacy `us_leaddata` table; since 054, unified
`leads` carries these for both countries, so narrowing buys nothing. The real IN-only leakage is in
the write forms — items 3 and 4.

**Dropping a table breaks the test harness before it breaks anything else.** The suite replays a few
migrations on top of the generated baseline (`scripts/apply-test-migrations.mjs`), and those files
are *history* — 042 copies rows out of both `locations` and `us_locations`, and 054 out of the `us_*`
tables. Once the baseline stops creating those tables, the copy is an unresolvable reference and
**every** test fails in global setup, not in an assertion. All three are now wrapped in a
`to_regclass(...) IS NOT NULL` guard, which is a no-op on live and self-skipping in tests; do the
same for the next drop. Check three places a code grep of `src/` will miss: the replayed migrations,
`tests/helpers/fixtures.ts`'s `TRUNCATE` list, and any function body (Postgres does not resolve table
names in a function until it runs).

This has now been exercised twice, and the second time (058, `locations`) the guard was the only
thing standing between a regenerated baseline and 176 failing tests — worth writing the guard in the
same commit as the drop, not after the baseline is regenerated.

059 (`sv_referrers`) is the counter-example that shows the check is what matters, not the guard: no
replayed migration and no function body mentioned the table, so it needed no guard at all. The three
places still have to be checked; sometimes the answer is that there is nothing to do.

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

`npm test -w solarvipani-business` — **green: 172 passed, 0 skipped.** Was 176 until 059 deleted the
referrer feature and the four `/referral` cases in `pageCountry.test.ts` with it.

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

All migrations through **061** are applied to live.
