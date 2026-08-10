-- Give leaddata the column vocabulary `leads` carries (2026-08-10).
--
-- ** NOT YET APPLIED. ** Step 1 of the lead collapse, next-steps.md item 6, and
-- the exact shape of 063: this file does everything EXCEPT the drop, and 067
-- drops `leads` and sv_sync_lead once the code that reads them is deployed and
-- quiet. `leads` was the last projection left after 062-065 finished the
-- business side.
--
-- ** WHICH TABLE SURVIVES, AND WHY IT IS LEADDATA. ** Both tables hold every
-- lead from every country already — leaddata.country_code has been NOT NULL
-- DEFAULT 'in' since 054, and live is 1212 IN + 4 US in leaddata. So the choice
-- is not about coverage, it is about identity:
--
--   - leaddata.id is the platform's lead id. Two foreign keys point at it —
--     project_management.lead_id and in_proposals.lead_id, both ON DELETE
--     CASCADE — and leaddata_claimrequests.lead_id, leaddata.original_id and
--     project_management.lead_id all carry it uncontrained. Every read of
--     `leads` aliases `source_id AS id` to get back to it (unifiedRead.ts).
--   - `leads` has zero inbound foreign keys. Verified on live:
--       SELECT conname FROM pg_constraint WHERE confrelid = 'leads'::regclass;
--     returns nothing. leads.id is a second surrogate key no code ever reads —
--     the same thing businesses.id turned out to be in 064.
--   - Every writer writes leaddata: main-app insertLead, business-app
--     submitLead / claimLead / updateLeadByBusiness / deleteLeadByBusiness /
--     fixClaimedLead, user-app submitLead / uploadBill, and the purge cron.
--     Nothing writes `leads` except sv_sync_lead.
--
-- Keeping `leads` instead would mean re-keying two foreign keys and every
-- referencing column onto a new id space. Keeping leaddata costs the four
-- renames below.
--
-- ** THIS ALSO CLOSES next-steps.md ITEM 2 — the drift needs no separate task.**
-- Re-measured on live 2026-08-10, and it is smaller than the item says: **18**
-- orphaned `leads` rows (item 2 said 156) and **3** unprojected leaddata rows.
-- The 18 are not a mystery and not a judgement call. Every one is
-- category = 1, business_id NULL, created Jan-Feb 2026 — which is exactly what
-- api/cron/purge-old-leads deletes:
--
--   DELETE FROM leaddata WHERE created_at < NOW() - INTERVAL '6 months'
--                          AND category = 1
--
-- The purge deletes the source and nothing deletes the projection, so each run
-- strands its batch in `leads`. Those rows were *supposed* to be gone; 067
-- taking them with the table is the correct outcome, not data loss. The 3
-- unprojected rows are the other direction (a sv_sync_lead call that never
-- happened) and survive untouched, since leaddata is what survives. After the
-- collapse the purge deletes one row and the class of drift cannot recur.
--
-- ** What changes here. **
--
--   state    -> level1
--   district -> level2
--   pin_code -> postal_code, varchar(6) -> varchar(10)
--
-- Renaming leaddata's names to `leads`' names rather than the reverse is what
-- makes the read sites move by changing only their table reference and
-- source_id -> id; their column names are already level1/level2/postal_code.
-- It is also the direction that does not make `state`/`district` the canonical
-- names for US rows, which is the leakage items 3 and 4 are still working
-- through. Same reasoning as 063, same direction.
--
-- postal_code widens because a US ZIP+4 does not fit in 6. This is a plain
-- varchar -> varchar widen, not 063's char -> varchar, so there is no padding
-- question: no value changes, and max(length(pin_code)) on live is 6 with 0
-- NULLs.
--
-- ** created_at becomes timestamptz, and this one is load-bearing. **
-- leaddata.created_at is `timestamp without time zone`; leads.created_at is
-- timestamptz. The reads being moved in this commit render it through
-- getRelativeTime() in LeadTile.svelte, which does new Date(...) — on a naive
-- string that parses as *browser-local*, so every lead's age would silently
-- shift by the viewer's offset the moment the read moved. This is the same
-- hazard as the password-reset bug (CLAUDE.md, "check withTimezone"), and the
-- fix is to make the surviving column match the type the readers already got.
--
-- The conversion is lossless on live and that was checked, not assumed. The
-- database's TimeZone is GMT, so the naive values are already UTC:
--
--   SELECT count(*) FILTER (WHERE l.created_at = d.created_at AT TIME ZONE 'UTC')
--        , count(*)
--     FROM leaddata d JOIN leads l
--       ON l.source_id = d.id AND l.country_code = d.country_code;
--   -- 1213 / 1213
--
-- All 1213 projected pairs agree exactly, so `AT TIME ZONE 'UTC'` reproduces
-- what sv_sync_lead has been writing into `leads` all along. The CURRENT_TIMESTAMP
-- default carries over as-is — it is natively timestamptz and was being
-- down-cast before.
--
-- ** The three smallint widenings are a live time bomb, not tidiness. **
-- business_id is smallint (max 32767) and holds a business_profiles.business_id,
-- which is at 6976 on live and minted from a shared sequence. original_id is
-- smallint and holds a leaddata.id, at 1367. Both fail with a plain integer
-- out-of-range error at the ceiling — an insert that has always worked starts
-- 500ing, with no warning as the number approaches. `leads` already types
-- business_id/original_id smallint too, so the projection never made it safe;
-- email_invite_count is the one place `leads` is already integer and leaddata
-- is not. Widening all three costs a table rewrite this migration is doing
-- anyway for created_at.
--
-- ** The index is replaced, not just kept. ** The read this commit moves onto
-- leaddata is the non-exclusive pool:
--
--   WHERE country_code = $1 AND category = 1 AND level1 = ANY($2)
--     AND isvisible AND created_at >= NOW() - INTERVAL '15 days'
--
-- `leads` served that with leads_created_idx (country_code, created_at DESC).
-- leaddata has only the flat leaddata_country_idx (country_code), so moving the
-- read without the composite is a straight regression. The composite has
-- country_code as its leading column, so it serves every lookup the flat index
-- did and the flat one goes.
--
-- ** sv_sync_lead is rewritten, not dropped. ** It reads l.state, l.district and
-- l.pin_code, so it breaks the instant the renames land unless it is replaced in
-- the same transaction — the same reason 063 could not leave sv_sync_business
-- alone. Its INSERT side (`leads`) is untouched; only the SELECT side moves. It
-- is dropped in 067 with the table.
--
-- ** ORDER: THIS FILE, THEN THE DEPLOY. ** Apply immediately before deploying,
-- not hours ahead. The renames break the deployed sites that read
-- leaddata.state/district/pin_code the moment this commits, and no ordering
-- avoids that — what the split buys is that `leads` stays projected and correct
-- throughout, so the window is recoverable by running the rollback script.
--
-- Code shipped in the same commit as this file:
--   business-app  lib/server/unifiedRead.ts   IN/US_LEAD_SELECTION now source
--                                             leaddata; the raw-string
--                                             IN/US_LEAD_COLUMNS go
--                 lib/server/leads.ts         IN_LEAD_RETURNING renamed cols
--                 [business_slug]/+page.server.ts, project-management,
--                 api/claimLead               reads moved off `leads`
--   main-app      lib/server/leads.ts         insertLead reads back leaddata
--                 solar/[state]/[district]    read moved off `leads`
--                 thank-you, partners/join    renamed cols
--
-- Rollback: 066-country-neutral-leaddata-columns.rollback.sql. Reversible in
-- full — every statement here is a rename, a widen or a CREATE OR REPLACE.
--
-- Verify after applying:
--   \d leaddata   -- level1/level2/postal_code, created_at timestamptz,
--                 -- business_id/original_id/email_invite_count integer
--   SELECT count(*) FROM leaddata;                    -- 1216, unmoved
--   SELECT count(*) FILTER (WHERE l.created_at = d.created_at) FROM leaddata d
--     JOIN leads l ON l.source_id = d.id AND l.country_code = d.country_code;
--                                                     -- 1213, unmoved

