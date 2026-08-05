# Next Steps

## ✅ DONE 2026-08-04 — Connection pooling: `business-app` creates a new Postgres pool per-request in most handlers

**Found:** 2026-08-04, while walking through architecture terms against the codebase.

**Problem:** Roughly two-thirds of `apps/business-app`'s route handlers (`+server.ts` / `+page.server.ts`) call
`createPool({ connectionString: POSTGRES_URL })` from `@vercel/postgres` **inside the handler function body**,
rather than at module scope. Examples: `us/api/claimLead`, `us/api/submitLead`, `us/api/updateLeadByBusiness`,
`in/api/claimLead`, `in/api/submitLead`, `in/api/updateBusinessDetails`, and ~25 more (both `/us` and `/in`).

On Vercel, a function instance can stay warm across multiple invocations. A pool created at **module scope**
(top of the file, outside any handler) is instantiated once and reused across every warm invocation — real
connection pooling. A pool created **inside the handler** gets a brand-new `Pool` object on every single call,
warm or not: no reuse across requests, and if these pools aren't explicitly closed, connections can accumulate
until GC or idle-timeout — a real risk of hitting Postgres's connection limit under load.

**What's already correct:** `apps/main-app` has a shared `src/lib/server/db.ts` that exports a single
module-scoped `pool` (and a Drizzle `db` wrapping the same pool), imported everywhere it's needed. A couple of
`business-app` files also get this right by declaring `const pool = createPool(...)` at module scope
(e.g. `us/api/getCities/+server.ts`, `lib/auth/business/RateLimiter.ts`).

**Fix:** Give `business-app` a shared `lib/server/db.ts` mirroring `main-app`'s pattern, and migrate the
in-handler `createPool` call sites to import the shared pool instead of creating their own.

**Done:** Added `apps/business-app/src/lib/server/db.ts` exporting a single module-scoped `pool`; migrated all
60 `createPool` call sites (including `PasswordManager`'s dynamic import) to import it, and removed the 14
`finally { await pool.end(); }` blocks that would have closed the now-shared pool. Log check was skipped
(no Vercel access from this session) — the change is safe regardless of whether limits were being hit.

## Drizzle migration plan (decided 2026-08-04: migrate, in small batches)

**Decision:** finish the Drizzle migration rather than demote it. Rationale: solo maintainer — the
type-checker is the reviewer. Schema changes (`drizzle-kit pull`) should surface every affected query at
compile time instead of failing at runtime route-by-route.

**Verified before planning:** `packages/db` schema defines 56 tables and covers all 25 tables that
business-app's raw SQL touches — no schema work is a prerequisite. Raw SQL lives in 59 business-app files,
53 main-app files, 1 file in packages.

**Ground rules for every phase:**
- Convert one batch, run `npm run check` in the affected app, commit, push. Never leave a batch half-done.
- Use `db.transaction()` for multi-statement work and `.for('update')` for row locks. The `sql` template
  escape hatch is allowed for genuinely awkward queries, but each use is noted in the commit message.
- Delete the hand-written row interfaces (`ClaimCountRow` etc.) as queries convert — Drizzle infers them.
- New/modified queries always use Drizzle from now on, even in not-yet-converted files (rule also added
  to CLAUDE.md in Phase 0).

### ✅ Phase 0 — plumbing (no query changes) — DONE 2026-08-04
Added `@solar/db` dep, `db = createDb(pool)` export in business-app's `db.ts`, CLAUDE.md convention
line. Schema verified current against live DB via `npm run pull -w @solar/db` (only import-order churn,
reverted). Baseline: `npm run check` in business-app has 84 pre-existing errors in 28 files (UI
components) — a converted batch passes if the count stays at 84.

Original plan: Add `@solar/db` as a dependency of business-app; extend `apps/business-app/src/lib/server/db.ts` to also
export `db = createDb(pool)` (same pattern as main-app, shared pool). Add the convention line to CLAUDE.md.
Run `drizzle-kit check` to confirm schema is current against the live DB.

### Phase 1 — pilot: simple lookup reads (business-app, ~9 files)
`getCities`, `getDistricts`, `getDistrictByPincode` (both `/us` and `/in`), `getCounties`,
`getCountyByZipcode`. Single-table selects, no auth, no writes. Purpose: establish what converted code
looks like; stop and review before continuing.

### Phase 2 — auth lib (business-app, 4 files)
`lib/auth/business/`: `RateLimiter`, `TokenManager`, `LoginTracker`, `PasswordManager`. Small, self-contained,
well-understood queries; RateLimiter's upsert exercises `onConflictDoUpdate`.

### Phase 3 — `/in` page loads (business-app, ~9 files)
The `(layout-1)/[business_slug]/**` `+layout.server.ts` / `+page.server.ts` files. Read-only joins.

### Phase 4 — `/us` page loads (business-app, ~5 files)
`us/[business_slug]/**` page loads. Same shape as Phase 3.

### ✅ Phase 5 — simple mutations (business-app, 22 files) — DONE 2026-08-04
add/delete/update for branches, referrers, recent projects, proposals, business details, compliance
accept/status, resetPassword — both countries. Straightforward single-row inserts/updates/deletes.
Also picked up the three lib helpers these routes share: `lib/compliance/ComplianceChecker`,
`lib/in/ownsBusinessSlug`, `lib/server/magicLink`. See the Progress section for details and for the
two live bugs the conversion surfaced.

### ✅ Phase 5.5 — characterization tests for the code Phase 6 will rewrite — DONE 2026-08-05
92 integration tests against real Postgres (Vitest), covering the two areas where a silent regression
hurts most:
- **Lead pipeline (52):** `submitLead`, `claimLead`, `updateLeadByBusiness` — claim-count limits,
  `FOR UPDATE` locking (two concurrent claims on the last slot → exactly one wins), duplicate-claim
  rejection, branch auto-creation, the 10-claim quality gate, `syncLeadToUnified` side effects.
- **Auth (40):** `PasswordManager`, `TokenManager`, `LoginTracker`, `RateLimiter` — throttle windows,
  token expiry (incl. NULL expiry = expired), hash-at-rest, rate-limit fail-**open**.

Test DB decision (owner: Ani, taken 2026-08-05): **local Docker Postgres**, `docker-compose.test.yml`,
port 5433, schema rebuilt per run. Overridable via `TEST_POSTGRES_URL`. See `tests/README.md` for the
full picture; the two things worth knowing here:

- **The migrations cannot build a test schema on their own.** 36 of 55 tables — `leaddata`,
  `businesses_1`, `branches`, `in_business_profiles`, `leaddata_claimrequests` among them — have no
  `CREATE TABLE` anywhere in the repo; they predate the migrations convention. Replaying from empty
  dies at `034`. So the schema is built as `tests/schema/000-baseline.sql` (generated from the
  introspected Drizzle schema by `scripts/generate-test-baseline.mjs`) plus the only three migrations
  that are pure final-state declarations: `042` (countries seed + `sv_slugify`), `047` and `050` (the
  `sv_sync_*` functions). History-encoding migrations can't replay over a final-state baseline —
  `039` creates `business_profiles`, `040` renames it, and the rename fails when the table is
  already there.
- **Regenerate the baseline after any schema change:** `npm run pull -w @solar/db && node
  scripts/generate-test-baseline.mjs`.

Only outbound email is mocked. Sessions use the real `SessionManager`, so the 401/403 branches stay
under test. `$lib/server/db` is aliased to a node-postgres pool of the same shape — the app's
`@vercel/postgres` driver talks to Neon over a WebSocket proxy and cannot reach a local Postgres. The
swap changes the driver, not the SQL.

Note: the plan assumed auth would still be raw SQL at this point, but Phase 2 had already converted it.
Those 40 tests are therefore a regression net rather than a pre-conversion snapshot — still worth
having, but they did not get to characterize pre-Drizzle behavior. The lead-pipeline tests did.

Phase 6 is now "convert until the tests pass again" instead of "convert and hope." The suite stays
after the migration as the permanent regression net for the critical path; UI/component tests and
trivial lookups (`getCities` etc.) are deliberately skipped — low failure probability, low failure
cost. Ongoing rule: every bug fixed from now on gets a test that reproduces it first.

### ✅ Phase 6 — the hard ones (business-app, 12 files) — DONE 2026-08-05
`claimLead`, `submitLead`, `updateLeadByBusiness`, `deleteLeadByBusiness` (all ×2 countries),
`fixClaimedLead`, `deleteAccount` (×2), `sendLeadClaimNotificationToCustomer` — transactions,
`FOR UPDATE` locks, multi-table writes, `syncLeadToUnified` interplay. Slowest, most careful phase;
convert one file per commit. These are the only `pool.query`/`client.query` call sites left in
business-app after Phase 5 — verified by grep.

Also fold in `lib/server/unifiedSync.ts`: it isn't raw `pool.query` in its own right (it calls the
`sv_sync_*` SQL functions through a `Queryable`), but every caller has to keep importing `pool`
purely to feed it. Converting it to take `db` and use the `sql` escape hatch for the function calls
would remove the last reason for a `pool` import outside `db.ts`, which Phase 10 wants anyway.
Note `claimLead` and `updateLeadByBusiness` pass a *transaction client* into these helpers, so
whatever `unifiedSync` takes must also accept a Drizzle transaction handle — do that conversion
before or together with those two files, not after.

