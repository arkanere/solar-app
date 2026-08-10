-- Rollback for 069. Puts the three table names back.
--
-- Safe to run at any time: 069 changes names only, so nothing here has to
-- reconstruct data. After this runs, the pre-069 deploy of both repos works
-- again unchanged.
--
-- Constraints, indexes and sequences were never renamed by 069, so there is
-- nothing to wind back for them.

BEGIN;

ALTER TABLE sv_user          RENAME TO in_user;
ALTER TABLE sv_user_feedback RENAME TO in_user_feedback;
ALTER TABLE sv_proposals     RENAME TO in_proposals;

COMMIT;
