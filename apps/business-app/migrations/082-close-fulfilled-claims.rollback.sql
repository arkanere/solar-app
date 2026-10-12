-- Rollback for 082-close-fulfilled-claims.sql.
--
-- Puts the three claim rows back to `isallotted = false, isresolved = false`.
-- Keyed on the ids 082 actually touched rather than on its condition, because
-- the condition is no longer selective once the flags are set — it would match
-- nothing, and a rollback that matches nothing is not a rollback.
--
-- The ids are the three named in 082's header, and they are the only rows that
-- run changed:
--
--   16 | lead 105 | business 4583
--   23 | lead 113 | business 4583
--   51 | lead 112 | business 4571
--
-- If 082 is ever re-run and closes different rows, update this file in the same
-- commit.
--
-- Running this restores three unactionable items to admin-app's lead-claims
-- queue. It does not restore the purged leads those claims reference — nothing
-- can, and that is what makes the rows unactionable in the first place.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 082-close-fulfilled-claims.rollback.sql

BEGIN;

UPDATE leaddata_claimrequests
   SET isallotted = false,
       isresolved = false
 WHERE id IN (16, 23, 51);

COMMIT;
