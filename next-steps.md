# Next Steps

> This file tracks **open work only**. Finished work is deleted, not archived here — the Drizzle
> migration, the TypeScript conversion and Phase 7's business-app route consolidation all came out
> once they were done. Git history has the full record.

## Open

1. **Duplicate `business_profiles.slug` values in live IN data.** Surveyed 2026-08-09; the picture is worse
   and more specific than this item used to say.

   **6708 profiles, 6518 distinct slugs, 36 NULL.**

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

   **The read side is fixed.** All eight page loads under `[business_slug]` used to re-derive the
   business id from the slug, ignoring the authoritative `businessId` that `SessionData` carries
   (`lib/types/auth.ts:83`). They now select on `business_session.businessId` beside the country
   predicate, so a logged-in business can no longer be served its twin's row.
   `tests/routing/duplicateSlug.test.ts` pins all eight against a slug shared by two businesses.

   **The write side is fixed too, so there is no known wrong-tenant path left.**
   `api/updateBusinessDetails` used to UPDATE `business_profiles` by slug with no id filter — one
   business saving its profile overwrote every row on the slug, its twin's included. It now resolves
   a single `targetBusinessId` in both authorization arms (the session's `businessId` when a business
   updates itself, the joined `branches.branchId` when it updates a branch) and matches the UPDATE on
   the primary key. Its ownership check no longer re-derives the main business from
   `session.businessSlug` either, which was the same slug-lookup bug one layer up. Four tests in
   `tests/routing/duplicateSlug.test.ts` pin it: two reproduce the overwrite (both fail against the
   old query), two hold the 403 arms in place.

   **Recommended order:** de-duplicate, then `UNIQUE (slug)`. Open question before de-duplicating:
   whether `isvisible = f` is a soft-delete you intend to keep, which decides whether the losing rows
   get deleted or re-slugged.

   The duplicates are also why `business_profiles` cannot take a `UNIQUE (slug)` constraint, and why
   `api/resetPassword` matches on the token hash rather than on the slug alone (`cdeff73`) — any new
   slug lookup has to assume duplicates until this is closed.

2. **Drift between `leaddata` and unified `leads`.** **3** `leaddata` rows have no unified row at all
   (a `sv_sync_lead` call that never happened), and **156** unified `leads` have no surviving
   `leaddata` source (the sync never deletes, so removing a source row orphans its projection).
   `businesses` was clean at 0 in either direction, which is part of why it was safe to collapse.
   Consequence: a full resync *raises* the `leads` count, so "counts unmoved" only holds for a
   **targeted** resync. Reconciling these is its own task, and item 6 wants it done first;
   `apps/main-app/src/lib/server/migrations/check-unified-drift.sql` is the existing tool.

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
   - **Four `sync_unified_*` orphans remain** (`business_in/us`, `lead_in/us`). Their triggers went
     with 051 and nothing can reach them; 062 dropped the two `account_*` siblings only because
     their bodies called a function it was removing. Dropping the rest is a one-liner.
   - **`rateLimiter.test.ts:79` has the fragile pattern that just cost four tests.** It drops
     `rate_limits` to exercise the fail-open branch and recreates it by hand in a `finally`. That
     stub currently matches the real schema exactly, so nothing is broken — but the identical
     pattern in `updateLeadByBusiness.test.ts` recreated a three-column `project_management` against
     a five-column table, and stayed invisible until a new test file reordered the suite. Switching
     it to the `ALTER TABLE ... RENAME` aside-and-back that file now uses would close it for good.
   - **`check-unified-drift.sql` is already broken and was before 060.** Its `leads_us`,
     `businesses_us` and `accounts_us` scopes read `us_leaddata` and `us_businesses`, which 056
     dropped, so the file errors partway through as written. Its `accounts_*` scopes are now dead
     for a second reason: 062 made `business_accounts` a store and 064 dropped `businesses`, so of
     its six scopes only the two `leads_*` ones still describe anything real. It is arguably now a
     `leads`-only drift check with a misleading name.

