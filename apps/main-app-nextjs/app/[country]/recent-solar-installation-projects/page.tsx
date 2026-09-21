/**
 * The public project gallery, page 1.
 * Everything is in lib/directory/projectRoutes.tsx; this route adds nothing.
 */
import { countryParams } from '@/lib/countries';
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
 * IN only, from the same `features.projects` gate the route itself enforces.
 * `[country]` is the only dynamic segment, so no query enumerates it — see
 * `countryParams` for why this route returns real params where the
 * data-driven project routes return `[]`.
 */
export async function generateStaticParams() {
  return countryParams((config) => config.features.projects);
}

export const generateMetadata = projectListRoute.generateMetadata;
export default projectListRoute.Page;
