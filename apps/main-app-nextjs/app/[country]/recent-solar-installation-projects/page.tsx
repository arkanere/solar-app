/**
 * The public project gallery, page 1.
 * Everything is in lib/directory/projectRoutes.tsx; this route adds nothing.
 */
import { projectListRoute } from '@/lib/directory/projectRoutes';

/**
 * The ISR window, restated rather than re-exported from projectRoutes.tsx.
 * Next's build reads this field by STATIC ANALYSIS of the route file, and it
 * cannot see through `export { revalidate } from '...'` — it warns "can't
 * recognize the exported `revalidate` field" and falls back to the default.
 * The 14 editorial routes re-export theirs and carry that warning today.
 */
export const revalidate = 86400;
/**
 * Empty on purpose — this is what turns ISR on, and it is the port of
 * `config.isr` from the SvelteKit load.
 *
 * `export const revalidate` alone does nothing on a route with a dynamic
 * segment: without this function Next marks the route `ƒ` and re-renders it,
 * and re-queries the database, on every request. Returning `[]` prerenders
 * nothing at build time (the build stays database-free) and lets every path
 * be rendered on first visit and then cached — Next's documented "all paths
 * at runtime". Measured: `s-maxage=1296000, stale-while-revalidate=30240000`
 * and `x-nextjs-cache: HIT` on the second request.
 *
 * Do not "tidy" this into a list of real params: that is the variant that
 * couples a ~1,380-page build to the database. README open item 5.
 */
export async function generateStaticParams() {
  return [];
}

export const generateMetadata = projectListRoute.generateMetadata;
export default projectListRoute.Page;
