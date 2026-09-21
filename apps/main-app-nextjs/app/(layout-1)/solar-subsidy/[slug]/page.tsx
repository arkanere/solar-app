/**
 * Archetype 4 — a solar-subsidy cluster article.
 * Spec: archetype/editorial.md. Everything is in lib/editorial/routes.tsx;
 * the pillar slug is the only thing this file knows.
 */
import { clusterRoute } from '@/lib/editorial/routes';

const route = clusterRoute('solar-subsidy');

export { revalidate } from '@/lib/editorial/routes';
export const generateMetadata = route.generateMetadata;
export default route.Page;
