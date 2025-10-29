<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import PostRecentProject from '$lib/in/PostRecentProject.svelte';
	import ShowSupport from '$lib/in/ShowSupport.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, projects = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Computed business info
	$: businessInfo = mainBusiness
		? {
				businessname: mainBusiness.businessname
			}
		: {};

	// State for modals
	let showAddProject = false;
	let showSupport = false;
	let mobileMenuOpen = false;

	// Function to toggle modals
	const toggleAddProject = () => {
		showAddProject = !showAddProject;
	};

	const toggleSupport = () => {
		showSupport = !showSupport;
	};

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
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

			const response = await fetch('/in/api/updateRecentProject', {
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

<!-- TOP NAVIGATION -->
<nav class="top-nav {darkMode ? 'dark' : 'light'}">
	<div class="nav-brand">
		<a href="/in/{businessSlug}">
			<span class="brand-full">Solar Vipani Business Dashboard - {businessInfo.businessname || ''}</span>
			<span class="brand-mobile">{businessInfo.businessname || 'Business Dashboard'}</span>
		</a>
	</div>

	<div class="hamburger" role="button" tabindex="0" on:click={toggleMobileMenu} on:keydown={(e) => e.key === 'Enter' && toggleMobileMenu()}>
		<span></span>
		<span></span>
		<span></span>
	</div>

	<ul class="nav-list {mobileMenuOpen ? 'open' : ''}">
		<li><button on:click={toggleAddProject}>Post Recent Project</button></li>
		<li><button on:click={toggleSupport}>Support</button></li>
		<li>
			<form method="POST" action={`/${businessSlug}/logout`}>
				<button type="submit">Logout</button>
			</form>
		</li>
	</ul>
</nav>

<main class={darkMode ? 'dark' : 'light'}>

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

<!-- Modals -->
{#if showAddProject}
	<PostRecentProject
		show={showAddProject}
		{businessSlug}
		on:close={() => (showAddProject = false)}
		on:posted={handleProjectAdded}
	/>
{/if}

{#if showSupport}
	<ShowSupport show={showSupport} on:close={() => (showSupport = false)} />
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

	/* Reset margins and ensure full width */
	:global(body) {
		margin: 0;
		padding: 0;
	}

	/* Hamburger menu */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 30px;
		height: 21px;
		cursor: pointer;
		margin: 1rem 0;
	}

	.hamburger span {
		display: block;
		height: 3px;
		width: 100%;
		background-color: var(--accent-color);
		border-radius: 3px;
	}

	/* Top Navigation Styles */
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		flex-wrap: wrap;
		transition: background-color 0.3s ease;
		margin: 0;
		position: relative;
		width: 100%;
	}

	.nav-brand {
		flex: 1;
	}

	.nav-brand a {
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.brand-mobile {
		display: none;
	}

	.brand-full {
		display: inline;
	}

	.nav-list {
		list-style-type: none;
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0 1rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.nav-list li {
		margin: 0;
	}

	/* Light Mode Nav */
	.top-nav.light {
		background-color: #fafafa;
		color: #333;
	}

	.top-nav.light .nav-brand a {
		color: #333;
	}

	.top-nav.light .nav-brand a:hover {
		color: #0077cc;
	}

	/* Dark Mode Nav */
	.top-nav.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.top-nav.dark .nav-brand a {
		color: #fff;
	}

	.top-nav.dark .nav-brand a:hover {
		color: #66b2ff;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 0rem 1rem;
		font-family: var(--font-family);
		min-height: calc(100vh - 70px);
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
	@media (max-width: 768px) {
		.top-nav {
			flex-wrap: wrap;
			padding: 0.75rem;
		}

		.nav-brand {
			flex: 1;
			order: 1;
		}

		.nav-brand a {
			font-size: 0.85rem;
		}

		.brand-full {
			display: none;
		}

		.brand-mobile {
			display: inline;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 200px;
		}

		.hamburger {
			order: 2;
			display: flex;
		}

		.nav-list {
			order: 4;
			width: 100%;
			margin: 0.5rem 0 0 0;
			display: none;
			flex-direction: column;
			gap: 0.5rem;
		}

		.nav-list.open {
			display: flex;
		}

		.nav-list li {
			width: 100%;
		}

		.nav-list button,
		.nav-list form,
		.nav-list form button {
			width: 100%;
			text-align: center;
			white-space: normal;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}

		.project-image {
			max-height: 180px;
		}
	}

	@media (max-width: 480px) {
		.brand-mobile {
			max-width: 140px;
			font-size: 0.8rem;
		}

		button {
			white-space: normal;
			word-break: break-word;
		}
	}
</style>