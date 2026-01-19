<script>
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

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

<main class="w-full bg-background text-foreground overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-4 py-8 min-h-screen">
	<h1 class="text-3xl md:text-4xl font-semibold text-center mb-4 text-primary">Recent Solar Installation Projects</h1>
	<p class="text-center text-muted-foreground mb-8">Showing page {currentPage} of {totalPages}</p>

	<section id="recent-projects" class="max-w-4xl w-full mb-10">
		{#if !data.success}
			<div class="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6" role="alert">
				<p class="text-destructive font-medium">Error: {data.error || 'Failed to load projects'}</p>
			</div>
		{:else if projects.length === 0}
			<div class="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6" role="alert">
				<p class="text-warning font-medium">No projects found on this page.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
				{#each projects as project (project.id)}
					<a
						href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
						class="group block bg-card hover:shadow-lg rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
					>
						<!-- Project Image -->
						<div class="w-full aspect-square overflow-hidden bg-muted relative">
							{#if project.cloudinary_public_id}
								<img
									src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${project.cloudinary_public_id}`}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							{:else if project.image_url}
								<img
									src={project.image_url}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
									No Image
								</div>
							{/if}
						</div>

						<!-- Project Details -->
						<div class="p-4 space-y-2">
							<h3 class="text-lg font-semibold text-primary line-clamp-2">
								{project.title}
							</h3>

							<p class="text-sm text-muted-foreground">
								📍 Pincode: {project.pincode || 'N/A'}
							</p>

							<p class="text-sm text-muted-foreground">
								📅 Completed: {formatDate(project.project_date)}
							</p>

							<p class="text-sm text-muted-foreground">
								🏢 Installer: <span class="font-medium text-primary">{formatBusinessName(project.business_slug)}</span>
							</p>

							{#if project.system_size}
								<p class="text-sm text-muted-foreground">
									⚡ System Size: <span class="font-medium text-primary">{project.system_size} kW</span>
								</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex justify-center items-center gap-2 mt-8 flex-wrap">
					<!-- Previous button -->
					{#if currentPage > 1}
						<a
							href={currentPage === 2 ? '/in/recent-solar-installation-projects' : `/in/recent-solar-installation-projects/${currentPage - 1}`}
							class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
						>
							← Previous
						</a>
					{/if}

					<!-- Page numbers -->
					{#each paginationLinks as link}
						{#if link === '...'}
							<span class="px-2 text-muted-foreground">...</span>
						{:else if link === currentPage}
							<span class="px-3 py-2 bg-primary text-primary-foreground font-medium rounded-lg">
								{link}
							</span>
						{:else}
							<a
								href={link === 1 ? '/in/recent-solar-installation-projects' : `/in/recent-solar-installation-projects/${link}`}
								class="px-3 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
							>
								{link}
							</a>
						{/if}
					{/each}

					<!-- Next button -->
					{#if currentPage < totalPages}
						<a
							href="/in/recent-solar-installation-projects/{currentPage + 1}"
							class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
						>
							Next →
						</a>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</main>
