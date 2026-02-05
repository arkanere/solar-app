/**
 * Pure utility functions for lead data transformations
 * Following Clojurist philosophy: no side effects, just data in → data out
 */

export const STAGES = {
	0: 'New Inquiry',
	1: 'Contacted',
	2: 'Proposal/Quotation Sent',
	3: 'Won'
} as const;

export const NON_EXCLUSIVE_CLAIMED_STAGES = {
	0: 'Claimed',
	1: 'Contacted',
	2: 'Proposal/Quotation Sent',
	3: 'Won'
} as const;

/**
 * Calculate relative time from a date string
 * @param dateString - ISO date string
 * @returns Object with text and variant for display
 */
export function getRelativeTime(dateString: string): { text: string; variant: string } {
	const now = new Date();
	const date = new Date(dateString);
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

	if (diffInDays > 0) {
		return {
			text: `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`,
			variant: diffInDays <= 1 ? 'time-fresh' : diffInDays <= 3 ? 'time-recent' : 'time-old'
		};
	} else if (diffInHours > 0) {
		return {
			text: `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`,
			variant: 'time-fresh'
		};
	} else if (diffInMinutes > 0) {
		return {
			text: `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`,
			variant: 'time-fresh'
		};
	} else {
		return {
			text: 'Just now',
			variant: 'time-fresh'
		};
	}
}

/**
 * Determine the next action for a lead based on its current state
 * @param stage - Current stage (0-3)
 * @param category - Lead category (1: unclaimed, 2: non-exclusive claimed, 3: exclusive)
 * @param status - Lead status (active/inactive)
 * @returns Next action text or null
 */
export function getNextAction(
	stage: number,
	category: number | null,
	status: boolean
): string | null {
	if (!status || stage === 3) {
		return null;
	}

	if (category === 2) {
		switch (stage) {
			case 0:
				return 'Call the customer';
			case 1:
				return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
			case 2:
				return 'Win the sale';
			default:
				return null;
		}
	}

	if (category === 3 || category === null) {
		switch (stage) {
			case 0:
				return 'Call the customer';
			case 1:
				return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
			case 2:
				return 'Win the sale';
			default:
				return null;
		}
	}

	return null;
}

/**
 * Format lead data for proposal modal
 * @param lead - Lead object
 * @returns Formatted proposal data
 */
export function formatLeadForProposal(lead: any) {
	return {
		customer_name: lead.name,
		phone_number: lead.phone,
		email: lead.email,
		address: lead.address || '',
		lead_id: lead.id
	};
}

/**
 * Track analytics event for calling a lead
 * @param leadId - Lead ID
 */
export function trackCallEvent(leadId: number) {
	if (typeof window !== 'undefined' && (window as any).umami) {
		(window as any).umami.track(`dashboard-home-call-now-button-${leadId}`);
	}
}
