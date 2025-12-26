<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { isDarkMode } from '$lib/in/themeStore';

	export let business = {};
	export let businessSlug = '';
	export let projectsCount = 0;
	export let referrersCount = 0;
	export let proposalsCount = 0;
	export let claimedLeadsCount = 0;

	const dispatch = createEventDispatcher();

	$: darkMode = $isDarkMode;

	// State for expand/collapse
	let isExpanded = true;

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
	$: tasks = [
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
	];

	// Calculate progress
	$: completedCount = tasks.filter(t => t.completed).length;
	$: totalCount = tasks.length;
	$: progressPercent = Math.round((completedCount / totalCount) * 100);

	// Handle action clicks
	function handleAction(task) {
		if (!task.action) return;

		if (task.action === 'openEditProfile') {
			dispatch('openEditProfile');
		} else {
			// Navigate to URL
			window.location.href = task.action;
		}
	}
</script>

<div class="setup-progress-card {darkMode ? 'dark' : 'light'}">
	<!-- Card Header -->
	<button class="card-header" on:click={toggleExpanded}>
		<div class="header-content">
			<span class="header-icon">🎯</span>
			<div class="header-text">
				<h3>Setup Your Business Account</h3>
				{#if !isExpanded}
					<p class="progress-summary">Progress: {completedCount} of {totalCount} complete ({progressPercent}%)</p>
				{/if}
			</div>
		</div>
		<button class="toggle-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
			{isExpanded ? '─' : '+'}
		</button>
	</button>

	<!-- Collapsed: Show only progress bar -->
	{#if !isExpanded}
		<div class="progress-bar-container collapsed">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progressPercent}%"></div>
			</div>
		</div>
	{/if}

	<!-- Expanded: Show full checklist -->
	{#if isExpanded}
		<div class="card-body">
			<!-- Progress Info -->
			<div class="progress-info">
				<p class="progress-text">Progress: {completedCount} of {totalCount} complete ({progressPercent}%)</p>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
			</div>

			<!-- Task List -->
			<ul class="task-list">
				{#each tasks as task}
					<li class="task-item {task.completed ? 'completed' : 'incomplete'}">
						<div class="task-header">
							<span class="task-icon">
								{task.completed ? '✅' : '⚠️'}
							</span>
							<div class="task-info">
								<h4 class="task-title">{task.title}</h4>
								{#if task.description}
									<p class="task-description">{task.description}</p>
								{/if}
							</div>
						</div>
						{#if !task.completed && task.action}
							<button class="task-action-btn" on:click={() => handleAction(task)}>
								{task.actionLabel} →
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.setup-progress-card {
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
		margin-bottom: 2rem;
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}

	.setup-progress-card:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
	}

	.setup-progress-card.light {
		background-color: #ffffff;
		border: 1px solid #e5e7eb;
	}

	.setup-progress-card.dark {
		background-color: #333;
		border: 1px solid #444;
	}

	/* Card Header */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: none;
		border: none;
		border-bottom: 1px solid #e5e7eb;
		cursor: pointer;
		width: 100%;
		text-align: left;
		transition: background-color 0.2s ease;
	}

	.dark .card-header {
		border-bottom-color: #444;
	}

	.card-header:hover {
		background-color: #f9fafb;
	}

	.dark .card-header:hover {
		background-color: #2a2a2a;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.header-icon {
		font-size: 1.5rem;
	}

	.header-text h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #0056b3;
	}

	.dark .header-text h3 {
		color: #66b2ff;
	}

	.progress-summary {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.dark .progress-summary {
		color: #9ca3af;
	}

	.toggle-btn {
		background: #e5e7eb;
		border: none;
		border-radius: 4px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: bold;
		transition: background-color 0.2s ease;
		flex-shrink: 0;
	}

	.toggle-btn:hover {
		background: #d1d5db;
	}

	.dark .toggle-btn {
		background: #444;
		color: #f0f0f0;
	}

	.dark .toggle-btn:hover {
		background: #555;
	}

	/* Card Body */
	.card-body {
		padding: 1.5rem;
	}

	/* Progress Info */
	.progress-info {
		margin-bottom: 1.5rem;
	}

	.progress-text {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.dark .progress-text {
		color: #d1d5db;
	}

	.progress-bar-container {
		padding: 0 1.5rem 1rem;
	}

	.progress-bar-container.collapsed {
		padding: 0 1.5rem 1.5rem;
	}

	.progress-bar {
		height: 10px;
		background-color: #e5e7eb;
		border-radius: 5px;
		overflow: hidden;
	}

	.dark .progress-bar {
		background-color: #444;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #0056b3, #0077cc);
		border-radius: 5px;
		transition: width 0.3s ease;
	}

	.dark .progress-fill {
		background: linear-gradient(90deg, #66b2ff, #42a5f5);
	}

	/* Task List */
	.task-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.task-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		margin-bottom: 0.75rem;
		border-radius: 8px;
		background-color: #f9fafb;
		transition: background-color 0.2s ease;
	}

	.dark .task-item {
		background-color: #2a2a2a;
	}

	.task-item.completed {
		background-color: #f0fdf4;
		border-left: 3px solid #059669;
	}

	.dark .task-item.completed {
		background-color: rgba(5, 150, 105, 0.1);
		border-left-color: #10b981;
	}

	.task-item.incomplete {
		background-color: #fef3c7;
		border-left: 3px solid #d97706;
	}

	.dark .task-item.incomplete {
		background-color: rgba(217, 119, 6, 0.1);
		border-left-color: #f59e0b;
	}

	.task-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
	}

	.task-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.task-info {
		flex: 1;
	}

	.task-title {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
	}

	.dark .task-title {
		color: #f0f0f0;
	}

	.task-description {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.4;
	}

	.dark .task-description {
		color: #9ca3af;
	}

	.task-action-btn {
		background: #0056b3;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		transition: background-color 0.2s ease;
		flex-shrink: 0;
	}

	.task-action-btn:hover {
		background: #004494;
	}

	.dark .task-action-btn {
		background: #66b2ff;
		color: #1a1a1a;
	}

	.dark .task-action-btn:hover {
		background: #5aa3ff;
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		.task-item {
			flex-direction: column;
			align-items: stretch;
		}

		.task-action-btn {
			width: 100%;
			text-align: center;
		}

		.header-text h3 {
			font-size: 1.1rem;
		}
	}
</style>
