<script module lang="ts">
	export type Lead = {
		id: number;
		name: string;
		phone: string;
		email: string;
		address?: string;
		stage: number;
		status: boolean;
		category?: number | null;
		business_notes?: string;
		received_at: string;
		pin_code?: string;
		type?: string;
		comment?: string;
	};

	export type CustomerInquiryProps = {
		leads?: Lead[];
		businessInfo?: Record<string, any>;
		errorMessage?: string | null;
		isClaiming?: boolean;
		onClaimLead?: (lead: any) => void;
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import LeadStageFilter from './LeadStageFilter.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import LeadTile from './LeadTile.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { cn } from '$lib/utils';
	import { deleteLeadAPI } from '$lib/in/actions/lead-api';

	let {
		leads = $bindable([]),
		businessInfo = {},
		errorMessage = null,
		isClaiming = false,
		onClaimLead = () => {}
	}: CustomerInquiryProps = $props();

	// Parent-level state (modals only)
	let showProposalModal = $state(false);
	let selectedLeadForProposal: any = $state(null);
	let showDeleteConfirm = $state(false);
	let leadToDelete: Lead | null = $state(null);
	let isDeleting = $state(false);

	// Tab state: derived initial value from whether claimed leads exist
	let activeTab = $state<'available' | 'my-leads'>('available');

	// Stage/status filter state (only applies to My Leads tab)
	let selectedStage = $state('all');
	let selectedStatus = $state('all');

	// Derive available (category 1) and my leads (category 2, 3, null/undefined)
	let availableLeads = $derived(leads.filter((l) => l.category === 1));
	let myLeads = $derived(
		leads.filter((l) => l.category !== 1)
	);

	// Set default tab based on claimed leads on first load
	$effect(() => {
		if (leads.length > 0 && myLeads.length > 0) {
			activeTab = 'my-leads';
		}
	});

	// Filtered my leads — applies stage/status only
	let filteredMyLeads = $derived(
		myLeads.filter((lead) => {
			if (selectedStage !== 'all' && lead.stage !== parseInt(selectedStage)) return false;
			if (selectedStatus !== 'all' && lead.status !== (selectedStatus === 'true')) return false;
			return true;
		})
	);

	// Count badges
	let availableCount = $derived(availableLeads.length);
	// Active leads not yet won
	let myLeadsActionableCount = $derived(
		myLeads.filter((l) => l.status === true && l.stage < 3).length
	);

	function handleFilterChange(filters: { selectedStage: string; selectedStatus: string }) {
		selectedStage = filters.selectedStage;
		selectedStatus = filters.selectedStatus;
	}

	// Event handlers
	function handleLeadUpdate(event: CustomEvent) {
		const { leadId, lead: updatedLead } = event.detail;
		leads = leads.map((l) => (l.id === leadId ? { ...l, ...updatedLead } : l));
	}

	function handleLeadClaim(event: CustomEvent) {
		const { leadId, businessId } = event.detail;
		if (!isClaiming) {
			onClaimLead({ leadId, businessId });
		}
	}

	function handleProposalOpen(event: CustomEvent) {
		selectedLeadForProposal = event.detail.proposalData;
		showProposalModal = true;
	}

	function handleDeleteRequest(event: CustomEvent) {
		const lead = leads.find((l) => l.id === event.detail.leadId);
		if (lead) {
			leadToDelete = lead;
			showDeleteConfirm = true;
		}
	}

	async function confirmDelete() {
		if (!leadToDelete || isDeleting) return;
		isDeleting = true;

		const result = await deleteLeadAPI(leadToDelete.id);

		if (result.success) {
			leads = leads.filter((l) => l.id !== leadToDelete.id);
			showDeleteConfirm = false;
			leadToDelete = null;
		} else {
			toast.error(result.error || 'Failed to delete lead');
		}

		isDeleting = false;
	}

	function cancelDelete() {
		if (isDeleting) return;
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	function closeProposalModal() {
		showProposalModal = false;
		selectedLeadForProposal = null;
	}
</script>

<!-- LEAD DATA SECTION -->
<section id="lead-data">
	<h2 class="text-2xl font-semibold text-left text-accent mb-4">Customer Inquiry</h2>

	{#if errorMessage}
		<Alert.Root variant="destructive" class="mb-4">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{errorMessage}</Alert.Description>
		</Alert.Root>
	{:else}
		<!-- Tab toggle -->
		<div class="flex gap-1 p-1 bg-muted rounded-lg mb-6 max-w-[540px] mx-auto">
			<button
				class={cn(
					'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
					activeTab === 'available'
						? 'bg-background shadow-sm text-foreground'
						: 'text-muted-foreground hover:text-foreground'
				)}
				onclick={() => (activeTab = 'available')}
			>
				Available Leads
				{#if availableCount > 0}
					<span
						class={cn(
							'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
							activeTab === 'available'
								? 'bg-primary text-primary-foreground'
								: 'bg-muted-foreground/20 text-muted-foreground'
						)}
					>
						{availableCount}
					</span>
				{/if}
			</button>
			<button
				class={cn(
					'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
					activeTab === 'my-leads'
						? 'bg-background shadow-sm text-foreground'
						: 'text-muted-foreground hover:text-foreground'
				)}
				onclick={() => (activeTab = 'my-leads')}
			>
				My Leads
				{#if myLeadsActionableCount > 0}
					<span
						class={cn(
							'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
							activeTab === 'my-leads'
								? 'bg-primary text-primary-foreground'
								: 'bg-muted-foreground/20 text-muted-foreground'
						)}
					>
						{myLeadsActionableCount}
					</span>
				{/if}
			</button>
		</div>

		<!-- Available Leads tab -->
		{#if activeTab === 'available'}
			<ul class="list-none p-0 w-full max-w-[540px] mx-auto">
				{#if availableLeads.length > 0}
					{#each availableLeads as lead}
						<LeadTile
							{lead}
							{businessInfo}
							{isClaiming}
							on:update={handleLeadUpdate}
							on:claim={handleLeadClaim}
							on:proposal={handleProposalOpen}
							on:delete={handleDeleteRequest}
						/>
					{/each}
				{:else if leads.length === 0}
					<!-- Dummy test lead for brand new users -->
					<LeadTile
						lead={{
							id: 0,
							name: 'John Doe',
							phone: '+91 0123456789',
							email: 'dummy@email.com',
							stage: 0,
							status: true,
							category: 1,
							business_notes: '',
							received_at: new Date().toISOString(),
							pin_code: '110001',
							type: 'Residential - Independent Home',
							comment: 'I want to install 3kW at my home. Please call me!'
						}}
						businessInfo={{}}
						isDemo={true}
					/>
				{:else}
					<Card.Root class="border-2 border-dashed my-4">
						<Card.Content class="text-center p-8">
							<p class="font-semibold text-lg text-muted-foreground mb-2">No available leads right now.</p>
							<p class="text-sm text-muted-foreground italic">
								New leads will appear here as they come in.
							</p>
						</Card.Content>
					</Card.Root>
				{/if}
			</ul>
		{/if}

		<!-- My Leads tab -->
		{#if activeTab === 'my-leads'}
			{#if myLeads.length > 0}
				<LeadStageFilter
					bind:selectedStage
					bind:selectedStatus
					onFilterChange={handleFilterChange}
				/>

				{#if filteredMyLeads.length === 0}
					<Card.Root class="border-2 border-dashed my-4">
						<Card.Content class="text-center p-8">
							<p class="font-semibold text-lg text-muted-foreground mb-2">
								No leads match the selected filters.
							</p>
							<p class="text-sm text-muted-foreground italic">
								Try adjusting your filters or clearing them to see more results.
							</p>
						</Card.Content>
					</Card.Root>
				{/if}

				<ul class="list-none p-0 w-full max-w-[540px] mx-auto">
					{#each filteredMyLeads as lead}
						<LeadTile
							{lead}
							{businessInfo}
							{isClaiming}
							on:update={handleLeadUpdate}
							on:claim={handleLeadClaim}
							on:proposal={handleProposalOpen}
							on:delete={handleDeleteRequest}
						/>
					{/each}
				</ul>
			{:else}
				<Card.Root class="border-2 border-dashed my-4 max-w-[540px] mx-auto">
					<Card.Content class="text-center p-8">
						<p class="font-semibold text-lg text-muted-foreground mb-2">No claimed leads yet.</p>
						<p class="text-sm text-muted-foreground italic">
							Claim leads from the Available Leads tab to start managing them.
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		{/if}
	{/if}
</section>

<!-- Delete Confirmation Modal -->
<Dialog.Root bind:open={showDeleteConfirm}>
	<Dialog.Content class="max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>Confirm Delete</Dialog.Title>
		</Dialog.Header>
		{#if leadToDelete}
			<p class="m-0 leading-relaxed text-foreground">
				Are you sure you want to delete the lead for <strong>{leadToDelete.name}</strong>?
			</p>
		{/if}
		<Dialog.Footer class="max-sm:flex-col">
			<Button
				variant="secondary"
				onclick={cancelDelete}
				disabled={isDeleting}
				class="max-sm:w-full"
			>
				Cancel
			</Button>
			<Button
				variant="destructive"
				onclick={confirmDelete}
				disabled={isDeleting}
				class="max-sm:w-full"
			>
				{isDeleting ? 'Deleting...' : 'Delete Lead'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Proposal Modal -->
{#if showProposalModal}
	<ProposalFormModal
		bind:show={showProposalModal}
		business={businessInfo}
		proposal={selectedLeadForProposal}
		onClose={closeProposalModal}
		onGenerated={closeProposalModal}
	/>
{/if}
