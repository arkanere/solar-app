-- Partner Leads Table (Phase 6)
-- Run manually: psql $POSTGRES_URL < 002-partner-leads.sql

BEGIN;

CREATE TABLE IF NOT EXISTS partner_leads (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  services TEXT DEFAULT '',
  experience VARCHAR(50) DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_leads_email ON partner_leads(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_partner_leads_district ON partner_leads(LOWER(district));

COMMIT;
