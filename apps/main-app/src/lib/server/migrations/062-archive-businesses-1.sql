-- Archive businesses_1 and make business_accounts a store (2026-08-09).
--
-- Step 1 of 2. 063 drops `businesses` and folds its column vocabulary into
-- business_profiles; this file only retires businesses_1. The split is
-- deliberate — see the note on sv_sync_business at the bottom of this header.
--
-- businesses_1 has not been a legacy table since 054/055 united both countries
-- on it — it has been a *write-staging* table. Following the signup path shows
-- what it actually does today (routes/[country=country]/api/submitBusiness):
--
--   1. duplicate check      reads business_profiles     (already migrated)
--   2. INSERT businesses_1  .returning({ id })          <- mints the id
--   3. INSERT business_profiles with that id            <- the real write
--   4. sv_sync_business     businesses   <- business_profiles
--   5. sv_sync_account      business_accounts <- businesses_1
--
-- So it has exactly two remaining jobs: mint the id (2), and stage login_email
-- long enough for sv_sync_account to project it (5). Nothing reads it for its
-- own sake. This migration removes both jobs.
--
-- The split it fed is the successor, and it is a pair, not one table:
--   business_profiles   profile half, keyed by business_id
--   business_accounts   auth half, keyed by (country_code, source_id)
--
-- business_profiles has been a real store since 054 (main-app writes it
-- directly). business_accounts has not — every auth *read* already goes there
-- (PasswordManager.ts:25, TokenManager.ts:27, LoginTracker.ts:49) but every
-- auth *write* went to businesses_1 and arrived by sync. Flipping that is the
-- substance of this change, and it inverts the standing "unified tables are a
-- projection, not a store" rule for the account half only. `businesses` stays a
-- projection until 063.
--
-- Verified on live before writing this migration:
--   - 6708 rows in each of businesses_1 / business_profiles / business_accounts,
--     1:1 in both directions, and 0 value drift on both the profile columns and
--     the credential columns — the data has been fully migrated for some time;
--   - NO inbound foreign keys to businesses_1 at all. The last one
--     (legal_acceptances) is already repointed, and sv_referrers went with 059.
--     admin-app's generated schema.ts still shows two, but it is stale — it also
--     still declares us_businesses and referrers_in, dropped by 056 and 059;
--   - no triggers on the table. 051 dropped the last of them;
--   - three function bodies mention it: sv_sync_account (dropped here),
--     sv_sync_in_split (dropped here) and sv_sync_in_business_profile (already
--     an orphan since 054 inlined the upsert — next-steps.md item 5).
--
-- ** businesses_1_id_seq is OWNED BY businesses_1.id. ** That is the same trap
-- 060 documented for in_business_accounts_id_seq, except here the sequence must
-- SURVIVE: it mints every business id, and (country_code, source_id) identity
-- plus the `source_id AS id` reads all depend on that numbering staying
-- continuous. It is reassigned below BEFORE the rename, so a later DROP of the
-- archive cannot take it. The sequence keeps its name — renaming it would be
-- churn for no gain and it is referenced by name in the DEFAULT below.
--
-- RENAME rather than DROP, following the 052 design: history stays queryable
-- and, more importantly, any writer this planning missed fails loudly instead
-- of silently not projecting. next-steps.md is explicit that stray writers are
-- found by code grep and not by a SQL check, and one writer here is outside
-- this repo entirely (see below). Drop the archive after a quiet period.
--
-- ** Why the business_profiles column renames are NOT here. ** The obvious
-- companion change — gstn/state/district/pincode -> tax_id/level1/level2/
-- postal_code, so the ~434 sites reading `businesses` keep their column names
-- when 063 repoints them — would break this step. sv_sync_business still runs
-- until 063 and its body selects `p.gstn, p.state, p.district, p.pincode FROM
-- business_profiles`; renaming under it fails the projection on the next write.
-- Those renames, the postal_code widening (char(6) -> varchar(10), which is a
-- US ZIP+4 bug of the same family as next-steps items 3 and 4), the composite
-- geo index and the countries FK all land in 063 alongside the drop of
-- sv_sync_business itself.
--
-- Code side, changed in the same commit as this file:
--   business-app  lib/auth/business/LoginTracker.ts    last_login -> business_accounts
--                 lib/server/magicLink.ts              token mint -> business_accounts
--                 lib/server/passwordReset.ts          reset mint -> business_accounts
--                 lib/server/unifiedSync.ts            syncAccountToUnified and
--                                                      syncInSplitTables deleted
--                 lib/server/writeTargets.ts           businessTable/businessInCountry gone
--                 api/resetPassword                    profiles/accounts join; the slug and
--                                                      the token hash now live in
--                                                      different tables
--                 api/addBranch                        branch row -> profiles + accounts
--                 api/deleteBranch                     isvisible on both halves
--                 api/deleteAccount                    isvisible + credentials on both
--                 api/claimLead                        auto-branch and allotment email
--                 api/updateBusinessDetails            the TODO-tagged businesses_1
--                                                      dual-write deleted
--   main-app      api/submitBusiness                   step 2 above deleted; accounts row
--                                                      written directly
--                 lib/server/unifiedSync.ts            syncAccountToUnified deleted
--
-- api/updateBusinessDetails keeps its wrong-tenant bug (next-steps.md item 1):
-- it still updates by slug with no id filter, so a business with a slug twin
-- overwrites the twin's row. Removing the second write halves the blast radius
-- and nothing more — fixing it is item 1's job, not this migration's.
--
-- OUTSIDE THIS REPO, and the reason this is a rename: solar-app-internal's
--   automation-scripts/shared/campaign/database.py:152
-- unions login_email and email out of businesses_1. It must move to
-- business_accounts + business_profiles or the campaign tooling reads a frozen
-- snapshot. admin-app's route code has no reference — the TODO at
-- submitBusiness:108 ("remove after admin-app migrates") is stale.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: this one needs the 061 treatment rather than a
--     to_regclass guard, and for the same reason — the table exists, under a
--     different name. 054 addresses businesses_1 by name in SIX executable
--     statements (ALTER TABLE, CREATE INDEX x1, INSERT ... SELECT, setval, and
--     two function bodies), so a guard on this file would not help: 054 fails
--     first. apply-test-migrations.mjs therefore winds the archive name back
--     alongside in_business_profiles and replays THIS file at the end of the
--     list to rename it forward again. Function bodies are not name-resolved at
--     CREATE time, so 047/050/055's references survive the rewind either way;
--     replaying this file is also what stops the test database keeping
--     sv_sync_account and sv_sync_in_split after production has dropped them.
--   - fixtures.ts: businesses_1 out of the TRUNCATE list, and createBusiness /
--     createUsBusiness rewritten to insert business_profiles + business_accounts
--     directly, mirroring the app path above. Both used to insert businesses_1
--     and call sv_sync_in_split/_account to fan it out.
--   - function bodies: the three above, all dropped here.
--
-- sync_unified_account_in/us are dropped too: they are 046's trigger functions,
-- their triggers went with 051, and their bodies call sv_sync_account. They are
-- already unreachable — this only stops them referencing a function that no
-- longer exists. The other four sync_unified_* orphans are equally dead but do
-- not touch anything here, so they are left alone (see next-steps.md item 5).
--
-- Reversible via 062-archive-businesses-1.rollback.sql, which renames the table
-- back and recreates the three functions. That rollback is only meaningful
-- while the archive still exists AND the code is reverted in the same deploy:
-- once auth writes land in business_accounts, businesses_1_archive is stale and
-- rolling the sync forward again would overwrite fresh credentials with old
-- ones. Revert code first, then run the rollback.
--
-- Take a backup first:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t businesses_1 > businesses_1-archive.sql
--
-- The test baseline is generated from packages/db/src/schema, so after applying:
--   npm run pull -w @solar/db && node scripts/generate-test-baseline.mjs
-- The pull is REQUIRED, not optional: it is what gives business_profiles.business_id
-- its DEFAULT in the generated schema, which is what makes the id optional on
-- insert in the three minting sites.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 062-archive-businesses-1.sql

