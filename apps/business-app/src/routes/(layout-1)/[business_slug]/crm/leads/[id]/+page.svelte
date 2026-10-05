<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import LeadProgressBar from '$lib/components/LeadProgressBar.svelte';
	import { ArrowLeft, ArrowRight, Trophy } from '@lucide/svelte';
	import { getStageLabel } from '$lib/constants/lead';
	import { getRelativeTime } from '$lib/in/utils/lead-helpers';
	import { updateLeadAPI } from '$lib/in/actions/lead-api';

	let lead = $derived($page.data.lead as any);
	let backHref = $derived(`/${$page.params.business_slug}/crm`);
	let status = $derived(
		lead.category === 1 ? 'Available' : !lead.status ? 'Inactive' : getStageLabel(lead.stage, lead.category)
	);

	let nextStageLabel = $derived.by(() => {
		if (lead.stage >= 3 || !lead.status) return null;
		const labels: Record<number, string> = { 0: 'Mark Contacted', 1: 'Mark Proposal Sent', 2: 'Mark as Won' };
		return labels[lead.stage] ?? null;
	});

	let isSaving = $state(false);
	let notes = $state('');
	let isSavingNotes = $state(false);

	// Reset the editor whenever the saved notes change (load or save)
	$effect(() => {
		notes = lead.business_notes ?? '';
	});

	async function saveNotes() {
		isSavingNotes = true;
		const result = await updateLeadAPI({
			id: lead.id,
			stage: Number(lead.stage),
			status: lead.status,
			business_notes: notes
		});
		if (result.success) {
			toast.success('Notes saved');
			await invalidateAll();
		} else {
			toast.error(result.error || 'Failed to save notes');
		}
		isSavingNotes = false;
	}
	let showDeactivateConfirm = $state(false);

	async function updateLead(updates: { stage?: number; status?: boolean }) {
		isSaving = true;
		const result = await updateLeadAPI({
			id: lead.id,
			stage: updates.stage ?? Number(lead.stage),
			status: updates.status ?? lead.status,
			business_notes: lead.business_notes
		});
		if (result.success) {
			await invalidateAll();
		} else {
			toast.error(result.error || 'Failed to update lead');
		}
		isSaving = false;
	}

	async function confirmDeactivate() {
		await updateLead({ status: false });
		showDeactivateConfirm = false;
	}
</script>

<svelte:head>
	<title>{lead.name} | Leads | Solar Vipani</title>
</svelte:head>

<div class="max-w-2xl space-y-4">
	<a href={backHref} class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
		<ArrowLeft size={16} />
		Leads
	</a>

	<Card.Root>
		<Card.Header class="flex-row items-center justify-between">
			<Card.Title class="text-xl font-bold">{lead.name}</Card.Title>
			<Badge variant="secondary">{status}</Badge>
		</Card.Header>

		<Card.Content>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
				<dt class="text-muted-foreground">Phone</dt>
				<dd class="text-foreground">{lead.phone ?? '-'}</dd>

				{#if lead.email}
					<dt class="text-muted-foreground">Email</dt>
					<dd class="text-foreground break-all">{lead.email}</dd>
				{/if}

				<dt class="text-muted-foreground">Location</dt>
				<dd class="text-foreground">{lead.pin_code}{lead.district ? ` (${lead.district})` : ''}</dd>

				{#if lead.type}
					<dt class="text-muted-foreground">Property type</dt>
					<dd class="text-foreground">{lead.type}</dd>
				{/if}

				<dt class="text-muted-foreground">Received</dt>
				<dd class="text-foreground">{getRelativeTime(lead.created_at).text}</dd>

				{#if lead.comment}
					<dt class="text-muted-foreground">Comment</dt>
					<dd class="text-foreground">{lead.comment}</dd>
				{/if}

				{#if lead.qualification_score != null}
					<dt class="text-muted-foreground">Qualification score</dt>
					<dd class="text-foreground">{lead.qualification_score}/10</dd>
				{/if}

				{#if lead.sv_comment_for_businesses}
					<dt class="text-muted-foreground">Solar Vipani note</dt>
					<dd class="text-foreground">{lead.sv_comment_for_businesses}</dd>
				{/if}
			</dl>
		</Card.Content>
	</Card.Root>

	{#if lead.category !== 1}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-base font-semibold">Stage</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<LeadProgressBar currentStage={lead.stage} leadCategory={lead.category} isActive={lead.status} />

				{#if lead.status}
					<div class="flex flex-col gap-2 sm:flex-row">
						{#if nextStageLabel}
							<Button class="flex-1" onclick={() => updateLead({ stage: lead.stage + 1 })} disabled={isSaving}>
								{#if lead.stage === 2}
									<Trophy size={16} />
								{:else}
									<ArrowRight size={16} />
								{/if}
								{isSaving ? 'Updating...' : nextStageLabel}
							</Button>
						{/if}
						<Button
							variant="outline"
							class="text-destructive hover:text-destructive"
							onclick={() => (showDeactivateConfirm = true)}
							disabled={isSaving}
						>
							Mark Inactive
						</Button>
					</div>
				{:else}
					<Button variant="outline" onclick={() => updateLead({ status: true })} disabled={isSaving}>
						{isSaving ? 'Updating...' : 'Mark Active'}
					</Button>
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-base font-semibold">Internal Notes</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-3">
				<Textarea bind:value={notes} placeholder="Add your private notes about this lead..." rows={4} />
				<Button onclick={saveNotes} disabled={isSavingNotes || notes === (lead.business_notes ?? '')}>
					{isSavingNotes ? 'Saving...' : 'Save Notes'}
				</Button>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<Dialog.Root bind:open={showDeactivateConfirm}>
	<Dialog.Content class="max-w-[480px]">
		<Dialog.Header>
			<Dialog.Title>Mark as Inactive?</Dialog.Title>
		</Dialog.Header>
		<p class="m-0 leading-relaxed text-foreground">
			This will remove <strong>{lead.name}</strong>'s inquiry from your active leads.
		</p>
		<Dialog.Footer class="max-sm:flex-col">
			<Button
				variant="secondary"
				onclick={() => (showDeactivateConfirm = false)}
				disabled={isSaving}
				class="max-sm:w-full"
			>
				Cancel
			</Button>
			<Button variant="destructive" onclick={confirmDeactivate} disabled={isSaving} class="max-sm:w-full">
				{isSaving ? 'Deactivating...' : 'Yes, Mark Inactive'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
