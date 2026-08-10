import { svProposals } from '@solar/db/schema';

/**
 * Drizzle RETURNING map for sv_proposals, keyed in snake_case. The raw-SQL
 * handlers used `RETURNING *` and shipped the driver's snake_case row straight
 * to the client as a `Proposal`; aliasing here keeps that response shape.
 */
export const PROPOSAL_RETURNING = {
	id: svProposals.id,
	business_slug: svProposals.businessSlug,
	lead_id: svProposals.leadId,
	customer_name: svProposals.customerName,
	phone_number: svProposals.phoneNumber,
	address: svProposals.address,
	email: svProposals.email,
	system_capacity_kw: svProposals.systemCapacityKw,
	panels_brand_model: svProposals.panelsBrandModel,
	number_of_panels: svProposals.numberOfPanels,
	inverter_brand_model: svProposals.inverterBrandModel,
	notes: svProposals.notes,
	created_at: svProposals.createdAt,
	updated_at: svProposals.updatedAt
} as const;
