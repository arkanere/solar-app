# Next Steps

> This file tracks **open work only**. Finished work is deleted, not archived here — the Drizzle
> migration, the TypeScript conversion and Phase 7's business-app route consolidation all came out
> once they were done. Git history has the full record.

## Open

1. **Duplicate `business_profiles.slug` values in live IN data.** Surveyed 2026-08-09.

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

   **This is a data task only — the code half is done and is not a security bug.** Every read and
   write resolves the business by the session's `businessId`, never by the URL slug, and
   `tests/routing/duplicateSlug.test.ts` holds that line.

   **Remaining: de-duplicate, then `UNIQUE (slug)`.** The open question is now answered:
   **`isvisible = f` is a soft-delete and the rows are kept.** So the losing rows get **re-slugged,
   not deleted** — every one of the 54 stays, and the 46 invisible ones need a new slug rather than a
   `DELETE`. That also means `UNIQUE (slug)` has to hold across soft-deleted rows, so it is a plain
   unique constraint and not a partial index on `isvisible = t`.

   **The `incorrect` sentinel stays as it is** (decided 2026-08-10) — those 125 rows are not part of
   the de-duplication. Tracing which writer produces it is still worth doing before any future fix,
   but it is not blocking the collision work.

   The duplicates are also why `business_profiles` cannot take a `UNIQUE (slug)` constraint, and why
   `api/resetPassword` matches on the token hash rather than on the slug alone (`cdeff73`) — any new
   slug lookup has to assume duplicates until this is closed.

2. **No US lead ever gets a `state`, so the US non-exclusive lead pool is permanently empty.** The
   dashboard's and `/crm`'s category-1 read matches `leaddata.level1 IN (business states)`, but
   every writer of a US lead leaves `leaddata.level1` null: `insertLead()` resolves level1/level2
   from `pincode_mapping` behind a `country === 'in'` guard (`apps/main-app/src/lib/server/leads.ts`),
   `business-app/api/submitLead` sets `level2` alone, and `claimLead` copies `level2` from the
   original lead without ever copying `level1`. 055's header records the same on live data ("For US rows state … are NULL").
   So a US business sees its exclusive and claimed leads but never a non-exclusive one. Two tests in
   `pageCountry.test.ts` pin the current behaviour ("matches no US lead when state is null"), and the
   positive cases only pass because their fixture sets a state by hand. Closing it needs a US
   postal-code-to-state source — `pincode_mapping` is IN-only — which is a data question, not a code
   one. Whoever fixes it should flip those two tests rather than delete them.

   **Decided 2026-08-10: the US postal-code data is going to be added**, in a later session. So this
   is waiting on that import rather than on a decision — when the source lands, items 2 and 3 close
   together.

3. **`PostRecentProject.svelte:395-419` is India-shaped and US businesses reach it.** It labels its
   fields **"Pincode:"** and **"District (Auto-filled):"** and auto-fills from
   `/api/getDistrictByPincode`, which queries `pincode_mapping`. That is the one lookup
   `geo_locations` cannot replace — it has no postal-code column, and a live schema sweep found no US
   zip source anywhere. Blocked on the same missing data as item 2; solve the two together.

   The sibling branch form was the same bug and is fixed (`d418a08`, `0a8351a`) — its dropdowns now
   read `geo_locations`, which is populated for both countries. Use it as the model, but note
   `getCities` there needs state *and* county, because US county names repeat across states.

---

## Standing constraints

**Column vocabulary is country-neutral everywhere.** `business_profiles` carries `tax_id`, `level1`,
`level2` and `postal_code` since 063; `leaddata` carries `level1`, `level2` and `postal_code` since
066. Neither has `gstn`/`state`/`district`/`pincode`/`pin_code` any more, which is what every
migration and comment numbered below 063 (business) or 066 (lead) refers to.

The one place the India-shaped names survive is *aliasing*: `unifiedRead.ts`'s four selections and
`leads.ts`'s `IN_LEAD_RETURNING` map the neutral columns back to `state`/`district`/`pin_code` for
the components and wire payloads that still speak them. Read those before assuming a key in a page
load's `data` matches a column.

**There are no projections left.** The four sync helpers went with the tables they fed:
`sv_sync_in_split` and `sv_sync_account` with 062, `sv_sync_business` with 064, and `sv_sync_lead`
with 067 — the last of them. A lead is one row in `leaddata`,
a business is two rows in `business_profiles` + `business_accounts`, and all three are written
first-class. **There is nothing to call after a write.** The `unifiedSync.ts` module is gone from all
three apps.

