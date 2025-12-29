<script>
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import { EmptyState } from '$lib/components/ui/empty-state';
	import { PageHeader } from '$lib/components/ui/page-header';
	import { StatCard } from '$lib/components/ui/stat-card';
	import { DataTable, TableHeader, TableRow, TableCell } from '$lib/components/ui/data-table';

	let businessSlug = $derived($page.params.business_slug);
	let projects = $derived($page.data.projects || []);
	let business = $derived($page.data.business);

	// Stage names mapping
	const stageNames = {
		1: 'Lead',
		2: 'Qualified',
		3: 'Proposal Sent',
		4: 'Negotiation',
		5: 'Won',
		6: 'Lost'
	};

	// Stage variant mapping for badges
	const stageVariants = {
		1: 'secondary',    // Lead - Gray
		2: 'default',      // Qualified - Info (accent)
		3: 'warning',      // Proposal - Warning
		4: 'warning',      // Negotiation - Orange/Warning
		5: 'success',      // Won - Success
		6: 'destructive'   // Lost - Danger
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

	// Function to get stage variant
	function getStageVariant(stage) {
		return stageVariants[stage] || 'secondary';
	}
</script>

<svelte:head>
	<title>Project Management - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="min-h-screen p-8 md:p-4 transition-colors duration-300 bg-background text-foreground">
	<PageHeader
		title="Project Management"
		description="Track and manage your solar installation projects"
		centered
	/>

	<section>
		{#if projects.length === 0}
			<EmptyState
				title="No projects found."
				description="Projects will appear here once you start managing leads."
			/>
		{:else}
			<div class="flex gap-4 mb-8 flex-wrap md:flex-col">
				<StatCard label="Total Projects" value={projects.length} />
				<StatCard label="Active Projects" value={projects.filter(p => p.stage >= 1 && p.stage <= 4).length} />
				<StatCard label="Won" value={projects.filter(p => p.stage === 5).length} variant="success" />
			</div>

			<DataTable>
				{#snippet headers()}
					<TableHeader>ID</TableHeader>
					<TableHeader>Customer</TableHeader>
					<TableHeader>Location</TableHeader>
					<TableHeader>Stage</TableHeader>
					<TableHeader>Created</TableHeader>
					<TableHeader>Last Updated</TableHeader>
				{/snippet}
				{#each projects as project}
					<TableRow>
						<TableCell>#{project.id}</TableCell>
						<TableCell>
							<div class="flex flex-col gap-1">
								<div class="font-semibold">{project.customer_name || 'N/A'}</div>
								{#if project.phone}
									<div class="text-sm text-foreground-muted">{project.phone}</div>
								{/if}
							</div>
						</TableCell>
						<TableCell>
							<div class="flex flex-col gap-1">
								{#if project.district}
									<div>{project.district}</div>
								{/if}
							</div>
						</TableCell>
						<TableCell>
							<Badge variant={getStageVariant(project.stage)}>
								{stageNames[project.stage] || `Stage ${project.stage}`}
							</Badge>
						</TableCell>
						<TableCell>{formatDate(project.created_at)}</TableCell>
						<TableCell>
							<div class="flex flex-col gap-1">
								<div>{formatDate(project.last_updated)}</div>
								<div class="text-sm text-foreground-muted">{getDaysAgo(project.last_updated)}</div>
							</div>
						</TableCell>
					</TableRow>
				{/each}
			</DataTable>
		{/if}
	</section>
</div>

