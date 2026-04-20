<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import LeadProgressBar from './LeadProgressBar.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import {
		Phone,
		Mail,
		ChevronDown,
		ChevronRight,
		Info,
		ArrowRight,
		Check
	} from '@lucide/svelte';
	import { getStagesMapForCategory, getCategoryLabel } from '$lib/constants/lead';
	import { getRelativeTime, getNextAction, formatLeadForProposal, trackCallEvent } from '$lib/in/utils/lead-helpers';
	import { updateLeadAPI } from '$lib/in/actions/lead-api';

	type LeadTileProps = {
		lead: any;
		businessInfo: Record<string, any>;
		isClaiming?: boolean;
		isDemo?: boolean;
		claimBlocked?: boolean;
	};

	let {
		lead,
		businessInfo,
		isClaiming = false,
		isDemo = false,
		claimBlocked = false
	}: LeadTileProps = $props();

	const dispatch = createEventDispatcher();

	// Component-owned state (autonomous)
	let isExpanded = $state(false);
	let isSavingNotes = $state(false);
	let notesSaved = $state(false);
	let notesCollapsed = $state(true);

	// Get appropriate stages based on lead category
	let stagesMap = $derived(getStagesMapForCategory(lead.category));
	let stageOptions = $derived(
		Object.entries(stagesMap)
			.filter(([key]) => key !== 'all')
			.map(([value, label]) => ({ value: Number(value), label }))
	);

	let nextAction = $derived(getNextAction(lead.stage, lead.category, lead.status));

	function toggleLeadDetails() {
		isExpanded = !isExpanded;
	}

	function makeCall() {
		trackCallEvent(lead.id);
		dispatch('call', { leadId: lead.id, phone: lead.phone });
		window.location.href = `tel:${lead.phone}`;
	}

	async function handleUpdateLead(updates: any) {
		const result = await updateLeadAPI({
			id: lead.id,
			stage: updates.stage !== undefined ? Number(updates.stage) : Number(lead.stage),
			status: updates.status !== undefined ? updates.status : lead.status,
			business_notes: updates.business_notes !== undefined ? updates.business_notes : lead.business_notes
		});

		if (result.success && result.lead) {
			dispatch('update', { leadId: lead.id, lead: result.lead });
		} else {
			toast.error(result.error || 'Failed to update lead');
		}
	}

	let notesDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	async function saveBusinessNotes() {
		isSavingNotes = true;

		await handleUpdateLead({ business_notes: lead.business_notes });

		isSavingNotes = false;
		notesSaved = true;

		setTimeout(() => {
			notesSaved = false;
		}, 3000);
	}

	function handleNotesInput() {
		if (notesDebounceTimer) clearTimeout(notesDebounceTimer);
		notesDebounceTimer = setTimeout(() => {
			notesDebounceTimer = null;
			saveBusinessNotes();
		}, 800);
	}

	function handleNotesBlur() {
		if (notesDebounceTimer) {
			clearTimeout(notesDebounceTimer);
			notesDebounceTimer = null;
		}
		saveBusinessNotes();
	}

	function handleClaim() {
		if (!businessInfo.id) {
			console.error('ERROR: businessInfo.id is undefined!');
			return;
		}
		dispatch('claim', { leadId: lead.id, businessId: businessInfo.id });
	}

	function handleDelete() {
		dispatch('delete', { leadId: lead.id });
	}

	function handleGenerateProposal() {
		dispatch('proposal', { lead, proposalData: formatLeadForProposal(lead) });
	}
</script>

<Card.Root
	class={cn(
		'mb-8 p-0 break-words transition-all duration-200 overflow-hidden list-none hover:shadow-md',
		isDemo && 'border-2 border-dashed opacity-70'
	)}
