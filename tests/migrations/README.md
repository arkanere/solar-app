# Test migrations

Copies of the migrations `scripts/apply-test-migrations.mjs` replays on top of
the baseline. The originals live in the `solar-app-internal` repo, in
`admin-app-nextjs/migrations/`. Do not edit these copies; re-copy a file if its
original changes, and add a new one here only when the test database needs it
(see the list in the script).
