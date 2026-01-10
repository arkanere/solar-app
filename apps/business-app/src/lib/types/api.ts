/**
 * API response types for business-app
 * Centralized type definitions for all API endpoint responses
 */

// ===== GENERIC API RESPONSE TYPES =====

/**
 * Standard success response wrapper
 * Used across all API endpoints for consistent success responses
 */
export interface ApiSuccessResponse<T = Record<string, unknown>> {
	success: true;
	message?: string;
	data?: T;
}

/**
 * Standard error response wrapper
 * Used across all API endpoints for consistent error responses
 */
export interface ApiErrorResponse {
	success: false;
	error: string;
	details?: string[] | Record<string, unknown>;
	retryAfter?: number; // For rate-limited responses (429)
}

/**
 * Generic API response type (success or error)
 * Most API endpoints return this pattern
 */
export type ApiResponse<T = Record<string, unknown>> =
	| (ApiSuccessResponse<T> & T)
	| ApiErrorResponse;

// ===== LOCATION API TYPES =====

/**
 * Response from location lookup APIs (cities, districts, counties)
 */
export interface LocationListResponse {
	cities?: string[];
	districts?: string[];
	counties?: string[];
	error?: string;
}

/**
 * Response from pincode/zipcode district/county lookup
 */
export interface LocationLookupResponse {
	district?: string;
	county?: string;
	error?: string;
}

// ===== REFERRER TYPES =====

/**
 * Referrer entity from referrers_in/referrers_us tables
 * Represents a business partner who refers leads
 */
export interface Referrer {
	id: number;
	business_id: number;
	name: string;
	slug: string;
	phone: string;
	email: string | null;
	notes: string | null;
	created_at: Date | string;
	updated_at: Date | string;
}

/**
 * Request payload for adding a referrer
 */
export interface AddReferrerRequest {
	businessId: number;
	name: string;
	slug: string;
	phone: string;
	email?: string | null;
	notes?: string | null;
}

/**
 * API response for referrer operations
 */
export type ReferrerApiResponse =
	| (ApiSuccessResponse<{ referrer: Referrer }> & { referrer: Referrer })
	| ApiErrorResponse;

// ===== RECENT PROJECT TYPES =====

/**
 * Recent project entity from projects table
 * Represents a completed solar installation project
 */
export interface RecentProject {
	id: number;
	business_slug: string;
	title: string;
	project_slug: string;
	pincode: string;
	district: string;
	project_date: Date | string;
	image_url?: string | null;
	cloudinary_public_id?: string | null;
	image_width?: number | null;
	image_height?: number | null;
	image_format?: string | null;
	created_at: Date | string;
	updated_at?: Date | string;
}

/**
 * Request payload for creating a recent project
 */
export interface AddProjectRequest {
	business_slug: string;
	projectTitle: string;
	pincode: string;
	projectDate: string;
	projectImage?: File; // For multipart/form-data
	image?: {
		// For JSON (Android app)
		data: string; // Base64 encoded
		mimetype: string;
		filename: string;
	};
}

/**
 * Request payload for updating a recent project
 */
export interface UpdateProjectRequest {
	id: number;
	business_slug: string;
	projectTitle?: string;
	pincode?: string;
	projectDate?: string;
	projectImage?: File;
	image?: {
		data: string;
		mimetype: string;
		filename: string;
	};
}

/**
 * API response for recent project operations
 */
export type ProjectApiResponse =
	| (ApiSuccessResponse<{ project: RecentProject }> & { project: RecentProject })
	| ApiErrorResponse;

// ===== BRANCH API TYPES =====

/**
 * Branch creation response (extends generic API response)
 */
export type BranchApiResponse =
	| (ApiSuccessResponse<{
			branch: {
				id: number;
				state: string;
				district?: string;
				county?: string;
				city: string;
			};
	  }> & {
			branch: {
				id: number;
				state: string;
				district?: string;
				county?: string;
				city: string;
			};
	  })
	| ApiErrorResponse;

// ===== LEAD SUBMISSION TYPES =====

/**
 * Request payload for submitting a lead from public forms
 */
export interface SubmitLeadRequest {
	name: string;
	phone: string;
	pinCode: string;
	type: string;
	comment: string;
	urlParam?: string;
	email?: string | null;
}

/**
 * Response from lead submission API
 */
export type LeadSubmissionResponse =
	| (ApiSuccessResponse<{ reference_uuid: string }> & { reference_uuid: string })
	| ApiErrorResponse;

// ===== PASSWORD RESET TYPES =====

/**
 * Request payload for password reset
 */
export interface PasswordResetRequest {
	business_slug: string;
	token: string;
	newPassword: string;
}

/**
 * Password validation result
 */
export interface PasswordValidation {
	valid: boolean;
	errors?: string[];
}

/**
 * Response from password reset API
 */
export type PasswordResetResponse =
	| (ApiSuccessResponse & { message?: string })
	| (ApiErrorResponse & { details?: string[] });

// ===== BUSINESS UPDATE TYPES =====

/**
 * Response from business profile update API
 */
export type BusinessUpdateResponse =
	| (ApiSuccessResponse<{
			business: {
				id: number;
				businessname: string;
				slug: string;
			};
	  }> & {
			business: {
				id: number;
				businessname: string;
				slug: string;
			};
	  })
	| ApiErrorResponse;

// ===== PAGE DATA TYPES =====

/**
 * Error page data returned by server load functions
 */
export interface PageErrorData {
	errorMessage: string;
}

/**
 * Page data with optional error
 */
export type PageDataWithError<T> = T | PageErrorData;

/**
 * Helper type guard to check if page data has an error
 */
export function isPageError(data: unknown): data is PageErrorData {
	return (
		typeof data === 'object' &&
		data !== null &&
		'errorMessage' in data &&
		typeof (data as PageErrorData).errorMessage === 'string'
	);
}

// ===== RATE LIMITING TYPES =====

/**
 * Rate limit check result
 */
export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number; // Milliseconds until retry allowed
}

// ===== UTILITY RESPONSE CONSTRUCTORS =====

/**
 * Helper to create success response
 */
export const createSuccessResponse = <T extends Record<string, unknown>>(
	data?: T,
	message?: string
): ApiSuccessResponse<T> & T => ({
	success: true,
	...(message && { message }),
	...(data || ({} as T))
});

/**
 * Helper to create error response
 */
export const createErrorResponse = (
	error: string,
	details?: string[] | Record<string, unknown>,
	retryAfter?: number
): ApiErrorResponse => ({
	success: false,
	error,
	...(details && { details }),
	...(retryAfter && { retryAfter })
});
