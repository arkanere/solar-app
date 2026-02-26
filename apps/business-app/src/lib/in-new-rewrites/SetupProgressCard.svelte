<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { isDarkMode } from '$lib/stores/theme.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { cn } from '$lib/utils';
	import { Target, AlertCircle } from '@lucide/svelte';

	type Task = {
		id: string;
		title: string;
		description: string;
		completed: boolean;
		action: string | null;
		actionLabel: string;
		priority: number;
	};

	export type SetupProgressCardProps = {
		business?: { description?: string; website?: string };
		businessSlug?: string;
		projectsCount?: number;
		claimedLeadsCount?: number;
		onOpenEditProfile?: () => void;
	};

	let {
		business = {},
		businessSlug = '',
		projectsCount = 0,
		claimedLeadsCount = 0,
		onOpenEditProfile = () => {}
	}: SetupProgressCardProps = $props();

	let darkMode = $derived($isDarkMode);

	let isExpanded = $state(true);

	onMount(() => {
		if (browser) {
			const stored = localStorage.getItem('setupProgressExpanded');
			if (stored !== null) {
				isExpanded = JSON.parse(stored);
			}
		}
	});

	function toggleExpanded() {
		isExpanded = !isExpanded;
		if (browser) {
			localStorage.setItem('setupProgressExpanded', JSON.stringify(isExpanded));
		}
	}

	let tasks = $derived([
		{
			id: 'complete-details',
			title: 'Complete Business Details',
			description: 'Add description',
			completed: !!business.description,
			action: 'openEditProfile',
			actionLabel: 'Complete Profile',
			priority: 9
		},
		{
			id: 'claim-lead',
			title: 'Claim Your First Lead',
			description: '',
			completed: claimedLeadsCount > 0,
			action: `/in/${businessSlug}/crm`,
			actionLabel: 'Go to CRM',
			priority: 8
		},
		{
			id: 'post-project',
			title: 'Post Your First Project',
			description: 'Showcase your work to attract customers',
			completed: projectsCount > 0,
			action: `/in/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project',
			priority: 7
		},
	]);

	let completedCount = $derived(tasks.filter((t) => t.completed).length);
	let totalCount = $derived(tasks.length);
	let progressPercent = $derived(Math.round((completedCount / totalCount) * 100));

	let visibleTasks = $derived(
		tasks
			.filter((t) => !t.completed)
			.sort((a, b) => b.priority - a.priority)
			.slice(0, 6)
	);

	function handleAction(task: Task) {
		if (!task.action) return;

		if (task.action === 'openEditProfile') {
			onOpenEditProfile();
		} else {
			window.location.href = task.action;
		}
	}
</script>

{#if completedCount < totalCount}
<Card.Root class="mb-8 overflow-hidden transition-shadow hover:shadow-md">
	<Card.Header class="p-0 border-b">
		<Button
			variant="ghost"
			class="flex justify-between items-center p-6 rounded-none w-full text-left h-auto hover:bg-transparent"
			onclick={toggleExpanded}
			aria-expanded={isExpanded}
		>
			<div class="flex items-center gap-4 flex-1">
				<Target class="shrink-0 text-accent" size={28} strokeWidth={2} />
				<div>
					<Card.Title class="text-xl font-bold text-accent max-sm:text-lg"
						>Setup Your Business Account</Card.Title
					>
					{#if !isExpanded}
						<Card.Description class="mt-1"
							>Progress: {completedCount} of {totalCount} complete ({progressPercent}%)</Card.Description
						>
					{/if}
				</div>
			</div>
			<span
				class="w-8 h-8 flex items-center justify-center rounded bg-muted text-foreground text-xl font-bold shrink-0 transition-colors hover:bg-muted/80"
			>
				{isExpanded ? '─' : '+'}
			</span>
		</Button>
	</Card.Header>

	{#if !isExpanded}
		<Card.Content class="pb-6 pt-0">
			<Progress value={progressPercent} class="h-2.5" />
		</Card.Content>
	{/if}

	{#if isExpanded}
		<Card.Content>
			<div class="mb-6">
				<p class="m-0 mb-2 text-sm font-semibold text-foreground">
					Progress: {completedCount} of {totalCount} complete ({progressPercent}%)
				</p>
				<Progress value={progressPercent} class="h-2.5" />
			</div>

			<ul class="list-none p-0 m-0">
				{#each visibleTasks as task}
					<li
						class={cn(
							'flex justify-between items-start gap-4 p-4 mb-3 rounded-lg transition-colors',
							'max-sm:flex-col max-sm:items-stretch',
							'bg-warning-muted border-l-[3px] border-l-warning'
						)}
					>
						<div class="flex items-start gap-3 flex-1">
							<div class="shrink-0">
								<AlertCircle size={20} strokeWidth={2} class="text-warning" />
							</div>
							<div class="flex-1">
								<h4 class="m-0 mb-1 text-base font-semibold text-foreground">{task.title}</h4>
								{#if task.description}
									<p class="m-0 text-sm text-muted-foreground leading-relaxed">
										{task.description}
									</p>
								{/if}
							</div>
						</div>
						{#if task.action}
							<Button size="sm" class="shrink-0 max-sm:w-full" onclick={() => handleAction(task)}>
								{task.actionLabel} →
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</Card.Content>
	{/if}
</Card.Root>
{/if}
