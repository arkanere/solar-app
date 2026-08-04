import { inProposals } from '@solar/db/schema';

/**
 * Drizzle RETURNING map for in_proposals, keyed in snake_case. The raw-SQL
 * handlers used `RETURNING *` and shipped the driver's snake_case row straight
 * to the client as a `Proposal`; aliasing here keeps that response shape.
 */
export const PROPOSAL_RETURNING = {
	id: inProposals.id,
	business_slug: inProposals.businessSlug,
	lead_id: inProposals.leadId,
	customer_name: inProposals.customerName,
	phone_number: inProposals.phoneNumber,
	address: inProposals.address,
	email: inProposals.email,
	system_capacity_kw: inProposals.systemCapacityKw,
	panels_brand_model: inProposals.panelsBrandModel,
	number_of_panels: inProposals.numberOfPanels,
	inverter_brand_model: inProposals.inverterBrandModel,
	notes: inProposals.notes,
	created_at: inProposals.createdAt,
	updated_at: inProposals.updatedAt
} as const;