The class of bug this removes is worth remembering, because it is what justified the churn: the
purge cron deleted `leaddata` rows and nothing deleted their `leads` rows, so every monthly run
stranded a batch — 18 of them by the time 067 ran.

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
`Lead` type. That selection was shaped for the narrow legacy `us_leaddata` table; since 054 the surviving
lead table carries these for both countries, so narrowing buys nothing. The real IN-only leakage is in
the write forms — items 2 and 3.

**There is a FOURTH place, and it is not in this repo.** `solar-app-internal` — admin-app and
`automation-scripts` — runs against the same production database. 060, 061, 062 and 065 all checked
it; 066/067's planning did not, and found admin-app's 38 `leads` call sites only *after* 066 was
already applied to live. It is not reachable by any grep of this repo, it has no test suite here,
and its route code is `.js` rather than `.ts`, so an `--include="*.ts"` filter silently misses all
of it. **Check `~/Developer/svelte/solar-app-internal` before every schema change, with no language
filter.** The three places below are necessary and were never sufficient.

Checking it that once also turned up two breakages *older* than the change that prompted the check —
admin-app had been 500ing on `businesses` since 064 and on `locations` since 058, and nothing in
either repo had noticed. That is the argument for making the check routine rather than occasional.

**Verifying that repo needs a different tool, because it has no tests and no typecheck.** A `.js`
app's `npm run build` cannot see inside a SQL string, so it proves nothing about a schema change.
What works: extract every `pool.query` string, resolve the column-list constants, and run each one
through `EXPLAIN (GENERIC_PLAN)` against live inside a read-only, rolled-back transaction. That
parses *and analyses* each statement — catching every missing table and column — without executing
anything, and it handles `$1` placeholders, which is why `PREPARE` is the worse choice. On the
2026-08-10 pass that was 91 of 99 statements clean; the other 8 build their `WHERE` dynamically and
cannot be reassembled, so they still need reading by eye.

**admin-app's id vocabulary is not this repo's.** It reads the same two stores, but the tables it
used to read were keyed by `(country_code, source_id)` — unique only as a pair — while the survivors
mint a globally unique id. `leads.source_id` became `leaddata.id` and `businesses.source_id` became
`business_profiles.business_id`. **`business_accounts` kept `source_id`**, because it was never
renamed and holds a `business_profiles.business_id` under the old name, so a join between the two is
asymmetric: `b.business_id = a.source_id`. That asymmetry is the one thing a find-and-replace across
that repo gets wrong, and it appears in nine files.

**Dropping a table breaks the test harness before it breaks anything else.** The suite replays a few
migrations on top of the generated baseline (`scripts/apply-test-migrations.mjs`), and those files
are *history* — 042 copies rows out of both `locations` and `us_locations`. Once the baseline stops
creating those tables, the copy is an unresolvable reference and **every** test fails in global
setup, not in an assertion. Both are wrapped in a `to_regclass(...) IS NOT NULL` guard, which is a
no-op on live and self-skipping in tests; do the same for the next drop. (054 had a third such copy
and is no longer replayed at all — see below.) Check three more places a code grep of `src/` will miss: the replayed migrations,
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

066 is the sharpest version of that: it was on the list for exactly one commit. It went on because
047 and 055 both `CREATE OR REPLACE sv_sync_lead` against leaddata's *old* column names, and a
plpgsql body is not resolved until it runs — so both create happily and then fail inside the first
fixture that calls the function. 066 was the only thing putting it back onto the renamed columns.
067 then dropped the function outright, and 066 came straight off again, taking its rewind with it.
**A file can be load-bearing for one commit and dead the next; re-check the list every time.**

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

All migrations through **068** are applied to live, verified 2026-08-10 by introspection. 066 and
067 were run by hand around their deploys, each gated as its header describes. 068 is pure
housekeeping — four unreachable trigger functions — and needed no deploy gating and no baseline
regeneration (the baseline declares tables only, which is why 047 is replayed on top of it).

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
-- 066: leaddata carries level1/level2/postal_code, not state/district/pin_code.
SELECT attname FROM pg_attribute WHERE attrelid = 'public.leaddata'::regclass AND attnum > 0;
-- 067: `leads` is gone and no sv_sync_* function is left at all.
SELECT to_regclass('public.leads');
-- 068: and no sync_unified_* orphan either. Both queries below return 0 rows;
-- the only function left in public is sv_slugify().
SELECT proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public' AND (proname LIKE 'sv_sync%' OR proname LIKE 'sync_unified%');
```

The same sweep confirms `us_*`, `locations` and `sv_referrers` are gone (056, 058, 059).