>
	<!-- HEADER SECTION - Identity & Status -->
	<Card.Header
		class="flex-row justify-between items-center py-5 pb-2 border-b max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3"
	>
		<Card.Title class="text-lg font-bold text-foreground leading-tight">{lead.name}</Card.Title>
		<div class="flex items-center gap-2 max-[480px]:self-start">
			{#if isDemo}
				<Badge variant="outline" class="bg-warning-muted text-warning">Test Lead</Badge>
			{:else}
				<Badge
					variant={lead.category === 1 ? 'outline' : lead.category === 2 ? 'secondary' : 'default'}
				>
					{getCategoryLabel(lead.category)}
				</Badge>
			{/if}
		</div>
	</Card.Header>

	<!-- COMPACT INFO - Always Visible -->
	<Card.Content class="p-0">
		<div class="px-6 py-4 space-y-3 border-b border-border">
			<!-- Location -->
			<div class="flex items-center gap-2 text-sm">
				<span class="font-semibold text-muted-foreground">Location:</span>
				<span class="font-medium text-foreground">{lead.pin_code}{lead.district ? ` (${lead.district})` : ''}</span>
			</div>

			<!-- Customer Comment -->
			<div class="text-sm">
				<p class="text-foreground leading-relaxed italic">"{lead.comment}"</p>
			</div>

			<!-- Next Step Hint - For Claimed Leads -->
			{#if lead.category !== 1 && nextAction}
				<div
					class="flex items-start gap-2 p-3 bg-accent-muted border-l-[3px] border-accent rounded text-sm"
				>
					<Info size={14} class="text-accent shrink-0 mt-0.5" />
					<span class="text-foreground-secondary leading-snug"
						><strong>Next:</strong> {nextAction}</span
					>
				</div>
			{/if}

			<!-- Primary Action Button -->
			{#if lead.category === 1}
				<!-- Unclaimed: Show Claim Button -->
				<div class="pt-2">
					{#if lead.claim_count > 4}
						<p class="font-semibold text-muted-foreground text-sm">
							Not Available. Claimed by Other Business
						</p>
					{:else if claimBlocked}
						<p class="text-xs text-destructive font-semibold mb-2">
							Claiming paused — complete the requirements shown above to resume
						</p>
						<Button
							class="w-full"
							disabled={true}
						>
							Claim Now (Free)
						</Button>
					{:else}
					{#if lead.claim_count > 0}
						<p class="text-xs text-muted-foreground mb-2">
							Claimed by {lead.claim_count} other {lead.claim_count === 1 ? 'business' : 'businesses'} in {lead.district}
						</p>
					{:else}
						<p class="text-xs text-muted-foreground mb-2">Be the first one to claim this inquiry</p>
					{/if}
						<Button
							class="w-full bg-success text-success-foreground hover:bg-success/90"
							onclick={handleClaim}
							disabled={isClaiming || isDemo}
						>
							{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
						</Button>
					{/if}
				</div>
			{:else}
				<!-- Claimed: Show Call Now Button -->
				<div class="pt-2 flex flex-col gap-2">
					<Button
						class="w-full"
						onclick={makeCall}
						title="Call {lead.name}"
						disabled={isDemo}
					>
						<Phone size={16} />
						Call Now
					</Button>
					{#if lead.stage === 1 && lead.status}
						<Button
							variant="outline"
							class="w-full"
							onclick={handleGenerateProposal}
							disabled={isDemo}
						>
							Generate Proposal
							<ArrowRight size={16} />
						</Button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- TOGGLE BUTTON -->
		<Button
			variant="ghost"
			class="w-full rounded-none border-y border-border text-muted-foreground hover:text-foreground"
			onclick={toggleLeadDetails}
			disabled={isDemo}
			aria-expanded={isExpanded}
			aria-controls="details-{lead.id}"
		>
			<ChevronDown
				size={16}
				class={cn('transition-transform duration-200', isExpanded && 'rotate-180')}
			/>
			<span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
		</Button>

		<!-- EXPANDABLE DETAILS SECTION -->
		{#if isExpanded}
			<div
				class="p-5 bg-background-secondary dark:bg-background-secondary border-b border-border transition-all duration-300 ease-in-out"
				id="details-{lead.id}"
			>
				<!-- RECEIVED TIME -->
				<div class="flex items-start gap-2 mb-3 text-sm">
					<span class="font-semibold text-muted-foreground">Received:</span>
					<span class="font-medium text-foreground">{getRelativeTime(lead.created_at).text}</span>
				</div>

				<!-- PHONE NUMBER -->
				<div class="flex items-center gap-2 mb-3 text-sm">
					<Phone size={16} class="text-muted-foreground shrink-0" />
					<span class="font-medium text-foreground">{lead.phone}</span>
				</div>

				<!-- PROPERTY TYPE -->
				{#if lead.type}
					<div class="flex items-start gap-2 mb-3 text-sm">
						<span class="font-semibold text-muted-foreground">Property Type:</span>
						<span class="font-medium text-foreground">{lead.type}</span>
					</div>
				{/if}

				<!-- EMAIL ADDRESS -->
				{#if lead.email}
					<div
						class="flex items-center gap-2 mb-3 p-3 bg-card dark:bg-background-tertiary rounded-md border border-border text-sm"
					>
						<Mail size={16} class="text-muted-foreground shrink-0" />
						<a
							href="mailto:{lead.email}"
							class="font-medium text-accent no-underline hover:underline">{lead.email}</a
						>
					</div>
				{/if}

				<!-- SOLAR VIPANI NOTES -->
				{#if lead.sv_comment_for_businesses}
					<div
						class="mt-4 p-3 bg-accent-muted border-l-[3px] border-accent rounded text-sm text-foreground-secondary"
					>
						<strong>Solar Vipani Note:</strong>
						{lead.sv_comment_for_businesses}
					</div>
				{/if}

				{#if lead.category !== 1}
					<!-- WORKFLOW SECTION - Progress & Stage -->
					<div class="p-5 border-b border-border">
						<h4
							class="m-0 mb-3 text-sm font-semibold text-foreground-secondary uppercase tracking-wide"
						>
							Workflow
						</h4>
						<div class="flex flex-wrap gap-4 mt-4 mb-5 max-sm:flex-col">
							<div class="flex-1 min-w-[140px] flex flex-col gap-1.5 max-sm:min-w-full">
								<Label for="stage-{lead.id}" class="text-xs font-semibold text-foreground-secondary"
									>Current Stage</Label
								>
								<Select.Root
									type="single"
									bind:value={lead.stage}
									onValueChange={(v) => {
										if (v?.value !== undefined) {
											lead.stage = v.value;
											handleUpdateLead({ stage: lead.stage });
										}
									}}
								>
									<Select.Trigger id="stage-{lead.id}">
										{stagesMap[lead.stage] || 'Select stage'}
									</Select.Trigger>
									<Select.Content>
										{#each stageOptions as option}
											<Select.Item value={option.value}>{option.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="flex-1 min-w-[140px] flex flex-col gap-1.5 max-sm:min-w-full">
								<Label
									for="status-{lead.id}"
									class="text-xs font-semibold text-foreground-secondary">Lead Status</Label
								>
								<Select.Root
									type="single"
									bind:value={lead.status}
									onValueChange={(v) => {
										if (v?.value !== undefined) {
											lead.status = v.value;
											handleUpdateLead({ status: lead.status });
										}
									}}
								>
									<Select.Trigger id="status-{lead.id}">
										{lead.status ? 'Active' : 'Inactive'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value={true}>Active</Select.Item>
										<Select.Item value={false}>Inactive</Select.Item>
									</Select.Content>
								</Select.Root>
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
							onclick={() => (notesCollapsed = !notesCollapsed)}
						>
							<ChevronRight
								size={16}
								class={cn(
									'transition-transform duration-200 text-muted-foreground',
									!notesCollapsed && 'rotate-90'
								)}
							/>
							<span>Internal Notes</span>
							{#if lead.business_notes}
								<span class="ml-auto text-accent text-lg">•</span>
							{/if}
						</Button>
						{#if !notesCollapsed}
							<div class="px-5 pb-4">
								<Textarea
									id="business-notes-{lead.id}"
									bind:value={lead.business_notes}
									placeholder="Add your private notes about this lead..."
									rows={3}
									disabled={isSavingNotes}
									class="w-full"
									oninput={handleNotesInput}
									onblur={handleNotesBlur}
								/>
								<div class="flex items-center gap-1 mt-2 h-5">
									{#if isSavingNotes}
										<span class="text-muted-foreground text-xs">Saving...</span>
									{:else if notesSaved}
										<span class="text-success font-semibold text-xs flex items-center gap-1">
											<Check size={12} strokeWidth={2.5} />
											Saved
										</span>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</Card.Content>

	<!-- SECONDARY ACTION BUTTONS - Only for Claimed Leads When Expanded -->
	{#if lead.category !== 1 && isExpanded && !lead.status}
		<Card.Footer
			class="p-5 bg-muted/50 dark:bg-background-tertiary justify-center gap-4 flex-wrap"
		>
			<Button
				variant="destructive"
				class="max-sm:w-full"
				onclick={handleDelete}
			>
				Delete Lead
			</Button>
		</Card.Footer>
	{/if}
</Card.Root>
