# Integration tests

Phase 5.5 of the Drizzle migration. These pin down the behavior of the two areas
where a silent regression is most expensive — the lead pipeline and auth — so the
Phase 6 rewrite can be judged against observed behavior rather than a reading of
the code.

They run against **real Postgres**, never a mocked pool. The risk being guarded
_is_ the SQL; a suite that stubs the driver would pass through exactly the bugs
this exists to catch.

## Running them

Start a database:

```sh
docker compose -f docker-compose.test.yml up -d
```

Then:

```sh
npm test -w solarvipani-business
```

The suite defaults to `postgres://solar:solar@localhost:5433/solar_test`, which is
what the compose file serves. To point it somewhere else — a local Postgres
install, a scratch cloud database — set `TEST_POSTGRES_URL`:

```sh
TEST_POSTGRES_URL=postgres://user@localhost:5432/solar_test npm test -w solarvipani-business
```

The target database's `public` schema is **dropped and rebuilt on every run**, so
setup refuses to touch any database whose name does not contain `test`.

## How the schema is built

Three steps, all in `scripts/apply-test-migrations.mjs`:

1. **`tests/schema/000-baseline.sql`** — every table, constraint and index.
   Generated from `packages/db/src/schema`, which `drizzle-kit pull` produces
   from the live database, so it traces back to production rather than to a
   hand-written guess.

2. **A rewind of three renames** — `061` renamed `in_business_profiles` to
   `business_profiles`, `062` gave `business_profiles.business_id` its sequence
   DEFAULT, and `063` renamed four of its columns and replaced two indexes. The
   baseline creates the end state, but the files replayed next are history and
   address the old names. The script winds all three back, replays the history
   unedited, and lets the real migrations rename them forward again.

   **A `to_regclass(...)` guard is no help for a rename** — the object exists,
   under a different name. Guards are for *drops*, and both appear here: `062`'s
   table rename became a drop's problem once `065` removed the archive, so that
   one statement is guarded inside the migration itself.

3. **Nine migration files** — `042`, `047`, `050`, `055`, `061`, `062`, `063`,
   `064`, `065`, `067`. These add what an introspected schema cannot express: the
   `countries` seed rows that `business_accounts` and `leaddata` have foreign keys
   to, and the `sv_sync_*` stored functions — which now exist on the list only so
   that the later files can drop them again, so the replay ends where production
   does with none left. Each is annotated in the script with why it is on the list.

   `054` used to be here and was removed with `065`: the only thing it
   contributed was a function `062` drops, and keeping it meant carrying four
   executable statements against a table that no longer exists. `066` was on the
   list for exactly one commit, for the same kind of reason and with the same
   ending — it put `sv_sync_lead` back onto leaddata's renamed columns, and `067`
   drops the function, so it came off again and took its rewind with it.

### Why a baseline, and why not just replay all the migrations

Two reasons, and both are worth knowing before changing any of this.

**A baseline is unavoidable.** Most of the tables — including `leaddata`,
`branches`, `business_profiles` and `leaddata_claimrequests` — have no
`CREATE TABLE` anywhere in the repository. They predate the migrations
convention. Replaying the numbered migrations against an empty database fails
early, at `034-magic-link-token-expiry.sql`, on a table nothing ever created.

**And a baseline is not sufficient by itself.** It can emit a column default
that names a sequence it never creates, which fails inside the baseline's own
`CREATE TABLE`. That is why `apply-test-migrations.mjs` has a
`PRE_BASELINE_SEQUENCES` step — see the comment there, and the 062 entry in
`next-steps.md`, for the mechanism.

**Only final-state migrations can replay on top of it.** The numbered migrations
encode _history_; the baseline is the _end state_. `039` creates
`business_profiles` and `040` renames it to `in_business_profiles` — against a
baseline that has the table under whichever name it currently carries, one of
those two steps always fails. The same goes for every `ALTER`/`DROP` that assumes
an earlier shape. The files listed above are the only ones that are pure
idempotent declarations, plus the renames and drops (`061`-`067`) that are there
for the reasons given in step 2.

The trigger-installing migrations (`043`, `045`, `046`) are deliberately skipped:
`049` and `051` drop every one of those triggers again, so production has none,
and the app made its projections with explicit `sv_sync_*` calls until `067`
removed the last one. Installing the triggers here would resurrect a projection
production does not have.

### After a schema change

```sh
npm run pull -w @solar/db          # refresh the introspected schema
node scripts/generate-test-baseline.mjs
```

## Layout

| Path                  | What it is                                                          |
| --------------------- | ------------------------------------------------------------------- |
| `tests/setup/`        | Global setup, and stand-ins for `$lib/server/db` and the `$env` modules |
| `tests/helpers/`      | Row builders and request/cookie construction                        |
| `tests/auth/`         | `RateLimiter`, `TokenManager`, `LoginTracker`, `PasswordManager`     |
| `tests/leads/`        | `submitLead`, `claimLead`, `updateLeadByBusiness`                     |

Note that `tests/` lives inside `apps/business-app/`, apart from the shared
`tests/schema/` baseline at the repository root.

## What is and is not mocked

Mocked: outbound email only.

Real: the database, the transactions, the `FOR UPDATE` locks, the compliance
gate, and session cookies — which are produced by
the actual `SessionManager` rather than by stubbing out `BusinessAuthService`, so
the 401/403 branches in each handler stay under test.

`$lib/server/db` is swapped for a node-postgres pool of the same shape. The app's
own `db.ts` builds its pool with `@vercel/postgres`, whose driver reaches Neon
over a WebSocket proxy and cannot talk to a local Postgres. The swap changes the
_driver_, not the SQL.

## Scope

Deliberately limited to the lead pipeline and auth. Trivial lookups
(`getCities` and friends) and UI components are skipped — low probability of
failure, low cost when they do.

**Ongoing rule:** every bug fixed from here on gets a test that reproduces it
first.
