import { db } from '$lib/server/db';
import { svProposals } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/auth/business';

interface DeleteProposalRequest {
	proposalId: number;
	businessSlug: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

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
		const existing = await db
			.select({ id: svProposals.id, customer_name: svProposals.customerName })
			.from(svProposals)
			.where(and(eq(svProposals.id, proposalId), eq(svProposals.businessSlug, businessSlug)));

		if (existing.length === 0) {
			return json(
				{ success: false, error: 'Proposal not found' },
				{ status: 404 }
			);
		}

		// Delete the proposal
		const [deletedProposal] = await db
			.delete(svProposals)
			.where(and(eq(svProposals.id, proposalId), eq(svProposals.businessSlug, businessSlug)))
			.returning({ id: svProposals.id, customer_name: svProposals.customerName });

		return json({
			success: true,
			message: 'Proposal deleted successfully',
			proposal: deletedProposal
		});
	} catch (error) {
		console.error('❌ Error deleting proposal:', error);

		// Handle specific database errors
		if (error instanceof Error && error.message.includes('relation "sv_proposals" does not exist')) {
			return json(
				{ success: false, error: 'Proposals table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json(
			{ success: false, error: 'Failed to delete proposal' },
			{ status: 500 }
		);
	}
};
