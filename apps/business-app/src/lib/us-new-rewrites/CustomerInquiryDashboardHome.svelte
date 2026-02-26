<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Dialog } from '$lib/components/ui/dialog';
	import { Select } from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Phone, AlertCircle, ExternalLink } from '@lucide/svelte';
	import LeadProgressBar from './LeadProgressBar.svelte';
	import { STAGES_MAP, NON_EXCLUSIVE_CLAIMED_STAGES_MAP } from '$lib/constants/lead';

	export type CustomerInquiryDashboardHomeProps = {
		leads?: any[];
		businessInfo?: Record<string, any>;
		businessSlug?: string;
		errorMessage?: string | null;
		isClaiming?: boolean;
		onClaimLead?: (lead: any) => void;
	};

	let {
		leads = $bindable([]),
		businessInfo = {},
		businessSlug = '',
		errorMessage = null,
		isClaiming = false,
		onClaimLead
	}: CustomerInquiryDashboardHomeProps = $props();

	let showDeleteConfirm = $state(false);
	let leadToDelete = $state(null);
	let isDeleting = $state(false);

	function makeCall(phoneNumber: string, leadName: string, leadId: number) {
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`us-dashboard-home-call-now-button-${leadId}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	const dummyLead = {
		name: 'John Doe',
		created_at: new Date().toISOString(),
		phone: '+1 (864) 123-4567',
		email: 'dummy@email.com',
		pin_code: '29601',
		type: 'Residential - Independent Home',
		comment:
			'I want to install a 6kW solar system at my home. Please call me to discuss pricing and incentives!'
	};

	let limitedLeads = $derived(leads.slice(0, 5));

	async function updateLead(lead: any) {
		try {
			const response = await fetch('/us/api/updateLeadByBusiness', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: lead.id,
					stage: Number(lead.stage),
					status: lead.status
				})
			});

			if (!response.ok) throw new Error('Failed to update lead');

			const result = await response.json();

			if (result.success) {
				leads = leads.map((l) => (l.id === lead.id ? { ...l, ...result.lead } : l));
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Update Lead Error:', error);
			toast.error('An error occurred while updating the lead.');
		}
	}

	async function claimLead(leadId: number, businessId: number) {
		if (isClaiming) return;
		onClaimLead?.({ leadId, businessId });
	}

	function getRelativeTime(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

		if (diffInDays > 0) {
			return {
				text: `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`,
				variant: diffInDays <= 1 ? 'default' : diffInDays <= 3 ? 'secondary' : 'destructive'
			};
		} else if (diffInHours > 0) {
			return { text: `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`, variant: 'default' };
		} else if (diffInMinutes > 0) {
			return {
				text: `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`,
				variant: 'default'
			};
		} else {
			return { text: 'Just now', variant: 'default' };
		}
	}

	function getNextAction(stage: number, category: number, status: boolean): string | null {
		if (!status || stage === 3) return null;

		if (category === 2) {
			switch (stage) {
				case 0:
					return 'Call the customer';
				case 1:
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2:
					return 'Win the sale';
				default:
					return null;
			}
		}

		if (category === 3 || category === null) {
			switch (stage) {
				case 0:
					return 'Call the customer';
				case 1:
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2:
					return 'Win the sale';
				default:
					return null;
			}
		}

		return null;
	}

	function getCategoryVariant(category: number) {
		if (category === 1) return 'secondary';
		if (category === 2) return 'default';
		return 'default';
	}

	function getCategoryLabel(category: number) {
		if (category === 1) return 'Non-Exclusive-Available-to-Claim';
		if (category === 2) return 'Non-Exclusive-Claimed';
		return 'Exclusive';
	}

	async function deleteLead(lead: any) {
		if (isDeleting) return;
		isDeleting = true;

		try {
			const response = await fetch('/us/api/deleteLeadByBusiness', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: lead.id })
			});

			if (!response.ok) throw new Error('Failed to delete lead');

			const result = await response.json();

			if (result.success) {
				leads = leads.filter((l) => l.id !== lead.id);
				showDeleteConfirm = false;
				leadToDelete = null;
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Delete Lead Error:', error);
			toast.error('An error occurred while deleting the lead.');
		} finally {
			isDeleting = false;
		}
	}

	function showDeleteConfirmation(lead: any) {
		leadToDelete = lead;
		showDeleteConfirm = true;
	}

	function cancelDelete() {
		if (isDeleting) return;
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	function confirmDelete() {
		if (leadToDelete) {
			deleteLead(leadToDelete);
		}
	}
</script>

<section class="space-y-6">
	<h2 class="text-2xl font-semibold text-primary">Customer Inquiry</h2>

	{#if errorMessage}
		<div class="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4">
			<AlertCircle class="h-5 w-5 text-destructive" />
			<p class="font-medium text-destructive">{errorMessage}</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#if leads.length > 0}
				{#each limitedLeads as lead (lead.id)}
					<Card.Root>
						<Card.Header>
							<div class="flex items-start justify-between gap-2">
								<Card.Title class="text-xl">{lead.name}</Card.Title>
								<Badge variant={getCategoryVariant(lead.category)} class="shrink-0">
									{getCategoryLabel(lead.category)}
								</Badge>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							<!-- Lead Details -->
							<div class="space-y-2 text-sm">
								<div class="flex items-center gap-2">
									<span class="font-medium">Received:</span>
									<Badge variant={getRelativeTime(lead.created_at).variant}>
										{getRelativeTime(lead.created_at).text}
									</Badge>
								</div>

								<div class="flex flex-wrap items-center gap-3">
									<div class="flex items-center gap-2">
										<span class="font-medium">Phone:</span>
										<span>{lead.phone}</span>
									</div>
									<Button
										size="sm"
										onclick={() => makeCall(lead.phone, lead.name, lead.id)}
										class="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500"
									>
										<Phone class="h-4 w-4" />
										CALL NOW
									</Button>
								</div>

								{#if lead.email}
									<div>
										<span class="font-medium">Email:</span>
										<span class="ml-2">{lead.email}</span>
									</div>
								{/if}

								<div>
									<span class="font-medium">Zip Code:</span>
									<span class="ml-2">{lead.pin_code}</span>
								</div>

								<div>
									<span class="font-medium">Type:</span>
									<span class="ml-2">{lead.type}</span>
								</div>

								<div>
									<span class="font-medium">Customer Comment:</span>
									<span class="ml-2">{lead.comment}</span>
								</div>

								{#if lead.sv_comment_for_businesses}
									<div
										class="rounded-md border-l-4 border-blue-500 bg-blue-50 p-3 dark:bg-blue-950/30"
									>
										<span class="font-medium text-blue-700 dark:text-blue-400"
											>Solarvipani.com Comment:</span
										>
										<span class="ml-2 italic text-blue-900 dark:text-blue-200"
											>{lead.sv_comment_for_businesses}</span
										>
									</div>
								{/if}
							</div>

							<!-- Stage and Status Controls (only for claimed/exclusive leads) -->
							{#if lead.category !== 1}
								<div class="flex flex-wrap gap-4 border-t pt-4">
									<div class="flex flex-col gap-2">
										<Label for="stage-{lead.id}">Stage</Label>
										<Select.Root type="single" bind:value={lead.stage}>
											<Select.Trigger id="stage-{lead.id}" class="w-[200px]">
												{#if lead.category === 2}
													{NON_EXCLUSIVE_CLAIMED_STAGES_MAP[lead.stage] || 'Select stage...'}
												{:else}
													{STAGES_MAP[lead.stage] || 'Select stage...'}
												{/if}
											</Select.Trigger>
											<Select.Content>
												{#if lead.category === 2}
													{#each Object.entries(NON_EXCLUSIVE_CLAIMED_STAGES_MAP).filter(([key]) => key !== 'all') as [value, label]}
														<Select.Item value={Number(value)} onchange={() => updateLead(lead)}>
															{label}
														</Select.Item>
													{/each}
												{:else}
													{#each Object.entries(STAGES_MAP).filter(([key]) => key !== 'all') as [value, label]}
														<Select.Item value={Number(value)} onchange={() => updateLead(lead)}>
															{label}
														</Select.Item>
													{/each}
												{/if}
											</Select.Content>
										</Select.Root>
									</div>

									<div class="flex flex-col gap-2">
										<Label for="status-{lead.id}">Status</Label>
										<Select.Root type="single" bind:value={lead.status}>
											<Select.Trigger id="status-{lead.id}" class="w-[150px]">
												{lead.status ? 'Active' : 'Inactive'}
											</Select.Trigger>
											<Select.Content>
												<Select.Item value={true} onchange={() => updateLead(lead)}>Active</Select.Item>
												<Select.Item value={false} onchange={() => updateLead(lead)}
													>Inactive</Select.Item
												>
											</Select.Content>
										</Select.Root>
									</div>
								</div>

								<LeadProgressBar
									currentStage={lead.stage}
									leadCategory={lead.category}
									isActive={lead.status}
								/>

								<!-- Next Action -->
								{@const nextAction = getNextAction(lead.stage, lead.category, lead.status)}
								{#if nextAction}
									<div
										class="rounded-md border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/30"
									>
										<span class="font-semibold text-blue-700 dark:text-blue-400">Next Action:</span>
										<span class="ml-2 italic text-blue-900 dark:text-blue-200">{nextAction}</span>
									</div>
								{/if}
							{/if}

							<!-- Action Buttons -->
							<div class="flex justify-end border-t pt-4">
								{#if lead.category === 1 && lead.claim_count > 4}
									<p class="font-semibold text-green-600">
										Not Available. Claimed by Other Business
									</p>
								{:else if lead.category === 1}
									{#if lead.claim_count > 0}
										<p class="text-xs text-muted-foreground mb-1">
											Claimed by {lead.claim_count} other {lead.claim_count === 1 ? 'business' : 'businesses'} in {lead.county}
										</p>
									{/if}
									<Button
										onclick={() => claimLead(lead.id, businessInfo.id)}
										disabled={isClaiming}
										class="bg-green-600 hover:bg-green-700"
									>
										{isClaiming ? 'Claiming...' : 'Claim Now (Free)'}
									</Button>
								{:else if lead.category !== 1 && !lead.status}
									<Button variant="destructive" onclick={() => showDeleteConfirmation(lead)}>
										Delete Lead
									</Button>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>
				{/each}

				{#if leads.length > 5}
					<Card.Root class="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
						<Card.Content class="flex flex-col items-center gap-2 py-4">
							<p class="font-medium text-blue-700 dark:text-blue-400">
								Showing 5 of {leads.length} leads.
								<a
									href="/us/{businessSlug}/crm"
									class="underline hover:text-blue-900 dark:hover:text-blue-200"
								>
									View all leads in CRM
								</a>
							</p>
						</Card.Content>
					</Card.Root>
				{/if}
			{:else}
				<!-- Dummy Lead -->
				<Card.Root class="border-dashed opacity-70">
					<Card.Header>
						<div class="flex items-start justify-between gap-2">
							<Card.Title class="text-xl">{dummyLead.name}</Card.Title>
							<Badge variant="outline" class="shrink-0">Test Lead</Badge>
						</div>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="font-medium">Received:</span>
								<Badge variant={getRelativeTime(dummyLead.created_at).variant}>
									{getRelativeTime(dummyLead.created_at).text}
								</Badge>
							</div>

							<div class="flex flex-wrap items-center gap-3">
								<div class="flex items-center gap-2">
									<span class="font-medium">Phone:</span>
									<span>{dummyLead.phone}</span>
								</div>
								<Button size="sm" disabled class="gap-2 bg-gray-400">
									<Phone class="h-4 w-4" />
									CALL NOW
								</Button>
							</div>

							<div>
								<span class="font-medium">Email:</span>
								<span class="ml-2">{dummyLead.email}</span>
							</div>

							<div>
								<span class="font-medium">Zip Code:</span>
								<span class="ml-2">{dummyLead.pin_code}</span>
							</div>

							<div>
								<span class="font-medium">Type:</span>
								<span class="ml-2">{dummyLead.type}</span>
							</div>

							<div>
								<span class="font-medium">Customer Comment:</span>
								<span class="ml-2">{dummyLead.comment}</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>

		<!-- Open CRM Button -->
		<div class="flex justify-center border-t pt-6">
			<Button asChild size="lg" class="gap-2">
				<a href="/us/{businessSlug}/crm">
					Open CRM
					<ExternalLink class="h-4 w-4" />
				</a>
			</Button>
		</div>
	{/if}
</section>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteConfirm}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Confirm Delete</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete the lead for <strong>{leadToDelete?.name}</strong>?
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="gap-2">
			<Button variant="outline" onclick={cancelDelete} disabled={isDeleting}>Cancel</Button>
			<Button variant="destructive" onclick={confirmDelete} disabled={isDeleting}>
				{isDeleting ? 'Deleting...' : 'Delete Lead'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
