<script>
	import { createEventDispatcher } from 'svelte';
	import LeadProgressBar from './LeadProgressBar.svelte';

	export let leads = [];
	export let businessInfo = {};
	export let businessSlug = '';
	export let errorMessage = null;
	export let isClaiming = false;

	const dispatch = createEventDispatcher();

	// Delete confirmation state
	let showDeleteConfirm = false;
	let leadToDelete = null;
	let isDeleting = false;

	// Lead stage mapping
	const STAGES = {
		0: 'New Inquiry',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Stage mapping for Non-Exclusive-Claimed leads (category 2)
	const NON_EXCLUSIVE_CLAIMED_STAGES = {
		0: 'Claimed',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Dummy test lead for new users
	const dummyLead = {
		name: 'John Doe',
		received_at: new Date().toISOString(),
		phone: '+91 0123456789',
		email: 'dummy@email.com',
		pin_code: '110001',
		type: 'Residential - Independent Home',
		comment: 'I want to install 3kW at my home. Please call me!'
	};

	// Limit leads to 5 for dashboard home
	$: limitedLeads = leads.slice(0, 5);

	async function updateLead(lead) {
		try {
			const response = await fetch('/api/updateLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: lead.id,
					stage: Number(lead.stage),
					status: lead.status
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update lead');
			}

			const result = await response.json();
			
			if (result.success) {
				// Update the lead in the local array
				leads = leads.map((l) => (l.id === lead.id ? { ...l, ...result.lead } : l));
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Update Lead Error:', error);
			alert('An error occurred while updating the lead.');
		}
	}

	async function claimLead(leadId, businessId) {
		if (isClaiming) return;

		dispatch('claimLead', { leadId, businessId });
	}

	function getRelativeTime(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

		if (diffInDays > 0) {
			return {
				text: `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`,
				class: diffInDays <= 1 ? 'time-fresh' : diffInDays <= 3 ? 'time-recent' : 'time-old'
			};
		} else if (diffInHours > 0) {
			return {
				text: `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`,
				class: 'time-fresh'
			};
		} else if (diffInMinutes > 0) {
			return {
				text: `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`,
				class: 'time-fresh'
			};
		} else {
			return {
				text: 'Just now',
				class: 'time-fresh'
			};
		}
	}

	function getNextAction(stage, category, status) {
		// No next action if lead is inactive or won
		if (!status || stage === 3) {
			return null;
		}

		// For Non-Exclusive-Claimed leads (category 2)
		if (category === 2) {
			switch (stage) {
				case 0: // Claimed
					return "Call the customer";
				case 1: // Contacted
					return "Send proposal/quotation if customer is interested, else make the inquiry inactive";
				case 2: // Proposal/Quotation Sent
					return "Win the sale";
				default:
					return null;
			}
		}

		// For Exclusive leads (category 3 or null)
		if (category === 3 || category === null) {
			switch (stage) {
				case 0: // New Inquiry
					return "Call the customer";
				case 1: // Contacted
					return "Send proposal/quotation if customer is interested, else make the inquiry inactive";
				case 2: // Proposal/Quotation Sent
					return "Win the sale";
				default:
					return null;
			}
		}

		return null;
	}

	// Delete lead function
	async function deleteLead(lead) {
		if (isDeleting) return;
		isDeleting = true;

		try {
			const response = await fetch('/api/deleteLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: lead.id
				})
			});

			if (!response.ok) {
				throw new Error('Failed to delete lead');
			}

			const result = await response.json();
			
			if (result.success) {
				// Remove the lead from the local array
				leads = leads.filter((l) => l.id !== lead.id);
				showDeleteConfirm = false;
				leadToDelete = null;
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Delete Lead Error:', error);
			alert('An error occurred while deleting the lead.');
		} finally {
			isDeleting = false;
		}
	}

	// Show delete confirmation
	function showDeleteConfirmation(lead) {
		leadToDelete = lead;
		showDeleteConfirm = true;
	}

	// Cancel delete
	function cancelDelete() {
		if (isDeleting) return; // Prevent canceling while deleting
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	// Confirm delete
	function confirmDelete() {
		if (leadToDelete) {
			deleteLead(leadToDelete);
		}
	}
</script>

<!-- LEAD DATA SECTION -->
<section id="lead-data">
	<h2>Customer Inquiry</h2>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else}
		<ul>
			{#if leads.length > 0}
				{#each limitedLeads as lead}
					<li>
						<div class="lead-header">
							<h3>
								{lead.name}
								<span
									class="tag {lead.category === 1
										? 'non-exclusive'
										: lead.category === 2
											? 'non-exclusive-claimed'
											: 'exclusive'}"
								>
									{lead.category === 1
										? 'Non-Exclusive-Available-to-Claim'
										: lead.category === 2
											? 'Non-Exclusive-Claimed'
											: 'Exclusive'}
								</span>
							</h3>
						</div>

						<div class="lead-details">
							<p><strong>Received:</strong> <span class="time-stamp {getRelativeTime(lead.created_at).class}">{getRelativeTime(lead.created_at).text}</span></p>
							<p><strong>Phone:</strong> {lead.phone}</p>
							{#if lead.email}
								<p><strong>Email:</strong> {lead.email}</p>
							{/if}
							<p><strong>Pin Code:</strong> {lead.pin_code}</p>
							<p><strong>Type:</strong> {lead.type}</p>
							<p><strong>Customer Comment:</strong> {lead.comment}</p>
							{#if lead.sv_comment_for_businesses}
								<p class="sv-comment"><strong>Solarvipani.com Comment:</strong> {lead.sv_comment_for_businesses}</p>
							{/if}

							{#if lead.category !== 1}
								<div class="stage-update-section">
									<div class="stage-controls">
										<label for="stage-{lead.id}"><strong>Stage:</strong></label>
										<select 
											id="stage-{lead.id}" 
											bind:value={lead.stage}
											on:change={() => updateLead(lead)}
										>
											{#if lead.category === 2}
												{#each Object.entries(NON_EXCLUSIVE_CLAIMED_STAGES) as [value, label]}
													<option value={Number(value)}>{label}</option>
												{/each}
											{:else}
												{#each Object.entries(STAGES) as [value, label]}
													<option value={Number(value)}>{label}</option>
												{/each}
											{/if}
										</select>
									</div>
									
									<div class="status-controls">
										<label for="status-{lead.id}"><strong>Status:</strong></label>
										<select 
											id="status-{lead.id}" 
											bind:value={lead.status}
											on:change={() => updateLead(lead)}
										>
											<option value={true}>Active</option>
											<option value={false}>Inactive</option>
										</select>
									</div>
								</div>
								
								<LeadProgressBar 
									currentStage={lead.stage} 
									leadCategory={lead.category}
									isActive={lead.status}
								/>
								
								<!-- Next Action Section -->
								{@const nextAction = getNextAction(lead.stage, lead.category, lead.status)}
								{#if nextAction}
									<div class="next-action">
										<strong>Next Action:</strong> <span class="action-text">{nextAction}</span>
									</div>
								{/if}
							{/if}

							<div class="button-container">
								{#if lead.category === 1 && lead.claim_count > 4}
									<p class="claimed-text">Not Available. Claimed by Other Business</p>
								{:else if lead.category === 1}
									<button
										class="claim-button"
										on:click={() => claimLead(lead.id, businessInfo.id)}
										disabled={isClaiming}
									>
										{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
									</button>
								{:else if lead.category !== 1 && !lead.status}
									<!-- Delete button for inactive leads -->
									<button
										class="delete-button"
										on:click={() => showDeleteConfirmation(lead)}
									>
										Delete Lead
									</button>
								{/if}
							</div>
						</div>
					</li>
				{/each}
				{#if leads.length > 5}
					<div class="view-more">
						<p><strong>Showing 5 of {leads.length} leads.</strong> <a href="/business/{businessSlug}/crm">View all leads in CRM</a></p>
					</div>
				{/if}
			{:else}
				<!-- Display dummy test lead when no leads exist -->
				<li class="dummy-lead">
					<div class="lead-header">
						<h3>
							{dummyLead.name} <span class="tag-dummy">Test Lead</span>
						</h3>
					</div>
					<div class="lead-details">
						<p><strong>Received:</strong> <span class="time-stamp {getRelativeTime(dummyLead.received_at).class}">{getRelativeTime(dummyLead.received_at).text}</span></p>
						<p><strong>Phone:</strong> {dummyLead.phone}</p>
						<p><strong>Email:</strong> {dummyLead.email}</p>
						<p><strong>Pin Code:</strong> {dummyLead.pin_code}</p>
						<p><strong>Type:</strong> {dummyLead.type}</p>
						<p><strong>Customer Comment:</strong> {dummyLead.comment}</p>
					</div>
				</li>
			{/if}
		</ul>

		<!-- Open CRM Button -->
		<div class="crm-button-container">
			<a href="/business/{businessSlug}/crm" class="open-crm-button">
				Open CRM
			</a>
		</div>
	{/if}
</section>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && leadToDelete}
	<div class="modal-overlay">
		<div class="modal-content">
			<div class="modal-header">
				<h3>Confirm Delete</h3>
			</div>
			<div class="modal-body">
				<p>Are you sure you want to delete the lead for <strong>{leadToDelete.name}</strong>?</p>
			</div>
			<div class="modal-actions">
				<button class="cancel-button" on:click={cancelDelete} disabled={isDeleting}>Cancel</button>
				<button class="confirm-delete-button" on:click={confirmDelete} disabled={isDeleting}>
					{isDeleting ? 'Deleting...' : 'Delete Lead'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Lead data section */
	#lead-data h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: left;
		color: var(--accent-color);
	}

	#lead-data ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
	}

	#lead-data li {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	:global(.light) #lead-data li {
		background-color: #fff;
		border: 1px solid var(--border-color-light);
	}

	:global(.dark) #lead-data li {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.lead-header h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
	}

	/* Time stamp styling */
	.time-stamp {
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.time-stamp.time-fresh {
		color: #2e7d32;
		background-color: rgba(46, 125, 50, 0.1);
	}

	.time-stamp.time-recent {
		color: #f57c00;
		background-color: rgba(245, 124, 0, 0.1);
	}

	.time-stamp.time-old {
		color: #d32f2f;
		background-color: rgba(211, 47, 47, 0.1);
	}

	:global(.dark) .time-stamp.time-fresh {
		color: #66bb6a;
		background-color: rgba(102, 187, 106, 0.15);
	}

	:global(.dark) .time-stamp.time-recent {
		color: #ffb74d;
		background-color: rgba(255, 183, 77, 0.15);
	}

	:global(.dark) .time-stamp.time-old {
		color: #ef5350;
		background-color: rgba(239, 83, 80, 0.15);
	}

	.lead-details p {
		margin: 0.25rem 0;
	}

	.error-message {
		color: red;
		font-weight: bold;
	}

	/* Tags */
	.tag,
	.tag-dummy {
		color: white;
		font-size: 0.8rem;
		padding: 0.2rem 0.5rem;
		border-radius: 5px;
		margin-left: 0.5rem;
		font-weight: bold;
	}

	.exclusive {
		background-color: #008000;
	}

	.non-exclusive {
		background-color: #ff9800;
	}

	.non-exclusive-claimed {
		background-color: #007bff;
	}

	.tag-dummy {
		background-color: #ffcc80;
		color: #333;
	}

	/* Dummy lead styling */
	.dummy-lead {
		opacity: 0.7;
		border: 2px dashed var(--border-color-light);
	}

	:global(.dark) .dummy-lead {
		border: 2px dashed var(--border-color-dark);
	}

	/* Button container and buttons */
	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 10px;
	}

	.update-button {
		background-color: var(--accent-color);
		color: white;
	}

	.update-button:hover {
		background-color: var(--accent-hover);
	}

	.claim-button {
		background-color: var(--success-color);
		color: white;
		font-weight: 600;
		border: 2px solid var(--success-color);
		box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
		padding: 0.575rem 1.15rem;
		font-size: 1.05rem;
	}

	.claim-button:hover {
		background-color: var(--success-hover);
		border-color: var(--success-hover);
		box-shadow: 0 2px 6px rgba(40, 167, 69, 0.3);
	}

	.claim-button:disabled {
		background-color: #9ca3af;
		border-color: #9ca3af;
		box-shadow: none;
		cursor: not-allowed;
	}

	.delete-button {
		background-color: #dc3545;
		color: white;
		font-weight: 600;
		border: 2px solid #dc3545;
		box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
		padding: 0.575rem 1.15rem;
		font-size: 1.05rem;
		border-radius: 5px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.delete-button:hover {
		background-color: #c82333;
		border-color: #c82333;
		box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
	}

	.claimed-text {
		font-weight: bold;
		color: var(--success-color);
		padding: 5px;
	}

	/* Solarvipani.com Comment styling */
	.sv-comment {
		margin: 0.75rem 0 !important;
		font-style: italic;
		color: #0056b3;
		background-color: rgba(0, 86, 179, 0.08);
		padding: 0.75rem;
		border-radius: 6px;
		border-left: 4px solid #0056b3;
		position: relative;
		z-index: 1;
		clear: both;
		display: block;
		width: 100%;
		box-sizing: border-box;
	}

	:global(.dark) .sv-comment {
		color: #64b5f6;
		background-color: rgba(100, 181, 246, 0.1);
		border-left-color: #64b5f6;
	}

	/* Stage update section styling */
	.stage-update-section {
		display: flex;
		gap: 1rem;
		margin: 1rem 0;
		align-items: center;
		flex-wrap: wrap;
	}

	.stage-controls,
	.status-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stage-controls label,
	.status-controls label {
		font-weight: 600;
		white-space: nowrap;
	}

	.stage-controls select,
	.status-controls select {
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--border-color-light);
		border-radius: 4px;
		background-color: #fff;
		font-size: 0.9rem;
		min-width: 120px;
		width: 100%;
		max-width: 200px;
	}

	:global(.dark) .stage-controls select,
	:global(.dark) .status-controls select {
		background-color: #333;
		border-color: var(--border-color-dark);
		color: var(--dark-primary-text-color);
	}

	@media (max-width: 768px) {
		.stage-update-section {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		.stage-controls,
		.status-controls {
			justify-content: space-between;
		}

		.stage-controls select,
		.status-controls select {
			min-width: 0;
			flex: 1;
			max-width: none;
		}
	}

	@media (max-width: 480px) {
		.stage-controls label,
		.status-controls label {
			white-space: normal;
			word-break: break-word;
		}

		.stage-controls select,
		.status-controls select {
			padding: 0.3rem 0.5rem;
			font-size: 0.85rem;
		}
	}

	/* Next Action styling */
	.next-action {
		margin: 1rem 0;
		padding: 1rem;
		background-color: rgba(0, 86, 179, 0.08);
		border: 1px solid rgba(0, 86, 179, 0.2);
		border-left: 4px solid #0056b3;
		border-radius: 6px;
		font-size: 0.95rem;
		display: block;
		width: 100%;
		box-sizing: border-box;
	}

	.next-action strong {
		color: #0056b3;
		font-weight: 600;
	}

	.action-text {
		color: #333;
		font-style: italic;
		line-height: 1.4;
	}

	:global(.dark) .next-action {
		background-color: rgba(100, 181, 246, 0.1);
		border-left-color: #64b5f6;
	}

	:global(.dark) .next-action strong {
		color: #64b5f6;
	}

	:global(.dark) .action-text {
		color: var(--dark-primary-text-color);
	}

	/* View more styling */
	.view-more {
		text-align: center;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 8px;
		background-color: rgba(0, 86, 179, 0.05);
		border: 1px solid rgba(0, 86, 179, 0.2);
	}

	.view-more p {
		margin: 0;
		color: #0056b3;
	}

	.view-more a {
		color: #0056b3;
		text-decoration: underline;
		font-weight: 600;
	}

	.view-more a:hover {
		color: #00449e;
	}

	:global(.dark) .view-more {
		background-color: rgba(100, 181, 246, 0.1);
		border-color: rgba(100, 181, 246, 0.2);
	}

	:global(.dark) .view-more p,
	:global(.dark) .view-more a {
		color: #64b5f6;
	}

	:global(.dark) .view-more a:hover {
		color: #42a5f5;
	}

	/* Open CRM Button styling */
	.crm-button-container {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 2px solid rgba(0, 86, 179, 0.1);
	}

	.open-crm-button {
		background-color: var(--accent-color);
		color: white;
		text-decoration: none;
		padding: 0.75rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1.1rem;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 86, 179, 0.2);
		border: 2px solid var(--accent-color);
		display: inline-block;
		text-align: center;
		min-width: 120px;
	}

	.open-crm-button:hover {
		background-color: var(--accent-hover);
		border-color: var(--accent-hover);
		box-shadow: 0 4px 8px rgba(0, 86, 179, 0.3);
		transform: translateY(-1px);
	}

	:global(.dark) .crm-button-container {
		border-top-color: rgba(100, 181, 246, 0.2);
	}

	/* Additional mobile overflow fixes */
	@media (max-width: 480px) {
		#lead-data li {
			padding: 1rem;
			margin-bottom: 1rem;
		}

		.lead-details p {
			word-break: break-all;
		}

		.claim-button,
		.update-button {
			white-space: normal;
			word-break: break-word;
			min-width: 0;
		}

		.next-action {
			padding: 0.75rem;
			font-size: 0.9rem;
		}
	}

	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		max-width: 400px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid #e9ecef;
	}

	.modal-header h3 {
		margin: 0;
		color: #333;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.modal-body {
		padding: 1rem 1.5rem;
	}

	.modal-body p {
		margin: 0 0 1rem;
		line-height: 1.5;
	}

	.modal-body p:last-child {
		margin-bottom: 0;
	}

	.modal-body small {
		color: #6c757d;
		font-style: italic;
	}

	.modal-actions {
		padding: 1rem 1.5rem 1.5rem;
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		border-top: 1px solid #e9ecef;
	}

	.cancel-button {
		background-color: #6c757d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.3s ease;
	}

	.cancel-button:hover {
		background-color: #5a6268;
	}

	.confirm-delete-button {
		background-color: #dc3545;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.3s ease;
	}

	.confirm-delete-button:hover {
		background-color: #c82333;
	}

	.confirm-delete-button:disabled,
	.cancel-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.confirm-delete-button:disabled:hover,
	.cancel-button:disabled:hover {
		background-color: #9ca3af;
	}

	/* Dark mode modal styles */
	:global(.dark) .modal-content {
		background: #333;
		color: var(--dark-primary-text-color);
	}

	:global(.dark) .modal-header {
		border-bottom-color: #444;
	}

	:global(.dark) .modal-header h3 {
		color: var(--dark-primary-text-color);
	}

	:global(.dark) .modal-actions {
		border-top-color: #444;
	}

	:global(.dark) .modal-body small {
		color: #adb5bd;
	}

	/* Mobile modal responsiveness */
	@media (max-width: 480px) {
		.modal-content {
			margin: 1rem;
		}

		.modal-header,
		.modal-body,
		.modal-actions {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.modal-actions {
			flex-direction: column;
		}

		.modal-actions button {
			width: 100%;
		}
	}
</style>