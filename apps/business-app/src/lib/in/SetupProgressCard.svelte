<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { isDarkMode } from '$lib/stores/theme.svelte.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	let {
		business = {},
		businessSlug = '',
		projectsCount = 0,
		referrersCount = 0,
		proposalsCount = 0,
		claimedLeadsCount = 0,
		onOpenEditProfile = () => {}
	} = $props();

	let darkMode = $derived($isDarkMode);

	// State for expand/collapse
	let isExpanded = $state(true);

	// Load expanded state from localStorage
	onMount(() => {
		if (browser) {
			const stored = localStorage.getItem('setupProgressExpanded');
			if (stored !== null) {
				isExpanded = JSON.parse(stored);
			}
		}
	});

	// Toggle expand/collapse
	function toggleExpanded() {
		isExpanded = !isExpanded;
		if (browser) {
			localStorage.setItem('setupProgressExpanded', JSON.stringify(isExpanded));
		}
	}

	// Define tasks with completion logic
	let tasks = $derived([
		{
			id: 'profile-created',
			title: 'Business Profile Created',
			description: '',
			completed: true, // Always true
			action: null,
			actionLabel: ''
		},
		{
			id: 'complete-details',
			title: 'Complete Business Details',
			description: 'Add description, website, and contact info',
			completed: !!business.description && !!business.website,
			action: 'openEditProfile',
			actionLabel: 'Complete Profile'
		},
		{
			id: 'post-project',
			title: 'Post Your First Project',
			description: 'Showcase your work to attract customers',
			completed: projectsCount > 0,
			action: `/in/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project'
		},
		{
			id: 'add-referrers',
			title: 'Add Referrers',
			description: 'Build your referral network',
			completed: referrersCount > 0,
			action: `/in/${businessSlug}/referral`,
			actionLabel: 'Add Referrer'
		},
		{
			id: 'claim-lead',
			title: 'Claim Your First Lead',
			description: '',
			completed: claimedLeadsCount > 0,
			action: `/in/${businessSlug}/crm`,
			actionLabel: 'Go to CRM'
		},
		{
			id: 'create-proposal',
			title: 'Create First Proposal',
			description: 'Generate professional quotes for customers',
			completed: proposalsCount > 0,
			action: `/in/${businessSlug}/proposal`,
			actionLabel: 'Create Proposal'
		}
	]);

	// Calculate progress
	let completedCount = $derived(tasks.filter(t => t.completed).length);
	let totalCount = $derived(tasks.length);
	let progressPercent = $derived(Math.round((completedCount / totalCount) * 100));

	// Handle action clicks
	function handleAction(task) {
		if (!task.action) return;

		if (task.action === 'openEditProfile') {
			onOpenEditProfile();
		} else {
			// Navigate to URL
			window.location.href = task.action;
		}
	}
</script>

<Card.Root class="mb-8 overflow-hidden transition-shadow hover:shadow-md">
	<!-- Card Header -->
	<Card.Header class="p-0 border-b">
		<Button
			variant="ghost"
			class="flex justify-between items-center p-6 rounded-none w-full text-left h-auto"
			onclick={toggleExpanded}
			aria-expanded={isExpanded}
		>
			<div class="flex items-center gap-4 flex-1">
				<span class="text-2xl">🎯</span>
				<div>
					<Card.Title class="text-xl font-bold text-accent max-sm:text-lg">Setup Your Business Account</Card.Title>
					{#if !isExpanded}
						<Card.Description class="mt-1">Progress: {completedCount} of {totalCount} complete ({progressPercent}%)</Card.Description>
					{/if}
				</div>
			</div>
			<span class="w-8 h-8 flex items-center justify-center rounded bg-muted text-foreground text-xl font-bold shrink-0 transition-colors hover:bg-muted/80">
				{isExpanded ? '─' : '+'}
			</span>
		</Button>
	</Card.Header>

	<!-- Collapsed: Show only progress bar -->
	{#if !isExpanded}
		<Card.Content class="pb-6 pt-0">
			<div class="h-2.5 bg-muted rounded-md overflow-hidden">
				<div class="h-full rounded-md transition-[width] duration-300 bg-accent" style="width: {progressPercent}%"></div>
			</div>
		</Card.Content>
	{/if}

	<!-- Expanded: Show full checklist -->
	{#if isExpanded}
		<Card.Content>
			<!-- Progress Info -->
			<div class="mb-6">
				<p class="m-0 mb-2 text-sm font-semibold text-foreground">Progress: {completedCount} of {totalCount} complete ({progressPercent}%)</p>
				<div class="h-2.5 bg-muted rounded-md overflow-hidden">
					<div class="h-full rounded-md transition-[width] duration-300 bg-accent" style="width: {progressPercent}%"></div>
				</div>
			</div>

			<!-- Task List -->
			<ul class="list-none p-0 m-0">
				{#each tasks as task}
					<li class={cn(
						"flex justify-between items-start gap-4 p-4 mb-3 rounded-lg transition-colors",
						"max-sm:flex-col max-sm:items-stretch",
						task.completed
							? "bg-success-muted border-l-[3px] border-l-success"
							: "bg-warning-muted border-l-[3px] border-l-warning"
					)}>
						<div class="flex items-start gap-3 flex-1">
							<span class="text-xl shrink-0">
								{task.completed ? '✅' : '⚠️'}
							</span>
							<div class="flex-1">
								<h4 class="m-0 mb-1 text-base font-semibold text-foreground">{task.title}</h4>
								{#if task.description}
									<p class="m-0 text-sm text-muted-foreground leading-relaxed">{task.description}</p>
								{/if}
							</div>
						</div>
						{#if !task.completed && task.action}
							<Button
								size="sm"
								class="shrink-0 max-sm:w-full"
								onclick={() => handleAction(task)}
							>
								{task.actionLabel} →
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</Card.Content>
	{/if}
</Card.Root>
