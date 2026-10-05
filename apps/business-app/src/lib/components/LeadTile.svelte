<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import {
		Phone,
		ArrowRight,
		Pencil,
		Trash2,
		Undo2
	} from '@lucide/svelte';
	import { getCategoryLabel, getStageLabel } from '$lib/constants/lead';
	import { getRelativeTime, formatLeadForProposal, trackCallEvent } from '$lib/in/utils/lead-helpers';
	import { updateLeadAPI } from '$lib/in/actions/lead-api';
	import { toast } from 'svelte-sonner';

	type LeadTileProps = {
		lead: any;
		businessInfo: Record<string, any>;
		isClaiming?: boolean;
		isDemo?: boolean;
		claimBlocked?: boolean;
		// Scrolls to and briefly highlights the tile
		focused?: boolean;
	};

	let {
		lead,
		businessInfo,
		isClaiming = false,
		isDemo = false,
		claimBlocked = false,
		focused = false
	}: LeadTileProps = $props();

	const dispatch = createEventDispatcher();

	let stageLabel = $derived(lead.status ? getStageLabel(lead.stage, lead.category) : 'Inactive');

	let tileEl: HTMLElement | null = $state(null);
	let isHighlighted = $state(false);

	$effect(() => {
		if (!focused || !tileEl) return;
		isHighlighted = true;
		tileEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
		const timer = setTimeout(() => (isHighlighted = false), 2500);
		return () => clearTimeout(timer);
	});

	// Short "time since", e.g. "5m ago", "3d ago", "8mo ago", "1y ago"
	function timeSince(date: string) {
		const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		if (days < 365) return `${Math.floor(days / 30)}mo ago`;
		return `${Math.floor(days / 365)}y ago`;
	}

	// Suggested next action for a claimed lead, from its stage and how long it has sat there
	let nextStep = $derived.by(() => {
		if (!lead.status || lead.category === 1) return null;
		const days = lead.updated_at
			? Math.floor((Date.now() - new Date(lead.updated_at).getTime()) / 86400000)
			: 0;
		switch (lead.stage) {
			case 0:
				return days >= 1 ? 'Call the customer today — they are waiting' : 'Call the customer';
			case 1:
				return days >= 3 ? 'Call again and send a proposal' : 'Send a proposal';
			case 2:
				return days >= 3 ? 'Call to follow up on the proposal' : 'Wait for a reply, follow up in a few days';
			default:
				return null;
		}
	});

	let leadHref = $derived(`/${$page.params.business_slug}/crm/leads/${lead.id}`);

	function makeCall() {
		trackCallEvent(lead.id);
		dispatch('call', { leadId: lead.id, phone: lead.phone });
		window.location.href = `tel:${lead.phone}`;
	}

	function handleClaim() {
		if (!businessInfo.id) {
			console.error('ERROR: businessInfo.id is undefined!');
			return;
		}
		dispatch('claim', { leadId: lead.id, businessId: businessInfo.id });
	}

	let isMovingBack = $state(false);

	// Undo a Won by mistake. The project it created stays in project management,
	// and marking Won again reuses it.
	async function moveBackToProposalSent() {
		isMovingBack = true;
		const result = await updateLeadAPI({
			id: lead.id,
			stage: 2,
			status: lead.status,
			business_notes: lead.business_notes
		});
		if (result.success) {
			dispatch('update', { leadId: lead.id, lead: result.lead ?? { stage: 2 } });
		} else {
			toast.error(result.error || 'Failed to update lead');
		}
		isMovingBack = false;
	}

	function handleGenerateProposal() {
		dispatch('proposal', { lead, proposalData: formatLeadForProposal(lead) });
	}
</script>

<Card.Root
	bind:ref={tileEl}
	class={cn(
		'p-0 gap-0 break-words transition-all duration-200 overflow-hidden list-none hover:shadow-md scroll-mt-4',
		isDemo && 'border-2 border-dashed opacity-70',
		isHighlighted && 'ring-2 ring-primary'
	)}