6. **Collapse `leads` into `leaddata` the way `businesses` went.** The table collapse is otherwise
   **done** — 062 archived `businesses_1`, 063 gave `business_profiles` the country-neutral names,
   064 dropped `businesses`. A business is two rows written directly, with no projection.

   `leads` is the same shape `businesses` was: a rename-projection of `leaddata` driven only by
   explicit app calls, and item 2 is what that costs — 3 `leaddata` rows with no projection and 156
   projected rows with no source. The playbook is now proven and worth reusing in the same order:

   1. rename `leaddata`'s columns to the neutral names `leads` already uses (`state`→`level1`,
      `district`→`level2`, `pin_code`→`postal_code`), rewriting `sv_sync_lead` in the same
      transaction, and move every read across — the equivalent of 063;
   2. deploy, confirm `pg_stat_user_tables` for `leads` goes flat;
   3. drop the sync calls, deploy;
   4. drop `leads` and `sv_sync_lead` — the equivalent of 064.

   Reconcile the 159 drifted rows before step 1, not after: once the projection is the only copy,
   whichever side you kept is the answer, and right now it is not obvious which that should be.

---

## Standing constraints

**Column vocabulary is country-neutral since 063.** `business_profiles` carries `tax_id`, `level1`,
`level2` and `postal_code` — not `gstn`/`state`/`district`/`pincode`, which is what every migration
and comment numbered below 063 refers to. `leaddata` still uses `state`/`district`/`pin_code`; it is
`leads` that has the neutral names. Do not assume a column name from a sibling table.

**`leads` is the only projection left.** `sv_sync_lead` is `INSERT INTO leads ... SELECT FROM
leaddata ... ON CONFLICT DO UPDATE`, so anything written directly to `leads` is clobbered by the next
sync. The rule for it is unchanged: **read `leads`** (filtered by the resolved country), **write
`leaddata`**, then call `syncLeadToUnified`.

**Everything about a business is a store now — write it directly and call nothing.**
`business_profiles` (profile) and `business_accounts` (auth) are the whole picture, and both are
written first-class. The three sync helpers that used to sit around them are gone: `sv_sync_in_split`
and `sv_sync_account` with 062, `sv_sync_business` with 064. There is no function to call after a
business write, and adding one back would mean reintroducing a duplicate.

