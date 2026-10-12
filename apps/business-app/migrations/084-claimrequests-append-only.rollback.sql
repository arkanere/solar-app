-- Roll back 084: allow deletes on leaddata_claimrequests again.

BEGIN;

DROP TRIGGER IF EXISTS claimrequests_no_delete ON leaddata_claimrequests;
DROP FUNCTION IF EXISTS sv_claimrequests_no_delete();

COMMIT;
