<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';

	const businessSlug = $page.params.business_slug;
	$: darkMode = $isDarkMode;
	$: ({ projects = [], business } = $page.data);

	// Stage names mapping
	const stageNames = {
		1: 'Lead',
		2: 'Qualified',
		3: 'Proposal Sent',
		4: 'Negotiation',
		5: 'Won',
		6: 'Lost'
	};

	// Function to format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Function to calculate days ago
	function getDaysAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else {
			return `${diffInDays} days ago`;
		}
	}

	// Function to get stage color
	function getStageColor(stage) {
		switch (stage) {
			case 1: return '#6c757d'; // Lead - Gray
			case 2: return '#17a2b8'; // Qualified - Info
			case 3: return '#ffc107'; // Proposal - Warning
			case 4: return '#fd7e14'; // Negotiation - Orange
			case 5: return '#28a745'; // Won - Success
			case 6: return '#dc3545'; // Lost - Danger
			default: return '#6c757d';
		}
	}
</script>

<svelte:head>
	<title>Project Management - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<h1>Project Management</h1>
		<p>Track and manage your solar installation projects</p>
	</header>

	<section id="projects-section">
		{#if projects.length === 0}
			<div class="no-projects">
				<p>No projects found.</p>
				<p class="hint">Projects will appear here once you start managing leads.</p>
			</div>
		{:else}
			<div class="stats-bar">
				<div class="stat-card">
					<span class="stat-label">Total Projects</span>
					<span class="stat-value">{projects.length}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Active Projects</span>
					<span class="stat-value">{projects.filter(p => p.stage >= 1 && p.stage <= 4).length}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Won</span>
					<span class="stat-value">{projects.filter(p => p.stage === 5).length}</span>
				</div>
			</div>

			<div class="projects-table-container">
				<table class="projects-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Customer</th>
							<th>Location</th>
							<th>Stage</th>
							<th>Created</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{#each projects as project}
							<tr>
								<td>#{project.id}</td>
								<td>
									<div class="customer-info">
										<div class="customer-name">{project.customer_name || 'N/A'}</div>
										{#if project.phone}
											<div class="customer-contact">{project.phone}</div>
										{/if}
									</div>
								</td>
								<td>
									<div class="location-info">
										{#if project.district}
											<div>{project.district}</div>
										{/if}
									</div>
								</td>
								<td>
									<span
										class="stage-badge"
										style="background-color: {getStageColor(project.stage)}"
									>
										{stageNames[project.stage] || `Stage ${project.stage}`}
									</span>
								</td>
								<td>{formatDate(project.created_at)}</td>
								<td>
									<div class="update-info">
										<div>{formatDate(project.last_updated)}</div>
										<div class="update-secondary">{getDaysAgo(project.last_updated)}</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.page-content {
		min-height: 100vh;
		font-family: var(--font-family);
		padding: 2rem;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.page-content.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.page-content.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.dark header h1 {
		color: #66b2ff;
	}

	header p {
		opacity: 0.8;
	}

	.stats-bar {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		flex: 1;
		min-width: 150px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.dark .stat-card {
		background: #2a2a2a;
	}

	.stat-label {
		font-size: 0.85rem;
		opacity: 0.7;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--accent-color);
	}

	.dark .stat-value {
		color: #66b2ff;
	}

	.projects-table-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow-x: auto;
	}

	.dark .projects-table-container {
		background: #2a2a2a;
	}

	.projects-table {
		width: 100%;
		border-collapse: collapse;
	}

	.projects-table thead {
		background: #f8f9fa;
	}

	.dark .projects-table thead {
		background: #333;
	}

	.projects-table th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid #dee2e6;
		white-space: nowrap;
	}

	.dark .projects-table th {
		border-bottom-color: #444;
	}

	.projects-table td {
		padding: 1rem;
		border-bottom: 1px solid #dee2e6;
	}

	.dark .projects-table td {
		border-bottom-color: #444;
	}

	.projects-table tbody tr:hover {
		background: #f8f9fa;
	}

	.dark .projects-table tbody tr:hover {
		background: #333;
	}

	.customer-info,
	.location-info,
	.update-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.customer-name {
		font-weight: 600;
	}

	.customer-contact,
	.location-secondary,
	.update-secondary {
		font-size: 0.85rem;
		opacity: 0.7;
	}

	.stage-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		color: white;
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.no-projects {
		text-align: center;
		padding: 3rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-projects {
		background: #2a2a2a;
	}

	.hint {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	@media (max-width: 1024px) {
		.projects-table {
			font-size: 0.9rem;
		}

		.projects-table th,
		.projects-table td {
			padding: 0.75rem 0.5rem;
		}
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem;
		}

		header h1 {
			font-size: 1.5rem;
		}

		.stats-bar {
			flex-direction: column;
		}

		.stat-card {
			min-width: 100%;
		}
	}
</style>
