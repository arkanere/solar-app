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
| business-app | 61 | 0 | `.svelte` only — see the caveat below |
| user-app | 0 | 2 | clean; warnings are a11y + unused CSS |

`npm test -w solarvipani-business` — **111 tests**, all passing.

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

All migrations through **053** are applied to live.

### What is actually open

1. **Phase 7 — collapse business-app's `/in` and `/us` into a country-less root.** Planned and
   approved 2026-08-05, not started. Full detail below.
2. **`business-app`'s `check` covers far less than it looks.** Its script is
   `svelte-check --no-tsconfig --ignore "src/lib/components/ui"`, so **none of its `.ts` files are
   type-checked** — only `.svelte`. Verified by planting a deliberate type error in
   `lib/server/passwordReset.ts` and watching it pass. Long-standing (present since at least
   Phase 5.5), and it is why 61 is not comparable to main-app's 10. Worth dropping the flag, but it
   will raise the count, so give it its own commit. **Phase 7 makes this more urgent** — nearly all
   of that migration's risk lives in `.ts`, where `check` is blind.
3. **4 dependabot advisories** (3 high, 1 moderate) that GitHub reports on every push.
4. **Duplicate `businesses.slug` values in live IN data.** `spectrum-solar-power-kasaragod` ×5,
   `spectrum-solar-power-kannur` ×4, `spectrum-solar-power-kozhikode` ×3 and ~22 more ×2. The
   `/[business_slug]` lookup does `.limit(1)`, so those businesses render a **non-deterministic**
   dashboard — whichever row Postgres returns first. Found during the Phase 7 pre-check
   (2026-08-05); predates it and is not caused by it. Fixing means de-duplicating live rows, which
   is its own task. It is also why `businesses` cannot take a `UNIQUE (slug)` constraint.
5. ~~**`/us` looks up counties in the Indian pincode table.**~~ **Closed by Phase 7** — the two
   offending endpoints (`getCountyByZipcode`, and the `/us` recent-project pair) are deleted along
   with the rest of `routes/us/`. This was the last open item from the pre-Drizzle record.

The pre-existing UI-component errors that make up the three baselines are known and untouched.

---

## Phase 7 — business-app route consolidation (approved 2026-08-05, not started)

**Goal.** `business-app` is a logged-in tenant app: every meaningful URL is already scoped by
`[business_slug]`, and a business belongs to exactly one country. The `/in` and `/us` prefixes carry
no information the slug doesn't already imply. Delete them — `/[business_slug]/crm`, not
`/in/[business_slug]/crm`. Unlike `main-app`, business-app does **not** get a `[country]` segment;
country becomes data, resolved from the database.

**Decisions.** (1) Country resolves from the DB by slug. (2) `/us` is deleted outright, including
`open-inquiries`, `project`, `getCounties`, `getCountyByZipcode` and all of `$lib/us-new-rewrites/`.
(3) No legacy redirects — clean break; outstanding magic-link and reset emails 404 within their
≤24h token window.

### What makes this harder than main-app's version

`/in` and `/us` are **not** near-identical copies. `/us` is an older, thinner fork — exactly **one**
file is byte-identical across the two trees. IN has `compliance`, `project-management`, `proposal`,
`quotation`, `recent-projects`, `referral` and 8 API endpoints that US lacks; IN wraps everything in
a `(layout-1)` group that US has no equivalent of. Most significantly,
`[business_slug]/+layout.server.ts` is 192 lines using `SessionManager` plus a full DB load on IN,
versus 63 lines hand-parsing the session cookie with `JSON.parse` on US. That divergence is
auth-relevant, so the US tree is deleted rather than merged.

**The seam that makes it tractable:** the auth layer is *already* country-parameterized.
`$lib/auth/business/*` takes an `AuthCountry` constructor argument, and `$lib/in/auth/business` /
`$lib/us/auth/business` are 40-line files that do nothing but bind `COUNTRY`. Same for
`$lib/server/passwordReset.ts`, `magicLink.ts`, `unifiedSync.ts`, `$lib/compliance/ComplianceChecker.ts`.

business-app has **no `src/hooks.server.ts`** and no rewrites in `vercel.json`, so every path is a
literal in a route or component.

### Pre-check — already run against live, 2026-08-05

Routing by bare slug is **safe**: zero cross-country collisions among real slugs. The only slugs
spanning both countries are the sentinels `'incorrect'` (124 IN + 1 US) and the empty string
(34 IN + 2 US), effectively all `isvisible = false`. Live counts are **6695 IN / 12 US**, of which
just 6 US are real and visible. So `countryForSlug` filtering on `isvisible = true` is deterministic
for every real slug, and **no unique constraint is added** (see open item 4 above — the data cannot
support one).

