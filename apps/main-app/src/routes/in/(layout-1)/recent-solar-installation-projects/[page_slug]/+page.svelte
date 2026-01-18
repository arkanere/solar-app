<script>
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { isDarkMode } from '$lib/themeStore.svelte';

	/** @type {import('./$types').PageData} */
	const { data } = $props();

	// Use the global theme store
	let darkMode = $derived($isDarkMode);

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

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Recent Solar Installation Projects</h1>
	<p class="page-info">Showing page {currentPage} of {totalPages}</p>

	<section id="recent-projects">
		{#if !data.success}
			<div class="error-message" role="alert">
				<p>Error: {data.error || 'Failed to load projects'}</p>
			</div>
		{:else if projects.length === 0}
			<div class="warning-message" role="alert">
				<p>No projects found on this page.</p>
			</div>
		{:else}
			<div class="projects-grid">
				{#each projects as project (project.id)}
					<div class="project-card">
						<a
							href="/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
							class="project-link"
						>
							<div class="project-image">
								{#if project.cloudinary_public_id}
									<img
										src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${project.cloudinary_public_id}`}
										alt={project.title}
										loading="lazy"
									/>
								{:else if project.image_url}
									<img src={project.image_url} alt={project.title} loading="lazy" />
								{:else}
									<div class="no-image">No Image</div>
								{/if}
							</div>

							<div class="project-details">
								<h3>{project.title}</h3>
								<p class="location">Pincode: {project.pincode || 'N/A'}</p>
								<p class="date">Completed on: {formatDate(project.project_date)}</p>
								<p class="installer">
									Installer: <span class="installer-name"
										>{formatBusinessName(project.business_slug)}</span
									>
								</p>
								{#if project.system_size}
									<p class="system-size">System Size: {project.system_size} kW</p>
								{/if}
							</div>
						</a>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="pagination">
					<!-- Previous button -->
					{#if currentPage > 1}
						<a 
							href={currentPage === 2 ? '/recent-solar-installation-projects' : `/recent-solar-installation-projects/${currentPage - 1}`}
							class="pagination-button prev"
						>
							← Previous
						</a>
					{/if}

					<!-- Page numbers -->
					{#each paginationLinks as link}
						{#if link === '...'}
							<span class="pagination-ellipsis">...</span>
						{:else if link === currentPage}
							<span class="pagination-button active">{link}</span>
						{:else}
							<a 
								href={link === 1 ? '/recent-solar-installation-projects' : `/recent-solar-installation-projects/${link}`}
								class="pagination-button"
							>
								{link}
							</a>
						{/if}
					{/each}

					<!-- Next button -->
					{#if currentPage < totalPages}
						<a 
							href="/recent-solar-installation-projects/{currentPage + 1}"
							class="pagination-button next"
						>
							Next →
						</a>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</main>

<style>
	/* Include the same CSS variables as the original */
	:root {
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;
		--secondary-color: #4caf50;
		--accent-color: #ffc107;
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--text-light: #ecf0f1;
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--heading-line-height: 1.2;
		--body-line-height: 1.6;
		--section-padding: 2rem 1.5rem;
		--container-width: 1140px;
		--grid-gap: 1.5rem;
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
		--transition-slow: 0.5s ease;
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		line-height: var(--body-line-height);
		overflow-x: hidden;
		transition: background-color var(--transition-medium), color var(--transition-medium);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		min-height: 100vh;
	}

	main > section {
		max-width: var(--container-width);
		width: 100%;
		margin-bottom: 2.5rem;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--text-light);
	}

	section {
		padding: var(--section-padding);
		transition: background-color var(--transition-medium);
	}

	.dark section {
		background-color: transparent;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: center;
		color: var(--primary-color);
		line-height: var(--heading-line-height);
	}

	.dark h1 {
		color: var(--primary-light);
	}

	.page-info {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.1rem;
		color: var(--text-medium);
	}

	.dark .page-info {
		color: #cbd5e0;
	}

	/* Projects grid - same as original */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--grid-gap);
		width: 100%;
		margin-bottom: 2rem;
	}

	.project-card {
		border-radius: var(--border-radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-md);
		transition: transform var(--transition-medium), box-shadow var(--transition-medium);
		background-color: var(--light-card-bg);
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.dark .project-card {
		background-color: var(--dark-card-bg);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.project-link {
		display: block;
		text-decoration: none;
		color: inherit;
		height: 100%;
	}

	.project-image {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		position: relative;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.no-image {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: #f1f1f1;
		color: var(--text-medium);
	}

	.dark .no-image {
		background-color: #2a2a2a;
		color: #a0aec0;
	}

	.project-details {
		padding: 1rem;
	}

	.project-details h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--primary-color);
		text-align: left;
	}

	.dark .project-details h3 {
		color: var(--primary-light);
	}

	.project-details p {
		margin: 0.25rem 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-medium);
	}

	.dark .project-details p {
		color: #a0aec0;
	}

	.installer-name {
		font-weight: 500;
		color: var(--primary-color);
	}

	.dark .installer-name {
		color: var(--primary-light);
	}

	.error-message,
	.warning-message {
		padding: 1rem;
		border-radius: var(--border-radius-md);
		margin-bottom: 1.5rem;
	}

	.error-message {
		background-color: #ffebee;
		border: 1px solid #f44336;
		color: #b71c1c;
	}

	.dark .error-message {
		background-color: rgba(244, 67, 54, 0.2);
		border-color: #f44336;
		color: #ef9a9a;
	}

	.warning-message {
		background-color: #fff8e1;
		border: 1px solid #ffc107;
		color: #ff6f00;
	}

	.dark .warning-message {
		background-color: rgba(255, 193, 7, 0.2);
		border-color: #ffc107;
		color: #ffcc80;
	}

	/* Pagination styles */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.pagination-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		margin: 0.25rem;
		text-decoration: none;
		border: 1px solid var(--primary-color);
		border-radius: var(--border-radius-sm);
		color: var(--primary-color);
		font-weight: 500;
		transition: all var(--transition-fast);
		min-width: 40px;
		height: 40px;
	}

	.pagination-button:hover {
		background-color: var(--primary-color);
		color: white;
		transform: translateY(-1px);
	}

	.pagination-button.active {
		background-color: var(--primary-color);
		color: white;
		cursor: default;
	}

	.pagination-button.prev,
	.pagination-button.next {
		padding: 0.5rem 1.5rem;
		min-width: auto;
	}

	.pagination-ellipsis {
		padding: 0.5rem;
		color: var(--text-medium);
	}

	.dark .pagination-button {
		border-color: var(--primary-light);
		color: var(--primary-light);
	}

	.dark .pagination-button:hover {
		background-color: var(--primary-light);
		color: var(--dark-bg-color);
	}

	.dark .pagination-button.active {
		background-color: var(--primary-light);
		color: var(--dark-bg-color);
	}

	.dark .pagination-ellipsis {
		color: #a0aec0;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		main {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.pagination {
			gap: 0.25rem;
		}

		.pagination-button {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
			min-width: 36px;
			height: 36px;
		}

		.pagination-button.prev,
		.pagination-button.next {
			padding: 0.4rem 1rem;
		}
	}

	@media (max-width: 576px) {
		h1 {
			font-size: 1.8rem;
		}

		.pagination-button {
			padding: 0.3rem 0.6rem;
			font-size: 0.8rem;
			min-width: 32px;
			height: 32px;
		}
	}
</style>