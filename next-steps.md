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

### Phase 5.5 — characterization tests for the code Phase 6 will rewrite
The project has no tests; rather than a blanket testing effort, write integration tests that pin down the
*current* behavior of the two areas where a silent regression hurts most, while they are still raw SQL:
- **Lead pipeline:** `submitLead`, `claimLead`, `updateLeadByBusiness` — claim-count limits, `FOR UPDATE`
  locking (two concurrent claims → exactly one wins), `syncLeadToUnified` side effects.
- **Auth:** `PasswordManager`, `TokenManager`, `LoginTracker`, `RateLimiter` — lockout thresholds, token
  expiry, rate-limit fail-open behavior.
Runner: Vitest. Tests run against a real Postgres, not a mocked pool — the risk being guarded *is* the SQL.
**Decision needed before starting (owner: Ani):** what that Postgres is — a local Docker container with
migrations applied in test setup, or a Neon/Vercel branch database. Depends on local workflow and whether
CI gets added.
Phase 6 then becomes "convert until the tests pass again" instead of "convert and hope." The suite stays
after the migration as the permanent regression net for the critical path; skip UI/component tests and
trivial lookups (`getCities` etc.) — low failure probability, low failure cost. Ongoing rule: every bug
fixed from now on gets a test that reproduces it first.

### Phase 6 — the hard ones (business-app, 12 files)
`claimLead`, `submitLead`, `updateLeadByBusiness`, `deleteLeadByBusiness` (all ×2 countries),
`fixClaimedLead`, `deleteAccount` (×2), `sendLeadClaimNotificationToCustomer` — transactions,
`FOR UPDATE` locks, multi-table writes, `syncLeadToUnified` interplay. Slowest, most careful phase;
convert one file per commit. These are the only `pool.query`/`client.query` call sites left in
business-app after Phase 5 — verified by grep.

Also fold in `lib/server/unifiedSync.ts`: it isn't raw `pool.query` in its own right (it calls the
`sv_sync_*` SQL functions through a `Queryable`), but every caller has to keep importing `pool`
purely to feed it. Converting it to take `db` and use the `sql` escape hatch for the function calls
would remove the last reason for a `pool` import outside `db.ts`, which Phase 10 wants anyway.

### Phases 7–9 — main-app (53 files)
Enumerate and batch the same way once business-app is done (main-app already imports `db`, so no plumbing
phase). Rough split: 7 = reads/page loads, 8 = simple mutations, 9 = lead pipeline + anything transactional.
Also the 1 raw-SQL file in `packages/`.

### Phase 10 — closeout
Grep-verify no `pool.query`/`client.query` remain outside `db.ts`; consider un-exporting the raw `pool`
from both apps' `db.ts` (or leaving it export-only-for-Drizzle); update this doc and CLAUDE.md.

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
- `/us`'s county lookups (`getCountyByZipcode` and both recent-project endpoints) resolve a US
  zipcode against `pincode_mapping`, the Indian pincode table, and validate it as 6 digits. The
  app-wide pattern predates the migration and was left alone; `us_locations` has the county data.

- [ ] Phase 5.5 (tests — blocked on test-DB decision)
- [ ] Phase 6
- [ ] Phase 7
- [ ] Phase 8
- [ ] Phase 9
- [ ] Phase 10

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
