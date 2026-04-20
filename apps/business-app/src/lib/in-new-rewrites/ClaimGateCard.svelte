<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ShieldAlert, Check, X } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type ClaimGateStatus = {
		totalClaimedLeads: number;
		staleLeadsCount: number;
		staleLeadsPercent: number;
		projectsCount: number;
		recentProjectExists: boolean;
		profileComplete: boolean;
		isBlocked: boolean;
		reasons: string[];
	};

	type Props = {
		claimGate: ClaimGateStatus;
		businessSlug: string;
		onOpenEditProfile?: () => void;
	};

	let { claimGate, businessSlug, onOpenEditProfile = () => {} }: Props = $props();

	let requirements = $derived([
		{
			label: 'Update your leads',
			detail: `${claimGate.staleLeadsCount} of ${claimGate.totalClaimedLeads} stuck at "Claimed"`,
			met: claimGate.staleLeadsPercent <= 50,
			action: `/in/${businessSlug}/crm`,
			actionLabel: 'Open CRM'
		},
		{
			label: 'Post 6+ projects',
			detail: `${claimGate.projectsCount}/6 posted`,
			met: claimGate.projectsCount >= 6,
			action: `/in/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project'
		},
		{
			label: 'Recent project (last 60 days)',
			detail: claimGate.recentProjectExists ? 'Done' : 'No recent project',
			met: claimGate.recentProjectExists,
			action: `/in/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project'
		},
		{
			label: 'Complete business profile',
			detail: claimGate.profileComplete ? 'Done' : 'Missing fields',
			met: claimGate.profileComplete,
			action: 'openEditProfile',
			actionLabel: 'Edit Profile'
		}
	]);

	function handleAction(action: string) {
		if (action === 'openEditProfile') {
			onOpenEditProfile();
		} else {
			window.location.href = action;
		}
	}
</script>

{#if claimGate.isBlocked}
	<Card.Root class="mb-6 border-destructive/40 bg-destructive/5">
		<Card.Header class="pb-3">
			<div class="flex items-center gap-3">
				<ShieldAlert class="text-destructive shrink-0" size={24} />
				<div>
					<Card.Title class="text-lg font-bold text-destructive">Claiming Paused</Card.Title>
					<Card.Description class="mt-1">
						Complete these requirements to claim new leads
					</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			<ul class="list-none p-0 m-0 space-y-3">
				{#each requirements as req}
					<li class={cn(
						'flex items-center justify-between gap-3 p-3 rounded-lg',
						req.met ? 'bg-success/10' : 'bg-destructive/5 border border-destructive/20'
					)}>
						<div class="flex items-center gap-3 flex-1 min-w-0">
							{#if req.met}
								<Check size={18} class="text-success shrink-0" />
							{:else}
								<X size={18} class="text-destructive shrink-0" />
							{/if}
							<div class="min-w-0">
								<p class="text-sm font-semibold text-foreground m-0">{req.label}</p>
								<p class="text-xs text-muted-foreground m-0">{req.detail}</p>
							</div>
						</div>
						{#if !req.met}
							<Button size="sm" variant="outline" class="shrink-0" onclick={() => handleAction(req.action)}>
								{req.actionLabel}
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
{/if}
