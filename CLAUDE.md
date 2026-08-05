# CLAUDE.md

Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

I'm always open to ideas on better ways to do things. Please don't hesitate to suggest a better way, or one that has long lasting impact over a tactical change. (as a few examples)"



## Git

Commit straight to `main` and push. Don't create a branch and don't open a pull request
unless I ask for one — solo maintainer, no review step to wait on.

## Database queries

All queries use Drizzle (`db` from `$lib/server/db`). **All three apps are fully migrated** — none of
them exports a raw `pool` any more, so there is no way to write `pool.query` in app code. The `sql`
template escape hatch is allowed for genuinely awkward queries (`LOWER(a) = LOWER(b)`, window
functions, `NOW() - INTERVAL`, `DESC NULLS LAST`, the `sv_sync_*` functions); note each use in the
commit message. It still parameterises — never interpolate a value into a query string.

`user-app` was the last holdout and converted 2026-08-05, after its TypeScript conversion earlier the
same day. Its `check` baseline is 1 error, from a duplicate-Vite-types clash in `vite.config.js`, not
from app code — a converted change passes if the count stays at 1. It has no test suite.

The only raw SQL left in the monorepo is the two `apps/main-app/scripts/chatbot-related/*.js` offline
scripts (5 call sites) — not request handlers, and still unassigned.

Two things `drizzle-kit pull` does that regularly bite:
- `jsonb` columns are typed `unknown` and timestamps `mode: 'string'`. Restate a shape with
  ``sql<T>`${table.col}` `` (renders as the bare column, so the SQL is unchanged); don't annotate
  `schema.ts`, which is generated and will be overwritten.
- Nullability is real. Many components declare columns non-null that the schema allows to be NULL —
  the old driver's `any` hid it. Prefer restating the existing contract over widening components.

## Tests

Integration tests live in `apps/business-app/tests/` and run against real Postgres, never a mocked
pool. Start it with `docker compose -f docker-compose.test.yml up -d`, then
`npm test -w solarvipani-business`. See `tests/README.md` — in particular the reason the test schema
needs a generated baseline, and the fact that it must be regenerated after any schema change.

Coverage is deliberately narrow: the lead pipeline and auth. Don't add tests for trivial lookups or
UI components. Every bug fixed from now on gets a test that reproduces it first.

## About Solar-app

This is a open source project.
