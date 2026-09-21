/**
 * Archetype 4 — a solar-pumps cluster article.
 * Spec: archetype/editorial.md. Everything is in lib/editorial/routes.tsx;
 * the pillar slug is the only thing this file knows.
 */
import { clusterRoute } from '@/lib/editorial/routes';

const route = clusterRoute('solar-pumps');

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
export const generateMetadata = route.generateMetadata;
export default route.Page;
