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

New or modified queries always use Drizzle (`db` from `$lib/server/db`), even in files that still
contain raw `pool.query` SQL — the migration is in progress (see next-steps.md). The `sql` template
escape hatch is allowed for genuinely awkward queries; note each use in the commit message.

## Tests

Integration tests live in `apps/business-app/tests/` and run against real Postgres, never a mocked
pool. Start it with `docker compose -f docker-compose.test.yml up -d`, then
`npm test -w solarvipani-business`. See `tests/README.md` — in particular the reason the test schema
needs a generated baseline, and the fact that it must be regenerated after any schema change.

Coverage is deliberately narrow: the lead pipeline and auth. Don't add tests for trivial lookups or
UI components. Every bug fixed from now on gets a test that reproduces it first.

## About Solar-app

This is a open source project.
