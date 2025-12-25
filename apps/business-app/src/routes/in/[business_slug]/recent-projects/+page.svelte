<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import PostRecentProject from '$lib/in/PostRecentProject.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, projects = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Format date for display
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// State for delete - track which project is being deleted
	let deletingProjectId = null;

	// State for post project modal
	let showPostRecentProject = false;

	// Handle project posted
	function handleProjectPosted(event) {
		showPostRecentProject = false;
		window.location.reload();
	}

	// Handle project deletion
	async function handleDeleteProject(project) {
		if (deletingProjectId !== null) return;

		const confirmed = confirm(
			`Are you sure you want to delete "${project.title}"? This action cannot be undone.`
		);
		if (!confirmed) return;

		try {
			deletingProjectId = project.id;

			const response = await fetch('/in/api/deleteRecentProject', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					projectId: project.id,
					business_slug: businessSlug
				})
			});

			const result = await response.json();

			if (result.success) {
				alert('Project deleted successfully');
				window.location.reload();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Delete Project Error:', error);
			alert('An error occurred while deleting the project.');
		} finally {
			deletingProjectId = null;
		}
	}
</script>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<div class="header-content">
			<div>
				<h1>Project Portfolio</h1>
				<p>Manage your completed solar installation projects</p>
			</div>
			<button class="btn post-btn" on:click={() => (showPostRecentProject = true)}>
				✨ Post Recent Project
			</button>
		</div>
	</header>

	<section id="projects-section">
		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{:else if projects.length === 0}
			<div class="no-projects">
				<p>You haven't posted any projects yet.</p>
				<p class="hint">Click the "Post Recent Project" button above to add your first project!</p>
			</div>
		{:else}
			<div class="projects-grid">
				{#each projects as project}
					<div class="project-card">
						{#if project.image_url}
							<div class="project-image">
								<img src={project.image_url} alt={project.title} />
							</div>
						{/if}
						<div class="project-content">
							<h3>{project.title}</h3>
							{#if project.description}
								<p class="description">{project.description}</p>
							{/if}
							<div class="project-meta">
								{#if project.capacity}
									<span class="meta-item">📊 {project.capacity} kW</span>
								{/if}
								{#if project.location}
									<span class="meta-item">📍 {project.location}</span>
								{/if}
								{#if project.installation_date}
									<span class="meta-item">📅 {formatDate(project.installation_date)}</span>
								{/if}
							</div>
							<div class="project-actions">
								<button
									class="btn delete-btn"
									on:click={() => handleDeleteProject(project)}
									disabled={deletingProjectId === project.id}
								>
									{deletingProjectId === project.id ? 'Deleting...' : 'Delete Project'}
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<!-- Post Recent Project Modal -->
{#if showPostRecentProject}
	<PostRecentProject
		show={showPostRecentProject}
		{businessSlug}
		on:close={() => (showPostRecentProject = false)}
		on:posted={handleProjectPosted}
	/>
{/if}

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--danger-color: #dc3545;
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
		margin-bottom: 2rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
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

	.post-btn {
		background: var(--accent-color);
		color: white;
		white-space: nowrap;
	}

	.post-btn:hover {
		background: #004494;
	}

	.dark .post-btn {
		background: #66b2ff;
		color: #1a1a1a;
	}

	.dark .post-btn:hover {
		background: #5aa3ff;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.project-card {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
	}

	.project-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.dark .project-card {
		background: #2a2a2a;
	}

	.project-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.project-content {
		padding: 1.5rem;
	}

	.project-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.description {
		font-size: 0.9rem;
		opacity: 0.8;
		margin: 0.5rem 0 1rem 0;
		line-height: 1.5;
	}

	.project-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.meta-item {
		font-size: 0.85rem;
		opacity: 0.8;
	}

	.project-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.3s ease;
	}

	.delete-btn {
		background: var(--danger-color);
		color: white;
	}

	.delete-btn:hover:not(:disabled) {
		background: #c82333;
	}

	.delete-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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

	.error-message {
		color: red;
		font-weight: bold;
		padding: 1rem;
		background: #ffebee;
		border-radius: 4px;
		text-align: center;
	}

	.dark .error-message {
		background: #541e1e;
		color: #ef9a9a;
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}

		header h1 {
			font-size: 1.5rem;
		}
	}
</style>