BEGIN;

-- ── the renames ─────────────────────────────────────────────────────────────
ALTER TABLE leaddata RENAME COLUMN state    TO level1;
ALTER TABLE leaddata RENAME COLUMN district TO level2;
ALTER TABLE leaddata RENAME COLUMN pin_code TO postal_code;

ALTER TABLE leaddata ALTER COLUMN postal_code TYPE varchar(10);

-- ── the type corrections ────────────────────────────────────────────────────
ALTER TABLE leaddata
  ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE leaddata ALTER COLUMN business_id        TYPE integer;
ALTER TABLE leaddata ALTER COLUMN original_id        TYPE integer;
ALTER TABLE leaddata ALTER COLUMN email_invite_count TYPE integer;

-- ── the country foreign key `leads` had and leaddata did not ────────────────
ALTER TABLE leaddata
  ADD CONSTRAINT leaddata_country_code_fkey
  FOREIGN KEY (country_code) REFERENCES countries(code);

-- ── the composite index that keeps the pool read on an index ────────────────
DROP INDEX leaddata_country_idx;
CREATE INDEX leaddata_country_created_idx
  ON leaddata USING btree (country_code, created_at DESC);

-- ── sv_sync_lead, sourcing the new names ────────────────────────────────────
-- Identical to 055's body except l.state -> l.level1, l.district -> l.level2
-- and l.pin_code -> l.postal_code. Kept alive through this step so `leads`
-- stays a correct projection while the deploy rolls; 067 drops it.