### Steps

1. **`src/lib/server/resolveCountry.ts`** — `countryForSlug(slug)` and `countryForLoginEmail(email)`,
   both returning `AuthCountry | null`. Reuse the existing `AuthCountry` from
   `$lib/auth/business/countryTables.ts`; do not introduce a second country type. Return `null`
   rather than defaulting to `'in'` — a silent default would render an IN-shaped dashboard for a
   typo'd slug. `countryForLoginEmail` is needed because `/login` has no slug in the URL and
   `TokenManager.getBusinessByEmail` is country-bound.
2. **Retire the per-country auth bindings.** Routes construct `new BusinessAuthService(country)`
   from `$lib/auth/business` directly; delete `$lib/{in,us}/auth/business/index.ts`. Pass the
   resolved country into `passwordReset`, `magicLink`, `unifiedSync`, `ComplianceChecker` instead of
   inferring it from which route file called them. Move `$lib/in/ownsBusinessSlug.ts` to
   `$lib/server/` with a `country` parameter (it hardcodes `countryCode = 'in'` twice and has no US
   twin). Pick `sendEmail` by country, not by import path.
3. **Delete `/us`** — `routes/us`, `$lib/us-new-rewrites`, and `$lib/us` once step 2 empties it.
4. **Move `/in` to the root** with `git mv` only, no content edits, so history follows the files.
   Note the current root `+page.svelte` is a **0-byte file** replaced by IN's landing page. Keep
   `api/` out of the HTML shell when merging the layouts.
5. **Strip the `/in` prefix from every path literal** — `` `/in/${x}` `` → `` `/${x}` ``. Wide but
   mechanical: `Sidebar.svelte` (11 sites), `$lib/in/actions/lead-api.ts`, eight `fetch('/in/api/…')`
   components, and the four `url.pathname` guards in `[business_slug]/+layout.server.ts`.
   **The trap:** cross-app links point at `main-app`, which still *has* `[country]`. So
   `/in/installer/${slug}` vs `/us/solar-panel-installer/${slug}` must now branch on the *resolved*
   country instead of on which file they live in. Miss it and US businesses silently get sent an
   India profile link. Business-app's own absolute URLs (reset, signin-link) drop the segment.
6. **Rename `$lib/in-new-rewrites` → `$lib/components`**, mirroring main-app's `f656c6a`. Separate
   commit — pure rename plus import rewrite.
7. **Tests.** All four route-importing test files break at import time (they import route modules by
   relative path; `vitest.config.ts` needs no change). Two coverage points must survive per
   CLAUDE.md's "both countries" rule: repoint — do **not** delete — `tests/leads/usClaimLeadEmail.test.ts`
   at the unified endpoint with a US fixture, where it becomes the guard for step 5's cross-app-link
   branching; and rewrite `tests/auth/forgotPassword.test.ts:180` (currently "the IN business is not
   reachable through the /us endpoint") as a test of `countryForLoginEmail`. Add a `countryForSlug`
   test covering one IN and one US slug.

One commit per step, straight to `main`.

### Verifying Phase 7

`npm run check -w solarvipani-business` must not exceed **61 errors / 0 warnings** — but remember it
only sees `.svelte` (open item 2), and this migration's risk is in `.ts`. `npm run build -w
solarvipani-business` is therefore **mandatory**: `resolveCountry` is server-only and must never
reach a component. `npm test -w solarvipani-business` — 111 tests.

Then smoke it manually: `/` renders the landing page; an **IN** login and a **US** login both land on
`/[slug]` (the load-bearing check that step 1 works — US previously had its own login route); a
bogus slug 404s without rendering an IN-shaped shell; and a forgot-password round trip for one
business of each country produces `business.solarvipani.com/[slug]/reset-password/[token]` with no
country segment.

### Landmines worth knowing before you start

- **`packages/db/src/schema/schema.ts` and `relations.ts` are generated** by
  `npm run pull -w @solar/db`. Do not hand-edit them. `index.ts` and `embeddings.ts` in the same
  directory **are** hand-maintained — `embeddings.ts` exists because `schemaFilter: ['public']`
  hides that Postgres schema from introspection.
- **`postpull.mjs` corrects two things drizzle-kit gets wrong**, including composite foreign keys,
  whose two sides come out mis-paired and produce DDL Postgres rejects. Add an entry there for any
  new composite FK.
- **Check `withTimezone` before writing a timestamp.** A plain `timestamp` column is read back in
  the process's local zone, so writing `.toISOString()` shifts it by the UTC offset.
- **Every bug fixed gets a test that reproduces it first.** That rule caught a dead `/us` endpoint
  and a timezone bug on 2026-08-05 alone.