>
	<!-- HEADER SECTION - Identity & Status -->
	<Card.Header
		class="flex flex-row justify-between items-center gap-3 py-5 pb-0"
	>
		<Card.Title class="min-w-0 truncate text-lg font-bold text-foreground leading-tight">{lead.name}</Card.Title>
		<div class="flex shrink-0 items-center gap-2">
			{#if isDemo}
				<Badge variant="outline" class="bg-warning-muted text-warning">Test Lead</Badge>
			{:else if lead.category !== 2}
				<Badge variant={lead.category === 1 ? 'outline' : 'default'}>
					{getCategoryLabel(lead.category)}
				</Badge>
			{/if}
		</div>
	</Card.Header>

	<!-- COMPACT INFO - Always Visible -->
	<Card.Content class="p-0">
		<div class="px-6 py-4 space-y-3">
			<!-- Next Step (claimed leads) -->
			{#if nextStep}
				<div class="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm">
					<span class="font-semibold text-primary">Next:</span>
					<span class="font-medium text-foreground">{nextStep}</span>
				</div>
			{/if}

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

			<!-- Contact (only after the lead is claimed) -->
			{#if lead.category !== 1}
				{#if lead.phone}
					<div class="flex items-center gap-2 text-sm">
						<span class="font-semibold text-muted-foreground">Phone:</span>
						<a href="tel:{lead.phone}" class="font-medium text-foreground hover:underline">{lead.phone}</a>
					</div>
				{/if}
				{#if lead.email}
					<div class="flex items-center gap-2 text-sm min-w-0">
						<span class="font-semibold text-muted-foreground shrink-0">Email:</span>
						<a href="mailto:{lead.email}" class="font-medium text-foreground hover:underline truncate">{lead.email}</a>
					</div>
				{/if}
			{/if}

			<!-- Customer Comment -->
			{#if lead.comment}
				<div class="flex items-start gap-2 text-sm">
					<span class="font-semibold text-muted-foreground shrink-0">Customer comment:</span>
					<span class="font-medium text-foreground">{lead.comment}</span>
				</div>
			{/if}

			<!-- Internal Notes (edited on the lead page) -->
			{#if lead.category !== 1 && lead.business_notes}
				<div class="text-sm">
					<span class="font-semibold text-muted-foreground">Internal notes:</span>
					<p class="text-foreground whitespace-pre-line">{lead.business_notes}</p>
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
						<Button
							class="w-full"
							onclick={handleClaim}
							disabled={isClaiming || isDemo}
						>
							{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
						</Button>
					{/if}
				</div>
			{:else}
				<!-- Claimed Lead: Stage + Actions -->
				<div class="space-y-5">
					<div class="flex items-center gap-2 text-sm">
						<span class="font-semibold text-muted-foreground">Stage:</span>
						<span class="font-medium text-foreground">{stageLabel}</span>
						{#if lead.updated_at}
							<span class="text-muted-foreground" title={new Date(lead.updated_at).toLocaleString()}>
								· {timeSince(lead.updated_at)}
							</span>
						{/if}
					</div>

					<div class="flex flex-wrap items-center gap-2">
						{#if lead.stage === 3}
							<Button size="sm" variant="outline" onclick={moveBackToProposalSent} disabled={isDemo || isMovingBack}>
								<Undo2 size={16} />
								{isMovingBack ? 'Updating...' : `Back to ${getStageLabel(2, lead.category)}`}
							</Button>
						{:else}
							{#if lead.status}
								<Button size="sm" onclick={makeCall} title="Call {lead.name}" disabled={isDemo}>
									<Phone size={16} />
									Call
								</Button>
							{/if}
							<Button size="sm" variant="outline" href={leadHref} disabled={isDemo}>
								<Pencil size={16} />
								Update
							</Button>
						{/if}
						{#if lead.status && lead.stage === 1}
							<Button size="sm" variant="outline" onclick={handleGenerateProposal} disabled={isDemo}>
								Generate Proposal
								<ArrowRight size={16} />
							</Button>
						{/if}
						<Button
							size="icon-sm"
							variant="ghost"
							class="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
							onclick={() => dispatch('delete', { leadId: lead.id })}
							title="Delete lead"
							aria-label="Delete lead"
							disabled={isDemo}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