CREATE OR REPLACE FUNCTION sv_sync_lead(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO leads (
    country_code, source_id, name, phone, email, postal_code, type, comment,
    urlparams, level1, level2, category, stage, status, claim_count,
    original_id, business_id, email_invite_count, sv_comment_for_businesses,
    svnotes, business_notes, marketing_consent, reference_uuid,
    qualification_score, bill_url, bill_cloudinary_public_id, bill_format,
    bill_uploaded_at, isvisible, created_at
  )
  SELECT
    l.country_code, l.id, l.name, l.phone, l.email, l.postal_code, l.type,
    l.comment, l.urlparams, l.level1, l.level2, l.category,
    l.stage, l.status, l.claim_count, l.original_id, l.business_id,
    l.email_invite_count, l.sv_comment_for_businesses, l.svnotes,
    l.business_notes, l.marketing_consent, l.reference_uuid,
    l.qualification_score, l.bill_url, l.bill_cloudinary_public_id,
    l.bill_format, l.bill_uploaded_at, l.isvisible, l.created_at
  FROM leaddata l
  WHERE l.id = p_source_id AND l.country_code = p_country
  ON CONFLICT (country_code, source_id) DO UPDATE SET
    name                      = EXCLUDED.name,
    phone                     = EXCLUDED.phone,
    email                     = EXCLUDED.email,
    postal_code               = EXCLUDED.postal_code,
    type                      = EXCLUDED.type,
    comment                   = EXCLUDED.comment,
    urlparams                 = EXCLUDED.urlparams,
    level1                    = EXCLUDED.level1,
    level2                    = EXCLUDED.level2,
    category                  = EXCLUDED.category,
    stage                     = EXCLUDED.stage,
    status                    = EXCLUDED.status,
    claim_count               = EXCLUDED.claim_count,
    original_id               = EXCLUDED.original_id,
    business_id               = EXCLUDED.business_id,
    email_invite_count        = EXCLUDED.email_invite_count,
    sv_comment_for_businesses = EXCLUDED.sv_comment_for_businesses,
    svnotes                   = EXCLUDED.svnotes,
    business_notes            = EXCLUDED.business_notes,
    marketing_consent         = EXCLUDED.marketing_consent,
    reference_uuid            = EXCLUDED.reference_uuid,
    qualification_score       = EXCLUDED.qualification_score,
    bill_url                  = EXCLUDED.bill_url,
    bill_cloudinary_public_id = EXCLUDED.bill_cloudinary_public_id,
    bill_format               = EXCLUDED.bill_format,
    bill_uploaded_at          = EXCLUDED.bill_uploaded_at,
    isvisible                 = EXCLUDED.isvisible,
    created_at                = EXCLUDED.created_at;
END;
$function$ LANGUAGE plpgsql;

COMMIT;
