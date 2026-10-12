-- business_accounts.source_id becomes unique on its own (2026-08-11).
--
-- ** APPLIED to live 2026-08-11. ** Both uniques confirmed present afterwards,
-- and 6709/6709 distinct source_id unchanged.
--
-- Additive and non-breaking, so it could go on before the code that depends on
-- it, and did: the mint functions stop filtering by country_code in the same
-- commit, and this is what makes that safe by construction rather than by the
-- data happening to cooperate.
--
-- Why. `source_id` holds a business_profiles.business_id, and that column has
-- carried `business_profiles_business_id_key` — a plain UNIQUE — since the
-- unification. So the value is already globally unique; the only thing saying
-- otherwise was this table's own constraint, UNIQUE (country_code, source_id),
-- which dates from when the projections keyed rows by a per-country source_id
-- (the caution unifiedRead.js used to carry, removed when 064/067 dropped the
-- projections). Every lookup against business_accounts has had to thread a
-- country ever since, purely to satisfy a constraint that no longer describes
-- the data.
--
-- That threading is not free. admin-app's welcome mail has been failing with
-- "Business country_code and ID are required" because one hop of
--   edit page -> /api/triggerWelcomeMail -> /api/createMagicLinkToken
-- never forwarded the country. Stating the real invariant here is what lets the
-- id-only signature replace it, so there is nothing left to forget.
--
-- Verified on live before writing this migration:
--   - 6709 rows, 6709 distinct source_id — no duplicates to clean up first, so
--     the ADD CONSTRAINT below cannot fail;
--   - no source_id appears under two country codes (0 rows from
--     GROUP BY source_id HAVING count(*) > 1);
--   - the composite UNIQUE **stays**. legal_acceptances_business_fkey is
--     FOREIGN KEY (country_code, business_id) REFERENCES
--     business_accounts(country_code, source_id) and needs it as its target;
--     dropping it would take that FK with it. This adds a second unique, it does
--     not replace the first. The redundancy is the point — the composite is
--     load-bearing for the FK, the new one for the lookups.
--   - business_accounts has no FK of its own to business_profiles.business_id.
--     Adding one is tempting and is deliberately NOT done here: `source_id` is
--     the old name, the rename is unfinished business (see next-steps.md), and a
--     new constraint under the old name would only make that harder to unpick.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: nothing on POST_BASELINE_MIGRATIONS touches
--     business_accounts' constraints — 062 reassigns a sequence and sets a
--     DEFAULT, and that is the closest any of them comes. This file does not go
--     on the list either: it is a pure final-state declaration, but the baseline
--     is generated from packages/db/src/schema, which now declares the
--     constraint itself. Adding it to the list as well would fail on the second
--     run with "constraint already exists".
--   - fixtures.ts: creates one account per business, keyed by the business id it
--     just inserted, so it has never produced a duplicate source_id. No change.
--   - function bodies: none. No surviving function reads business_accounts —
--     sv_sync_account went with 062 and the last sv_sync_* with 067.
--
-- Note this constrains *identity*, not tokens: two accounts can still be made to
-- hold the same magic_link_token hash, which is exactly what the slug-keyed mint
-- this replaces has been doing (6 such pairs on live, 5 still unexpired — see
-- 072, which revokes them).
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 071-business-accounts-source-id-unique.sql

BEGIN;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		 WHERE conrelid = 'business_accounts'::regclass
		   AND conname = 'business_accounts_source_id_key'
	) THEN
		ALTER TABLE business_accounts
			ADD CONSTRAINT business_accounts_source_id_key UNIQUE (source_id);
	END IF;
END
$$;

COMMIT;

-- After committing, both uniques should be present — the composite for
-- legal_acceptances_business_fkey, the single-column one for the id lookups:
--
--   SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
--    WHERE conrelid = 'business_accounts'::regclass AND contype = 'u';
--   -- business_accounts_country_code_source_id_key | UNIQUE (country_code, source_id)
--   -- business_accounts_source_id_key              | UNIQUE (source_id)
