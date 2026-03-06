-- SEO Foundation Tables (Phase 0)
-- Run manually: psql $POSTGRES_URL < 001-seo-foundation.sql

BEGIN;

CREATE TABLE IF NOT EXISTS seo_pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  pillar_slug VARCHAR(100),
  page_type VARCHAR(50) NOT NULL,
  product_category VARCHAR(50),
  h1 TEXT NOT NULL,
  meta_title VARCHAR(160) NOT NULL,
  meta_description VARCHAR(320) NOT NULL,
  content JSONB NOT NULL,
  faq JSONB,
  author_slug VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seo_pages_pillar ON seo_pages(pillar_slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_type ON seo_pages(page_type);

CREATE TABLE IF NOT EXISTS solar_brands (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  product_category VARCHAR(50) NOT NULL,
  description TEXT,
  logo_url TEXT,
  meta_title VARCHAR(160),
  meta_description VARCHAR(320),
  faq JSONB,
  status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS solar_products (
  id SERIAL PRIMARY KEY,
  brand_slug VARCHAR(100) REFERENCES solar_brands(slug),
  model_slug VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  product_category VARCHAR(50) NOT NULL,
  specs JSONB NOT NULL,
  price_range_min INT,
  price_range_max INT,
  datasheet_url TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  UNIQUE(brand_slug, model_slug)
);

CREATE TABLE IF NOT EXISTS state_subsidies (
  id SERIAL PRIMARY KEY,
  state_slug VARCHAR(100) UNIQUE NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  central_subsidy_rate TEXT,
  state_topup_rate TEXT,
  eligibility TEXT,
  application_process TEXT,
  content JSONB,
  faq JSONB,
  last_verified DATE,
  status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS discoms (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  state_slug VARCHAR(100) REFERENCES state_subsidies(state_slug),
  net_metering_policy TEXT,
  tariff_structure TEXT,
  application_process TEXT,
  content JSONB,
  faq JSONB,
  status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS solar_financing_banks (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  interest_rate TEXT,
  max_amount TEXT,
  tenure TEXT,
  eligibility TEXT,
  documents TEXT,
  content JSONB,
  faq JSONB,
  status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  photo_url TEXT,
  credentials TEXT,
  expertise TEXT,
  bio TEXT,
  social_links JSONB,
  status VARCHAR(20) DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS in_blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  meta_title VARCHAR(160),
  meta_description VARCHAR(320),
  content TEXT NOT NULL,
  author_slug VARCHAR(100) REFERENCES authors(slug),
  parent_cluster_slug VARCHAR(255),
  tags JSONB,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'draft'
);

COMMIT;
