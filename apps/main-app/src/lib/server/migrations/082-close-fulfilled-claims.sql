-- Close the three claim requests that were fulfilled but never flagged (2026-09-09).
--
-- ** APPLIED to live 2026-09-09, on explicit instruction. ** UPDATE 3.
--
-- These are the only three rows in `leaddata_claimrequests` with
-- `isresolved = false`, and they have been the only three for sixteen months.
-- Every one of them was already fulfilled: the business named on the claim
-- holds a `category = 2` copy of the lead, which is what fulfilling a claim
-- produces. The rows are stale bookkeeping, not outstanding work.
--
--   claim 16 | lead 105 | business 4583 | projection 120, 2025-02-07
--   claim 23 | lead 113 | business 4583 | projection 125, 2025-02-08
--   claim 51 | lead 112 | business 4571 | projection 303, 2025-05-13
--
-- ** The evidence, and why it is conclusive. ** `business-app/api/claimLead`
-- fulfils a claim by inserting a new `leaddata` row with `category = 2`,
-- `original_id` = the original lead's id and `business_id` = the claiming
-- business. `leaddata_claimrequests` carries a UNIQUE (lead_id, business_id),
-- so there is at most one claim row per pair and the projection cannot belong
-- to a different claim. A projection existing for (lead_id, business_id) is
-- therefore proof that this claim was served.
--
-- ** How they came to be unflagged. ** Two different ways, and neither can
-- recur:
--
--   16 and 23 are part of a nineteen-row backfill — every one of those rows
--   carries the identical timestamp 2025-02-08 22:15:58.413 — recording claims
--   that had already been fulfilled. Seventeen of the nineteen were written
--   with their flags set; these two were not. Their projections predate the
--   claim rows, which is the backfill's signature rather than an anomaly.
--
--   51 is a real claim whose projection was created 23 seconds later and whose
--   flags were never written — a partial failure from before claimLead became
--   transactional. (Take care reading those two timestamps side by side:
--   `leaddata_claimrequests.created_at` is `timestamp` and `leaddata.created_at`
--   is `timestamptz`, so a normal pair displays 5h30m apart while describing the
--   same instant. Every recent pair on live shows exactly +05:30:00.000.)
--
-- claimLead now inserts the claim row and sets `isallotted`/`isresolved` inside
-- one transaction — "Auto-allocate ALL successful claims" — so a fulfilled claim
-- cannot be left unflagged again. Every claim created since January 2026 is
-- resolved: 57, 33, 62, 34, 64, 50 and 19 rows a month, all of them.
--
-- ** Written against the condition, not the three ids **, so it stays correct
-- if the numbers move before it runs, and so it cannot touch a claim that is
-- genuinely outstanding. A row with no projection is left alone — there are
-- none today, and if one appears it is real work for an admin, not a relic.
--
-- ** What running it costs. ** admin-app's lead-claims queue, which shows
-- unresolved claims, becomes empty. That is the honest state: there is no
-- outstanding claim work, and there has not been since May 2025. Nothing else
-- changes — no mail is sent, no lead moves, no business gains or loses access.
-- The businesses already hold these leads.
--
-- ** What NOT running it costs. ** Three rows sit in that queue permanently.
-- They cannot be allotted (the original leads were purged by the six-month
-- retention cron, so there is nothing left to copy) and an admin has no way to
-- tell they were already served.
--
-- ** These are not the 193 dangling claims, and those are not a defect. **
-- 193 of 471 claim rows reference a `leaddata` row that no longer exists,
-- because `api/cron/purge-old-leads` deletes `category = 1` leads after six
-- months for PII retention while the claim row — which holds no PII, only ids
-- and two booleans — stays. 188 of the 193 were allotted, so they are the
-- history of fulfilled claims whose subject was deliberately erased. Nothing
-- reads them wrongly: the five-claim limit uses a per-lead counter, the
-- duplicate check is scoped to a live lead id, and control-tower counts
-- projections. They are left exactly as they are.
--
-- Not on POST_BASELINE_MIGRATIONS and must not be: it is a data fix against
-- production rows, and the test database is built empty.
--
-- Rollback: 082-close-fulfilled-claims.rollback.sql, which names the three ids
-- this run touched. Keep them in step if this is ever re-run.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 082-close-fulfilled-claims.sql

BEGIN;

UPDATE leaddata_claimrequests c
   SET isallotted = true,
       isresolved = true
 WHERE NOT c.isresolved
   AND EXISTS (
     SELECT 1
       FROM leaddata p
      WHERE p.original_id = c.lead_id
        AND p.business_id = c.business_id
   );

COMMIT;

-- After committing, no claim row should be unresolved, and the totals should
-- have moved by exactly three:
--
--   SELECT count(*) FILTER (WHERE NOT isresolved) unresolved,
--          count(*) FILTER (WHERE isresolved)     resolved,
--          count(*) FILTER (WHERE isallotted)     allotted
--     FROM leaddata_claimrequests;
--   -- unresolved 0, resolved 471, allotted 468   (was 3, 468, 465)