BEGIN;

-- ------------------------------------------------------------ the id mint ----
-- Reassign before the rename so a later DROP of the archive cannot take the
-- sequence with it. business_profiles.business_id is the column that inherits
-- the minting job; its UNIQUE constraint already enforces what businesses_1's
-- primary key did.

ALTER SEQUENCE businesses_1_id_seq OWNED BY business_profiles.business_id;

ALTER TABLE business_profiles
  ALTER COLUMN business_id SET DEFAULT nextval('businesses_1_id_seq');

-- ------------------------------------------------------- the projections ----
-- sv_sync_account is the function that made business_accounts a projection; it
-- has no source once businesses_1 is archived, and there is nothing to repoint
-- it at — business_profiles holds no credential columns, by the deliberate
-- separation in docs/account-profile-separation.md. The app writes the table
-- directly from here on.
--
-- sv_sync_in_split is the businesses_1 -> business_profiles projection behind
-- all six syncInSplitTables call sites, which go with it.
--
-- sv_sync_business and sv_sync_lead are untouched: they source from
-- business_profiles and leaddata, neither of which is going anywhere here.

DROP FUNCTION IF EXISTS sv_sync_account(character, integer);
DROP FUNCTION IF EXISTS sv_sync_in_split(integer);
DROP FUNCTION IF EXISTS sv_sync_in_business_profile(integer);

DROP FUNCTION IF EXISTS sync_unified_account_in();
DROP FUNCTION IF EXISTS sync_unified_account_us();

-- ------------------------------------------------------------- the table ----

ALTER TABLE businesses_1 RENAME TO businesses_1_archive;

COMMIT;

-- After committing, confirm the mint works and the archive is inert:
--
--   SELECT nextval('businesses_1_id_seq');            -- > 6983, and climbing
--   \d business_profiles                              -- business_id has the DEFAULT
--   SELECT count(*) FROM businesses_1_archive;        -- 6708, frozen from here
--   SELECT proname FROM pg_proc WHERE prosrc LIKE '%businesses_1%';  -- 0 rows
