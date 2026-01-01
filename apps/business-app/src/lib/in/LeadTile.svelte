<script lang="ts">
	import LeadProgressBar from './LeadProgressBar.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Select } from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { LeadStatusBadge } from '$lib/components/ui/lead-status-badge';
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';
	import {
		STAGES_MAP,
		NON_EXCLUSIVE_CLAIMED_STAGES_MAP,
		getStagesMapForCategory
	} from '$lib/constants/lead';

	let {
		lead,
		businessInfo,
		isClaiming = false,
		savingNotes = new Set(),
		savedNotes = new Set(),
		expandedLeads = new Set(),
		// Functions
		makeCall = () => {},
		saveBusinessNotes = () => {},
		updateLead = () => {},
		getRelativeTime = () => {},
		getNextAction = () => {},
		openProposalModal = () => {},
		showDeleteConfirmation = () => {},
		claimLead = () => {},
		onToggleDetails = () => {}
	} = $props();

	// Get appropriate stages based on lead category
	let stagesMap = $derived(getStagesMapForCategory(lead.category));

	let collapsedNotes = $derived(lead.collapsedNotes !== false);
	let isExpanded = $derived(expandedLeads.has(lead.id));
	let nextAction = $derived(getNextAction(lead.stage, lead.category, lead.status));

	function toggleLeadDetails() {
		onToggleDetails({ leadId: lead.id });
	}
</script>

