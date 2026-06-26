import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { recordLeadDataAcceptance } from '$lib/compliance';

export const POST: RequestHandler = async ({ cookies, getClientAddress }) => {
	const authService = new BusinessAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
	}

	const businessId = sessionResult.session.businessId;
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		let ip: string | null = null;
		try {
			ip = getClientAddress();
		} catch {
			ip = null;
		}

		const policy = await recordLeadDataAcceptance(pool, businessId, ip);
		if (!policy) {
			return json(
				{ success: false, error: 'No active policy configured' },
				{ status: 500 }
			);
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error recording policy acceptance:', error);
		return json({ success: false, error: 'Failed to record acceptance' }, { status: 500 });
	}
};
