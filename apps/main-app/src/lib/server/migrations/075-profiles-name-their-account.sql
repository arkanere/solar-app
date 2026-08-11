-- business_profiles.account_business_id (2026-08-11).
--
-- ** APPLIED to live. ** This header said NOT YET APPLIED until 2026-08-11,
-- when it was found to be wrong: the column was already there, NOT NULL, with
-- every footer check below passing. The apply was not recorded at the time, so
-- the marker is written from the live schema rather than from the run — all
-- four checks re-measured on 2026-08-11: 0 NULLs, 203 rows naming another
-- profile (matching all 203 in `branches`), 0 disagreeing with branches.main_id,
-- 0 naming a profile that does not exist, and the index present.
--
-- ** A stale NOT-YET-APPLIED marker costs real time. ** It sent a magic-link
-- outage investigation at this file first, because 076 records itself as
-- applied ahead of its prerequisite and this said the prerequisite never ran —
-- a believable story that was not what had happened. The actual cause was 077.
-- Record the apply when you run it; a marker is only load-bearing if it is true.
--
-- Step one of making business_accounts one-row-per-business. Today it is
-- one-row-per-*profile*, and since a branch office is its own profile row, every
-- branch carries a duplicate account: 203 of the 6709 account rows are copies of
-- 68 businesses' credentials. All 203 hold their main's login_email verbatim;
-- 197 hold its password too, and the 6 that do not are drift — the main changed
-- its password and the copy went stale.
--
-- That duplication is load-bearing in three places, all of them working around
-- it rather than using it:
--   - TokenManager.getBusinessByEmail matches an account by email, then excludes
--     any whose id is an active branch, then takes limit(1) — because one email
--     legitimately matches many accounts. It is not airtight: 4 branch accounts
--     carry a last_login, the most recent 2026-08-08, so sign-ins have landed on
--     branch rows.
--   - admin-app finds a branch's main with SPLIT_PART(slug, '-branch-', 1),
--     recovering a relationship from a string because no column states it.
--   - addBranch and claimLead copy login_email and login_password onto the new
--     branch account, which is how the seeded plaintext password (074) spread.
--
-- This adds the column that states the relationship. A main points at itself, a
-- branch at its main, so `account_business_id` is the id to look an account up
-- by, for every profile, with no COALESCE and no special case. It is NOT NULL on
-- purpose: a total column is what lets every reader be a plain join.
--
-- Verified on live before writing this migration, so the backfill is total and
-- unambiguous:
--   - 203 rows in `branches`, 203 distinct branch_id — no profile is a branch of
--     two mains;
--   - 0 rows where a branch_id is also a main_id — the graph is one level deep,
--     so no recursion is needed and a branch's account is never itself a branch's;
--   - 0 dangling ids: every branch_id and every main_id has a profile;
--   - 0 pairs spanning two countries.
--
-- ** There is deliberately no foreign key on this column, and that took some
-- finding out. ** A self-referencing NOT NULL FK cannot be satisfied when a new
-- main is inserted: the id it must name is its own, and that id does not exist
-- until the row does. The three ways out are all worse than living without it:
--
--   - claim the id from the sequence first and insert both columns together.
--     This requires naming the sequence, and the sequence cannot be named
--     safely. 062 reassigned the DEFAULT to businesses_1_id_seq, but the test
--     baseline's `serial` creates and owns business_profiles_business_id_seq —
--     so on live pg_get_serial_sequence() agrees with the DEFAULT and in the
--     test database it does not. Code written against either name is wrong
--     somewhere. (That divergence predates this migration; it is noted here
--     because this is where it surfaced.)
--   - insert a placeholder and UPDATE it. The FK is checked per statement, so
--     the placeholder is rejected on the way in.
--   - make the FK DEFERRABLE INITIALLY DEFERRED and wrap every insert in a
--     transaction. Correct, but the baseline is generated from
--     packages/db/src/schema and drizzle-kit has no way to express DEFERRABLE,
--     so the test database would get a non-deferrable copy and fail.
--
-- Doing without costs little here: `branches`, which models exactly the same
-- main-to-branch relationship, has carried no foreign keys for its whole life.
-- Writers set the column (three insert paths, all in solar-app) and the footer
-- query below checks it, which is the same standard branches is held to.
--
-- Nothing reads the column yet. This file is safe to apply on its own and leaves
-- every query behaving exactly as before; it is additive on purpose so the code
-- change and the delete (076) each land against a database that already agrees
-- with them.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS. The column is
--     declared in packages/db/src/schema, so the generated baseline carries it,
--     and adding this file to the list as well would fail on the second run.
--   - fixtures.ts: createBusiness and createUsBusiness insert profiles and must
--     set the new NOT NULL column. Updated in the same commit — a fixture that
--     did not would fail every test, which is the intended way to find them.
--   - function bodies: none write business_profiles (062/064/067 took the last
--     of the sv_sync_* family), so nothing needs the column added to it.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 075-profiles-name-their-account.sql

BEGIN;

ALTER TABLE business_profiles
	ADD COLUMN IF NOT EXISTS account_business_id INTEGER;

-- A main names itself; a branch names its main. `branches` is the only source
-- for that today, and it stays — 076 leaves it in place as the store for
-- `isactive`, which is relationship state rather than identity.
UPDATE business_profiles p
   SET account_business_id = COALESCE(
	   (SELECT br.main_id FROM branches br WHERE br.branch_id = p.business_id),
	   p.business_id
   )
 WHERE account_business_id IS NULL;

ALTER TABLE business_profiles
	ALTER COLUMN account_business_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS business_profiles_account_business_id_idx
	ON business_profiles USING btree (account_business_id);

COMMIT;

-- After committing, every profile names an account-owning profile, and the
-- branches are exactly the rows that name someone else:
--
--   SELECT count(*) FROM business_profiles WHERE account_business_id IS NULL;
--   -- 0
--   SELECT count(*) FROM business_profiles WHERE account_business_id <> business_id;
--   -- 203, matching branches
--   SELECT count(*) FROM business_profiles p JOIN branches br ON br.branch_id = p.business_id
--    WHERE p.account_business_id <> br.main_id;
--   -- 0
--
-- And the check that stands in for the absent foreign key — every profile names
-- a profile that exists. Worth re-running after any bulk import:
--
--   SELECT count(*) FROM business_profiles p
--    WHERE NOT EXISTS (SELECT 1 FROM business_profiles o WHERE o.business_id = p.account_business_id);
--   -- 0
