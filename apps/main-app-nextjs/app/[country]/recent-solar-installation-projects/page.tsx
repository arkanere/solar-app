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
 * Empty on purpose: this is what turns ISR on, and it is the port of
 * `config.isr` from the SvelteKit load. Do not "tidy" it into a list of real
 * params — that is the variant that couples a ~1,380-page build to the
 * database. See "ISR needs `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
}

export const generateMetadata = projectListRoute.generateMetadata;
export default projectListRoute.Page;