**Done** — see the Phase 6 entry in Progress below for what the conversion actually looked like, the
patterns it added, and the one bug it surfaced and left unfixed. The rest of this section is the
plan as written before the work; the call-site table is now historical (all 65 are converted).

**Cold start for this phase.** Re-verified 2026-08-05 — these are all the `pool.query`/`client.query`
call sites left in business-app, 65 across 12 files:

| Count | File (`apps/business-app/src/`) |
| --- | --- |
| 26 | `routes/in/api/claimLead/+server.ts` |
| 14 | `routes/us/api/claimLead/+server.ts` |
| 5 | `routes/in/api/updateLeadByBusiness/+server.ts` |
| 3 | `routes/in/api/deleteAccount/+server.ts`, `routes/in/api/deleteLeadByBusiness/+server.ts`, `routes/us/api/deleteAccount/+server.ts` |
| 2 | `routes/in/api/sendLeadClaimNotificationToCustomer/+server.ts`, `routes/in/api/submitLead/+server.ts`, `routes/us/api/deleteLeadByBusiness/+server.ts`, `routes/us/api/submitLead/+server.ts`, `routes/us/api/updateLeadByBusiness/+server.ts` |
| 1 | `routes/in/api/fixClaimedLead/+server.ts` |

Workflow per file: convert → `npm test -w solarvipani-business` (must stay 92 passing) →
`npm run check` (must stay at 84 errors) → commit → push. Start with the three files the Phase 5.5
tests actually cover — `in/claimLead`, `in/updateLeadByBusiness`, `in/submitLead` — since those are
the only ones with a real safety net; the `/us` twins and the delete/fix endpoints are unguarded, so
convert them by close reading and keep the diffs small.

**Prerequisite (resolved 2026-08-05, but read this before the next session):** the tests need a
Postgres the suite can reach. Docker is still **not** installed on the dev machine, so
`docker compose -f docker-compose.test.yml up -d` does not work. Port 5433 does answer — that's the
EDB PostgreSQL 16 install, which has no `solar` role and needs a password we don't have, so the
default `postgres://solar:solar@localhost:5433/solar_test` fails auth.

What Phase 6 actually ran against: a throwaway cluster built from the EDB binaries, no Docker and
no password, leaving the 5433 server untouched.

```sh
export PATH=/System/Volumes/Data/Library/PostgreSQL/16/bin:$PATH
initdb -D pgdata -U solar --auth=trust
pg_ctl -D pgdata -o "-p 5544 -k /tmp" -l pg.log start
psql -h localhost -p 5544 -U solar -d postgres \
  -c "create database solar_test;" \
  -c "alter role solar with password 'solar' superuser;"

export TEST_POSTGRES_URL="postgres://solar:solar@localhost:5544/solar_test"
npm test -w solarvipani-business
```

The cluster lived in a scratch directory and is gone. Either install Docker and use the compose
file as originally intended, or re-run the four commands above (anywhere writable) and export
`TEST_POSTGRES_URL`. The suite rebuilds its schema per run, so a fresh empty database is fine.

### ✅ Phases 7–9 — main-app (54 files) — ALL DONE 2026-08-05
Enumerate and batch the same way now that business-app is done (main-app already imports `db`, so no plumbing
phase). Rough split: 7 = reads/page loads, 8 = simple mutations, 9 = lead pipeline + anything transactional.
Also the 1 raw-SQL file in `packages/`.

**Cold start for Phase 7.** Enumerated 2026-08-05: **54 files**, split below. `npm run check` baseline
for main-app is **13 errors + 1 warning in 7 files** (all pre-existing, in UI components) — a converted
batch passes if the count stays there. There is no test suite for main-app, so `check` is the only signal.

`packages/db/src/client.ts` shows up in the grep but is a false positive — the phrase `pool.query()`
appears in its doc comment. `packages/` has no real raw-SQL call sites; the "1 file in packages" in the
plan above was that comment.

**✅ Phase 7 — reads / page loads (24 files) — DONE 2026-08-05.**

| Status | Files |
| --- | --- |
| ✅ 7a | the 7 pillar `+page.server.ts` (solar-panels, -inverters, -pumps, -installation, rooftop-solar, -financing, -subsidy) |
| ✅ 7b | the 7 `[slug]` loads + 3 `[model_slug]` loads + `lib/server/slug-resolver.ts` |
| ✅ 7c | `lib/server/geo.ts`, `lib/server/sitemap.ts`, `lib/server/businesses.ts` — the shared read helpers |
| ✅ 7d | `[country]/(layout-1)/solar/` tree: index, `[state]`, `[state]/[district]`, `[state]/[district]/[slug]` |
| ✅ 7e | `partners/` (5), `partners/join/[district_slug]` (5), `installer/[installer_slug]` (3), `district/[district_slug]` (1), `business-listing` (1) |
| ✅ 7f | `tools/solar-calculator` (4), `tools/subsidy-checker` (3), `tools/emi-calculator` (1), `authors/[author_slug]` (3), `api/stories` (1) |
| ✅ 7g | `recent-solar-installation-projects` (2) + `[page_slug]` (2), `project/[project_id]` (1), `thank-you` (2), `get-quotes` (2), both `+layout.server.ts` (2+2), `[country]/(layout-1)/+page.server.ts` (1) |

