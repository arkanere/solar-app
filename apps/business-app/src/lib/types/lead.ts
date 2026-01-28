/**
 * Lead-related type definitions for business-app
 * Centralized types for LeadData, ClaimRequest, Proposal, and Project entities
 */

import type { LeadCategory, LeadStage, LeadStatus } from '$lib/constants/lead';

// ===== LEAD DATA TYPES =====

/**
 * Main lead entity from leaddata table
 */
export interface LeadData {
	id: number;
	name: string;
	phone: string;
	email: string | null;
	pin_code: string;
	district: string | null;
	type: string | null; // Property type (residential, commercial, etc.)
	comment: string | null; // Customer's inquiry comment
	created_at: Date | string;
	svnotes: string | null; // Internal Solar Vipani notes
	sv_comment_for_businesses: string | null; // Notes visible to businesses
	urlparams: string | null; // URL parameters from lead source
	isvisible: boolean;
	category: LeadCategory; // 1=Non-Exclusive-Available, 2=Non-Exclusive-Claimed, 3=Exclusive
	stage: LeadStage; // 0-3 depending on category
	status: LeadStatus; // true=Active, false=Inactive
	claim_count: number; // Number of times this lead has been claimed (max 5)
	original_id: number | null; // For allocated leads, references the original lead
	business_id: number | null; // Business this lead is assigned to (null for category 1)
	business_notes: string | null; // Private notes from business
}

/**
 * Partial lead data for list views (subset of fields commonly displayed)
 */
export interface LeadDataPartial {
	id: number;
	name: string;
	phone: string;
	email: string | null;
	pin_code: string;
	district: string | null;
	comment: string | null;
	created_at: Date | string;
	category: LeadCategory;
	stage: LeadStage;
	status: LeadStatus;
	claim_count: number;
	sv_comment_for_businesses: string | null;
	type: string | null;
	business_notes: string | null;
}

/**
 * Lead data for components (includes UI state properties)
 */
export interface LeadDataWithUIState extends LeadData {
	collapsedNotes?: boolean; // UI state for notes section
}

// ===== CLAIM REQUEST TYPES =====

/**
 * Claim request entity from leaddata_claimrequests table
 */
export interface ClaimRequest {
	id: number;
	lead_id: number;
	claim_id: number; // Sequential claim number (0-4)
	business_id: number;
	created_at: Date | string;
	isallotted: boolean; // Whether this claim was approved/allocated
	isresolved: boolean; // Whether the claim request has been processed
}

/**
 * Claim request payload for API calls
 */
export interface ClaimRequestPayload {
	lead_id: number;
	business_id: number;
}

// ===== PROPOSAL TYPES =====

/**
 * Proposal entity from in_proposals table
 */
export interface Proposal {
	id: number;
	business_slug: string;
	lead_id: number | null;
	customer_name: string;
	phone_number: string | null;
	address: string | null;
	email: string | null;
	system_capacity_kw: number; // Decimal/float field
	panels_brand_model: string | null;
	number_of_panels: number | null;
	inverter_brand_model: string | null;
	notes: string | null;
	created_at: Date | string;
	updated_at: Date | string;
}

/**
 * Proposal payload for create/update operations
 */
export interface ProposalPayload {
	id?: number; // Present for updates
	business_slug: string;
	lead_id?: number | null;
	customer_name: string;
	phone_number?: string | null;
	address?: string | null;
	email?: string | null;
	system_capacity_kw: number | string; // May come as string from forms
	panels_brand_model?: string | null;
	number_of_panels?: number | string | null;
	inverter_brand_model?: string | null;
	notes?: string | null;
}

// ===== PROJECT MANAGEMENT TYPES =====

/**
 * Project entity from project_management table
 */
export interface Project {
	id: number;
	lead_id: number;
	stage: LeadStage; // Typically stage 3 (Won) when created
	created_at?: Date | string;
	updated_at?: Date | string;
}

// ===== API REQUEST/RESPONSE TYPES =====

/**
 * Lead update payload for API calls
 */
export interface LeadUpdatePayload {
	id: number;
	stage?: LeadStage;
	status?: LeadStatus;
	business_notes?: string | null;
}

/**
 * Lead update partial fields (for dynamic updates)
 */
export interface LeadUpdateFields {
	stage?: LeadStage;
	status?: LeadStatus;
	business_notes?: string | null;
}

/**
 * API response for lead operations
 */
export interface LeadApiResponse {
	success: boolean;
	error?: string;
	lead?: LeadData;
}

/**
 * API response for claim operations
 */
export interface ClaimApiResponse {
	success: boolean;
	error?: string;
}

/**
 * API response for proposal operations
 */
export interface ProposalApiResponse {
	success: boolean;
	error?: string;
	proposal?: Proposal;
}
