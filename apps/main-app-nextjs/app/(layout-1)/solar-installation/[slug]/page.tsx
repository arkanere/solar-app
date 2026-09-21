/**
 * Archetype 4 — a solar-installation cluster article.
 * Spec: archetype/editorial.md. Everything is in lib/editorial/routes.tsx;
 * the pillar slug is the only thing this file knows.
 */
import { clusterRoute } from '@/lib/editorial/routes';

const route = clusterRoute('solar-installation');

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
 * Empty on purpose: this is what turns ISR on, and it is the port of
 * `config.isr` from the SvelteKit load. Do not "tidy" it into a list of real
 * params — that is the variant that couples a ~1,380-page build to the
 * database. See "ISR needs `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
}

export const generateMetadata = route.generateMetadata;
export default route.Page;
