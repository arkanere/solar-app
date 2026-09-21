/**
 * GET /api/stories — the five newest visible projects, as JSON. Ported from
 * apps/main-app/src/routes/api/stories/+server.ts.
 *
 * **NOTHING IN THIS APP CALLS IT.** In SvelteKit its only consumer is
 * `storiesStore.ts`, which feeds `StoriesModal.svelte` from the
 * `(layout-1)` layout — a reel that has not been ported. It is here because
 * the URL is advertised and principle 1 keeps every route; when the modal
 * arrives it should read `listStories` directly as a server component rather
 * than fetch its own origin over HTTP, at which point this endpoint exists
 * only for outside callers.
 *
 * The SvelteKit handler's `config.isr.expiration = 86400` becomes `revalidate`
 * — one day, unchanged. No `generateStaticParams` is needed: the route has no
 * dynamic segment, so `revalidate` alone caches it (that requirement is about
 * dynamic routes, per the README).
 *
 * The `debug` object is carried across verbatim. It is part of the response
 * shape callers may already read, and dropping it is a content decision, not a
 * port one.
 */
import { listStories } from '@/lib/directory/data';

/** 24 hours, from the SvelteKit handler. */
export const revalidate = 86400;

export async function GET() {
  try {
    const projects = await listStories();

    return Response.json({
      success: true,
      projects,
      debug: {
        timestamp: new Date().toISOString(),
        projectCount: projects.length
      }
    });
  } catch (error) {
    console.error('Database query error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch projects: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
