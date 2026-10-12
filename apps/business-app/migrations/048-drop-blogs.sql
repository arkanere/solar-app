-- Blogs feature removed (2026-07-19): the /in/blogs and /us/blogs route trees
-- are deleted from main-app and legacy blog URLs 301 to the country home, so
-- nothing reads these tables any more.
--
-- DESTRUCTIVE and irreversible: drops in_blogs (74 rows) and us_blogs (7 rows)
-- with their content. Take a backup first if the articles might ever be wanted
-- again, e.g.:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t in_blogs -t us_blogs > blogs-archive.sql
--
-- in_blog_posts is NOT dropped: it is a separate (currently empty) table that
-- the /in/authors pages query.
-- Run manually: psql $POSTGRES_URL < 048-drop-blogs.sql

BEGIN;

DROP TABLE IF EXISTS in_blogs;
DROP TABLE IF EXISTS us_blogs;

COMMIT;
