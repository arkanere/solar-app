<script>
	import { createEventDispatcher } from 'svelte';
	import LeadProgressBar from './LeadProgressBar.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import LeadTile from './LeadTile.svelte';

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

	// Proposal modal state
	let showProposalModal = false;
	let selectedLeadForProposal = null;

	// Function to make call
	function makeCall(phoneNumber, leadName, leadId) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`dashboard-home-call-now-button-${leadId}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

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

	async function updateLead(lead, updateFields = {}) {
		try {
			const response = await fetch('/in/api/updateLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: lead.id,
					stage: updateFields.stage !== undefined ? Number(updateFields.stage) : Number(lead.stage),
					status: updateFields.status !== undefined ? updateFields.status : lead.status,
					business_notes: updateFields.business_notes !== undefined ? updateFields.business_notes : lead.business_notes
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

	// State for tracking save status per lead
	let savingNotes = new Set();
	let savedNotes = new Set();

	// State for tracking expanded/collapsed leads (compact view)
	let expandedLeads = new Set();

	// Function to save business notes
	async function saveBusinessNotes(lead) {
		savingNotes.add(lead.id);
		savingNotes = savingNotes; // Trigger reactivity

		await updateLead(lead, { business_notes: lead.business_notes });

		savingNotes.delete(lead.id);
		savingNotes = savingNotes; // Trigger reactivity

		// Show saved status
		savedNotes.add(lead.id);
		savedNotes = savedNotes; // Trigger reactivity

		// Hide saved status after 3 seconds
		setTimeout(() => {
			savedNotes.delete(lead.id);
			savedNotes = savedNotes; // Trigger reactivity
		}, 3000);
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
			const response = await fetch('/in/api/deleteLeadByBusiness', {
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

	// Open proposal modal
	function openProposalModal(lead) {
		selectedLeadForProposal = {
			customer_name: lead.name,
			phone_number: lead.phone,
			email: lead.email,
			address: lead.address || '',
			lead_id: lead.id
		};
		showProposalModal = true;
	}

	// Close proposal modal
	function closeProposalModal() {
		showProposalModal = false;
		selectedLeadForProposal = null;
	}

	// Handle proposal generated/updated
	function handleProposalGenerated() {
		// Optionally refresh leads or show success message
		closeProposalModal();
	}

	// Toggle lead details expand/collapse
	function toggleLeadDetails(leadId) {
		if (expandedLeads.has(leadId)) {
			expandedLeads.delete(leadId);
		} else {
			expandedLeads.add(leadId);
		}
		expandedLeads = expandedLeads; // Trigger reactivity
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
					<LeadTile
						{lead}
						{businessInfo}
						{isClaiming}
						{savingNotes}
						{savedNotes}
						{expandedLeads}
						{STAGES}
						{NON_EXCLUSIVE_CLAIMED_STAGES}
						{makeCall}
						{saveBusinessNotes}
						{updateLead}
						{getRelativeTime}
						{getNextAction}
						{openProposalModal}
						{showDeleteConfirmation}
						{claimLead}
						on:toggleDetails={(e) => toggleLeadDetails(e.detail.leadId)}
					/>
				{/each}
				{#if leads.length > 5}
					<div class="view-more">
						<p><strong>Showing 5 of {leads.length} leads.</strong> <a href="/in/{businessSlug}/crm">View all leads in CRM</a></p>
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
						<div class="phone-section">
							<p><strong>Phone:</strong> {dummyLead.phone}</p>
							<button
								class="call-now-button"
								disabled
								title="Test lead - calling disabled"
							>
								<span class="button-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
										></path>
									</svg>
								</span>
								<span>CALL NOW</span>
							</button>
						</div>
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
			<a href="/in/{businessSlug}/crm" class="open-crm-button">
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

<!-- Proposal Modal -->
{#if showProposalModal}
	<ProposalFormModal
		show={showProposalModal}
		business={businessInfo}
		proposal={selectedLeadForProposal}
		on:close={closeProposalModal}
		on:generated={handleProposalGenerated}
	/>
{/if}

<style>
	/* ========================================
	   DESIGN SYSTEM - SEMANTIC COLORS
	   ======================================== */
	:root {
		/* Primary Actions */
		--color-primary: #2563EB;
		--color-primary-hover: #1D4ED8;
		--color-primary-active: #1E40AF;

		/* Success/Active */
		--color-success: #059669;
		--color-success-hover: #047857;
		--color-success-bg: #F0FDF4;

		/* Warning */
		--color-warning: #D97706;
		--color-warning-bg: #FEF3C7;

		/* Danger */
		--color-danger: #DC2626;
		--color-danger-hover: #B91C1C;

		/* Neutral */
		--color-gray-50: #F9FAFB;
		--color-gray-100: #F3F4F6;
		--color-gray-200: #E5E7EB;
		--color-gray-300: #D1D5DB;
		--color-gray-400: #9CA3AF;
		--color-gray-500: #6B7280;
		--color-gray-600: #475569;
		--color-gray-700: #374151;
		--color-gray-800: #1F2937;
		--color-gray-900: #111827;

		/* Spacing (8px base) */
		--spacing-1: 8px;
		--spacing-2: 12px;
		--spacing-3: 16px;
		--spacing-4: 20px;
		--spacing-5: 24px;
		--spacing-6: 32px;
	}

	/* ========================================
	   LEAD CARD CONTAINER
	   ======================================== */
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
		max-width: 900px;
		margin: 0 auto;
	}

	#lead-data li {
		margin-bottom: var(--spacing-5);
		padding: 0;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
		word-wrap: break-word;
		overflow-wrap: break-word;
		transition: box-shadow 0.2s ease;
		overflow: hidden;
	}

	#lead-data li:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
	}

	:global(.light) #lead-data li {
		background-color: #FFFFFF;
		border: 1px solid var(--color-gray-200);
	}

	:global(.dark) #lead-data li {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	/* ========================================
	   HEADER SECTION - Identity & Status
	   ======================================== */
	.lead-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-5) var(--spacing-5) var(--spacing-2);
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .lead-header {
		border-bottom-color: #444;
	}

	.lead-header h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		color: var(--color-gray-900);
		line-height: 1.3;
	}

	:global(.dark) .lead-header h3 {
		color: var(--dark-primary-text-color);
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 6px;
		white-space: nowrap;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.status-exclusive {
		background-color: #ECFDF5;
		color: var(--color-success);
		border: 1px solid #A7F3D0;
	}

	.status-exclusive .status-dot {
		background-color: var(--color-success);
	}

	.status-claimed {
		background-color: #EFF6FF;
		color: var(--color-primary);
		border: 1px solid #BFDBFE;
	}

	.status-claimed .status-dot {
		background-color: var(--color-primary);
	}

	.status-available {
		background-color: #FEF3C7;
		color: var(--color-warning);
		border: 1px solid #FDE68A;
	}

	.status-available .status-dot {
		background-color: var(--color-warning);
	}

	.received-time {
		padding: 0 var(--spacing-5) var(--spacing-3);
		margin: 0;
		font-size: 12px;
		color: var(--color-gray-500);
	}

	:global(.dark) .received-time {
		color: #9ca3af;
	}

	/* ========================================
	   CONTACT ACTION BAR
	   ======================================== */
	.contact-action-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-3);
		padding: var(--spacing-3) var(--spacing-5);
		background-color: var(--color-gray-50);
		border-bottom: 1px solid var(--color-gray-200);
		flex-wrap: wrap;
	}

	:global(.dark) .contact-action-bar {
		background-color: #2a2a2a;
		border-bottom-color: #444;
	}

	.contact-info-row {
		display: flex;
		gap: var(--spacing-4);
		flex-wrap: wrap;
		flex: 1;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: var(--color-gray-700);
	}

	:global(.dark) .contact-item {
		color: var(--dark-primary-text-color);
	}

	.contact-item svg {
		color: var(--color-gray-500);
		flex-shrink: 0;
	}

	:global(.dark) .contact-item svg {
		color: #9ca3af;
	}

	.contact-value {
		font-weight: 500;
		color: var(--color-gray-900);
	}

	:global(.dark) .contact-value {
		color: var(--dark-primary-text-color);
	}

	.email-link {
		color: var(--color-primary);
		text-decoration: none;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	.call-now-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		font-size: 14px;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--color-primary);
		color: white;
		box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
	}

	.call-now-button:hover {
		background-color: var(--color-primary-hover);
		box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
		transform: translateY(-1px);
	}

	.call-now-button:active {
		transform: translateY(0);
	}

	.call-now-button svg {
		width: 16px;
		height: 16px;
	}

	@media (max-width: 640px) {
		.contact-action-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.contact-info-row {
			flex-direction: column;
			gap: var(--spacing-2);
		}

		.call-now-button {
			width: 100%;
			justify-content: center;
		}
	}

	/* ========================================
	   LEAD INFORMATION SECTION
	   ======================================== */
	.lead-info-section {
		padding: var(--spacing-4) var(--spacing-5);
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .lead-info-section {
		border-bottom-color: #444;
	}

	.section-header {
		margin: 0 0 var(--spacing-2) 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-gray-700);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global(.dark) .section-header {
		color: #d1d5db;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-3);
		margin-top: var(--spacing-3);
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.info-item-full {
		grid-column: 1 / -1;
	}

	.info-label {
		font-size: 12px;
		font-weight: 500;
		color: var(--color-gray-500);
	}

	:global(.dark) .info-label {
		color: #9ca3af;
	}

	.info-value {
		font-size: 14px;
		font-weight: 600;
		color: var(--color-gray-900);
	}

	:global(.dark) .info-value {
		color: var(--dark-primary-text-color);
	}

	.sv-comment {
		margin-top: var(--spacing-3);
		padding: var(--spacing-2);
		background-color: #EFF6FF;
		border-left: 3px solid var(--color-primary);
		border-radius: 4px;
		font-size: 13px;
		color: var(--color-gray-700);
	}

	:global(.dark) .sv-comment {
		background-color: rgba(59, 130, 246, 0.1);
		color: #d1d5db;
	}

	@media (max-width: 640px) {
		.info-grid {
			grid-template-columns: 1fr;
		}

		.info-item-full {
			grid-column: 1;
		}
	}

	/* ========================================
	   WORKFLOW SECTION - Progress & Stage
	   ======================================== */
	.workflow-section {
		padding: var(--spacing-4) var(--spacing-5);
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .workflow-section {
		border-bottom-color: #444;
	}

	.stage-status-controls {
		display: flex;
		gap: var(--spacing-3);
		margin-top: var(--spacing-3);
		margin-bottom: var(--spacing-4);
		flex-wrap: wrap;
	}

	.control-group {
		flex: 1;
		min-width: 140px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.control-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-gray-700);
	}

	:global(.dark) .control-label {
		color: #d1d5db;
	}

	.control-select {
		padding: 10px 12px;
		border: 1px solid var(--color-gray-300);
		border-radius: 6px;
		background-color: white;
		font-size: 14px;
		font-weight: 500;
		color: var(--color-gray-900);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.control-select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	:global(.dark) .control-select {
		background-color: #2a2a2a;
		border-color: #444;
		color: var(--dark-primary-text-color);
	}

	@media (max-width: 640px) {
		.stage-status-controls {
			flex-direction: column;
		}

		.control-group {
			min-width: 100%;
		}
	}

	/* ========================================
	   NOTES SECTION - Collapsible
	   ======================================== */
	.notes-section {
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .notes-section {
		border-bottom-color: #444;
	}

	.notes-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: var(--spacing-3) var(--spacing-5);
		background: none;
		border: none;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-gray-700);
		text-align: left;
		transition: background-color 0.2s ease;
	}

	.notes-header:hover {
		background-color: var(--color-gray-50);
	}

	:global(.dark) .notes-header {
		color: #d1d5db;
	}

	:global(.dark) .notes-header:hover {
		background-color: #2a2a2a;
	}

	.collapse-icon {
		transition: transform 0.2s ease;
		color: var(--color-gray-500);
	}

	.collapse-icon.expanded {
		transform: rotate(90deg);
	}

	.notes-indicator {
		margin-left: auto;
		color: var(--color-primary);
		font-size: 18px;
	}

	.notes-content {
		padding: 0 var(--spacing-5) var(--spacing-3);
	}

	.notes-content textarea {
		width: 100%;
		padding: var(--spacing-2);
		border: 1px solid var(--color-gray-300);
		border-radius: 6px;
		font-size: 14px;
		font-family: inherit;
		resize: vertical;
		min-height: 80px;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
	}

	.notes-content textarea:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	:global(.dark) .notes-content textarea {
		background-color: #2a2a2a;
		border-color: #444;
		color: var(--dark-primary-text-color);
	}

	.notes-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-top: var(--spacing-2);
	}

	.save-button {
		background-color: var(--color-gray-600);
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 13px;
		transition: all 0.2s ease;
	}

	.save-button:hover {
		background-color: var(--color-gray-700);
	}

	.save-button:disabled {
		background-color: var(--color-gray-400);
		cursor: not-allowed;
	}

	.save-success {
		color: var(--color-success);
		font-weight: 600;
		font-size: 13px;
	}

	/* ========================================
	   ACTION FOOTER - Next Steps & Buttons
	   ======================================== */
	.action-footer {
		padding: var(--spacing-4) var(--spacing-5);
		background-color: var(--color-gray-50);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-3);
		flex-wrap: wrap;
	}

	:global(.dark) .action-footer {
		background-color: #2a2a2a;
	}

	.action-hint {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		flex: 1;
		font-size: 13px;
		color: var(--color-gray-700);
	}

	:global(.dark) .action-hint {
		color: #d1d5db;
	}

	.action-hint svg {
		color: var(--color-primary);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.action-text {
		line-height: 1.5;
	}

	.primary-action-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		font-size: 14px;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--color-primary);
		color: white;
		box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
	}

	.primary-action-button:hover {
		background-color: var(--color-primary-hover);
		box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
		transform: translateY(-1px);
	}

	.primary-action-button:active {
		transform: translateY(0);
	}

	.claim-button {
		background-color: var(--color-success);
		color: white;
		font-weight: 600;
		border: none;
		box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
		padding: 12px 24px;
		font-size: 14px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.claim-button:hover {
		background-color: var(--color-success-hover);
		box-shadow: 0 4px 6px rgba(5, 150, 105, 0.4);
		transform: translateY(-1px);
	}

	.claim-button:disabled {
		background-color: var(--color-gray-400);
		cursor: not-allowed;
		box-shadow: none;
		transform: none;
	}

	.delete-button {
		background-color: var(--color-danger);
		color: white;
		font-weight: 600;
		border: none;
		box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
		padding: 10px 20px;
		font-size: 14px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.delete-button:hover {
		background-color: var(--color-danger-hover);
		box-shadow: 0 4px 6px rgba(220, 38, 38, 0.4);
	}

	.claimed-text {
		font-weight: 600;
		color: var(--color-gray-600);
		font-size: 14px;
	}

	@media (max-width: 640px) {
		.action-footer {
			flex-direction: column;
			align-items: stretch;
		}

		.primary-action-button,
		.claim-button,
		.delete-button {
			width: 100%;
			justify-content: center;
		}
	}

	/* ========================================
	   DUMMY LEAD & UTILITY STYLES
	   ======================================== */
	.dummy-lead {
		opacity: 0.7;
		border: 2px dashed var(--border-color-light);
	}

	:global(.dark) .dummy-lead {
		border: 2px dashed var(--border-color-dark);
	}

	.error-message {
		color: var(--color-danger);
		font-weight: 600;
		padding: var(--spacing-3);
	}

	/* View more styling */
	.view-more {
		text-align: center;
		padding: var(--spacing-3);
		margin: var(--spacing-4) 0;
		border-radius: 8px;
		background-color: #EFF6FF;
		border: 1px solid #BFDBFE;
	}

	.view-more p {
		margin: 0;
		color: var(--color-primary);
		font-size: 14px;
	}

	.view-more a {
		color: var(--color-primary);
		text-decoration: underline;
		font-weight: 600;
	}

	.view-more a:hover {
		color: var(--color-primary-hover);
	}

	:global(.dark) .view-more {
		background-color: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.2);
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
		margin-top: var(--spacing-5);
		padding-top: var(--spacing-4);
		border-top: 2px solid var(--color-gray-200);
	}

	.open-crm-button {
		background-color: var(--color-primary);
		color: white;
		text-decoration: none;
		padding: 12px 32px;
		border-radius: 8px;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
		display: inline-block;
		text-align: center;
		min-width: 120px;
	}

	.open-crm-button:hover {
		background-color: var(--color-primary-hover);
		box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
		transform: translateY(-1px);
	}

	:global(.dark) .crm-button-container {
		border-top-color: #444;
	}

	/* Additional mobile overflow fixes */
	@media (max-width: 480px) {
		.lead-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-2);
		}

		.status-badge {
			align-self: flex-start;
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