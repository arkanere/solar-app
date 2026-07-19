-- Read-only drift check: legacy tables vs unified tables. Every SELECT should
-- return drift = 0. Run before and after 049 (trigger drop), and periodically
-- afterwards until the legacy tables are retired. Any nonzero count means some
-- writer updated a legacy row without its sv_sync_* projection; fix the writer,
-- then heal the rows with SELECT sv_sync_lead/business/account(country, id).
-- Run: psql $POSTGRES_URL < check-unified-drift.sql

-- Leads IN
SELECT 'leads_in' AS scope, count(*) AS drift FROM (
  SELECT id, name, phone, pin_code, email, district, state, category, stage, status,
         claim_count, svnotes, business_notes, bill_cloudinary_public_id, isvisible
  FROM leaddata
  EXCEPT
  SELECT source_id, name, phone, postal_code, email, level2, level1, category, stage, status,
         claim_count, svnotes, business_notes, bill_cloudinary_public_id, isvisible
  FROM leads WHERE country_code = 'in'
) d;

-- Leads US
SELECT 'leads_us', count(*) FROM (
  SELECT id, name, phone, zipcode, email, county, category, stage, status, claim_count, svnotes, isvisible
  FROM us_leaddata
  EXCEPT
  SELECT source_id, name, phone, postal_code, email, level2, category, stage, status, claim_count, svnotes, isvisible
  FROM leads WHERE country_code = 'us'
) d;

-- Businesses IN (source of truth for profiles: in_business_profiles)
SELECT 'businesses_in', count(*) FROM (
  SELECT business_id, slug, businessname, email, phonenumber, state, district, city,
         pincode, rscore, tag, notes, businessfilled, tier3, isvisible
  FROM in_business_profiles
  EXCEPT
  SELECT source_id, slug, businessname, email, phonenumber, level1, level2, city,
         postal_code, rscore, tag, notes, businessfilled, tier3, isvisible
  FROM businesses WHERE country_code = 'in'
) d;

-- Businesses US
SELECT 'businesses_us', count(*) FROM (
  SELECT id, slug, businessname, email, phonenumber, state, county, city,
         zipcode, rscore, tag, notes, businessfilled, tier3, isvisible
  FROM us_businesses
  EXCEPT
  SELECT source_id, slug, businessname, email, phonenumber, level1, level2, city,
         postal_code, rscore, tag, notes, businessfilled, tier3, isvisible
  FROM businesses WHERE country_code = 'us'
) d;

-- Accounts IN (sv_sync_account('in') sources from businesses_1)
SELECT 'accounts_in', count(*) FROM (
  SELECT id, login_email, login_password, magic_link_token, reset_token, last_login, isvisible
  FROM businesses_1
  EXCEPT
  SELECT source_id, login_email, login_password, magic_link_token, reset_token, last_login, isvisible
  FROM business_accounts WHERE country_code = 'in'
) d;

-- Accounts US
SELECT 'accounts_us', count(*) FROM (
  SELECT id, login_email, login_password, magic_link_token, reset_token, last_login, isvisible
  FROM us_businesses
  EXCEPT
  SELECT source_id, login_email, login_password, magic_link_token, reset_token, last_login, isvisible
  FROM business_accounts WHERE country_code = 'us'
) d;

-- 039/040 split-table freshness (these triggers stay until business-app IN
-- writes are repointed; drift here means the 040 chain itself broke)
SELECT 'split_accounts_in', count(*) FROM (
  SELECT id, login_email, magic_link_token, reset_token, last_login
  FROM businesses_1
  EXCEPT
  SELECT business_id, login_email, magic_link_token, reset_token, last_login
  FROM in_business_accounts
) d;
