-- Drop business_profiles.country_code (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- ** MUST FOLLOW THE CODE DEPLOY, NOT PRECEDE IT. **
--
-- Country is a fact about a *business*, not about each of its locations: a
-- business has one login, one country, and one or more addresses. It has been
-- stored on both halves since 054 gave every table a country_code discriminator,
-- and nothing has ever enforced that the two copies agree. This removes the
-- profile copy and leaves business_accounts.country_code as the only one.
--
-- The account copy is the one that stays, and not by preference: legal_acceptances
-- has a composite foreign key onto business_accounts(country_code, source_id)
-- (see postpull.mjs's COMPOSITE_FK_COLUMN_ORDER), so that column is a foreign key
-- target and cannot move. The profile copy has no such role.
--
-- After this, a profile's country is reached the way its account is reached:
--
--   business_profiles p
--     JOIN business_accounts a ON a.source_id = p.account_business_id
--    WHERE a.country_code = $1
--
-- which is the same join the auth layer already does, now used by the public
-- reads too.
--
-- ** This makes main-app join business_accounts on pages that never touched it.
-- ** Every public listing, geo and sitemap query was scoped by
-- business_profiles.country_code and is now scoped through the join above, so
-- the public site reads the credentials table on essentially every page. That
-- was a known and accepted cost of putting country in one place; it is recorded
-- here because it is the thing to look at first if listing latency moves.
--
-- The two indexes are rebuilt rather than dropped. Both led with country_code:
--
--   business_profiles_country_slug_idx  (country_code, slug)
--   business_profiles_geo_idx           (country_code, level2, isvisible)
--
-- Slugs are NOT unique across countries — resolveCountry exists precisely
-- because the same slug can name a business in both, and the sentinel slug
-- 'incorrect' is in both today — so a slug lookup still has to be
-- country-scoped. It just gets its country from the joined account now, which
-- means the remaining index is on slug alone and the country filter is applied
-- on the business_accounts side. Same for the geo index, which keeps
-- (level2, isvisible).
--
-- Measure before applying. This is the check that decides whether dropping the
-- column changes which country any location belongs to:
--
--   SELECT count(*) FROM business_profiles p
--     JOIN business_accounts a ON a.source_id = p.account_business_id
--    WHERE a.country_code IS DISTINCT FROM p.country_code;
--   -- MUST be 0. If it is not, the two copies have drifted and the drift has to
--   -- be resolved by hand first — this file has no way to know which copy is
--   -- right, and picking one silently is exactly the failure it is meant to
--   -- prevent.
--
--   SELECT count(*) FROM business_profiles p
--    WHERE NOT EXISTS (SELECT 1 FROM business_accounts a WHERE a.source_id = p.account_business_id);
--   -- MUST be 0, or those profiles lose their country entirely. 076 measured
--   -- this as 0 after its delete; re-check, because it is the precondition for
--   -- the join being total.
--
-- ** Order matters, in this direction only. ** A deployed reader that still
-- filters business_profiles.country_code gets an undefined-column error the
-- moment this runs — that is every public listing page. Reading country through
-- the account works whether or not this has run, which is why the code goes
-- first.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: this one IS on POST_BASELINE_MIGRATIONS, and has to
--     be. 063 is replayed and it creates business_profiles_country_code_fkey and
--     both composite indexes on country_code; the rewind in
--     apply-test-migrations.mjs adds the column back so 063 still has something
--     to act on. Without this file on the list after 063, the test database
--     would keep a column production no longer has. Every statement below is
--     therefore guarded so it is a no-op on a database already in the end state.
--   - fixtures.ts: createBusiness and createUsBusiness set the column on the
--     profile. They now set it on the account only. Updated in the same commit.
--   - function bodies: sv_sync_business read p.country_code, and 064 dropped it.
--     Nothing live names the column.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 079-drop-profile-country-code.sql

BEGIN;

-- The country filter moves to the business_accounts side of the join, so what is
-- left here is the bare local column of each index.
DROP INDEX IF EXISTS business_profiles_country_slug_idx;
DROP INDEX IF EXISTS business_profiles_geo_idx;

CREATE INDEX IF NOT EXISTS business_profiles_slug_idx
	ON business_profiles USING btree (slug);

CREATE INDEX IF NOT EXISTS business_profiles_geo_idx
	ON business_profiles USING btree (level2, isvisible);

ALTER TABLE business_profiles
	DROP CONSTRAINT IF EXISTS business_profiles_country_code_fkey;

ALTER TABLE business_profiles
	DROP COLUMN IF EXISTS country_code;

COMMIT;

-- After committing, country lives in exactly one place and every profile still
-- resolves to one:
--
--   SELECT count(*) FROM information_schema.columns
--    WHERE table_name = 'business_profiles' AND column_name = 'country_code';
--   -- 0
--
--   SELECT a.country_code, count(*) FROM business_profiles p
--     JOIN business_accounts a ON a.source_id = p.account_business_id
--    GROUP BY a.country_code;
--   -- should total 6709, the profile count 076 left behind
--
--   SELECT indexname FROM pg_indexes WHERE tablename = 'business_profiles';
--   -- business_profiles_slug_idx and business_profiles_geo_idx, no country ones
