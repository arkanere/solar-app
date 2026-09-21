/**
 * The public project gallery, pages 2..n.
 * Everything is in lib/directory/projectRoutes.tsx; this route adds nothing.
 */
import { projectListPageRoute } from '@/lib/directory/projectRoutes';

/**
 * The ISR window, restated rather than re-exported from projectRoutes.tsx.
 * Next's build reads this field by STATIC ANALYSIS of the route file, and it
 * cannot see through `export { revalidate } from '...'` — it warns "can't
 * recognize the exported `revalidate` field" and falls back to the default.
 * The 14 editorial routes re-export theirs and carry that warning today.
 */
export const revalidate = 86400;
export const generateMetadata = projectListPageRoute.generateMetadata;
export default projectListPageRoute.Page;
