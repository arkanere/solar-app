import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// There is no dashboard: /{slug} opens the CRM.
export const load: PageServerLoad = ({ params }) => {
	throw redirect(302, `/${params.business_slug}/crm`);
};
