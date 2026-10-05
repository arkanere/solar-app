-- Add leaddata.updated_at (2026-10-05).
--
-- ** APPLIED 2026-10-05. ** BEGIN, ALTER TABLE, UPDATE 1347, COMMIT.
--
-- The business-app lead card shows the time since a lead was last updated.
-- `business-app/api/updateLeadByBusiness` sets this column whenever a business
-- changes a lead's stage, status or notes. Existing rows start at created_at,
-- and new rows (including claimed copies) default to the insert time.

BEGIN;

ALTER TABLE leaddata ADD COLUMN updated_at timestamptz DEFAULT CURRENT_TIMESTAMP;
UPDATE leaddata SET updated_at = created_at;

COMMIT;
