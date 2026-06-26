import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { checkLeadDataPolicy, getActiveLeadDataPolicy } from '$lib/compliance';

export const GET: RequestHandler = async ({ cookies }) => {
	const authService = new BusinessAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
	}

	const businessId = sessionResult.session.businessId;
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const [status, policy] = await Promise.all([
			checkLeadDataPolicy(pool, businessId),
			getActiveLeadDataPolicy(pool)
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
