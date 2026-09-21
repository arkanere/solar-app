/**
 * Archetype 4 — a solar-subsidy cluster article.
 * Spec: archetype/editorial.md. Everything is in lib/editorial/routes.tsx;
 * the pillar slug is the only thing this file knows.
 */
import { clusterRoute } from '@/lib/editorial/routes';

const route = clusterRoute('solar-subsidy');

/**
 * 15 days, matching `config.isr.expiration` on the SvelteKit load.
 *
 * A LITERAL, and it has to be. Next reads Route Segment Config by static
 * analysis of this file, without executing it: a re-export from routes.tsx
 * warns "can't recognize the exported `revalidate` field" on every build, and
 * an imported constant fails the build outright with `Unknown identifier`.
 * So the number lives in the fourteen route files — routes.tsx says so too.
 */
export const revalidate = 1296000;
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

export const generateMetadata = route.generateMetadata;
export default route.Page;