<Card.Root class="mb-8 p-0 break-words transition-all duration-200 overflow-hidden list-none hover:shadow-md">
	<!-- HEADER SECTION - Identity & Status -->
	<Card.Header class="flex-row justify-between items-center py-5 pb-2 border-b max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3">
		<Card.Title class="text-lg font-bold text-foreground leading-tight">{lead.name}</Card.Title>
		<LeadStatusBadge category={lead.category} class="max-[480px]:self-start" />
	</Card.Header>
	<p class="px-6 pb-4 pt-0 m-0 text-xs text-muted-foreground">Received {getRelativeTime(lead.created_at).text}</p>

	<!-- COMPACT INFO GRID - Always Visible -->
	<Card.Content class="p-0">
	<div class="grid grid-cols-[1fr_auto] gap-3 p-4 px-6 bg-muted/50 dark:bg-background-tertiary border-b border-border max-sm:grid-cols-1">
		<div class="flex items-center gap-1.5 text-sm text-foreground-secondary font-medium col-span-1">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0">
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
			</svg>
			<span class="font-medium text-foreground">{lead.phone}</span>
		</div>
		{#if lead.category !== 1}
			<Button
				class="col-span-1 row-span-3 max-sm:col-span-1 max-sm:row-auto max-sm:w-full"
				onclick={() => makeCall(lead.phone, lead.name, lead.id)}
				title="Call {lead.name}"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
				</svg>
				Call Now
			</Button>
		{/if}
		<div class="flex items-center gap-1.5 text-sm text-foreground-secondary">
			<span class="font-semibold text-muted-foreground">Customer Comment:</span>
			<span class="font-medium text-foreground">{lead.comment}</span>
		</div>
		<div class="flex items-center gap-1.5 text-sm text-foreground-secondary">
			<span class="font-semibold text-muted-foreground">Location:</span>
			<span class="font-medium text-foreground">{lead.pin_code}</span>
		</div>
		{#if lead.category !== 1}
			<div class="flex items-center gap-1.5 text-sm text-foreground-secondary">
				<span class="font-semibold text-muted-foreground">Stage:</span>
				<span class="font-medium text-foreground">
					{stagesMap[lead.stage]}
				</span>
			</div>
		{/if}
	</div>

	<!-- TOGGLE BUTTON -->
	<Button
		variant="ghost"
		class="w-full rounded-none border-y border-border text-muted-foreground hover:text-foreground"
		onclick={toggleLeadDetails}
		aria-expanded={isExpanded}
		aria-controls="details-{lead.id}"
	>
		<svg class={cn("transition-transform duration-200", isExpanded && "rotate-180")} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
		<span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
	</Button>

	<!-- EXPANDABLE DETAILS SECTION -->
	{#if isExpanded}
		<div class="p-5 bg-background-secondary dark:bg-background-secondary border-b border-border animate-expand" id="details-{lead.id}">
			<!-- EMAIL ADDRESS -->
			{#if lead.email}
				<div class="flex items-center gap-2 mb-3 p-3 bg-card dark:bg-background-tertiary rounded-md border border-border text-sm">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
						<polyline points="22,6 12,13 2,6"></polyline>
					</svg>
					<a href="mailto:{lead.email}" class="font-medium text-accent no-underline hover:underline">{lead.email}</a>
				</div>
			{/if}

			<!-- PROPERTY TYPE -->
			{#if lead.type}
				<div class="flex items-start gap-2 mb-3 text-sm">
					<span class="font-semibold text-muted-foreground">Property Type:</span>
					<span class="font-medium text-foreground">{lead.type}</span>
				</div>
			{/if}

			<!-- SOLAR VIPANI NOTES -->
			{#if lead.sv_comment_for_businesses}
				<div class="mt-4 p-3 bg-accent-muted border-l-[3px] border-accent rounded text-sm text-foreground-secondary">
					<strong>Solar Vipani Note:</strong> {lead.sv_comment_for_businesses}
				</div>
			{/if}

	{#if lead.category !== 1}
		<!-- WORKFLOW SECTION - Progress & Stage -->
		<div class="p-5 border-b border-border">
			<h4 class="m-0 mb-3 text-sm font-semibold text-foreground-secondary uppercase tracking-wide">Workflow</h4>
			<div class="flex flex-wrap gap-4 mt-4 mb-5 max-sm:flex-col">
				<div class="flex-1 min-w-[140px] flex flex-col gap-1.5 max-sm:min-w-full">
					<Label for="stage-{lead.id}" class="text-xs font-semibold text-foreground-secondary">Current Stage</Label>
					<Select
						id="stage-{lead.id}"
						bind:value={lead.stage}
						onchange={() => updateLead(lead, { stage: lead.stage })}
					>
						{#each Object.entries(stagesMap).filter(([key]) => key !== 'all') as [value, label]}
							<option value={Number(value)}>{label}</option>
						{/each}
					</Select>
				</div>

				<div class="flex-1 min-w-[140px] flex flex-col gap-1.5 max-sm:min-w-full">
					<Label for="status-{lead.id}" class="text-xs font-semibold text-foreground-secondary">Lead Status</Label>
					<Select
						id="status-{lead.id}"
						bind:value={lead.status}
						onchange={() => updateLead(lead, { status: lead.status })}
					>
						<option value={true}>Active</option>
						<option value={false}>Inactive</option>
					</Select>
				</div>
			</div>

			<LeadProgressBar
				currentStage={lead.stage}
				leadCategory={lead.category}
				isActive={lead.status}
			/>
		</div>

		<!-- NOTES SECTION -->
		<div class="border-b border-border">
			<Button
				variant="ghost"
				class="w-full justify-start rounded-none py-4 px-5 text-sm font-semibold text-foreground-secondary"
				onclick={() => lead.collapsedNotes = !collapsedNotes}
			>
				<svg class={cn("transition-transform duration-200 text-muted-foreground", !collapsedNotes && "rotate-90")} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
				<span>Internal Notes</span>
				{#if lead.business_notes}
					<span class="ml-auto text-accent text-lg">•</span>
				{/if}
			</Button>
			{#if !collapsedNotes}
				<div class="px-5 pb-4">
					<Textarea
						id="business-notes-{lead.id}"
						bind:value={lead.business_notes}
						placeholder="Add your private notes about this lead..."
						rows={3}
						disabled={savingNotes.has(lead.id)}
						class="w-full"
					/>
					<div class="flex items-center gap-3 mt-3">
						<Button
							variant="secondary"
							onclick={() => saveBusinessNotes(lead)}
							disabled={savingNotes.has(lead.id)}
						>
							{#if savingNotes.has(lead.id)}
								Saving...
							{:else}
								Save
							{/if}
						</Button>
						{#if savedNotes.has(lead.id)}
							<span class="text-success font-semibold text-sm flex items-center gap-1">
								<Check size={16} strokeWidth={2.5} />
								Saved
							</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- NEXT STEP HINT (inside expandable section) -->
		{#if nextAction}
			<div class="flex items-start gap-2.5 p-4 mt-4 bg-accent-muted border-l-[3px] border-accent rounded text-sm text-foreground-secondary">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent shrink-0 mt-0.5">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line>
				</svg>
				<span class="leading-relaxed"><strong>Next Step:</strong> {nextAction}</span>
			</div>
		{/if}
	{/if}
		</div>
	{/if}
	</Card.Content>

	<!-- ACTION BUTTONS - Always Visible -->
	{#if lead.category !== 1}
		{#if lead.stage === 1 && lead.status}
			<Card.Footer class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch">
				<Button
					class="shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-sm:w-full"
					onclick={() => openProposalModal(lead)}
				>
					Generate Proposal
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</Button>
			</Card.Footer>
		{:else if !lead.status}
			<Card.Footer class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch">
				<Button
					variant="destructive"
					class="max-sm:w-full"
					onclick={() => showDeleteConfirmation(lead)}
				>
					Delete Lead
				</Button>
			</Card.Footer>
		{/if}
	{:else}
		<!-- CLAIM BUTTON FOR NON-EXCLUSIVE AVAILABLE LEADS -->
		<Card.Footer class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch">
			{#if lead.claim_count > 4}
				<p class="font-semibold text-muted-foreground text-sm m-0">Not Available. Claimed by Other Business</p>
			{:else}
				<Button
					class="bg-success text-success-foreground hover:bg-success/90 shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-sm:w-full"
					onclick={() => claimLead(lead.id, businessInfo.id)}
					disabled={isClaiming}
				>
					{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
				</Button>
			{/if}
		</Card.Footer>
	{/if}
</Card.Root>

<style>
	/* Animation for expandable details section */
	@keyframes expand {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 1000px;
		}
	}

	.animate-expand {
		animation: expand 0.3s ease;
	}
</style>
