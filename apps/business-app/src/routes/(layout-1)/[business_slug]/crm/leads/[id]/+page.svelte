<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import LeadProgressBar from '$lib/components/LeadProgressBar.svelte';
	import { ArrowLeft, ArrowRight, Trophy } from '@lucide/svelte';
	import { getStageLabel, type LeadStage } from '$lib/constants/lead';
	import { getRelativeTime } from '$lib/in/utils/lead-helpers';
	import { updateLeadAPI } from '$lib/in/actions/lead-api';

	let lead = $derived($page.data.lead as any);
	let backHref = $derived(`/${$page.params.business_slug}/crm`);

	let nextStageLabel = $derived.by(() => {
		if (lead.stage >= 3 || !lead.status) return null;
		const labels: Record<number, string> = { 0: 'Mark Contacted', 1: 'Mark Proposal Sent', 2: 'Mark as Won' };
		return labels[lead.stage] ?? null;
	});

	// Lets a mistaken stage change be undone. Won is excluded since it creates a project.
	let prevStageLabel = $derived(
		lead.status && lead.stage > 0 && lead.stage < 3 ? getStageLabel((lead.stage - 1) as LeadStage, lead.category) : null
	);

	let isSaving = $state(false);
	// Which stage button is saving, so only that one shows "Updating..."
	let savingDirection = $state<'forward' | 'back' | null>(null);
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

	async function moveStage(direction: 'forward' | 'back') {
		savingDirection = direction;
		await updateLead({ stage: lead.stage + (direction === 'forward' ? 1 : -1) });
		savingDirection = null;
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

	<div class="flex items-center gap-3">
		<h1 class="min-w-0 truncate text-2xl font-semibold text-foreground">{lead.name}</h1>
		{#if lead.category === 1}
			<Badge variant="secondary">Available</Badge>
		{/if}
	</div>

	<Card.Root class="gap-0 py-0 divide-y">
		<section class="p-6">
			<h2 class="mb-4 text-sm font-semibold text-foreground">Details</h2>
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
		</section>

		{#if lead.category !== 1}
			<section class="p-6 space-y-4">
				<h2 class="text-sm font-semibold text-foreground">Stage</h2>
				<LeadProgressBar currentStage={lead.stage} leadCategory={lead.category} isActive={lead.status} />

				{#if lead.status}
					<div class="flex flex-wrap gap-2">
						{#if nextStageLabel}
							<Button onclick={() => moveStage('forward')} disabled={isSaving}>
								{#if lead.stage === 2}
									<Trophy size={16} />
								{:else}
									<ArrowRight size={16} />
								{/if}
								{savingDirection === 'forward' ? 'Updating...' : nextStageLabel}
							</Button>
						{/if}
						{#if prevStageLabel}
							<Button variant="outline" onclick={() => moveStage('back')} disabled={isSaving}>
								<ArrowLeft size={16} />
								{savingDirection === 'back' ? 'Updating...' : `Back to ${prevStageLabel}`}
							</Button>
						{/if}
					</div>
				{:else}
					<Button variant="outline" onclick={() => updateLead({ status: true })} disabled={isSaving}>
						{isSaving ? 'Updating...' : 'Mark Active'}
					</Button>
				{/if}
			</section>

			<section class="p-6 space-y-3">
				<h2 class="text-sm font-semibold text-foreground">Internal Notes</h2>
				<Textarea bind:value={notes} placeholder="Add your private notes about this lead..." rows={4} />
				<Button onclick={saveNotes} disabled={isSavingNotes || notes === (lead.business_notes ?? '')}>
					{isSavingNotes ? 'Saving...' : 'Save Notes'}
				</Button>
			</section>
		{/if}
	</Card.Root>
</div>
