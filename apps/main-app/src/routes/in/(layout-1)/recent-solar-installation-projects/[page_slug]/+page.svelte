<script>
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	/** @type {import('./$types').PageData} */
	const { data } = $props();

	// Get current page from data
	let currentPage = $derived(data.pagination?.currentPage || 1);
	let totalPages = $derived(data.pagination?.totalPages || 1);
	let projects = $derived(data.projects || []);

	// Format date to a more readable format
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Convert business slug to a more readable name
	function formatBusinessName(slug) {
		if (!slug) return 'Unknown';
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Generate pagination links
	function generatePaginationLinks(current, total) {
		const links = [];
		const maxVisible = 7;

		if (total <= maxVisible) {
			// Show all pages if total is small
			for (let i = 1; i <= total; i++) {
				links.push(i);
			}
		} else {
			// Always show first page
			links.push(1);

			if (current > 3) {
				links.push('...');
			}

			// Show current page and neighbors
			const start = Math.max(2, current - 1);
			const end = Math.min(total - 1, current + 1);

			for (let i = start; i <= end; i++) {
				if (!links.includes(i)) {
					links.push(i);
				}
			}

			if (current < total - 2) {
				links.push('...');
			}

			// Always show last page
			if (!links.includes(total)) {
				links.push(total);
			}
		}

		return links;
	}

	let paginationLinks = $derived(generatePaginationLinks(currentPage, totalPages));
</script>

<svelte:head>
	<title>Recent Solar Installation Projects - Page {currentPage}</title>
	<meta
		name="description"
		content="View recent solar installation projects from our installers - Page {currentPage}."
	/>
</svelte:head>

<main class="w-full bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
	<div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
		<div class="text-center mb-[theme(--spacing-2xl)]">
			<h1 class="text-3xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Recent Solar Installation Projects</h1>
			<div class="flex justify-center items-center my-[theme(--spacing-lg)]">
				<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
			</div>
			<p class="text-center text-foreground dark:text-foreground-secondary">Showing page {currentPage} of {totalPages}</p>
		</div>

		<section id="recent-projects" class="w-full mb-[theme(--spacing-2xl)]">
			{#if !data.success}
			<Alert variant="destructive" class="mb-[theme(--spacing-lg)]">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{data.error || 'Failed to load projects'}
				</AlertDescription>
			</Alert>
		{:else if projects.length === 0}
			<Alert variant="warning" class="mb-[theme(--spacing-lg)]">
				<AlertTitle>No Projects</AlertTitle>
				<AlertDescription>
					No projects found on this page.
				</AlertDescription>
			</Alert>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] w-full mb-[theme(--spacing-lg)]">
				{#each projects as project (project.id)}
					<a
						href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
						class="group block overflow-hidden transition-all duration-[var(--transition-default)] hover:-translate-y-[var(--hover-lift-sm)]"
					>
						<Card class="h-full flex flex-col hover:shadow-[var(--shadow-card-hover)]">
						<!-- Project Image -->
						<div class="w-full aspect-square overflow-hidden bg-muted relative">
							{#if project.cloudinary_public_id}
								<img
									src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${project.cloudinary_public_id}`}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover group-hover:scale-[var(--hover-scale)] transition-transform duration-[var(--transition-default)]"
								/>
							{:else if project.image_url}
								<img
									src={project.image_url}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover group-hover:scale-[var(--hover-scale)] transition-transform duration-[var(--transition-default)]"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-muted text-foreground dark:text-foreground-secondary">
									No Image
								</div>
							{/if}
						</div>

						<!-- Project Details -->
						<CardContent class="py-[theme(--card-padding-y)] px-[theme(--card-padding-y)] space-y-[theme(--spacing-sm)] flex-1 flex flex-col justify-between">
							<div class="space-y-[theme(--spacing-sm)]">
								<h3 class="text-lg font-semibold text-primary line-clamp-2">
									{project.title}
								</h3>

								<p class="text-sm text-foreground dark:text-foreground-secondary">
									📍 Pincode: {project.pincode || 'N/A'}
								</p>

								<p class="text-sm text-foreground dark:text-foreground-secondary">
									📅 Completed: {formatDate(project.project_date)}
								</p>

								<p class="text-sm text-foreground dark:text-foreground-secondary">
									🏢 Installer: <span class="font-medium text-primary">{formatBusinessName(project.business_slug)}</span>
								</p>

								{#if project.system_size}
									<p class="text-sm text-foreground dark:text-foreground-secondary">
										⚡ System Size: <span class="font-medium text-primary">{project.system_size} kW</span>
									</p>
								{/if}
							</div>
						</CardContent>
					</Card>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex justify-center items-center gap-[theme(--spacing-sm)] mt-[theme(--spacing-2xl)] flex-wrap">
					<!-- Previous button -->
					{#if currentPage > 1}
						<Button
							asChild
							variant="default"
							class="transition-all duration-[var(--transition-default)] hover:-translate-y-[var(--hover-lift-sm)]"
						>
							<a
								href={currentPage === 2 ? '/in/recent-solar-installation-projects' : `/in/recent-solar-installation-projects/${currentPage - 1}`}
							>
								← Previous
							</a>
						</Button>
					{/if}

					<!-- Page numbers -->
					{#each paginationLinks as link}
						{#if link === '...'}
							<span class="px-[theme(--spacing-sm)] text-foreground dark:text-foreground-secondary">...</span>
						{:else if link === currentPage}
							<span class="px-[theme(--spacing-md)] py-[theme(--spacing-sm)] bg-primary text-primary-foreground font-medium rounded-[theme(--radius-md)]">
								{link}
							</span>
						{:else}
							<Button
								asChild
								variant="outline"
								class="transition-all duration-[var(--transition-default)] hover:-translate-y-[var(--hover-lift-sm)]"
							>
								<a
									href={link === 1 ? '/in/recent-solar-installation-projects' : `/in/recent-solar-installation-projects/${link}`}
								>
									{link}
								</a>
							</Button>
						{/if}
					{/each}

					<!-- Next button -->
					{#if currentPage < totalPages}
						<Button
							asChild
							variant="default"
							class="transition-all duration-[var(--transition-default)] hover:-translate-y-[var(--hover-lift-sm)]"
						>
							<a href="/in/recent-solar-installation-projects/{currentPage + 1}">
								Next →
							</a>
						</Button>
					{/if}
				</div>
			{/if}
		{/if}
		</section>
	</div>
</main>
