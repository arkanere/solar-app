/**
 * API action functions for lead operations
 * Following Clojurist philosophy: separate side effects from business logic
 */

export type UpdateLeadParams = {
	id: number;
	stage?: number;
	status?: boolean;
	business_notes?: string;
};

export type ApiResponse<T> = {
	success: boolean;
	lead?: T;
	error?: string;
};

/**
 * Update a lead by business
 * @param params - Update parameters
 * @returns API response with updated lead or error
 */
export async function updateLeadAPI(params: UpdateLeadParams): Promise<ApiResponse<any>> {
	try {
		const response = await fetch('/in/api/updateLeadByBusiness', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});

		if (!response.ok) {
			throw new Error('Failed to update lead');
		}

		return await response.json();
	} catch (error) {
		console.error('Update Lead Error:', error);
		return {
			success: false,
			error: 'An error occurred while updating the lead'
		};
	}
}

/**
 * Delete a lead by business
 * @param leadId - Lead ID to delete
 * @returns API response
 */
export async function deleteLeadAPI(leadId: number): Promise<ApiResponse<any>> {
	try {
		const response = await fetch('/in/api/deleteLeadByBusiness', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: leadId
			})
		});

		if (!response.ok) {
			throw new Error('Failed to delete lead');
		}

		return await response.json();
	} catch (error) {
		console.error('Delete Lead Error:', error);
		return {
			success: false,
			error: 'An error occurred while deleting the lead'
		};
	}
}
