# Next Steps

> This file tracks **open work only**. Finished work is deleted, not archived here — the Drizzle
> migration, the TypeScript conversion and Phase 7's business-app route consolidation all came out
> once they were done. Git history has the full record.

## Open

1. **Confirm `694faea` is deployed.** Migrations 054 and 055 are applied to live, so the DB syncs
   `businesses`/`leads`/`business_accounts` from `businesses_1`/`leaddata` for **both** countries.
   `694faea` is the app half — it repoints business-app's and main-app's `us_*` writers at the
   united tables. Until it ships, the deployed app writes `us_*` while the DB reads the united
   tables, and US writes never reach unified. Low volume (12 businesses, 4 leads), but real: it is
   the same code/DB inconsistency that forced 055's first rollback, in the opposite direction.

2. **Phase 7 smoke test.** The phase is code-complete; only the manual pass is left, and it needs a
   running app. Check that `/` renders the landing page; that an **IN** login and a **US** login both
   land on `/[slug]`; that a bogus slug 404s without rendering an IN-shaped shell; and that a
   forgot-password round trip for one business of each country produces
   `business.solarvipani.com/[slug]/reset-password/[token]` with no country segment.

3. **Country-resolution leftovers.** The sweep itself is **done** — no `[business_slug]` page load
   filters on a literal `countryCode = 'in'` any more (`f8eaa73`, `86bec48`, `87ddc19`, `bc24d16`,
   `5c9881b`, and the last four in one commit). `tests/routing/pageCountry.test.ts` covers all nine
   loads, 25 cases, each verified red against its literal first. Three things it left behind:

   **Loads are still IN-shaped.** The dashboard, `/crm` and `/recent-projects` select
   `IN_BUSINESS_SELECTION` / `IN_LEAD_SELECTION` unconditionally, so a US business's rows come back
   under India's legacy column names (`district`, `pincode`/`pin_code` rather than `county`,
   `zipcode`). The values are right — the aliases differ only in name, and since 054 the legacy
   tables are on the IN structure — but the UI labels a US county "District". Switching to the `US_*`
   selections changes the shape the `.svelte` components read, so it is its own task.

   **The category-1 (non-exclusive) lead read is untested on the US side**, in both the dashboard and
   `/crm`. It filters `leads.level1 IN (uniqueStates)`, and `createUsLead()` has no `state` option,
   so a US fixture lead can never match. Covering it means adding one.

   **`/proposal` and `/project-management` swallow their own 404s.** Both throw `error(404)` for a
   missing business from inside a `try` whose `catch` rethrows everything as `error(500)`, so the
   404 never reaches the client. Pre-existing; the country checks were hoisted above the `try`
   rather than adding to it, but the existing throws are still inside.

4. **Drop the `us_*` tables.** They now have no writer and no reader in the sync path, but the drop
   is its own migration and is gated on confirming main-app's remaining direct reads
   (`business-listing`, the thank-you page) and the **external admin-app** are off them.

5. **The referral page's referrer link points at a route that does not exist.**
   `referral/+page.svelte` emits `…/solar-panel-installer/{slug}/referrer/{ref}`, and main-app has no
   `/referrer/` route in either country and no rewrite that produces one. Phase 7 made its country
   segment dynamic and deliberately left the shape alone rather than guessing. Note also that
   `/{country}/installer/{slug}` is the canonical profile URL for both countries —
   `/us/solar-panel-installer/{slug}` is only a legacy 301, and there is no `/in` equivalent at all.

6. **4 dependabot advisories** (3 high, 1 moderate) that GitHub reports on every push.

7. **Duplicate `businesses.slug` values in live IN data.** `spectrum-solar-power-kasaragod` ×5,
   `spectrum-solar-power-kannur` ×4, `spectrum-solar-power-kozhikode` ×3 and ~22 more ×2. The
   `/[business_slug]` lookup does `.limit(1)`, so those businesses render a **non-deterministic**
   dashboard — whichever row Postgres returns first. Fixing means de-duplicating live rows, which is
   its own task. It is also why `businesses` cannot take a `UNIQUE (slug)` constraint.

8. **Drift between `leaddata` and unified `leads`.** **3** `leaddata` rows have no unified row at all
   (a `sv_sync_lead` call that never happened), and **156** unified `leads` have no surviving
   `leaddata` source (the sync never deletes, so removing a source row orphans its projection).
   `businesses` is clean — 0 in either direction. Consequence: a full resync *raises* the unified
   lead count, so "counts unmoved" only holds for a **targeted** resync. Reconciling these is its own
   task; `apps/main-app/src/lib/server/migrations/check-unified-drift.sql` is the existing tool.

9. **`api/resetPassword` never syncs the new password to unified.** It writes `login_password` to
   `businesses_1` and stops. `PasswordManager` reads `business_accounts.login_password`
   (`PasswordManager.ts:25`), and nothing else calls `sv_sync_account` on that path — `forgotPassword`
   syncs when it *mints* the token, not when the password changes. So a completed reset appears to
   succeed while login keeps checking the old password, until some other write happens to resync the
   account. Not country-specific; found while doing 3a, and out of its scope. The round-trip test
   passes because it asserts on `businesses_1`, not on a subsequent login — a fix should add that
   login step.

10. **Delete `api/sendLeadClaimNotificationToCustomer`.** It has **zero callers** anywhere in the
    repo, and `claimLead` already sends the identical email inline and country-correctly
    (`claimLead/+server.ts:485`). It is also **unauthenticated** — anyone who can guess a lead id and
    business id can make it send mail and mint a magic-link token — whereas claimLead's copy sits
    behind a session check. `87ddc19` made it country-correct rather than deleting it, because
    deleting a public endpoint was not in that task's scope.

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

`npm test -w solarvipani-business` — **green: 131 passed, 0 skipped.**

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
