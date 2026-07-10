<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import LeadProgressBar from './LeadProgressBar.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import {
		Phone,
		Mail,
		ChevronDown,
		ChevronRight,
		ArrowRight,
		Check,
		X,
		Trophy
	} from '@lucide/svelte';
	import { getCategoryLabel } from '$lib/constants/lead';
	import { getRelativeTime, formatLeadForProposal, trackCallEvent } from '$lib/in/utils/lead-helpers';
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

	let nextStageLabel = $derived.by(() => {
		if (lead.stage >= 3 || !lead.status) return null;
		const labels: Record<number, string> = { 0: 'Mark Contacted', 1: 'Mark Proposal Sent', 2: 'Mark as Won' };
		return labels[lead.stage] ?? null;
	});
	let isAdvancing = $state(false);
	let showDeactivateConfirm = $state(false);
	let isDeactivating = $state(false);

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

	async function advanceStage() {
		if (lead.stage >= 3 || isAdvancing) return;
		isAdvancing = true;
		await handleUpdateLead({ stage: lead.stage + 1 });
		isAdvancing = false;
	}

	async function confirmDeactivate() {
		isDeactivating = true;
		await handleUpdateLead({ status: false });
		isDeactivating = false;
		showDeactivateConfirm = false;
	}

	function handleClaim() {
		if (!businessInfo.id) {
			console.error('ERROR: businessInfo.id is undefined!');
			return;
		}
		dispatch('claim', { leadId: lead.id, businessId: businessInfo.id });
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
			<!-- Received Time (above the fold for available leads) -->
			{#if lead.category === 1}
				<div class="flex items-center gap-2 text-sm">
					<span class="font-semibold text-muted-foreground">Received:</span>
					<Badge variant={getRelativeTime(lead.created_at).variant as any}>{getRelativeTime(lead.created_at).text}</Badge>
				</div>
			{/if}

			<!-- Location -->
			<div class="flex items-center gap-2 text-sm">
				<span class="font-semibold text-muted-foreground">Location:</span>
				<span class="font-medium text-foreground">{lead.pin_code}{lead.district ? ` (${lead.district})` : ''}</span>
			</div>

			<!-- Customer Comment -->
			<div class="text-sm">
				<p class="text-foreground leading-relaxed italic">"{lead.comment}"</p>
			</div>

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
				<!-- Claimed Lead: Progress + Actions -->
				<div class="pt-2 space-y-3">
					<LeadProgressBar
						currentStage={lead.stage}
						leadCategory={lead.category}
						isActive={lead.status}
					/>

					{#if lead.status}
						<Button
							class="w-full"
							onclick={makeCall}
							title="Call {lead.name}"
							disabled={isDemo}
						>
							<Phone size={16} />
							Call Now
						</Button>
						{#if lead.stage === 1}
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
						<div class="flex gap-2">
							{#if nextStageLabel}
								<Button
									variant={lead.stage === 2 ? 'default' : 'secondary'}
									class="flex-1 {lead.stage === 2 ? 'bg-success text-success-foreground hover:bg-success/90' : ''}"
									onclick={advanceStage}
									disabled={isAdvancing || isDemo}
								>
									{#if lead.stage === 2}
										<Trophy size={16} />
									{:else}
										<ArrowRight size={16} />
									{/if}
									{isAdvancing ? 'Updating...' : nextStageLabel}
								</Button>
							{/if}
							<Button
								variant="outline"
								class="text-destructive hover:bg-destructive hover:text-destructive-foreground"
								onclick={() => (showDeactivateConfirm = true)}
								disabled={isDemo}
								title="Mark as inactive"
							>
								<X size={16} />
							</Button>
						</div>
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
				<!-- RECEIVED TIME (hidden for available leads since it's above the fold) -->
				{#if lead.category !== 1}
					<div class="flex items-start gap-2 mb-3 text-sm">
						<span class="font-semibold text-muted-foreground">Received:</span>
						<span class="font-medium text-foreground">{getRelativeTime(lead.created_at).text}</span>
					</div>
				{/if}

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

				<!-- QUALIFICATION SCORE -->
				{#if lead.qualification_score != null}
					<div class="flex items-start gap-2 mb-3 text-sm">
						<span class="font-semibold text-muted-foreground">Qualification Score:</span>
						<Badge variant={lead.qualification_score >= 7 ? 'default' : lead.qualification_score >= 4 ? 'secondary' : 'outline'}>
							{lead.qualification_score}/10
						</Badge>
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

	<!-- Deactivate Confirmation Dialog -->
	<Dialog.Root bind:open={showDeactivateConfirm}>
		<Dialog.Content class="max-w-[480px]">
			<Dialog.Header>
				<Dialog.Title>Mark as Inactive?</Dialog.Title>
			</Dialog.Header>
			<p class="m-0 leading-relaxed text-foreground">
				This will remove <strong>{lead.name}</strong>'s inquiry from your active leads. You won't see it in your list anymore.
			</p>
			<Dialog.Footer class="max-sm:flex-col">
				<Button
					variant="secondary"
					onclick={() => (showDeactivateConfirm = false)}
					disabled={isDeactivating}
					class="max-sm:w-full"
				>
					Cancel
				</Button>
				<Button
					variant="destructive"
					onclick={confirmDeactivate}
					disabled={isDeactivating}
					class="max-sm:w-full"
				>
					{isDeactivating ? 'Deactivating...' : 'Yes, Mark Inactive'}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</Card.Root>
