/**
 * Shared Lead Constants
 * Single source of truth for lead-related constants, types, and utilities
 */

// ===== TYPES =====

export type LeadCategory = 1 | 2 | 3;
export type LeadStage = 0 | 1 | 2 | 3;
export type LeadStatus = boolean;

// ===== CATEGORY CONSTANTS =====

export const LEAD_CATEGORIES = {
	1: 'Non-Exclusive',
	2: 'Non-Exclusive-Claimed',
	3: 'Exclusive'
} as const;

export const LEAD_CATEGORIES_WITH_ALL = {
	all: 'All Categories',
	1: 'Non-Exclusive-Available',
	2: 'Non-Exclusive-Claimed',
	3: 'Exclusive'
} as const;

// ===== STAGE CONSTANTS =====

/** Stages for Exclusive leads (category 3) and Non-Exclusive available leads (category 1) */
export const EXCLUSIVE_STAGES = ['New Inquiry', 'Contacted', 'Proposal/Quotation Sent', 'Won'] as const;

/** Stages for Non-Exclusive-Claimed leads (category 2) */
export const NON_EXCLUSIVE_CLAIMED_STAGES = ['Claimed', 'Contacted', 'Proposal/Quotation Sent', 'Won'] as const;

/** Display stages for Non-Exclusive-Claimed leads (includes pre-claim qualification stage) */
export const NON_EXCLUSIVE_CLAIMED_DISPLAY_STAGES = [
	'Qualified by Solar Vipani',
	'Claimed',
	'Contacted',
	'Proposal/Quotation Sent',
	'Won'
] as const;

/** Stage mapping with numeric keys for filters */
export const STAGES_MAP = {
	all: 'All Stages',
	0: 'New Inquiry',
	1: 'Contacted',
	2: 'Proposal/Quotation Sent',
	3: 'Won'
} as const;

/** Non-Exclusive-Claimed stage mapping with numeric keys for filters */
export const NON_EXCLUSIVE_CLAIMED_STAGES_MAP = {
	all: 'All Stages',
	0: 'Claimed',
	1: 'Contacted',
	2: 'Proposal/Quotation Sent',
	3: 'Won'
} as const;

// ===== STATUS CONSTANTS =====

export const STATUS_OPTIONS = {
	all: 'All Status',
	true: 'Active',
	false: 'Inactive'
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Get the appropriate stages array based on lead category
 */
export function getStagesForCategory(category: LeadCategory): readonly string[] {
	return category === 2 ? NON_EXCLUSIVE_CLAIMED_STAGES : EXCLUSIVE_STAGES;
}

/**
 * Get the display stages array based on lead category (includes extra display stage for claimed leads)
 */
export function getDisplayStagesForCategory(category: LeadCategory): readonly string[] {
	return category === 2 ? NON_EXCLUSIVE_CLAIMED_DISPLAY_STAGES : EXCLUSIVE_STAGES;
}

/**
 * Get the stages map based on lead category (for filters)
 */
export function getStagesMapForCategory(category: LeadCategory | 'all' | string): typeof STAGES_MAP | typeof NON_EXCLUSIVE_CLAIMED_STAGES_MAP {
	return category === 2 || category === '2' ? NON_EXCLUSIVE_CLAIMED_STAGES_MAP : STAGES_MAP;
}

/**
 * Get category label from category number
 */
export function getCategoryLabel(category: LeadCategory | null): string {
	if (category === null) return LEAD_CATEGORIES[3]; // Default to Exclusive
	return LEAD_CATEGORIES[category] ?? LEAD_CATEGORIES[3];
}

/**
 * Get stage label from stage number and category
 */
export function getStageLabel(stage: LeadStage, category: LeadCategory): string {
	const stages = getStagesForCategory(category);
	return stages[stage] ?? stages[0];
}
