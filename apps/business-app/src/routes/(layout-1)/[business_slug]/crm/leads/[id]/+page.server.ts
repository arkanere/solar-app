import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { load as crmLoad } from '../../+page.server';

export const prerender = false;

// Reuses the CRM list load, so this page sees exactly the leads the CRM page
// shows, with the same masking. A lead outside that list is a 404.
export const load: PageServerLoad = async (event) => {
	const id = Number(event.params.id);
	if (!Number.isInteger(id)) error(404, 'Lead not found');

	const data = await crmLoad(event as unknown as Parameters<typeof crmLoad>[0]);
	if (!data || data.errorMessage) error(404, data?.errorMessage ?? 'Lead not found');

	const lead = data.leads?.find((l) => l.id === id);
	if (!lead) error(404, 'Lead not found');

	return { lead };
};
