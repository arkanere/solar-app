import { json, type RequestHandler } from '@sveltejs/kit';
import { countryForSlug } from '$lib/server/resolveCountry';
import { SessionManager } from '$lib/auth/business';
import { checkLeadDataPolicy, getActiveLeadDataPolicy } from '$lib/compliance';

export const GET: RequestHandler = async ({ cookies }) => {
	const sessionResult = SessionManager.validateSession(cookies);

	if (!sessionResult.success) {
		return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
	}

	// URLs no longer carry the country, so it comes from the acting
	// business. Writes below target that country's legacy tables.
	const country = await countryForSlug(sessionResult.session.businessSlug);
	if (!country) {
		return json({ success: false, error: 'Business not found' }, { status: 404 });
	}

	const businessId = sessionResult.session.businessId;

	try {
		const [status, policy] = await Promise.all([
			checkLeadDataPolicy(businessId, country),
			getActiveLeadDataPolicy()
		]);

		return json({
			success: true,
			compliant: status.compliant,
			acceptedAt: status.acceptedAt,
			policy: policy ? { version: policy.version, summary: policy.summary } : null
		});
	} catch (error) {
		console.error('Error checking compliance status:', error);
		return json({ success: false, error: 'Failed to check status' }, { status: 500 });
	}
};
