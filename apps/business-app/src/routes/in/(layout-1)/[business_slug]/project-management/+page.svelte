<script lang="ts">
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import type { BadgeVariant } from '$lib/components/ui/badge';

	let businessSlug = $derived($page.params.business_slug);
	let projects = $derived($page.data.projects || []);

	// Stage names mapping
	const stageNames: Record<number, string> = {
		1: 'Lead',
		2: 'Qualified',
		3: 'Proposal Sent',
		4: 'Negotiation',
		5: 'Won',
		6: 'Lost'
	};

	// Stage variant mapping for badges
	const stageVariants: Record<number, string> = {
		1: 'secondary',    // Lead - Gray
		2: 'default',      // Qualified - Info (accent)
		3: 'warning',      // Proposal - Warning
		4: 'warning',      // Negotiation - Orange/Warning
		5: 'success',      // Won - Success
		6: 'destructive'   // Lost - Danger
	};

	// Function to format date
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Function to calculate days ago
	function getDaysAgo(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
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
	function getStageVariant(stage: number): BadgeVariant {
		// 'warning'/'success' are not defined on Badge and render as base style
		return (stageVariants[stage] || 'secondary') as BadgeVariant;
	}
</script>

<svelte:head>
	<title>Project Management - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div>
	<header class="mb-6">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Project Management</h1>
			<p class="mt-1 text-sm text-muted-foreground">Track and manage your solar installation projects</p>
		</div>
	</header>

	<section>
		{#if projects.length === 0}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">No projects found. Projects will appear here once you start managing leads.</p>
			</div>
		{:else}
			<div class="flex gap-4 mb-8 flex-wrap md:flex-col">
				<Card class="flex-1">
					<CardHeader class="pb-2">
						<CardTitle class="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">{projects.length}</div>
					</CardContent>
				</Card>
				<Card class="flex-1">
					<CardHeader class="pb-2">
						<CardTitle class="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">{projects.filter((p: any) => p.stage >= 1 && p.stage <= 4).length}</div>
					</CardContent>
				</Card>
				<Card class="flex-1">
					<CardHeader class="pb-2">
						<CardTitle class="text-sm font-medium text-muted-foreground">Won</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold text-success">{projects.filter((p: any) => p.stage === 5).length}</div>
					</CardContent>
				</Card>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Stage</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Last Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
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
				</TableBody>
			</Table>
		{/if}
	</section>
</div>

