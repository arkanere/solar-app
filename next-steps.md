# Next Steps

> This file tracks **open work only**. The chronological record of the Drizzle migration, the
> TypeScript conversion and the follow-up list was removed on 2026-08-05 once every phase was done;
> it is in git history if you need it.

## Where things stand — 2026-08-05

**The Drizzle migration is finished and so is every follow-up it generated.** All three apps
(`main-app`, `business-app`, `user-app`) are TypeScript, on Svelte 5 runes, and query exclusively
through Drizzle. No app exports a raw `pool`, and no hand-written SQL exists anywhere outside
`apps/business-app/tests`. Conventions and the recurring `drizzle-kit pull` gotchas live in
**CLAUDE.md** — read that before touching queries or the schema.

### Baselines

`npm run check` is on svelte-check v4, which prints **machine format** to a non-TTY: grep
`COMPLETED n FILES x ERRORS`, *not* `found x errors`. A change passes if the count does not rise.

| app | errors | warnings | notes |
| --- | --- | --- | --- |
| main-app | 10 | 1 | pre-existing, UI components |
| business-app | 9 | 0 | was 61; `/us` deletion removed most. `.svelte` only — see the caveat below |
| user-app | 0 | 2 | clean; warnings are a11y + unused CSS |

`npm test -w solarvipani-business` — **RED mid-Phase-7**: two test files still import deleted `/us`
route modules. Repointed in Phase 7 step E; was 111 passing before.

**Also run `npm run build -w <app>`** when you touch imports. `check` cannot see server code
reaching a browser bundle, and that is a hard build failure — it left business-app undeployable for
an unknown stretch before it was caught on 2026-08-05.

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

All migrations through **053** are applied to live. **054 is written but NOT applied** — see Phase 7
step A; it needs a decision before it touches live data.


### What is actually open

1. **Phase 7 — business-app route consolidation.** In progress; steps 1–3 landed, steps 4–7 open.
   Full remaining detail below.
2. **`business-app`'s `check` covers far less than it looks.** Its script is
   `svelte-check --no-tsconfig --ignore "src/lib/components/ui"`, so **none of its `.ts` files are
   type-checked** — only `.svelte`. Long-standing (present since at least Phase 5.5). Run
   `npx tsc --noEmit -p apps/business-app/tsconfig.json` to see what it hides: **22 errors** as of
   2026-08-05 (TokenManager nullability ×3, `ui/*/index.ts` svelte re-exports, one `claimLead`
   `NewLeadRow` mismatch). All pre-existing. Worth dropping the flag, but it will raise the count,
   so give it its own commit. **Phase 7 makes this urgent** — nearly all of that migration's risk
   lives in `.ts`, where `check` is blind.
3. **4 dependabot advisories** (3 high, 1 moderate) that GitHub reports on every push.
4. **Duplicate `businesses.slug` values in live IN data.** `spectrum-solar-power-kasaragod` ×5,
   `spectrum-solar-power-kannur` ×4, `spectrum-solar-power-kozhikode` ×3 and ~22 more ×2. The
   `/[business_slug]` lookup does `.limit(1)`, so those businesses render a **non-deterministic**
   dashboard — whichever row Postgres returns first. Found during the Phase 7 pre-check
   (2026-08-05); predates it and is not caused by it. Fixing means de-duplicating live rows, which
   is its own task. It is also why `businesses` cannot take a `UNIQUE (slug)` constraint.

The pre-existing UI-component errors that make up the three baselines are known and untouched.

---

## Phase 7 — business-app route consolidation (in progress)

**Goal.** Every meaningful business-app URL is already scoped by `[business_slug]`, and a business
belongs to exactly one country, so the `/in` and `/us` prefixes carry no information the slug does
not already imply. Target is `/[business_slug]/crm`, not `/in/[business_slug]/crm`. Unlike
`main-app`, business-app gets **no** `[country]` segment — country is data, resolved from the DB.

### Done

- **`/us` deleted** (`ca676e7`) — `routes/us`, `$lib/us-new-rewrites`, `$lib/us`. It was an older,
  thinner fork; exactly one file was byte-identical between the trees. This also closed the old
  "/us resolves US zipcodes against the Indian `pincode_mapping`" item.
- **Country resolution wired** (`978d6b1`) — `$lib/server/resolveCountry.ts`
  (`countryForSlug`, `countryForLoginEmail`) and `$lib/server/writeTargets.ts`, threaded through
  `[business_slug]/+layout.server.ts` and all 18 API endpoints that had `'in'` hardcoded.
- **Migration 054 written** (`9998a92`) — unites the legacy tables on the IN structure.
  **Not applied to live.**

### Pick up here

1. Decide on / apply **054** (`psql "$POSTGRES_URL_NON_POOLING" < 054-unite-country-legacy-tables.sql`),
   then verify the copy: 12 businesses, 4 leads, 1 branch, 0 projects, ids unchanged, unified
   `businesses`/`leads` counts unmoved.
2. Write **055** to repoint the `sv_sync_*` `'us'` arms, then collapse `writeTargets.ts`.
3. Steps B–E below (route move, path literals, rename, tests) are independent of 054/055 and can
   proceed in parallel — **E unblocks the red test suite**, so it is the cheapest thing to do next
   if the migration decision stalls.

### Two facts that constrain everything left

**Unified tables are a projection, not a store.** `sv_sync_business` is
`INSERT INTO businesses ... SELECT FROM in_business_profiles ... ON CONFLICT DO UPDATE`. Anything
written directly to `businesses`/`leads`/`business_accounts` is clobbered by the next sync — which
is why main-app has **zero** unified writes anywhere. The rule is: **read unified** (filtered by the
resolved country), **write the per-country legacy table**, then call `sync*ToUnified`.

