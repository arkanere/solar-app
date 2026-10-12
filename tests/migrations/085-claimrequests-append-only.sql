-- Make leaddata_claimrequests append-only for deletes (2026-10-12).
--
-- ** APPLIED to live 2026-10-12. ** BEGIN, CREATE FUNCTION, DROP TRIGGER (skipped), CREATE TRIGGER, COMMIT.
--
-- leaddata_claimrequests is the claim history. Since this change the 10-claim
-- quality gate in solar-app business-app (src/lib/server/claimGate.ts) counts claims
-- from it rather than from the claimed copies in leaddata, which a business can
-- hide. If a claim row could be deleted, the gate could be reset the same way,
-- so deletes are refused at the database rather than by convention in app code.
--
-- A BEFORE DELETE row trigger, not a REVOKE: it holds for every role, including
-- the one the apps connect as. TRUNCATE does not fire row triggers, so the test
-- suite's resetDatabase is unaffected. A claim that genuinely has to go is
-- removed by disabling the trigger in the same transaction, on purpose:
--
--   BEGIN;
--   ALTER TABLE leaddata_claimrequests DISABLE TRIGGER claimrequests_no_delete;
--   DELETE FROM leaddata_claimrequests WHERE id = ...;
--   ALTER TABLE leaddata_claimrequests ENABLE TRIGGER claimrequests_no_delete;
--   COMMIT;
--
-- Nothing deletes claim rows today: no app code does, and the purge-old-leads
-- cron deletes only category 1 leads, leaving their claim rows (see 082).
--
-- Rollback: 085-claimrequests-append-only.rollback.sql
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 085-claimrequests-append-only.sql

BEGIN;

CREATE OR REPLACE FUNCTION sv_claimrequests_no_delete() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
	RAISE EXCEPTION 'leaddata_claimrequests is append-only: claim % cannot be deleted', OLD.id;
END;
$$;

DROP TRIGGER IF EXISTS claimrequests_no_delete ON leaddata_claimrequests;
CREATE TRIGGER claimrequests_no_delete
	BEFORE DELETE ON leaddata_claimrequests
	FOR EACH ROW EXECUTE FUNCTION sv_claimrequests_no_delete();

COMMIT;
