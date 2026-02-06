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
	import { Clock, Phone } from '@lucide/svelte';
	import LeadStageFilter from './LeadStageFilter.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import LeadTile from './LeadTile.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { getRelativeTime } from '$lib/in/utils/lead-helpers';
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

	// Filter state (specific to CRM view)
	let selectedCategory = $state('all');
	let selectedStage = $state('all');
	let selectedStatus = $state('all');
	let filteredLeads: Lead[] = $state([]);

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

	// Pure filter function - data transformation only
	function filterLeads() {
		filteredLeads = leads.filter((lead) => {
			// Category filter
			if (selectedCategory !== 'all') {
				const categoryValue = parseInt(selectedCategory);
				// Handle exclusive leads (category 3 or null/undefined)
				if (categoryValue === 3) {
					if (lead.category !== 3 && lead.category !== null && lead.category !== undefined) {
						return false;
					}
				} else {
					if (lead.category !== categoryValue) {
						return false;
					}
				}
			}

			// Stage filter
			if (selectedStage !== 'all') {
				const stageValue = parseInt(selectedStage);
				if (lead.stage !== stageValue) {
					return false;
				}
			}

			// Status filter
			if (selectedStatus !== 'all') {
				const statusValue = selectedStatus === 'true';
				if (lead.status !== statusValue) {
					return false;
				}
			}

			return true;
		});
	}

	// Handle filter changes
	function handleFilterChange(filters: {
		selectedCategory: string;
		selectedStage: string;
		selectedStatus: string;
	}) {
		selectedCategory = filters.selectedCategory;
		selectedStage = filters.selectedStage;
		selectedStatus = filters.selectedStatus;
		filterLeads();
	}

	// Update filtered leads when leads change
	$effect(() => {
		leads;
		filterLeads();
	});

	// Event handlers - simple data transformations
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
		{#if leads.length > 0}
			<LeadStageFilter
				bind:selectedCategory
				bind:selectedStage
				bind:selectedStatus
				onFilterChange={handleFilterChange}
			/>

			{#if filteredLeads.length === 0}
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
		{/if}

		<ul class="list-none p-0 w-full max-w-[540px] mx-auto">
			{#if leads.length > 0}
				{#each filteredLeads as lead}
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
			{:else}
				<!-- Display dummy test lead when no leads exist -->
				<li class="mb-8">
					<Card.Root class="border-2 border-dashed opacity-70">
						<Card.Header class="border-b">
							<Card.Title class="flex items-center gap-2">
								{dummyLead.name}
								<Badge variant="outline" class="bg-warning-muted text-warning">Test Lead</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content class="p-5">
							<p class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
								<Clock class="h-3.5 w-3.5 shrink-0" />
								<span class="font-medium">Received:</span>
								<span
									class={cn(
										'font-medium',
										getRelativeTime(dummyLead.received_at).variant === 'time-fresh' && 'text-success',
										getRelativeTime(dummyLead.received_at).variant === 'time-recent' && 'text-warning',
										getRelativeTime(dummyLead.received_at).variant === 'time-old' &&
											'text-muted-foreground'
									)}>{getRelativeTime(dummyLead.received_at).text}</span
								>
							</p>
							<div class="flex items-center justify-between gap-4 mb-4 flex-wrap">
								<p class="text-foreground m-0"><strong>Phone:</strong> {dummyLead.phone}</p>
								<Button variant="default" disabled class="opacity-50">
									<Phone class="h-4 w-4 mr-2" />
									CALL NOW
								</Button>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Email:</strong>
									{dummyLead.email}
								</p>
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Pin Code:</strong>
									{dummyLead.pin_code}
								</p>
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Type:</strong>
									{dummyLead.type}
								</p>
								<p class="text-foreground m-0 sm:col-span-2">
									<strong class="text-foreground-secondary">Customer Comment:</strong>
									{dummyLead.comment}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				</li>
			{/if}
		</ul>
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
