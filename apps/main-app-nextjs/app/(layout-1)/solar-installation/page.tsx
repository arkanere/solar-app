/**
 * Archetype 4 — the solar-installation pillar landing.
 * Spec: archetype/editorial.md. Everything is in lib/editorial/routes.tsx;
 * the pillar slug is the only thing this file knows.
 */
import { pillarRoute } from '@/lib/editorial/routes';

const route = pillarRoute('solar-installation');

export { revalidate } from '@/lib/editorial/routes';
export const generateMetadata = route.generateMetadata;
export default route.Page;
