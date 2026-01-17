<script lang="ts">
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

	type LeadTileProps = {
		lead: any;
		businessInfo: Record<string, any>;
		isClaiming?: boolean;
		savingNotes?: Set<number>;
		savedNotes?: Set<number>;
		expandedLeads?: Set<number>;
		STAGES?: Record<number, string>;
		NON_EXCLUSIVE_CLAIMED_STAGES?: Record<number, string>;
		makeCall?: (phone: string, name: string, id: number) => void;
		saveBusinessNotes?: (lead: any) => void;
		updateLead?: (lead: any, updates: any) => void;
		getRelativeTime?: (date: string) => { text: string; variant: string };
		getNextAction?: (stage: number, category: number, status: string) => string | null;
		openProposalModal?: (lead: any) => void;
		showDeleteConfirmation?: (lead: any) => void;
		claimLead?: (leadId: number, businessId: number) => void;
		onToggleDetails?: (params: { leadId: number }) => void;
	};

	let {
		lead,
		businessInfo,
		isClaiming = false,
		savingNotes = new Set(),
		savedNotes = new Set(),
		expandedLeads = new Set(),
		makeCall = () => {},
		saveBusinessNotes = () => {},
		updateLead = () => {},
		getRelativeTime = () => ({ text: '', variant: '' }),
		getNextAction = () => null,
		openProposalModal = () => {},
		showDeleteConfirmation = () => {},
		claimLead = () => {},
		onToggleDetails = () => {}
	}: LeadTileProps = $props();

	// Get appropriate stages based on lead category
	let stagesMap = $derived(getStagesMapForCategory(lead.category));
	let stageOptions = $derived(
		Object.entries(stagesMap)
			.filter(([key]) => key !== 'all')
			.map(([value, label]) => ({ value: Number(value), label }))
	);

	let collapsedNotes = $derived(lead.collapsedNotes !== false);
	let isExpanded = $derived(expandedLeads.has(lead.id));
	let nextAction = $derived(getNextAction(lead.stage, lead.category, lead.status));

	function toggleLeadDetails() {
		onToggleDetails({ leadId: lead.id });
	}
</script>

<Card.Root
	class="mb-8 p-0 break-words transition-all duration-200 overflow-hidden list-none hover:shadow-md"
>
	<!-- HEADER SECTION - Identity & Status -->
	<Card.Header
		class="flex-row justify-between items-center py-5 pb-2 border-b max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3"
	>
		<Card.Title class="text-lg font-bold text-foreground leading-tight">{lead.name}</Card.Title>
		<Badge
			variant={lead.category === 1 ? 'outline' : lead.category === 2 ? 'secondary' : 'default'}
			class="max-[480px]:self-start"
		>
			{getCategoryLabel(lead.category)}
		</Badge>
	</Card.Header>
	<p class="px-6 pb-4 pt-0 m-0 text-xs text-muted-foreground">
		Received {getRelativeTime(lead.created_at).text}
	</p>

	<!-- COMPACT INFO GRID - Always Visible -->
	<Card.Content class="p-0">
		<div
			class="grid grid-cols-[1fr_auto] gap-3 p-4 px-6 bg-muted/50 dark:bg-background-tertiary border-b border-border max-sm:grid-cols-1"
		>
			<div
				class="flex items-center gap-1.5 text-sm text-foreground-secondary font-medium col-span-1"
			>
				<Phone size={16} class="text-muted-foreground shrink-0" />
				<span class="font-medium text-foreground">{lead.phone}</span>
			</div>
			{#if lead.category !== 1}
				<Button
					class="col-span-1 row-span-3 max-sm:col-span-1 max-sm:row-auto max-sm:w-full"
					onclick={() => makeCall(lead.phone, lead.name, lead.id)}
					title="Call {lead.name}"
				>
					<Phone size={16} />
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

				<!-- PROPERTY TYPE -->
				{#if lead.type}
					<div class="flex items-start gap-2 mb-3 text-sm">
						<span class="font-semibold text-muted-foreground">Property Type:</span>
						<span class="font-medium text-foreground">{lead.type}</span>
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
											updateLead(lead, { stage: lead.stage });
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
											updateLead(lead, { status: lead.status });
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
							onclick={() => (lead.collapsedNotes = !collapsedNotes)}
						>
							<ChevronRight
								size={16}
								class={cn(
									'transition-transform duration-200 text-muted-foreground',
									!collapsedNotes && 'rotate-90'
								)}
							/>
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
						<div
							class="flex items-start gap-2.5 p-4 mt-4 bg-accent-muted border-l-[3px] border-accent rounded text-sm text-foreground-secondary"
						>
							<Info size={16} class="text-accent shrink-0 mt-0.5" />
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
			<Card.Footer
				class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch"
			>
				<Button
					class="shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-sm:w-full"
					onclick={() => openProposalModal(lead)}
				>
					Generate Proposal
					<ArrowRight size={16} />
				</Button>
			</Card.Footer>
		{:else if !lead.status}
			<Card.Footer
				class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch"
			>
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
		<Card.Footer
			class="p-5 bg-muted/50 dark:bg-background-tertiary justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch"
		>
			{#if lead.claim_count > 4}
				<p class="font-semibold text-muted-foreground text-sm m-0">
					Not Available. Claimed by Other Business
				</p>
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
