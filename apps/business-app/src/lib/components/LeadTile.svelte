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
		Trash2
	} from '@lucide/svelte';
	import { getCategoryLabel, getStageLabel } from '$lib/constants/lead';
	import { getRelativeTime, formatLeadForProposal, trackCallEvent } from '$lib/in/utils/lead-helpers';

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

	function handleGenerateProposal() {
		dispatch('proposal', { lead, proposalData: formatLeadForProposal(lead) });
	}
</script>

<Card.Root
	bind:ref={tileEl}
	class={cn(
		'p-0 break-words transition-all duration-200 overflow-hidden list-none hover:shadow-md scroll-mt-4',
		isDemo && 'border-2 border-dashed opacity-70',
		isHighlighted && 'ring-2 ring-primary'
	)}
>
	<!-- HEADER SECTION - Identity & Status -->
	<Card.Header
		class="flex-row justify-between items-center py-5 pb-0 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3"
	>
		<Card.Title class="text-lg font-bold text-foreground leading-tight">{lead.name}</Card.Title>
		<div class="flex items-center gap-2 max-[480px]:self-start">
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
					{#if lead.claim_count > 0}
						<p class="text-xs text-muted-foreground mb-2">
							Claimed by {lead.claim_count} other {lead.claim_count === 1 ? 'business' : 'businesses'} in {lead.district}
						</p>
					{:else}
						<p class="text-xs text-muted-foreground mb-2">Be the first one to claim this inquiry</p>
					{/if}
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
				<div class="pt-2 space-y-3">
					<div class="flex items-center gap-2 text-sm">
						<span class="font-semibold text-muted-foreground">Stage:</span>
						<Badge variant="secondary">{stageLabel}</Badge>
					</div>

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
					{/if}
					<div class="flex gap-2">
						<Button variant="outline" class="flex-1" href={leadHref} disabled={isDemo}>
							<Pencil size={16} />
							Update
						</Button>
						<Button
							variant="outline"
							class="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
							onclick={() => dispatch('delete', { leadId: lead.id })}
							disabled={isDemo}
						>
							<Trash2 size={16} />
							Delete
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
