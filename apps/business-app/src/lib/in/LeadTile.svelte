<script>
	import { createEventDispatcher } from 'svelte';
	import LeadProgressBar from './LeadProgressBar.svelte';

	export let lead;
	export let businessInfo;
	export let isClaiming = false;
	export let savingNotes = new Set();
	export let savedNotes = new Set();
	export let expandedLeads = new Set();
	export let STAGES = {};
	export let NON_EXCLUSIVE_CLAIMED_STAGES = {};

	const dispatch = createEventDispatcher();

	// Functions
	export let makeCall = () => {};
	export let saveBusinessNotes = () => {};
	export let updateLead = () => {};
	export let getRelativeTime = () => {};
	export let getNextAction = () => {};
	export let openProposalModal = () => {};
	export let showDeleteConfirmation = () => {};
	export let claimLead = () => {};

	$: collapsedNotes = lead.collapsedNotes !== false;
	$: isExpanded = expandedLeads.has(lead.id);
	$: nextAction = getNextAction(lead.stage, lead.category, lead.status);

	function toggleLeadDetails() {
		dispatch('toggleDetails', { leadId: lead.id });
	}
</script>

<li>
	<!-- HEADER SECTION - Identity & Status -->
	<div class="lead-header">
		<h3>{lead.name}</h3>
		<span
			class="status-badge status-{lead.category === 1
				? 'available'
				: lead.category === 2
					? 'claimed'
					: 'exclusive'}"
		>
			<span class="status-dot"></span>
			{lead.category === 1
				? 'Non-Exclusive'
				: lead.category === 2
					? 'Non-Exclusive-Claimed'
					: 'Exclusive'}
		</span>
	</div>
	<p class="received-time">Received {getRelativeTime(lead.created_at).text}</p>

	<!-- COMPACT INFO GRID - Always Visible -->
	<div class="compact-info-grid">
		<div class="compact-info-item phone-item">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
			</svg>
			<span class="compact-info-value">{lead.phone}</span>
		</div>
		{#if lead.category !== 1}
			<button
				class="call-now-button-compact"
				on:click={() => makeCall(lead.phone, lead.name, lead.id)}
				title="Call {lead.name}"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
				</svg>
				Call Now
			</button>
		{/if}
		<div class="compact-info-item">
			<span class="compact-info-label">Customer Comment:</span>
			<span class="compact-info-value">{lead.comment}</span>
		</div>
		<div class="compact-info-item">
			<span class="compact-info-label">Location:</span>
			<span class="compact-info-value">{lead.pin_code}</span>
		</div>
		{#if lead.category !== 1}
			<div class="compact-info-item">
				<span class="compact-info-label">Stage:</span>
				<span class="compact-info-value">
					{lead.category === 2 ? NON_EXCLUSIVE_CLAIMED_STAGES[lead.stage] : STAGES[lead.stage]}
				</span>
			</div>
		{/if}
	</div>

	<!-- TOGGLE BUTTON -->
	<button
		class="toggle-details-button"
		on:click={toggleLeadDetails}
		aria-expanded={isExpanded}
		aria-controls="details-{lead.id}"
		type="button"
	>
		<svg class="toggle-icon {isExpanded ? 'expanded' : ''}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
		<span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
	</button>

	<!-- EXPANDABLE DETAILS SECTION -->
	{#if isExpanded}
		<div class="details-section" id="details-{lead.id}">
			<!-- EMAIL ADDRESS -->
			{#if lead.email}
				<div class="detail-item email-detail">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
						<polyline points="22,6 12,13 2,6"></polyline>
					</svg>
					<a href="mailto:{lead.email}" class="detail-value email-link">{lead.email}</a>
				</div>
			{/if}

			<!-- PROPERTY TYPE -->
			{#if lead.type}
				<div class="detail-item">
					<span class="detail-label">Property Type:</span>
					<span class="detail-value">{lead.type}</span>
				</div>
			{/if}

			<!-- SOLAR VIPANI NOTES -->
			{#if lead.sv_comment_for_businesses}
				<div class="sv-comment">
					<strong>Solar Vipani Note:</strong> {lead.sv_comment_for_businesses}
				</div>
			{/if}

	{#if lead.category !== 1}
		<!-- WORKFLOW SECTION - Progress & Stage -->
		<div class="workflow-section">
			<h4 class="section-header">Workflow</h4>
			<div class="stage-status-controls">
				<div class="control-group">
					<label for="stage-{lead.id}" class="control-label">Current Stage</label>
					<select
						id="stage-{lead.id}"
						class="control-select"
						bind:value={lead.stage}
						on:change={() => updateLead(lead, { stage: lead.stage })}
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

				<div class="control-group">
					<label for="status-{lead.id}" class="control-label">Lead Status</label>
					<select
						id="status-{lead.id}"
						class="control-select"
						bind:value={lead.status}
						on:change={() => updateLead(lead, { status: lead.status })}
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
		</div>

		<!-- NOTES SECTION -->
		<div class="notes-section">
			<button
				class="notes-header"
				on:click={() => lead.collapsedNotes = !collapsedNotes}
				type="button"
			>
				<svg class="collapse-icon {collapsedNotes ? '' : 'expanded'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
				<span>Internal Notes</span>
				{#if lead.business_notes}
					<span class="notes-indicator">•</span>
				{/if}
			</button>
			{#if !collapsedNotes}
				<div class="notes-content">
					<textarea
						id="business-notes-{lead.id}"
						bind:value={lead.business_notes}
						placeholder="Add your private notes about this lead..."
						rows="3"
						disabled={savingNotes.has(lead.id)}
					></textarea>
					<div class="notes-actions">
						<button
							class="save-button"
							on:click={() => saveBusinessNotes(lead)}
							disabled={savingNotes.has(lead.id)}
						>
							{#if savingNotes.has(lead.id)}
								Saving...
							{:else}
								Save
							{/if}
						</button>
						{#if savedNotes.has(lead.id)}
							<span class="save-success">✓ Saved</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- NEXT STEP HINT (inside expandable section) -->
		{#if nextAction}
			<div class="next-step-hint">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line>
				</svg>
				<span class="action-text"><strong>Next Step:</strong> {nextAction}</span>
			</div>
		{/if}
	{/if}
		</div>
	{/if}

	<!-- ACTION BUTTONS - Always Visible -->
	{#if lead.category !== 1}
		{#if lead.stage === 1 && lead.status}
			<div class="action-footer">
				<button
					class="primary-action-button"
					on:click={() => openProposalModal(lead)}
				>
					Generate Proposal
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</button>
			</div>
		{:else if !lead.status}
			<div class="action-footer">
				<button
					class="delete-button"
					on:click={() => showDeleteConfirmation(lead)}
				>
					Delete Lead
				</button>
			</div>
		{/if}
	{:else}
		<!-- CLAIM BUTTON FOR NON-EXCLUSIVE AVAILABLE LEADS -->
		<div class="action-footer">
			{#if lead.claim_count > 4}
				<p class="claimed-text">Not Available. Claimed by Other Business</p>
			{:else}
				<button
					class="claim-button"
					on:click={() => claimLead(lead.id, businessInfo.id)}
					disabled={isClaiming}
				>
					{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
				</button>
			{/if}
		</div>
	{/if}
</li>

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

	li {
		margin-bottom: var(--spacing-6);
		padding: 0;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
		word-wrap: break-word;
		overflow-wrap: break-word;
		transition: all 0.2s ease;
		overflow: hidden;
		background-color: #FFFFFF;
		border: 2px solid #000000;
		list-style-type: none;
	}

	li:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
	}

	:global(.dark) li {
		background-color: #333;
		border: 2px solid #000000;
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
	   COMPACT INFO GRID
	   ======================================== */
	.compact-info-grid {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-5);
		background-color: var(--color-gray-50);
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .compact-info-grid {
		background-color: #2a2a2a;
		border-bottom-color: #444;
	}

	.compact-info-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--color-gray-700);
	}

	:global(.dark) .compact-info-item {
		color: var(--dark-primary-text-color);
	}

	.compact-info-item.phone-item {
		grid-column: 1;
		font-weight: 500;
	}

	.compact-info-item svg {
		color: var(--color-gray-500);
		flex-shrink: 0;
	}

	:global(.dark) .compact-info-item svg {
		color: #9ca3af;
	}

	.compact-info-label {
		font-weight: 600;
		color: var(--color-gray-600);
	}

	:global(.dark) .compact-info-label {
		color: #9ca3af;
	}

	.compact-info-value {
		font-weight: 500;
		color: var(--color-gray-900);
	}

	:global(.dark) .compact-info-value {
		color: var(--dark-primary-text-color);
	}

	.call-now-button-compact {
		grid-column: 2;
		grid-row: 1 / span 3;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--color-primary);
		color: white;
		box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
		white-space: nowrap;
	}

	.call-now-button-compact:hover {
		background-color: var(--color-primary-hover);
		box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
		transform: translateY(-1px);
	}

	.call-now-button-compact:active {
		transform: translateY(0);
	}

	.call-now-button-compact svg {
		width: 16px;
		height: 16px;
	}

	@media (max-width: 640px) {
		.compact-info-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-2);
		}

		.compact-info-item.phone-item {
			grid-column: 1;
		}

		.call-now-button-compact {
			grid-column: 1;
			grid-row: auto;
			width: 100%;
		}
	}

	/* ========================================
	   TOGGLE DETAILS BUTTON
	   ======================================== */
	.toggle-details-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: var(--spacing-2) var(--spacing-3);
		background: none;
		border: none;
		border-top: 1px solid var(--color-gray-200);
		border-bottom: 1px solid var(--color-gray-200);
		cursor: pointer;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-gray-600);
		transition: all 0.2s ease;
	}

	.toggle-details-button:hover {
		background-color: var(--color-gray-50);
		color: var(--color-gray-800);
	}

	:global(.dark) .toggle-details-button {
		border-top-color: #444;
		border-bottom-color: #444;
		color: #9ca3af;
	}

	:global(.dark) .toggle-details-button:hover {
		background-color: #2a2a2a;
		color: #d1d5db;
	}

	.toggle-icon {
		transition: transform 0.2s ease;
		color: var(--color-gray-500);
	}

	.toggle-icon.expanded {
		transform: rotate(180deg);
	}

	/* ========================================
	   EXPANDABLE DETAILS SECTION
	   ======================================== */
	.details-section {
		padding: var(--spacing-4) var(--spacing-5);
		background-color: #FAFBFC;
		border-bottom: 1px solid var(--color-gray-200);
		animation: expandDetails 0.3s ease;
	}

	:global(.dark) .details-section {
		background-color: #252525;
		border-bottom-color: #444;
	}

	@keyframes expandDetails {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 1000px;
		}
	}

	.detail-item {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: var(--spacing-2);
		font-size: 13px;
	}

	.detail-item.email-detail {
		align-items: center;
		padding: var(--spacing-2);
		background-color: white;
		border-radius: 6px;
		border: 1px solid var(--color-gray-200);
	}

	:global(.dark) .detail-item.email-detail {
		background-color: #2a2a2a;
		border-color: #444;
	}

	.detail-item svg {
		color: var(--color-gray-500);
		flex-shrink: 0;
		margin-top: 2px;
	}

	:global(.dark) .detail-item svg {
		color: #9ca3af;
	}

	.detail-label {
		font-weight: 600;
		color: var(--color-gray-600);
	}

	:global(.dark) .detail-label {
		color: #9ca3af;
	}

	.detail-value {
		font-weight: 500;
		color: var(--color-gray-900);
	}

	:global(.dark) .detail-value {
		color: var(--dark-primary-text-color);
	}

	.email-link {
		color: var(--color-primary);
		text-decoration: none;
	}

	.email-link:hover {
		text-decoration: underline;
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

	.next-step-hint {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: var(--spacing-3);
		margin-top: var(--spacing-3);
		background-color: #EFF6FF;
		border-left: 3px solid var(--color-primary);
		border-radius: 4px;
		font-size: 13px;
		color: var(--color-gray-700);
	}

	:global(.dark) .next-step-hint {
		background-color: rgba(59, 130, 246, 0.1);
		color: #d1d5db;
	}

	.next-step-hint svg {
		color: var(--color-primary);
		flex-shrink: 0;
		margin-top: 2px;
	}

	/* ========================================
	   WORKFLOW SECTION
	   ======================================== */
	.workflow-section {
		padding: var(--spacing-4) var(--spacing-5);
		border-bottom: 1px solid var(--color-gray-200);
	}

	:global(.dark) .workflow-section {
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
	   NOTES SECTION
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
	   ACTION FOOTER
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
</style>
