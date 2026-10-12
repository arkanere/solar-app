-- Revoke the magic-link tokens that are valid for more than one account (2026-08-11).
--
-- ** APPLIED to live 2026-08-11, on explicit instruction. ** UPDATE 12, and
-- afterwards: 0 shared token hashes, all 12 rows still non-empty (so the
-- audience filter described below still passes them) and all 12 with a NULL
-- expiry. Not automatic, and should not be made so — it invalidates credentials
-- already emailed to real businesses, which is a judgement call rather than a
-- mechanical follow-on from 071. The code fix (id-keyed minting) stops new ones
-- appearing whether this runs or not; this only dealt with the ones already out
-- there.
--
-- One thing the pre-run row dump showed that is worth keeping: every one of the
-- 6 pairs was a real business alongside `businessadminz@solar.com`, the internal
-- placeholder — not two real businesses. So the exposure was narrower than the
-- shape of the bug allows: a business's link could land on the placeholder
-- account rather than on a competitor's leads. The bug could have paired two
-- real businesses (31 non-sentinel slugs are shared on live); it happened not
-- to have yet.
--
-- What produced them. admin-app's mintInBusinessTokenBySlug() minted with
--   UPDATE business_accounts a ... FROM business_profiles b
--    WHERE b.slug = $3
-- and business_profiles.slug is not unique — live has 191 rows sharing a slug
-- with at least one other, and that is after setting aside the 125 on the
-- sentinel 'incorrect' and the 37 with none. So a mint for one business wrote
-- its token hash onto every row on the slug, and TokenManager validates a link
-- by (token, slug), which cannot tell those rows apart either. One emailed link
-- therefore signs into whichever of them the lookup returns first.
--
-- Four endpoints minted this way, all bulk lead-sharing mails: sendLeadDetails
-- and shareMaskedLeadWith{District,State,Unverified}Businesses.
--
-- Measured on live at the time of writing:
--   - 6 token hashes held by 2 accounts each, 12 accounts in total;
--   - 5 of the 6 unexpired, i.e. live credentials today;
--   - every pair is two rows of one slug, e.g. gnr-power-private-limited-chennai
--     (source_id 5215 and 6568) and marhaba-green-energy-chennai (5374, 6694).
-- The statement is written against the condition, not that list, so it stays
-- correct if the numbers have moved by the time it runs.
--
-- ** Why this scrambles the token instead of setting it to NULL. ** The obvious
-- revoke is `magic_link_token = NULL`, and it would be wrong here: two of the
-- four endpoints above pick their audience with
--   AND a.magic_link_token IS NOT NULL AND a.magic_link_token <> ''
-- so a business holding no token is not mailed — and those endpoints are the
-- main thing that mints one. NULLing would drop these 12 accounts out of
-- district and state lead sharing and leave nothing to put them back. (That
-- filter is odd on its own terms and is worth revisiting separately; this
-- migration works with it rather than around it.)
--
-- So each row gets a fresh random hash instead, and a NULL expiry. Both halves
-- matter: the hash is of a value that was never generated as a token and is not
-- emailed anywhere, so no link matches it; and TokenManager treats a NULL expiry
-- as expired rather than as "no expiry", which is fail-closed and is pinned by
-- tests/auth/tokenManager.test.ts. The column stays non-empty, so the audience
-- filter still passes and the next lead mail mints a real token over the top.
--
-- What running it costs: those businesses' outstanding "Claim the Lead" links
-- stop working and they see the login page instead. Nothing else — the account,
-- its password and its leads are untouched. What NOT running it costs: each of
-- those links keeps admitting its holder to a business that is not theirs,
-- including that business's leads and CRM, until it expires on its own (15 days
-- from the mint).
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and must not be. It
--     is a data fix against production rows; the test database is built empty
--     and its fixtures mint per id, so there is nothing here for it to do.
--   - fixtures.ts: nothing. No fixture shares a token between accounts.
--   - function bodies: none read business_accounts (062 and 067 took the last of
--     the sv_sync_* family).
--
-- No rollback script, and none is possible: tokens are stored hashed, so the raw
-- values in those emails cannot be recovered from the column to be put back.
-- That is the same property that bounds the loss — a revoked link is reissued by
-- sending the business a new mail, not by restoring this row.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 072-revoke-ambiguous-magic-tokens.sql

BEGIN;

UPDATE business_accounts
   SET magic_link_token = encode(sha256((random()::text || source_id::text)::bytea), 'hex'),
       magic_link_token_expires_at = NULL,
       updated_at = NOW()
 WHERE magic_link_token IN (
	 SELECT magic_link_token
	   FROM business_accounts
	  WHERE magic_link_token IS NOT NULL
	    AND magic_link_token <> ''
	  GROUP BY magic_link_token
	 HAVING count(*) > 1
 );

COMMIT;

-- After committing, no token hash should be shared, and every row this touched
-- should be unusable:
--
--   SELECT count(*) FROM (
--     SELECT magic_link_token FROM business_accounts
--      WHERE magic_link_token IS NOT NULL AND magic_link_token <> ''
--      GROUP BY magic_link_token HAVING count(*) > 1) t;
--   -- 0
