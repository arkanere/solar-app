-- ============================================
-- US Blogs Table Schema
-- ============================================
-- This script creates the us_blogs table with all necessary
-- fields, indexes, and triggers for the blog management system
-- ============================================

-- Create the main blogs table
CREATE TABLE us_blogs (
    -- Primary key
    id SERIAL PRIMARY KEY,

    -- Core content fields (structured, required)
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,

    -- JSONB fields for flexible data
    featured_image JSONB,  -- {url, alt, cloudinaryId, width, height}
    seo_metadata JSONB DEFAULT '{}',  -- {metaTitle, metaDescription, keywords, ogImage}
    custom_fields JSONB DEFAULT '{}',  -- Post-type specific data for future extensibility

    -- Arrays for tags and categories (fast queries with GIN index)
    tags TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',

    -- Author information (simple approach for now)
    author_name VARCHAR(255) DEFAULT 'SolarVipani Admin',

    -- Status and publication tracking
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Analytics (optional)
    view_count INTEGER DEFAULT 0,

    -- Full-text search vector (auto-maintained by trigger)
    search_vector tsvector
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Index for published blogs (most common query)
CREATE INDEX idx_us_blogs_published ON us_blogs(status, published_at DESC);

-- Index for slug lookups (unique constraint already creates index, but explicit for clarity)
CREATE INDEX idx_us_blogs_slug ON us_blogs(slug);

-- GIN indexes for array fields (enables fast array containment queries)
CREATE INDEX idx_us_blogs_tags ON us_blogs USING GIN(tags);
CREATE INDEX idx_us_blogs_categories ON us_blogs USING GIN(categories);

-- GIN index for JSONB fields (enables fast JSON queries)
CREATE INDEX idx_us_blogs_custom_fields ON us_blogs USING GIN(custom_fields);
CREATE INDEX idx_us_blogs_seo_metadata ON us_blogs USING GIN(seo_metadata);

-- GIN index for full-text search
CREATE INDEX idx_us_blogs_search ON us_blogs USING GIN(search_vector);

-- ============================================
-- Triggers for Auto-Maintenance
-- ============================================

-- Trigger to auto-update search_vector when blog content changes
CREATE TRIGGER us_blogs_search_update
BEFORE INSERT OR UPDATE ON us_blogs
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(
    search_vector,
    'pg_catalog.english',
    title,
    excerpt,
    content
);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_us_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on every update
CREATE TRIGGER us_blogs_updated_at
BEFORE UPDATE ON us_blogs
FOR EACH ROW EXECUTE FUNCTION update_us_blogs_updated_at();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert a sample blog post to verify setup
INSERT INTO us_blogs (
    title,
    slug,
    content,
    excerpt,
    featured_image,
    seo_metadata,
    tags,
    categories,
    author_name,
    status,
    published_at
) VALUES (
    'Getting Started with Solar Vipani Blog System',
    'getting-started-with-solar-vipani-blog',
    '<h2>Welcome to the New Blog System</h2><p>This is a sample blog post demonstrating the new database-driven blog management system. Content can now be managed easily through the admin interface.</p><h3>Features</h3><ul><li>Rich text editing</li><li>Image uploads via Cloudinary</li><li>SEO optimization</li><li>Tag and category management</li><li>Draft/publish workflow</li></ul>',
    'Learn about the new blog management system and its powerful features.',
    '{"url": "https://via.placeholder.com/1200x630", "alt": "Sample featured image", "width": 1200, "height": 630}',
    '{"metaTitle": "Getting Started with Solar Vipani Blog System", "metaDescription": "Learn about the new blog management system and its powerful features.", "keywords": "blog, cms, solar vipani"}',
    ARRAY['blog', 'announcement', 'tutorial'],
    ARRAY['news', 'guides'],
    'SolarVipani Admin',
    'published',
    NOW()
);

-- ============================================
-- Verification Queries
-- ============================================

-- Verify table creation
-- SELECT * FROM us_blogs;

-- Test full-text search
-- SELECT title, ts_rank(search_vector, query) AS rank
-- FROM us_blogs, to_tsquery('english', 'blog & system') query
-- WHERE search_vector @@ query
-- ORDER BY rank DESC;

-- Test tag queries (find posts with specific tags)
-- SELECT title, tags FROM us_blogs WHERE tags @> ARRAY['tutorial'];

-- Test JSONB queries
-- SELECT title, seo_metadata->>'metaTitle' as seo_title FROM us_blogs;

-- ============================================
-- Instructions
-- ============================================
-- 1. Connect to your PostgreSQL database (Vercel Postgres)
-- 2. Run this entire SQL script
-- 3. Verify the sample blog post was created
-- 4. Test the verification queries above
-- 5. Delete the sample post if not needed:
--    DELETE FROM us_blogs WHERE slug = 'getting-started-with-solar-vipani-blog';
