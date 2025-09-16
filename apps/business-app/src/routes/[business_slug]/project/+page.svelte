<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import PostRecentProject from '$lib/PostRecentProject.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, projects = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// State for add project modal
	let showAddProject = false;

	// Function to toggle the add project modal
	const toggleAddProject = () => {
		showAddProject = !showAddProject;
	};

	// Handle project added event
	function handleProjectAdded(event) {
		// Refresh the page to show the new project
		window.location.reload();
	}

	// Format date for display
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// State for delete confirmation
	let deletingProject = null;
	let isDeleting = false;

	// Handle project deletion
	async function handleDeleteProject(project) {
		if (isDeleting) return;
		
		const confirmed = confirm(`Are you sure you want to hide "${project.title}"? This will remove it from public view.`);
		if (!confirmed) return;

		try {
			isDeleting = true;
			deletingProject = project.id;

			const response = await fetch('/api/updateRecentProject', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					projectId: project.id,
					business_slug: businessSlug
				})
			});

			const result = await response.json();

			if (result.success) {
				alert('Project hidden successfully!');
				// Refresh the page to show updated list
				window.location.reload();
			} else {
				alert(`Error: ${result.error || 'Failed to hide project'}`);
			}
		} catch (error) {
			console.error('Error hiding project:', error);
			alert('An error occurred while hiding the project');
		} finally {
			isDeleting = false;
			deletingProject = null;
		}
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<!-- Navigation Bar -->
	<nav>
		<ul class="nav-list">
			<li><button on:click={toggleAddProject}>Post Recent Project</button></li>
			<li>
				<button onclick="window.location.href='/{businessSlug}'">Back to Dashboard</button>
			</li>
		</ul>
	</nav>

	<header>
		<h1>Your Projects</h1>
		<p>Showcase your solar panel installation projects</p>
	</header>

	<!-- Projects Section -->
	<section id="projects-section">
		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{:else}
			<div class="projects-grid">
				{#each projects as project}
					<div class="project-tile">
						<div class="project-header">
							<h2>{project.title}</h2>
						</div>
						
						{#if project.image_url}
							<div class="project-image">
								<img src={project.image_url} alt={project.title} loading="lazy" />
							</div>
						{/if}
						
						<div class="project-details">
							<p><strong>Location:</strong> {project.pincode}</p>
							<p><strong>Project Date:</strong> {formatDate(project.project_date)}</p>
							<p><strong>Added:</strong> {formatDate(project.created_at)}</p>
						</div>
						
						<div class="project-actions">
							<button 
								class="btn delete-btn" 
								on:click={() => handleDeleteProject(project)}
								disabled={isDeleting && deletingProject === project.id}
							>
								{isDeleting && deletingProject === project.id ? 'Deleting...' : 'Delete'}
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- No projects message -->
		{#if projects.length === 0 && !errorMessage && mainBusiness}
			<div class="no-projects">
				<p>You haven't posted any projects yet.</p>
				<button on:click={toggleAddProject}>Post Your First Project</button>
			</div>
		{/if}
	</section>
</main>

<!-- Add Project Modal -->
{#if showAddProject}
	<PostRecentProject
		show={showAddProject}
		{businessSlug}
		on:close={() => (showAddProject = false)}
		on:posted={handleProjectAdded}
	/>
{/if}

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--light-secondary-text-color: #666;
		--dark-secondary-text-color: #ccc;
		--accent-color: #0056b3;
		--accent-hover: #00449e;
		--border-color-light: #ddd;
		--border-color-dark: #444;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--success-color: #28a745;
		--success-hover: #218838;

		/* Project-specific colors */
		--delete-btn-color: #dc3545;
		--delete-btn-hover: #c82333;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 0rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	main > * {
		max-width: 1200px;
		width: 100%;
		margin-bottom: 2rem;
	}

	/* Light/Dark mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Navigation */
	.nav-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin-bottom: 2rem;
	}

	/* Header */
	header h1 {
		font-size: 2rem;
		margin-top: 0rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: center;
		color: var(--accent-color);
	}

	header p {
		margin: 0;
		color: var(--light-secondary-text-color);
		text-align: center;
	}

	.dark header p {
		color: var(--dark-secondary-text-color);
	}

	/* Button styles */
	button {
		background-color: var(--accent-color);
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		text-decoration: none;
		display: inline-block;
		font-size: 1rem;
		font-family: var(--font-family);
	}

	button:hover {
		background-color: var(--accent-hover);
	}

	button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	/* Projects grid */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
		width: 100%;
	}

	/* Project tile styling */
	.project-tile {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: flex;
		flex-direction: column;
	}

	.dark .project-tile {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.project-tile:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.dark .project-tile:hover {
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
	}

	.project-header {
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--border-color-light);
		padding-bottom: 0.75rem;
	}

	.dark .project-header {
		border-bottom: 1px solid var(--border-color-dark);
	}

	.project-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.project-image {
		margin-bottom: 1rem;
		border-radius: 6px;
		overflow: hidden;
		max-height: 200px;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s ease;
	}

	.project-image:hover img {
		transform: scale(1.05);
	}

	.project-details {
		margin-bottom: 1rem;
		flex-grow: 1;
	}

	.project-details p {
		margin: 0.5rem 0;
	}

	/* No projects message */
	.no-projects {
		text-align: center;
		padding: 3rem;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-projects {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.no-projects p {
		margin-bottom: 1rem;
		font-size: 1.1rem;
		color: var(--light-secondary-text-color);
	}

	.dark .no-projects p {
		color: var(--dark-secondary-text-color);
	}

	.no-projects button {
		background-color: var(--success-color);
	}

	.no-projects button:hover {
		background-color: var(--success-hover);
	}

	/* Error message */
	.error-message {
		color: red;
		font-weight: bold;
		padding: 1rem;
		background-color: #ffebee;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.dark .error-message {
		background-color: #541e1e;
		color: #ef9a9a;
	}

	/* Project actions and buttons */
	.project-actions {
		display: flex;
		gap: 10px;
		margin-top: auto; /* Push to bottom of flex container */
		padding-top: 15px;
	}

	.btn {
		padding: 8px 16px;
		border-radius: 4px;
		text-decoration: none;
		font-size: 14px;
		cursor: pointer;
		text-align: center;
		transition:
			background-color 0.3s,
			color 0.3s;
		flex: 1;
	}

	.delete-btn {
		background-color: var(--delete-btn-color);
		color: white;
		border: none;
	}

	.delete-btn:hover:not(:disabled) {
		background-color: var(--delete-btn-hover);
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 600px) {
		.nav-list {
			justify-content: center;
		}

		.nav-list li {
			margin-bottom: 0.5rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
		
		.project-image {
			max-height: 180px;
		}
	}
</style>