**`SessionManager` is country-free.** `validateSession`, `isAuthenticated` and `logout` all delegate
to it, so an endpoint doing only those needs no country-bound `BusinessAuthService`. Only `login`
and `signin-link` genuinely need one.

### Remaining steps

**A. Unite the legacy tables on the IN structure.** Supersedes the earlier per-country-table-pair
approach, and dissolves the three divergences that blocked it (`business_notes` missing from
`us_leaddata`, `in_business_profiles` having no US counterpart, `brands` being IN-only) — under one
set of tables those columns simply exist for every country, NULL where a country does not populate
them. That is already how the unified read layer behaves: `sv_sync_lead('us')` leaves
`business_notes`, `reference_uuid`, `qualification_score` and `bill_*` NULL, so the IN shape is
*already* the platform-wide shape and this only makes the write layer agree.

Two migrations, **written but NOT applied to live**:

  - **054-unite-country-legacy-tables.sql** (+ `.rollback.sql`) — adds a `country_code` discriminator
    to `businesses_1`, `in_business_profiles` and `leaddata` (defaulting existing rows to `'in'`),
    copies the US rows in with the renames applied (`ein`→`gstn`, `county`→`district`,
    `zipcode`→`pincode`/`pin_code`), generates US `in_business_profiles` rows, and bumps the
    sequences. Purely additive: `us_*` are left in place and the `sv_sync_*` `'us'` arms still read
    them, so it can be verified before anything switches over.
  - **055** (not yet written) — repoint the `sv_sync_business` / `_account` / `_lead` `'us'` arms at
    the united tables, replacing the source-table branch with a `country_code` filter. Only after
    this can the app code change.

  *Why the copy is safe with no id remapping* — verified on live 2026-08-05: `us_businesses.id` and
  `us_leaddata.id` were allocated from the IN sequences (neither has a sequence of its own), and
  there are **zero** id collisions against the IN tables. Ids therefore do not change, so every
  unified `(country_code, source_id)` pair stays valid and **no resync is needed**. Volume is 12
  businesses, 4 leads, 1 branch, 0 projects; no US lead has a `business_id`, so there is no claim
  linkage to preserve.

  *Then the code:* collapse `$lib/server/writeTargets.ts` from table pairs to one table set plus a
  `country_code` value, and add `country_code` to the write sites. Most are already mechanical —
  `deleteAccount`, `deleteBranch`, `fixClaimedLead` and `deleteLeadByBusiness` touch only shared
  columns.

  *Platform-wide caveat:* `us_*` are read by main-app and the external admin-app too. 054 does not
  drop them, and dropping them should be its own later migration once every writer is confirmed off.

**B. Move `/in` to the root.** `git mv` only, no content edits, so history follows the files. The
current root `+page.svelte` is a **0-byte file** replaced by IN's landing page. Keep `api/` out of
the HTML shell when merging the layouts.

**C. Strip the `/in` prefix from every path literal** — `` `/in/${x}` `` → `` `/${x}` ``. Wide but
mechanical: `Sidebar.svelte` (11 sites), `$lib/in/actions/lead-api.ts`, eight `fetch('/in/api/…')`
components, and the four `url.pathname` guards in `[business_slug]/+layout.server.ts`.
**The trap:** cross-app links point at `main-app`, which still *has* `[country]`. So
`/in/installer/${slug}` vs `/us/solar-panel-installer/${slug}` must branch on the *resolved*
country, not on which file they live in. Miss it and US businesses silently get an India profile
link. business-app's own absolute URLs (reset, signin-link) drop the segment.

**D. Rename `$lib/in-new-rewrites` → `$lib/components`**, mirroring main-app's `f656c6a`. Separate
commit — pure rename plus import rewrite.

**E. Tests — the suite is currently RED.** Two files still import deleted `/us` route modules:
`tests/auth/forgotPassword.test.ts:180` and `tests/leads/usClaimLeadEmail.test.ts`. Both are
**repointed, not deleted**, to keep CLAUDE.md's "both countries" rule:

  - `usClaimLeadEmail.test.ts` → the unified endpoint with a US fixture. Its
    `business.solarvipani.com/us/${slug}/signin-link/` assertion becomes country-less; the
    `solarvipani.com/us/solar-panel-installer/${slug}` one **stays** `/us/`, being a main-app URL.
    This becomes the guard for step C's cross-app-link branching.
  - `forgotPassword.test.ts:180` ("the IN business is not reachable through the /us endpoint")
    becomes a test of `countryForLoginEmail`.
  - Add a `countryForSlug` test covering one IN and one US slug.
  - **No test currently covers a US write.** Add one before step A ships — that is the whole risk.

### Verifying Phase 7

`npm run check -w solarvipani-business` is **9 errors / 0 warnings** since the `/us` deletion (the
61 baseline was mostly `us-new-rewrites`); it must not rise. Because `check` cannot see `.ts`, also
run `npx tsc --noEmit -p apps/business-app/tsconfig.json` (22 pre-existing errors — the count must
not rise) and `npm run build -w solarvipani-business`, which is mandatory: `resolveCountry` is
server-only and must never reach a component.

Then smoke it: `/` renders the landing page; an **IN** login and a **US** login both land on
`/[slug]`; a bogus slug 404s without rendering an IN-shaped shell; and a forgot-password round trip
for one business of each country produces `business.solarvipani.com/[slug]/reset-password/[token]`
with no country segment.
