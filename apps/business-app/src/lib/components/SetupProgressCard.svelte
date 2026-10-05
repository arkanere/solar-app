<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { AlertCircle, ChevronDown } from '@lucide/svelte';

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
	<div class="rounded-lg border">
		<button
			type="button"
			class="flex w-full items-center gap-3 px-4 py-3 text-left"
			onclick={toggleExpanded}
			aria-expanded={isExpanded}
		>
			<AlertCircle class="shrink-0 text-warning" size={18} strokeWidth={2} />
			<span class="flex-1 text-sm font-medium text-foreground">
				Pending tasks
				<span class="ml-1 text-muted-foreground">· {totalCount - completedCount} left</span>
			</span>
			<ChevronDown
				size={16}
				class={cn(
					'shrink-0 text-muted-foreground transition-transform duration-200',
					isExpanded && 'rotate-180'
				)}
			/>
		</button>

		{#if isExpanded}
			<ul class="list-none p-0 m-0 border-t divide-y">
				{#each visibleTasks as task}
					<li
						class="flex justify-between items-center gap-4 px-4 py-3 max-sm:flex-col max-sm:items-stretch"
					>
						<div class="flex-1">
							<p class="m-0 text-sm font-medium text-foreground">{task.title}</p>
							{#if task.description}
								<p class="m-0 text-sm text-muted-foreground">{task.description}</p>
							{/if}
						</div>
						{#if task.action}
							<Button
								size="sm"
								variant="outline"
								class="shrink-0 max-sm:w-full"
								onclick={() => handleAction(task)}
							>
								{task.actionLabel}
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
