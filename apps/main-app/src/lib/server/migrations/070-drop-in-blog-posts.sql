-- Drop in_blog_posts (2026-08-10).
--
-- ** NOT YET APPLIED. ** Run after the commit that removes the dead SELECT in
-- main-app's authors route has deployed. Not reversible by reverting code, which
-- is why it is its own file rather than part of 069's renames.
--
-- The table is empty and has always been empty: 0 rows, and no row has ever been
-- written to it (there is no INSERT against it anywhere in either repo — the one
-- statement that ever touched it is the SELECT described below).
--
-- 048 removed the blogs feature entirely (2026-07-19) and explicitly kept this
-- table, on the grounds that /in/authors read it. That is still literally true
-- and is also the reason it can go now: the read is dead. The loader at
-- apps/main-app/src/routes/(layout-1)/authors/[author_slug]/+page.server.ts
-- SELECTs into `blogPosts` and *nothing renders it* — the route's own comment
-- has said so since the column bug that 500'd the page was fixed. So the query
-- costs a round trip per author page view to produce a value that is discarded.
-- Removing the SELECT changes no rendered output; that is what makes this a
-- housekeeping drop rather than a feature removal.
--
-- Verified on live before writing this migration:
--   - 0 rows;
--   - one inbound-facing constraint, in_blog_posts_author_slug_fkey, which is
--     OUTBOUND from this table to authors.slug and dies with it. `authors` keeps
--     all its rows and is read by the same route for everything it actually
--     renders;
--   - nothing else references it: no view (public has none), no function body,
--     no trigger. The three update_*_blogs_updated_at functions left over from
--     048 do not mention it — they are orphans of the dropped blogs tables and
--     are a separate cleanup, noted in next-steps.md;
--   - in_blog_posts_id_seq is owned by the column and is dropped with the table.
--
-- The three places a grep of src/ misses (see next-steps.md):
--   - replayed migrations: 001 creates in_blog_posts, but 001 is NOT on
--     apply-test-migrations.mjs's POST_BASELINE_MIGRATIONS list, so nothing
--     replays a CREATE for it. Nothing else on that list mentions it.
--   - fixtures.ts TRUNCATE list: does not contain it (it contains in_user, which
--     069 renames).
--   - function bodies: none, per the sweep above.
-- So this needs no rewind, and the to_regclass guard below is belt-and-braces
-- rather than load-bearing — but it is written the way next-steps.md says to
-- write a drop, in the same commit as the drop, because the cost is zero and the
-- one time it was skipped it cost 176 failing tests.
--
-- solar-app-internal declares the table in admin-app's generated schema.ts but
-- has no query against it, so nothing there breaks. Its schema.ts export is
-- removed in the same lockstep deploy as 069.

BEGIN;

DO $$
BEGIN
	IF to_regclass('public.in_blog_posts') IS NOT NULL THEN
		DROP TABLE in_blog_posts;
	END IF;
END
$$;

COMMIT;
