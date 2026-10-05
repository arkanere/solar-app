<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { Target, AlertCircle, ChevronDown } from '@lucide/svelte';

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
		business?: { phonenumber?: string; email?: string; description?: string; website?: string; google_maps_link?: string; brands?: number[] };
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

	let isExpanded = $state(false);

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
			id: 'add-contact',
			title: 'Add Phone & Email',
			description: 'Required to claim leads — customers use these to contact you',
			completed: !!business.phonenumber?.trim() && !!business.email?.trim(),
			action: 'openEditProfile',
			actionLabel: 'Add Contact',
			priority: 10
		},
		{
			id: 'add-brands',
			title: 'Add Brands You Work With',
			description: 'Let customers know which solar panel brands you install',
			completed: Array.isArray(business.brands) && business.brands.length > 0,
			action: 'openEditProfile',
			actionLabel: 'Add Brands',
			priority: 9
		},
		{
			id: 'add-maps-link',
			title: 'Add Google Maps Link',
			description: 'Help customers find your business location',
			completed: !!business.google_maps_link,
			action: 'openEditProfile',
			actionLabel: 'Add Maps Link',
			priority: 8
		},
		{
			id: 'add-description',
			title: 'Add Business Description',
			description: 'Tell customers what makes your business stand out',
			completed: !!business.description,
			action: 'openEditProfile',
			actionLabel: 'Add Description',
			priority: 7
		},
		{
			id: 'claim-lead',
			title: 'Claim Your First Lead',
			description: '',
			completed: claimedLeadsCount > 0,
			action: `/${businessSlug}/crm`,
			actionLabel: 'Go to CRM',
			priority: 6
		},
		{
			id: 'post-project',
			title: 'Post Your First Project',
			description: 'Showcase your work to attract customers',
			completed: projectsCount > 0,
			action: `/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project',
			priority: 5
		}
	]);

	let completedCount = $derived(tasks.filter((t) => t.completed).length);
	let totalCount = $derived(tasks.length);

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
<Card.Root class="mb-4 overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md">
	<Card.Header class="p-0">
		<Button
			variant="ghost"
			class="flex justify-between items-center gap-4 p-5 rounded-none w-full text-left h-auto hover:bg-transparent"
			onclick={toggleExpanded}
			aria-expanded={isExpanded}
		>
			<div class="flex items-center gap-4 flex-1 min-w-0">
				<Target class="shrink-0 text-accent-strong" size={24} strokeWidth={2} />
				<div class="flex-1 min-w-0">
					<Card.Title class="text-lg font-semibold text-foreground max-sm:text-base"
						>Pending Tasks</Card.Title
					>
				</div>
			</div>
			<ChevronDown
				size={18}
				class={cn(
					'shrink-0 text-muted-foreground transition-transform duration-200',
					isExpanded && 'rotate-180'
				)}
			/>
		</Button>
	</Card.Header>

	{#if isExpanded}
		<Card.Content class="border-t px-5 pt-4 pb-5">
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
