/**
 * Business entity types for business-app
 * Types for business profiles used across /in and /us regions
 */

/**
 * Region type for business location
 * 'in' for India, 'us' for USA
 */
export type BusinessRegion = 'in' | 'us';

/**
 * Complete business profile from database
 * Used when fetching full business details
 */
export interface BusinessProfile {
	id: number;
	businessname: string;
	slug: string;
	login_email: string;
	login_password?: string; // Optional as it shouldn't be sent to frontend
	email?: string; // Public email for contact
	phonenumber?: string;
	whatsapp?: string;
	description?: string;
	address?: string;
	website?: string;
	instagram_id?: string;
	google_maps_link?: string;

	// Location fields (India)
	state?: string;
	district?: string;
	city?: string;

	// Location fields (USA)
	county?: string;

	// Additional metadata
	gstn?: string; // GST Number (India)
	pluscode?: string; // Google Plus Code
	tag?: string;
	notes?: string;
	services?: string;

	// Visibility
	isvisible: boolean;

	// Ranking score
	rscore?: number;

	// Timestamps (optional as they may not always be queried)
	created_at?: Date | string;
	updated_at?: Date | string;
	last_login?: Date | string;
}

/**
 * Business profile for display/edit purposes
 * Subset of fields that are typically shown or editable in UI
 */
export interface BusinessProfileEditable {
	id: number;
	businessname: string;
	description?: string;
	phonenumber?: string;
	whatsapp?: string;
	email?: string;
	address?: string;
	website?: string;
	instagram_id?: string;
	google_maps_link?: string;
}

/**
 * Branch business information
 * Used for branch relationships
 */
export interface BranchBusiness {
	id: number;
	slug: string;
	district?: string; // India
	county?: string;   // USA
}

/**
 * Branch relationship data
 * Links main business to branch locations
 */
export interface Branch {
	id: number;
	main_id: number;
	branch_id: number;
	isactive: boolean;
	created_at?: Date | string;
}

/**
 * Request payload for adding a new branch
 */
export interface AddBranchRequest {
	businessId: number; // Main business ID
	state: string;
	district?: string; // India
	county?: string;   // USA
	city: string;
}

/**
 * Request payload for updating business details
 */
export interface UpdateBusinessRequest {
	id: number;
	business_slug: string;
	businessname?: string;
	description?: string;
	phonenumber?: string;
	whatsapp?: string;
	email?: string;
	address?: string;
	website?: string;
	instagram_id?: string;
	google_maps_link?: string;
}

/**
 * Business lookup result (minimal info)
 * Used for session validation and quick lookups
 */
export interface BusinessLookup {
	id: number;
	slug: string;
	businessname: string;
}

/**
 * API response for business operations
 */
export interface BusinessApiResponse {
	success: boolean;
	error?: string;
	business?: BusinessProfile | BusinessLookup;
}

/**
 * Setup progress data
 * Tracks business account setup completion
 */
export interface SetupProgress {
	projectsCount: number;
	referrersCount: number;
	proposalsCount: number;
}