**Phase 8 — simple mutations (9 files).** `api/submitBusiness` (5), `api/updateRecentProject` (5),
`api/postRecentProject` (2), `api/generateUserMagicLink` (3), `lib/server/magicLink.ts` (1),
`api/submitDataAccess` (1), `api/submitDataDeletion` (1), `api/cron/purge-old-leads` (1),
`(layout-1)/unsubscribe/+server.js` (2 — note: `.js`, not TypeScript, so `check` won't cover it).

**Phase 9 — lead pipeline (1 file).** `lib/server/leads.ts` (3) — already partly Drizzle; the raw
call sites are the transactional insert path. Smaller than expected because main-app's lead writes
are concentrated here.

Two things carry over from business-app and will save time:
- The patterns are all established: `db.transaction()` + `.for('update')`, `earlyExit` +
  `tx.rollback()` for rollback-then-return, snake_case `*_RETURNING` maps wherever a handler ships a
  driver row to the client, `sql` escape hatch noted in the commit message.
- `$lib/server/leads.ts`'s returning maps are business-app-local. If main-app writes the same lead
  tables, either mirror them there or lift them into `packages/db` — decide before Phase 9, not during.

There is **no test coverage for main-app**. The Phase 5.5 suite is business-app only, so Phases 7–9
have no safety net; the `npm run check` baseline is the only automated signal. Consider whether the
main-app lead pipeline deserves its own characterization tests before Phase 9, the way 5.5 preceded 6.

### ✅ Phase 10 — closeout — DONE 2026-08-05
Grep verified: `grep -rn "pool\.query\|client\.query" apps/main-app/src apps/business-app/src`
returns nothing, and `createPool` appears in neither app outside `lib/server/db.ts`.

**The raw `pool` export is gone from both apps' `db.ts`.** It is now a module-private const feeding
`createDb`. Nothing outside `db.ts` needed it, and removing the export is what makes the
Drizzle-only convention self-enforcing rather than a rule to remember. `business-app/tests` are
unaffected — they alias `$lib/server/db` to `tests/setup/testDb.ts`, which exports its own
node-postgres pool for assertions.

CLAUDE.md updated: the "migration in progress" wording is replaced with the finished state, the
`user-app` exception below, and the two `drizzle-kit pull` gotchas (jsonb → `unknown`, timestamps →
`mode: 'string'`, and real nullability) that caused most of the Phase 7 churn.

Baselines held throughout: main-app `npm run check` 13 errors, business-app 84 errors + 92 tests.

### Progress
- [x] Phase 0 (2026-08-04)
- [x] Phase 1 (2026-08-04) — 8 files (not 9; that's all the lookup endpoints that exist). Pattern
      established: `db.selectDistinct({col: table.col}).from(...).where(eq(...)).orderBy(asc(...))`;
      schema tables imported from `@solar/db/schema`; one `sql` escape hatch for `LOWER() = LOWER()`.
- [x] Phase 2 (2026-08-04) — auth lib converted; `onConflictDoUpdate` + `sql` CASE for RateLimiter's
      window reset; per-country Drizzle tables replace the table-name string maps (removed from
      countryTables.ts); timestamps wrapped in `new Date()` to keep Date-typed contracts.
- [x] Phase 3 (2026-08-04) — all 9 `/in` server loads converted; added typed `*_SELECTION` Drizzle
      maps to `unifiedRead.ts` (string projections kept until remaining raw call sites migrate).
      Compliance page still passes `pool` into `$lib/compliance` helpers (those convert in Phase 5).
- [x] Phase 4 (2026-08-04) — all 5 `/us` server loads converted (main page, branch, crm,
      open-inquiries, project). Same pattern as Phase 3; `US_BUSINESS_SELECTION`/`US_LEAD_SELECTION`
      reused from `unifiedRead.ts`.
- [x] Phase 5 (2026-08-04) — 22 files in 7 commits (5a–5f): branch/referrer mutations (4), recent-project
      mutations (6), proposal mutations + `ownsBusinessSlug` (4), resetPassword (2),
      updateBusinessDetails + compliance lib + magicLink (5), us/addBranch (1). Patterns added:
      snake_case-aliased `.returning()` maps where the raw handler shipped driver rows straight to
      the client (`PROPOSAL_RETURNING` in `lib/server/proposals.ts`); conditional spreads into
      `.returning()` to reproduce the old dynamically-built RETURNING lists; `aliasedTable` for
      self-joins; per-country Drizzle tables replacing trusted table-name strings (magicLink),
      continuing the Phase 2 approach. `sql` escape hatches: `LOWER() = LOWER()` city compares
      (×2), `NOW()` for created_at/updated_at (×4), `COALESCE` in the mintUserToken upsert.
      Helpers that took a `pool` argument (compliance ×4, `ownsBusinessSlug`, `mintUserToken`)
      now use `db` directly; their call sites lost the argument, including two in Phase 6 files.
      `unifiedSync`'s helpers still take a raw `Queryable`, so files calling them still import
      `pool` — those convert with `unifiedSync` itself, which is not yet assigned to a phase.

**Two live bugs surfaced by the conversion** (both fixed, per decision):
- The three `/us` recent-project endpoints wrote to `projects` (the IN table) and set a `county`
  column that table doesn't have — the INSERT/UPDATE could never have succeeded, and the deletes
  hit the wrong country's rows. Now on `us_projects`, which is what the `/us` project page reads.
  `pincode` maps to `us_projects.zipcode`, still returned to the client as `pincode`.
- Both `resetPassword` endpoints read/wrote `reset_token_hash` and `reset_token_used`, columns that
  exist in no schema or migration; every request was failing on the SELECT. Now on the real
  `reset_token` / `reset_token_expires`. The "already used" branch is gone — a successful reset
  clears the token, so reuse reports the generic invalid/expired error.

**Still open, found in passing (no action taken):**
- Nothing in the app issues a password reset token, so `resetPassword` is unreachable end to end
  even now that it works. Either add a forgot-password endpoint or delete the flow and its pages.
- **`faq` is nullable but typed non-null (Phase 7a).** Every `faq` jsonb column is nullable in the
  DB, and the raw driver's `any` hid that. `PillarPage.svelte` and the seven pillar `+page.svelte`
  files all declare it non-null; the component guards with `?? []`, but the pages do
  `data.pillarData.faq?.length > 0`, which is a TS error the moment the type is honest
  (`undefined > 0`). The selection maps in `lib/server/seo.ts` therefore declare `FaqItem[]`, which
  is exactly the pre-conversion behaviour, with a comment pointing here. Fixing it properly means
  widening the component prop to `FaqItem[] | null` and correcting the `?.length` guard in seven
  page files — a UI change, not a query change, so it was left out of the conversion batch.
- `/us`'s county lookups (`getCountyByZipcode` and both recent-project endpoints) resolve a US
  zipcode against `pincode_mapping`, the Indian pincode table, and validate it as 6 digits. The
  app-wide pattern predates the migration and was left alone; `us_locations` has the county data.

- [x] Phase 5.5 (2026-08-05) — 92 tests, 7 files. Vitest + local Docker Postgres. Harness:
      `docker-compose.test.yml`, `scripts/apply-test-migrations.mjs`,
      `scripts/generate-test-baseline.mjs`, `tests/schema/000-baseline.sql`,
      `apps/business-app/tests/`. `npm test -w solarvipani-business`. Surfaced that the numbered
      migrations cover only 19 of 55 tables (see the phase entry above). `npm run check` unchanged
      at the 84-error baseline.
- [x] Phase 6 (2026-08-05) — 12 route files + `unifiedSync`, in 6 commits (6a–6f). **business-app is
      now fully converted:** `grep -rn "pool\.query\|client\.query" apps/business-app/src` returns
      nothing. 92 tests passing throughout, `npm run check` unchanged at 84.
  - **6a — `unifiedSync` first, as the phase entry required.** The four `sv_sync_*` helpers now take
    `Pick<Database, 'execute'>`, which both `db` and a `db.transaction()` handle satisfy, so a caller
    inside a transaction still projects on the same connection. The 16 non-transactional call sites
    moved from `pool` to `db` in the same commit, and `mintBusinessTokenById` lost its now-dead
    `pool` parameter. The two `claimLead` files pass a transaction client, so their sync calls were
    temporarily inlined as raw `SELECT sv_sync_*` and restored in 6b/6e — that's why 6a touches 18
    files and why those TODO(phase 6) comments existed for two commits.
  - **Transaction pattern (6b, 6e).** `db.transaction(async (tx) => ...)`, with `.for('update')`
    for the `FOR UPDATE` claim-count lock. The branches that did `ROLLBACK` then returned a specific
    response set an outer `earlyExit` and call `tx.rollback()`; since that throws, the outer catch
    checks `earlyExit` before falling through to the 500. All such branches fire before any write,
    so rollback-vs-commit is not a behavioural difference — worth re-checking if new ones are added.
  - **`RETURNING *` needed explicit maps.** Several handlers shipped the driver row straight to the
    client, so the wire shape is the table's snake_case column names; bare `.returning()` would
    have silently switched them to camelCase. Added `$lib/server/leads.ts` with `IN_LEAD_RETURNING`
    and `US_LEAD_RETURNING` (same idea as Phase 5's `PROPOSAL_RETURNING`). Used by claimLead,
    updateLeadByBusiness and deleteLeadByBusiness on both sides.
  - `sql` escape hatches added: the claim gate's `NOW() - INTERVAL '60 days'` compare, the
    district-presence `EXISTS` subquery, `claim_count + 1` (×2), `NOW()` for the claimed copy's
    `created_at` (×2). Everything else converted to the query builder.
  - All the hand-written row interfaces in these files are gone (`ClaimCountRow`, `ClaimRequestRow`,
    `NewLeadRow`, `LeadDataRow`, `LeadRow`, `BusinessRow`, `LeadInsertResult`, `DistrictResult`,
    `CountyResult`).

**Bug found and deliberately NOT fixed — `/us/api/claimLead` never sends its emails.** Both
post-commit lookups, and the `mintBusinessTokenById` call between them, read `businesses_1` — the
**IN** table — for a `/us` business id. `us_businesses` and `businesses_1` share an id sequence
(`nextval('businesses_1_id_seq')`), so the id can't collide into a real row: the lookup returns
nothing, the handler logs "business not found", and both the allotment email and the customer
notification are silently skipped. Same family as the two Phase 5 bugs, but unlike those, fixing it
*starts* sending mail this endpoint has never sent — to real installers and real customers. Left as
a one-line-per-site change (`businesses1` → `usBusinesses`, `'businesses_1'` → `'us_businesses'`)
with NOTE comments at each site, pending a decision. `/us/api/claimLead` has no test coverage.

- [x] Phase 7 (2026-08-05) — 24 files in 7 commits (7a–7g). **main-app has no raw SQL left in any
      page load or layout**; what remains is the nine Phase 8 mutation endpoints and
      `lib/server/leads.ts`. Shared modules added: `lib/server/seo.ts` (selection maps for the SEO
      content families), `lib/server/projects.ts` (`PROJECT_CARD_SELECTION`,
      `getTopProjectsPerBusiness`, `listVisibleProjects`), `BUSINESS_CARD_SELECTION` in
      `businesses.ts`, and `getDistrictsWithInstallerCounts` / `getVisibleInstallerCount` in
      `queries.ts`. `slug-resolver.ts` and `sitemap.ts` exports dropped their `pool` parameters
      (Phase 5 precedent). `businesses.ts`'s `BUSINESS_COLUMNS` string and `mapBusiness()` mapper are
      gone. `api/stories` was still creating its own module-scope `createPool` — now on the shared `db`.
      **Three things worth carrying into Phases 8–9:**
      - **Nullability is the recurring friction, not the SQL.** Drizzle reports the real nullability
        the raw driver's `any` hid, and many components declare columns non-null that the schema
        allows to be NULL. Default to restating the old contract with ``sql<T>`${table.col}` `` plus a
        comment; only widen the component when it already guards at runtime (done once, for
        `ProjectGallery.svelte`'s four optional props). This accounted for most of the churn in 7d–7g.
      - **`mode: 'string'` timestamps.** The introspected schema types timestamptz as strings, so
        callers doing `row.col.toISOString()` break. `sitemap.ts` formats in SQL with
        `to_char(... AT TIME ZONE 'UTC', 'YYYY-MM-DD')`. Grep for `.toISOString()` on a query result
        before converting a file.
      - **`jsonb` is typed `unknown`.** Wrapping the column in ``sql<T>`${table.col}` `` restates the
        shape without changing the generated SQL. Annotating `schema.ts` with `.$type<T>()` would not
        survive the next `drizzle-kit pull`.

**Two more bugs surfaced by Phase 7, both fixed (7f), both in `/authors/[author_slug]`:**
- **The page 500'd on every request.** Its blog-post query selected `excerpt` and `featured_image`,
  neither of which exists on `in_blog_posts` in any schema or migration — same family as the Phase 5
  `resetPassword` bug. Both columns dropped; nothing in the app reads `blogPosts` (the blogs feature
  was removed 2026-07), so no rendered output changed.
- **The author avatar never rendered.** The load did `SELECT *`, which returns `photo_url`, but the
  page reads `data.author.photo` — always undefined, always skipped by its `{#if}` guard. `SELECT *`
  typed the row `any`, so nothing caught it. The page now reads `photo_url`, so author photos start
  appearing. Unlike the `/us/claimLead` mail bug below, this sends nothing to anyone, so it was
  fixed rather than left pending a decision.

- [x] Phase 8 (2026-08-05) — 9 files in 2 commits (8a, 8b). Three endpoints were still calling
      createPool per request or per module. api/stories, submitBusiness, postRecentProject and
      updateRecentProject all moved to the shared db. **Security fix in updateRecentProject:** the
      UPDATE interpolated the caller-supplied business_slug into the SQL string while every other
      value was parameterised; the query builder parameterises it.
- [x] Phase 9 (2026-08-05) — 1 file, folded into the 8b commit. unifiedSync converting to
      Pick<Database, 'execute'> forced leads.ts at the same time (exactly as business-app 6a
      forced claimLead): its pool.connect() + BEGIN/COMMIT/ROLLBACK around createDb(client) is now a
      plain db.transaction(), with syncLeadToUnified taking the tx handle.
- [x] Phase 10 (2026-08-05) — grep clean, raw pool un-exported from both apps, CLAUDE.md updated.
      Surfaced that user-app was never in scope — see the new section at the end of this file.

---

## Original observation (2026-08-04): Drizzle ORM adoption is stalled mid-migration

**Found:** 2026-08-04, same session, while checking ORM usage.

**Observation:** `packages/db` sets up Drizzle properly (`drizzle.config.ts`, typed `schema.ts`/`relations.ts`,
`drizzle-kit pull`/`check` scripts), and `apps/main-app/src/lib/server/db.ts` wraps the same Postgres pool with
both a raw `pool` export and a Drizzle `db` export — the file's own comment says this is intentional so
"converted and not-yet-converted queries share one connection pool."

In practice, adoption never got past that first step: across the whole monorepo only 2 files
(`apps/main-app/src/lib/server/db.ts` and `apps/main-app/src/lib/server/leads.ts`) import `@solar/db`, versus
115 files that query via raw `pool.query(...)` / `@vercel/postgres` directly (hand-written SQL strings,
including transactions and `FOR UPDATE` locks in places like `claimLead`).

**Why it's worth a decision, not just a note:** an ORM migration frozen at ~2% coverage isn't really "in
progress" — it's effectively two permanently coexisting query styles, which is worse long-term than picking one
and sticking with it (new contributors have no clear convention to follow, and Drizzle's schema/types drift in
relevance if most queries never go through it). Worth explicitly deciding: keep pushing the migration forward,
or accept raw SQL as the standard and demote `@solar/db` to schema/type-reference only.

---

## ✅ DONE 2026-08-05 — Convert `user-app` to TypeScript (and finish Svelte 5)

**Done in 6 commits (batches A–F).** `apps/user-app/src` now has **zero `.js` files** and all 7
`.svelte` components declare `lang="ts"`. `npm run build -w user-app` passes at every batch.

**Error count, batch by batch:** 0 (unchecked) → **73** (A, checkJs on) → 29 (B) → 25 (C) → 25 (D)
→ 19 (E) → **1** (F). Warnings 8 → 2.

| Batch | What | Errors after |
| --- | --- | --- |
| ✅ A | Flip `checkJs: true` — one line, no code changes | 73 |
| ✅ B | `lib/auth/user/` (6 files) | 29 |
| ✅ C | `sendEmail`, `server/billStorage`, `server/internalAuth`, `server/unifiedSync`, `hooks.server` | 25 |
| ✅ D | the 4 `routes/in/api/**/+server` endpoints | 25 |
| ✅ E | the 4 `+page.server` loads/actions | 19 |
| ✅ F | `lang="ts"` on all 7 components | 1 |

**Sequencing decision (owner: Ani, 2026-08-05).** The plan's batch A said "fix what falls out
*before* renaming anything." That was changed: nearly all 73 errors were the exact type debt the
`.ts` conversion clears (implicit-any params, `@returns {Object}`, `unknown` in catch), so fixing
them in JSDoc first would have authored every shape twice and made A the largest commit in the
phase. Instead A is the one-line flip and the rule for B–F became **"must decrease, never
increase,"** verified per batch. Batch D was flat at 25 rather than decreasing — confirmed by
re-running `check` against the stashed tree, because those four endpoints were already clean.

**The current baseline is 1 error / 2 warnings, and the 1 error is not user-app's code.**
`vite.config.js:5` fails because two copies of Vite's types are in play: main-app's stale
`@sveltejs/kit@2.70.1` (via `@sveltejs/vite-plugin-svelte@3`) drags `vite@5.4.21` into the hoisted
root `node_modules`, while user-app resolves its own `vite@7.3.6`, so `sveltekit()` returns v5
`Plugin`s into a v7 `defineConfig`. **All three apps have this clash**; user-app is only the one with
`checkJs` on to see it. Fixing it means bumping main-app's kit/vite-plugin-svelte, which moves the
main-app (13) and business-app (84) baselines — so it wants its own commit, exactly like the
`svelte-check` v4 upgrade below. `checkJs` was deliberately left **on** rather than switched off to
bury it. The 2 warnings are pre-existing and untouched (a `radiogroup` missing `tabindex`, an unused
`h3` selector).

**Still open — `svelte-check` is still pinned at `^3.6.0`** across all three apps, which predates
Svelte 5. Upgrading to v4 was in scope for this phase and was **not** done, for the reason the plan
itself gives: it will move all three error baselines and that movement should be isolated and
attributable. Do it as its own commit across all three apps, together with (or right after) the Vite
dedupe above — they are the same kind of change.

### Six defects the conversion surfaced

Four fixed, two noted. This is the payoff the phase was argued for.

- **`createUserAuthService()` would have thrown `ReferenceError`** (batch B).
  `export { UserAuthService } from './UserAuthService.js'` re-exports without binding the name
  locally, so the function body referenced an undefined identifier. **Fixed** by adding the import.
  It has no callers anywhere in the monorepo — a deletion candidate, same as
  `main-app/src/lib/server/magicLink.ts`.
- **`refreshSession` did arithmetic on two `Date`s** (`(now - lastActivity)`, batch B). Worked via
  `valueOf`, but was untypeable. **Fixed** — `.getTime()` on both.
- **`billStorage.uploadBill` could resolve `undefined`** (batch C) when Cloudinary's callback yielded
  neither error nor result, then throw on the `.public_id` read a line later. **Fixed** — rejects.
- **`/in/thank-you` never rendered its exclusive-lead heading** (batch F). The template reads
  `customerDetails.isExclusiveLead`; the load has never selected it, so the page always showed "Top
  Solar Installers in Your Area." **Fixed** (owner's call): the load now derives it from `urlparams`
  using the same regex `sendLeadSubmissionConfirmation` uses for the email. **Keep those two in
  step.** Note this is a visible change to a live page — same family as the Phase 7f author-avatar
  bug.
- **`/in/thank-you`'s `{#if error}` branch was unreachable** (batch F) — the load has never returned
  `error`. **Deleted**; the missing-lead case is already covered by `customerDetails` being null.
- **The feedback form did not re-seed on navigation** (batch F) — the 6 `state_referenced_locally`
  warnings. next-steps.md called for `$derived`, which **would have made the form read-only** (a
  derived value cannot be assigned; the star rating, both radio groups and the textarea all write
  back). Resolution: `$state` seeding stays so SSR still renders saved feedback, plus an `$effect`
  that re-seeds when `data.feedback` changes. The initializers still read `data` at the top level, so
  the now-inaccurate warning is suppressed per-line with `svelte-ignore`.

### Carry into the follow-on Drizzle phase

- **`lib/server/unifiedSync.ts` is the seam, and it is ready.** Its `db` parameter is now a named
  exported `Queryable` interface instead of an inline shape. main-app and business-app's copies take
  `Pick<Database, 'execute'>`; **swapping that one type for the `@solar/db` import is the whole
  change here** — nothing else in the module moves. Do it early, the way business-app's Phase 6a did,
  because callers pass it through.
- **The per-handler `createPool` is still there and was deliberately left.** `submitLead`,
  `sendLeadSubmissionConfirmation`, `in/+page.server`, `in/feedback/+page.server` and
  `in/thank-you/+page.server` all still call `createPool` inside the handler — the pattern the
  2026-08-04 pooling fix removed from business-app. It gets fixed by the Phase 0-style plumbing step
  (add `@solar/db`, create `db.ts` with a module-private pool), so fixing it now would have meant
  touching those files twice.
- **The load return types are declared interfaces now** (`Lead`, `ClaimedBusiness`, `Feedback`,
  `CustomerDetails`, `Installer`), with `as Lead[]`-style casts on the logged-out early returns.
  Those casts are load-bearing: three loads return a different object shape when logged out, and
  without the annotation the inferred `PageData` unions a real row type with `never[]`. When the
  queries convert, keep the interfaces rather than letting Drizzle's inference widen them — the
  nullability in them was checked against `schema.ts`, not guessed.
- **One nullability correction already had to be made** — `in_user_feedback.got_callback`,
  `got_quotation` and `recommendation_rating` are `NOT NULL`; batch E widened them and batch F put
  them back. Check `schema.ts` rather than the SELECT list.

---

## Original plan for the TypeScript phase (kept for reference)

**Decision taken 2026-08-05 (owner: Ani):** option 1 from the section below — convert `user-app` to
TypeScript *first*, then migrate its queries to Drizzle as a follow-on phase. This is the option that
restores the plan's original rationale ("solo maintainer — the type-checker is the reviewer"), which
a JavaScript app cannot deliver.

**Do this before the Drizzle conversion of `user-app`, not after.** Converting the queries first
would mean touching all 12 DB files twice and would forfeit the compile-time check on the conversion
itself — which is precisely the safety net that made Phases 1–10 tractable.

### Check the scope claim before planning — Svelte 5 is mostly already done

Verified 2026-08-05, and it contradicts the obvious assumption:

- `user-app` is **already on Svelte 5** — `svelte ^5.46.1`, and **6 of its 7 components already use
  runes** (`$props`, `$state`, `$derived`).
- `grep -rln 'export let |on:click|on:submit|on:change|\$: ' src/` returns **nothing**. There are no
  Svelte 4 idioms left to migrate.
- The only component with no runes is `src/routes/+page.svelte`, and that is because it has no
  reactive state at all — a static region picker. Nothing to convert.

So "convert to Svelte 5" is effectively complete. Do not go looking for migration work that isn't
there. What genuinely remains under that heading is small:

- No `.svelte` file declares `lang="ts"` (0 of 7), so component scripts are unchecked.
- `svelte-check` is pinned at `^3.6.0` across all three apps, which predates Svelte 5. Worth
  upgrading to v4 as part of this — but **do it as its own commit across all three apps**, because
  it will move the main-app (13) and business-app (84) error baselines and you want that movement
  isolated and attributable.

### The actual work: TypeScript

**19 `.js` files, 0 `.ts` files.** `tsconfig.json` already extends the base config but sets
`allowJs: true, checkJs: false` — so today nothing in this app is type-checked at all.

**Baseline before starting: `npm run check -w user-app` reports 0 errors and 8 warnings in 2 files.**
This is a *clean* baseline, unlike main-app (13) and business-app (84) — the one app where the
conversion can be held to zero new errors with no pre-existing noise to see past. Keep it at 0.

The 8 warnings are all the same Svelte 5 issue in `routes/in/feedback/+page.svelte` (lines 7–11):
*"This reference only captures the initial value of `data`. Did you mean to reference it inside a
derived instead?"* — destructuring `data` at the top of `<script>` instead of wrapping in `$derived`.
That is a real reactivity bug (the page will not update on client-side navigation), not noise. Fix it
while you are in the file, with a note in the commit.

**Suggested batches**, smallest-blast-radius first, same one-batch-per-commit rule as Phases 1–10:

| Batch | Files |
| --- | --- |
| A | Flip `checkJs: true` and fix what falls out *before* renaming anything — this surfaces the real type debt while the diff is still one line and revertible |
| B | `lib/auth/user/` (6): `AuthTypes`, `SessionManager`, `TokenManager`, `LoginTracker`, `UserAuthService`, `index` — self-contained, and `AuthTypes.js` is presumably JSDoc types that become real interfaces |
| C | `lib/` leaf helpers (5): `sendEmail`, `server/billStorage`, `server/internalAuth`, `server/unifiedSync`, plus `hooks.server.js` |
| D | The 4 `+server.js` endpoints under `routes/in/api/` |
| E | The 4 `+page.server.js` loads and `routes/signin-link/[token]/+page.server.js` |
| F | Add `lang="ts"` to the 7 components; fix the feedback-page `$derived` warnings |

Two things carry over from this session and will save time:

- **`lib/server/unifiedSync.js` is the seam to the Drizzle phase.** Both other apps' copies now take
  `Pick<Database, 'execute'>`; converting this one to match is what will let `user-app`'s Drizzle
  phase reuse the pattern instead of inventing a third. Type it in batch C with that end state in
  mind, even though it still wraps a raw pool at that point.
- **`user-app` has no `@solar/db` dependency and no `lib/server/db.js`.** Both apps' `db.ts` no
  longer export a raw `pool` (Phase 10), so the follow-on Drizzle phase starts with a Phase 0-style
  plumbing step: add the dep, create `db.ts` with a module-private pool, and only then convert
  queries. `user-app` also still creates pools inside handlers — the pattern the 2026-08-04 pooling
  fix removed from business-app — so that gets fixed by the same move.

Also in scope for whoever picks this up, or explicitly deferred: the two
`apps/main-app/scripts/chatbot-related/*.js` offline scripts (5 raw-SQL call sites). They are not
`user-app` and not request handlers; they just have nowhere else to be tracked.

---

## Found 2026-08-05 during Phase 10: `user-app` was never in the migration's scope

The Phase 10 grep across the whole monorepo turned up a **third app the Drizzle plan never counted**.
The plan's inventory was "59 business-app files, 53 main-app files, 1 file in packages" — `apps/user-app`
is absent from it, and the "1 file in packages" turned out to be a false positive (the phrase
`pool.query()` in `packages/db/src/client.ts`'s doc comment).

**Still on raw SQL — 12 files, 31 call sites:**

| Count | File |
| --- | --- |
| 3 | `user-app/src/routes/in/thank-you/+page.server.js`, `user-app/src/routes/in/api/uploadBill/+server.js`, `user-app/src/routes/in/api/generateUserMagicLink/+server.js`, `user-app/src/lib/auth/user/TokenManager.js`, `user-app/src/lib/auth/user/LoginTracker.js` |
| 2 | `user-app/src/routes/in/+page.server.js`, `user-app/src/routes/in/feedback/+page.server.js`, `user-app/src/routes/in/api/submitLead/+server.js`, `user-app/src/routes/in/api/sendLeadSubmissionConfirmation/+server.js` |
| 3 | `main-app/scripts/chatbot-related/sync-embedding-index.js` |
| 2 | `main-app/scripts/chatbot-related/embed-city-pages.js` |

**Decided 2026-08-05: option 1 — and both halves are now done.** See the two "DONE 2026-08-05"
sections below for the TypeScript conversion and the Drizzle migration that followed it.
The reasoning is recorded below as it stood when the options were open.

**This is a decision, not a leftover batch.** The whole rationale in the plan's header is "solo
maintainer — the type-checker is the reviewer." `user-app` is **plain JavaScript**, not TypeScript:
there is no `npm run check` type-checking to catch a schema change, so converting it buys the
convention and the parameterised `sql` helper, but not the compile-time safety that justified the
work everywhere else. It also has no `@solar/db` dependency and no `lib/server/db.js`, so it needs a
Phase 0-style plumbing step first — and it still creates pools per handler, the problem the
2026-08-04 pooling fix removed from business-app.

Three options, roughly in order of cost:
1. **✅ CHOSEN — Convert `user-app` to TypeScript first, then migrate it.** Highest cost, but the
   only one that delivers the reason the migration was worth doing. The app is small (12 files touch
   the DB, 19 files total).
2. **Migrate it as JavaScript.** Cheap, gets one query style across the monorepo and fixes the
   per-handler pooling, but no type-checking payoff.
3. **Leave it and say so.** Then CLAUDE.md's "all queries use Drizzle" needs to keep its `user-app`
   carve-out permanently, which is the "two coexisting query styles" outcome the original 2026-08-04
   observation argued against.

The two `main-app/scripts/chatbot-related/*.js` files are offline scripts, not request handlers —
lower stakes either way, but they belong with whichever decision is taken.

**Also noted:** `apps/main-app/src/lib/server/magicLink.ts` has no importers anywhere in the
monorepo (business-app has its own). It was converted in Phase 8a so the Phase 10 grep would come
back clean; it is a deletion candidate.

---

## ✅ DONE 2026-08-05 — Migrate `user-app`'s queries to Drizzle

**The migration is finished.** `grep -rn "pool\.query\|client\.query" apps/user-app/src` returns
nothing and `createPool` appears only in `lib/server/db.ts`, so all three apps are now converted and
CLAUDE.md has dropped the `user-app` carve-out. `npm run check -w user-app` held at the 1-error
baseline (the `vite.config.js` duplicate-Vite-types artifact) and `npm run build -w user-app` passed
at every batch — the only two signals available, since user-app has no test suite.

**Done in 5 commits.** Phase 0 first, then unifiedSync, then everything else:

| Batch | What |
| --- | --- |
| ✅ 0 | `@solar/db` dep + `lib/server/db.ts` with a module-private pool feeding `createDb` |
| ✅ A | `unifiedSync` + its two callers, `submitLead` and `uploadBill` |
| ✅ B | auth lib: `TokenManager`, `LoginTracker` |
| ✅ C | `generateUserMagicLink`, `sendLeadSubmissionConfirmation` |
| ✅ D | the three `+page.server.ts` loads: `in/`, `in/feedback`, `in/thank-you` |

**The five per-handler `createPool` call sites are gone**, which is the 2026-08-04 pooling fix finally
reaching this app. `TokenManager.getUserByEmail` also dropped a `pool.connect()` /
`finally { client.release() }` wrapped around a single SELECT.

**Both `sql` hatches next-steps flagged in advance landed as predicted**, plus a few more:
- `LOWER(level2) = LOWER($1)` in thank-you and sendLeadSubmissionConfirmation.
- **The `LoginTracker` interval was the one real security-shaped finding.** It built
  `INTERVAL '${throttleHours} hours'` by string interpolation of a caller-supplied number — the only
  unparameterised value in the app. Now `NOW() - make_interval(hours => $n)`, a real bind parameter.
  (Same family as the Phase 8 `updateRecentProject` fix, though this one is reached only from
  internal callers.)
- `rscore DESC NULLS LAST` (×2). Postgres defaults `DESC` to `NULLS FIRST`, so `desc()` alone would
  have silently changed the order. **Grep for `NULLS LAST` before converting an ORDER BY.**
- `NOW()` / `CURRENT_TIMESTAMP` writes, and `SELECT sv_sync_lead(...)` in unifiedSync.

**Nullability and `mode: 'string'` were the friction, exactly as Phase 7 predicted.** Everything was
restated with ``sql<T>`${table.col}` `` rather than widening the declared interfaces, per the
"Carry into the follow-on Drizzle phase" note above: `sql<number>` over the nullable
`leads.source_id` (always set on rows projected from leaddata), `sql<Date | null>` over the
`mode: 'string'` timestamps that `AuthUser.created_at` / `LastLoginUpdate.lastLogin` /
`submittedAt` declare as Dates, and `sql<string>` over the nullable `businesses.businessname`.

`generateUserMagicLink`'s `name = COALESCE($3, name)` became a conditional spread — omitting the key
from the `.set()` keeps the stored name, which is what the COALESCE did when the caller sent none.

### One mismatch found and deliberately left

**`ClaimedBusiness.stage` and `.status` are declared `string | null`, but the columns are `smallint`
and `boolean`** (`/in/+page.server.ts`). The raw driver's `any` hid it; the page's `getStageLabel()`
indexes a `Record<string, string>` with the value and works by JS coercion. The conversion restates
the declared types with `sql<string | null>`, so behaviour is byte-identical — but the honest types
are `number | null` and `boolean | null`, and fixing it means touching `+page.svelte`. That is a UI
change, not a query change, so it was kept out of the conversion batch. Same call as the `faq`
nullability item under Phase 7a.

### What is actually left in the monorepo

Everything below the first item was cleared on 2026-08-05 — see the follow-up section
at the end of this file.

- **`svelte-check` is still pinned at `^3.6.0`** across all three apps, and the Vite-types dedupe is
  still undone. Both are described under the TypeScript phase above; they are the same kind of
  change and want one commit across all three apps, because they will move the main-app (13) and
  business-app (84) baselines. **This is the only thing on the original list still open.**
- ~~The two `chatbot-related/*.js` offline scripts~~ — converted to TypeScript + Drizzle.
- ~~Deletion candidates (`main-app/lib/server/magicLink.ts`, `createUserAuthService()`)~~ — deleted.
- ~~`resetPassword` unreachable~~ — the forgot-password endpoint now exists.
- ~~`/us/api/claimLead` never sends its emails~~ — fixed, along with the larger bug underneath it.

---

## Original plan for the user-app Drizzle phase (kept for reference)

**Scope: 12 files, 31 call sites** (the table in the section below is still accurate — the file
extensions are now `.ts`, and `TokenManager`/`LoginTracker` live under `lib/auth/user/`).

**Baseline to hold: `npm run check -w user-app` is 1 error and 2 warnings.** The 1 error is the
vite.config.js duplicate-Vite-types artifact described above, not user-app code — a converted batch
passes if the count stays at 1. There is **no test suite for user-app**, so `check` is the only
automated signal, same situation as main-app in Phases 7–9.

**Phase 0 (plumbing) first, and it is not optional here.** `user-app` has no `@solar/db` dependency
and no `lib/server/db.ts`. Add the dep, create `db.ts` with a **module-private** pool feeding
`createDb` (both other apps un-exported their raw pool in Phase 10 — do not re-introduce the
export), then convert queries. This step also fixes the five per-handler `createPool` call sites
listed above; that is why they were left alone during the TypeScript conversion.

**Then `unifiedSync.ts`, before anything that calls it** — the business-app 6a / main-app 9 lesson.
It is a one-type change: `Queryable` → `Pick<Database, 'execute'>`. `submitLead` and `uploadBill`
both call it.

Everything else is the established pattern; nothing in `user-app` is as hairy as `claimLead`. Expect
the friction to be nullability and `mode: 'string'` timestamps rather than SQL — the loads' declared
interfaces (see "Carry into the follow-on Drizzle phase" above) are the contract to restate, and they
were checked against `schema.ts`.

Two `sql` escape hatches are already visible in the current SQL and should be noted in the commit
message when they land: `LOWER(level2) = LOWER($1)` (thank-you and sendLeadSubmissionConfirmation)
and the `INTERVAL '${throttleHours} hours'` in `LoginTracker` — note that one interpolates a
**number the caller controls**, so parameterise or clamp it rather than porting it across verbatim.

**Also still unassigned:** the two `apps/main-app/scripts/chatbot-related/*.js` offline scripts
(5 raw-SQL call sites). Not `user-app` and not request handlers; they just have nowhere else to be
tracked.

---

## ✅ DONE 2026-08-05 — clearing the follow-up list (decisions by Ani)

Five items, all agreed up front. The first one grew: what was filed as an email bug turned out
to be the visible symptom of a dead endpoint.

### 1. `/us/api/claimLead` — the email bug was downstream of a much bigger one

**Found while writing the reproducing test the CLAUDE.md rule requires.** `seedLeadDataPolicy`
failed with a foreign-key violation the moment it was pointed at a US business, which exposed the
real defect:

**`legal_acceptances.business_id` referenced `businesses_1(id)` — the IN table.** So:

- `/us/api/compliance/acceptPolicy` failed with a FK violation for any US business. No US business
  could ever record a policy acceptance.
- `checkLeadDataPolicy()` therefore always returned `compliant: false`, and
- `/us/api/claimLead` returned **403 `compliance_required` on every request** — never reaching the
  email code the item was originally about. The endpoint was not "sending no emails"; it was not
  working at all.

**Fix (migration `053-legal-acceptances-country.sql`):** acceptances are now keyed
`(country_code, business_id)` against `business_accounts` — the country-agnostic table the auth
layer already reads — with `country_code` backfilled to `'in'` (a US row was impossible, so the
backfill is unambiguous). `checkLeadDataPolicy`, `recordLeadDataAcceptance` and
`getAcceptanceHistory` take a country; all 7 call sites pass theirs.

**Then the emails.** Ani's steer to prefer the country-agnostic table was right, and initially I
reported it couldn't work because unified `businesses` has no `login_email`. That was wrong — I had
not looked at **`business_accounts`**, which is exactly that table. Both lookups now read unified
`businesses` joined to `business_accounts` on `(country_code, source_id)`, the same join
`TokenManager` uses. `mintBusinessTokenById` keeps writing the per-country legacy table — that is
still the write side and it projects to `business_accounts` itself — so only its table *argument*
was wrong (`'businesses_1'` → `'us_businesses'`).

**Decision recorded:** /us has no real users, so enabling the mail carried no risk to real people.

**Note for whoever applies this:** the migration has **not** been run against live — this session
had no credentials. `schema.ts`'s `legal_acceptances` entry is hand-updated to match; running
`npm run pull -w @solar/db` after applying 053 should produce an identical result. Do **not** pull
from a test cluster to regenerate: the baseline does not create three `loc_key(...)` expression
indexes, so a pull from there silently drops them (tried, reverted).

### 2. Forgot-password — built

`POST /{in,us}/api/forgotPassword` plus request pages at `/{in,us}/forgot-password`, linked from
both login pages. Email-only, mirroring the login form, which already resolves the slug from the
address. `$lib/server/passwordReset.ts` is the counterpart to `magicLink.ts` and follows the same
rules (hashed at rest, raw emailed, minting invalidates the previous link, resetPassword consumes
it by clearing it).

Anti-enumeration is the design constraint: every outcome that depends on whether the address is
registered returns the same 200 and the same body. Only a malformed email (400) and the rate limit
(429; 5 per 15 min, keyed on **IP alone** — keying on email would let an attacker probe addresses
without ever tripping it) differ.

**A bug the tests caught before it shipped, worth remembering:** `reset_token_expires` is
`timestamp` **without** time zone, while `magic_link_token_expires_at` is timestamptz. Writing
`.toISOString()` to the naive column — copied from the magic-link path — shifts the expiry by the
local UTC offset when node-postgres reads it back, expiring every link on creation anywhere east
of UTC. It is written local-naive now. **Check `withTimezone` before reusing a timestamp write.**

### 3. Chatbot scripts — TypeScript + Drizzle

Both `apps/main-app/scripts/chatbot-related/*` are `.ts` and on Drizzle, so the monorepo has no
hand-built SQL left outside tests.

`embeddings.in_embedding_index` is **not** in the generated schema: `drizzle.config.ts` sets
`schemaFilter: ['public']`, and widening it would pull the whole `embeddings` schema into the file
every app compiles against. It is declared by hand in **`packages/db/src/schema/embeddings.ts`**
(a `pgSchema` table, re-exported from the barrel), scoped to the five columns these scripts use.
That file is **not generated and pull will not touch it** — if a script starts using another
column, add it there against the live table.

Two improvements beyond the query layer: `--limit N` was interpolated into the SQL string (now
bound via `.limit()`, and the clause is dropped when unset), and the multi-row `VALUES`
placeholders were hand-numbered `$1..$3n` (Drizzle builds them). `excluded.*` in the `DO UPDATE` is
a `sql` escape hatch — there is no builder form.

Running them needs **tsx** (added to their `package.json`, along with a tsconfig and
`npm run sync` / `embed` / `check`): `@solar/db` uses extensionless internal imports that bare Node
ESM will not resolve, even though Node 24 strips the types fine.

Verified against a real local Postgres using the node-postgres driver — `@vercel/postgres` only
speaks to Neon over a WebSocket, the same constraint the test suite works around.

### 4. Dead modules — deleted

`apps/main-app/src/lib/server/magicLink.ts` and `user-app`'s `createUserAuthService()`. Both had no
importers anywhere in the monorepo.

### 5. Honest types — fixed

- **`faq`** (deferred since Phase 7a): `seo.ts` says `FaqItem[] | null`, `PillarPage`/`ClusterPage`
  widened to match (the other four seo components already declared it nullable, and all six already
  guarded with `?? []`). The nine pages doing `data.X.faq?.length > 0 ? faqLD(data.X.faq)` now
  derive `faqItems = data.X.faq ?? []`, which both narrows for `faqLD` and matches the pattern
  `solar/[state]/+page.svelte` already used.
- **`ClaimedBusiness.stage`/`.status`** (deferred from the user-app conversion): now
  `number | null` / `boolean | null`, matching the smallint and boolean columns.

### Test suite

**92 → 111 tests**, and it now covers /us and compliance, not just /in:

- `tests/leads/usClaimLeadEmail.test.ts` (5) — both mails, the minted token and its projection.
- `tests/compliance/leadDataPolicy.test.ts` (5) — the FK fix, both countries, cross-country isolation.
- `tests/auth/forgotPassword.test.ts` (9) — end-to-end (the emailed token is accepted by
  `resetPassword`), single use, re-minting, enumeration-safety, rate limiting.
- New fixtures: `createUsBusiness`, `createUsLead`, and a `country` option on `seedLeadDataPolicy`.

### Still open

**Only the `svelte-check` v4 upgrade + Vite-types dedupe.** One commit across all three apps,
because it moves every baseline. Current baselines: main-app **13 errors + 1 warning**,
business-app **84 errors + 111 tests**, user-app **1 error + 2 warnings**.

**No Docker on this machine**, so the suite ran against a throwaway cluster built from the EDB
binaries — the recipe under Phase 6 still works, on port 5544.
