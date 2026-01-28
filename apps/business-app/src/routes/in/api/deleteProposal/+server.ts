import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { Proposal } from '$lib/types/lead';

interface DeleteProposalRequest {
	proposalId: number;
	businessSlug: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const data = (await request.json()) as DeleteProposalRequest;
		const { proposalId, businessSlug } = data;

		// Validate required fields
		if (!proposalId) {
			return json(
				{ success: false, error: 'Proposal ID is required' },
				{ status: 400 }
			);
		}

		if (!businessSlug) {
			return json(
				{ success: false, error: 'Business slug is required' },
				{ status: 400 }
			);
		}

		// Check if proposal exists for this business
		const checkQuery = `
			SELECT id, customer_name FROM in_proposals
			WHERE id = $1 AND business_slug = $2
		`;
		const checkResult = await pool.query<Pick<Proposal, 'id' | 'customer_name'>>(checkQuery, [
			proposalId,
			businessSlug
		]);

		if (checkResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Proposal not found' },
				{ status: 404 }
			);
		}

		// Delete the proposal
		const deleteQuery = `
			DELETE FROM in_proposals
			WHERE id = $1 AND business_slug = $2
			RETURNING id, customer_name
		`;
		const deleteResult = await pool.query<Pick<Proposal, 'id' | 'customer_name'>>(deleteQuery, [
			proposalId,
			businessSlug
		]);

		const deletedProposal = deleteResult.rows[0];

		return json({
			success: true,
			message: 'Proposal deleted successfully',
			proposal: deletedProposal
		});
	} catch (error) {
		console.error('❌ Error deleting proposal:', error);

		// Handle specific database errors
		if (error instanceof Error && error.message.includes('relation "in_proposals" does not exist')) {
			return json(
				{ success: false, error: 'Proposals table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json(
			{ success: false, error: 'Failed to delete proposal' },
			{ status: 500 }
		);
	} finally {
		await pool.end();
	}
};