**The new hazard that replaces the old one:** a business is two rows, and nothing projects the
second any more. Every id-minting site (`submitBusiness`, `addBranch`, `claimLead`'s auto-branch)
must insert `business_profiles` **and** `business_accounts`. Miss the account row and the business
looks perfectly healthy — it lists on the public site, it has a slug — and simply cannot log in,
be sent a magic link, or reset its password. `tests/auth/accountsAreAStore.test.ts` pins the
invariant table-wide rather than per endpoint, so a fourth minting site is covered without being
named. `isvisible` is carried by **both** halves and both must be written when hiding a business.

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

062-065 settled which tool to reach for, and the two are not interchangeable:

- **A rename needs a rewind.** A `to_regclass` guard cannot help — the object exists, under a
  different name, so the guard passes and the statement still fails. Wind the name back before the
  baseline, replay history unedited, and let the real migration rename it forward at the end of the
  list. Three renames are wound back today (061's table, 062's DEFAULT, 063's columns and indexes).
- **A drop needs a guard**, inside the migration itself — a no-op on live, self-skipping in tests.

The same statement can change category. 062's `ALTER TABLE businesses_1 RENAME TO
businesses_1_archive` was a rewind problem until 065 dropped the archive, at which point neither
name existed in the baseline and it became a guard problem.

**And sometimes the answer is to remove the file from the replay list.** 054 came off with 065: its
only contribution was a `CREATE OR REPLACE` of `sv_sync_in_split`, which 062 drops, so it was
carrying four executable statements against a vanished table for no gain. Check what a replayed file
still contributes before writing a guard for it.

**062 also found a fourth place, which no amount of code grepping reaches: the baseline can emit a
default referencing a sequence it never creates.** `businesses_1.id` was a `serial`, which
introspection round-trips fine. Reassigning the sequence to `business_profiles.business_id` made
`pull` type *that* column `serial` (emitting a different sequence,
`business_profiles_business_id_seq`) and leave `businesses_1_archive.id` a plain integer carrying a
bare `DEFAULT nextval('businesses_1_id_seq')` — which nothing then declares. The baseline failed on
its own `CREATE TABLE` with `relation "businesses_1_id_seq" does not exist`, before a single test
ran. A generated baseline cannot express "this column's default points at a sequence another table
owns", so this is structural, not a generator bug. `apply-test-migrations.mjs` now has a
`PRE_BASELINE_SEQUENCES` step for it. 065 dropped the archive and with it that particular dangling
default, but the step stays and is still required: 062 is still replayed, and it reassigns the
sequence and sets the same default on `business_profiles.business_id`, so the sequence has to exist
before it runs. **Any future migration that moves a sequence between tables hits this — regenerate
the baseline and actually run the suite, do not assume.**

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

`npm test -w solarvipani-business` — **green: 188 passed, 0 skipped**, in 16 files. This line said
172 for a while and was simply stale: a measured run on the commit before 062 gave **180**, 062
added the four in `tests/auth/accountsAreAStore.test.ts`, and the `updateBusinessDetails` fix added
four more to `tests/routing/duplicateSlug.test.ts`. Measure before trusting it.

**Workspace names are not the directory names.** `npm run check -w <app>` takes `main-app`,
`user-app` and `solarvipani-business` — the first two are unprefixed and the third is not
`solarvipani-user`'s sibling. `npm run check -w solarvipani` fails with "No workspaces found".

**Also run `npm run build -w <app>`** when you touch imports. `check` cannot see server code reaching
a browser bundle, and that is a hard build failure — it left business-app undeployable for an unknown
stretch before it was caught. business-app's `$lib/server/resolveCountry` is the current live example:
server-only, and must never reach a component.

### Running the tests

**Docker is not installed on this machine**, so `docker compose -f docker-compose.test.yml up -d`
does not work. Build a throwaway cluster from the EDB binaries instead:

**A cluster may already be running on 5544** from an earlier session — `initdb` then succeeds and
`pg_ctl start` fails with `could not bind IPv4 address "127.0.0.1": Address already in use`, which
reads like a port conflict but usually means the cluster you want is already up. Check before
rebuilding: `psql -h localhost -p 5544 -U solar -d postgres -c '\l'`.

```sh
export PATH=/System/Volumes/Data/Library/PostgreSQL/16/bin:$PATH
initdb -D pgdata -U solar --auth=trust
pg_ctl -D pgdata -o "-p 5544 -k /tmp" -l pg.log start
psql -h localhost -p 5544 -U solar -d postgres \
  -c "create database solar_test;" -c "alter role solar with password 'solar' superuser;"

export TEST_POSTGRES_URL="postgres://solar:solar@localhost:5544/solar_test"
npm test -w solarvipani-business
```

The suite rebuilds its schema per run, so a fresh empty database is fine. To force a clean slate,
drop and recreate the database rather than the `public` schema — `DROP SCHEMA public CASCADE` leaves
the connection's `search_path` pointing at nothing and the next run fails inside `NamespaceCreate`. Port 5433 answers but is
the EDB install, which has no `solar` role — do not point the suite at it.

### Live database

`apps/main-app/.env.local` holds the credentials. Use **`POSTGRES_URL_NON_POOLING`** for DDL and for
`npm run pull -w @solar/db`. **Never pull from a test cluster** — its baseline omits three
`loc_key(...)` expression indexes, so a pull from there silently drops them.

All migrations through **065** are applied to live. Verified 2026-08-10 by introspection, after this
line sat at 061 while 062-065 were described as done everywhere else in this file.

**There is no migration-tracking table** — nothing records what has run, so this line is
hand-maintained and will go stale again. It is cheap to re-derive from the schema itself; each
migration has a fingerprint:

```sql
-- 060/061: in_business_* gone. 062/064/065: businesses, businesses_1, businesses_1_archive gone.
SELECT relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'public' AND c.relkind = 'r' AND relname IN
   ('businesses','businesses_1','businesses_1_archive','in_business_profiles','in_business_accounts');
-- 063: business_profiles carries tax_id/level1/level2/postal_code, not gstn/state/district/pincode.
SELECT attname FROM pg_attribute WHERE attrelid = 'public.business_profiles'::regclass AND attnum > 0;
-- 062/064: sv_sync_lead is the only sv_sync_* left.
SELECT proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public' AND proname LIKE 'sv_sync%';
```

The same sweep confirms the four `sync_unified_*` orphans in item 5 are still on live, and that
`us_*`, `locations` and `sv_referrers` are gone (056, 058, 059).
