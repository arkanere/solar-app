<script>
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let projects = $derived(data.projects || []);

	let currentStoryIndex = $state(0);
	let isViewerOpen = $state(false);
	let storyProgress = $state(0);
	let storyInterval;
	let progressInterval;
	let storiesLoaded = $state(false);

	// Story duration in milliseconds
	const STORY_DURATION = 5000;
	const PROGRESS_UPDATE_INTERVAL = 50;

	// Format business name from slug
	function formatBusinessName(slug) {
		if (!slug) return 'Unknown';
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Format date
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Get image URL for project
	function getImageUrl(project, size = 'w_400,h_400') {
		if (project.cloudinary_public_id) {
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,${size},q_auto,f_auto/${project.cloudinary_public_id}`;
		} else if (project.image_url) {
			return project.image_url;
		}
		return null;
	}

	// Open story viewer
	function openStory(index) {
		currentStoryIndex = index;
		isViewerOpen = true;
		startStoryProgress();
	}

	// Close story viewer
	function closeStory() {
		isViewerOpen = false;
		stopStoryProgress();
		// After closing, show the "View All Projects" option
		showViewAll = true;
	}

	let showViewAll = $state(false);

	// Navigate to next story
	function nextStory() {
		if (currentStoryIndex < projects.length - 1) {
			currentStoryIndex++;
			resetStoryProgress();
		} else {
			closeStory();
		}
	}

	// Navigate to previous story
	function previousStory() {
		if (currentStoryIndex > 0) {
			currentStoryIndex--;
			resetStoryProgress();
		}
	}

	// Start story progress timer
	function startStoryProgress() {
		storyProgress = 0;
		progressInterval = setInterval(() => {
			storyProgress += (PROGRESS_UPDATE_INTERVAL / STORY_DURATION) * 100;
			if (storyProgress >= 100) {
				nextStory();
			}
		}, PROGRESS_UPDATE_INTERVAL);
	}

	// Stop story progress timer
	function stopStoryProgress() {
		if (progressInterval) {
			clearInterval(progressInterval);
			progressInterval = null;
		}
		storyProgress = 0;
	}

	// Reset story progress
	function resetStoryProgress() {
		stopStoryProgress();
		startStoryProgress();
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (!isViewerOpen) return;

		if (event.key === 'Escape') {
			closeStory();
		} else if (event.key === 'ArrowLeft') {
			previousStory();
		} else if (event.key === 'ArrowRight') {
			nextStory();
		}
	}

	// Handle keyboard events on the modal backdrop
	function handleBackdropKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeStory();
		}
	}

	// Handle story area clicks for navigation
	function handleStoryClick(event, area) {
		event.preventDefault();
		if (area === 'left') {
			previousStory();
		} else if (area === 'right') {
			nextStory();
		}
	}

	onMount(() => {
		// Auto-start stories if there are projects
		if (projects.length > 0) {
			setTimeout(() => {
				openStory(0);
			}, 500); // Small delay to let the page render
		}

		return () => {
			stopStoryProgress();
		};
	});

	// Auto-start stories when projects data loads
	$effect(() => {
		if (projects.length > 0 && !storiesLoaded && !isViewerOpen) {
			storiesLoaded = true;
			setTimeout(() => {
				openStory(0);
			}, 500);
		}
	});
</script>

<svelte:head>
	<title>Solar Project Stories | Recent Installation Showcase</title>
	<meta
		name="description"
		content="Discover recent solar panel installations across India through engaging project stories. See real installations by verified solar installers with system details and locations."
	/>
	
	<meta name="keywords" content="solar stories, solar installation showcase, recent solar projects, solar panel installations India, solar project gallery" />
	
	<meta name="geo.region" content="IN" />
	<meta name="geo.country" content="India" />
	
	<link rel="canonical" href="https://solarvipani.com/stories" />
	
	<meta property="og:title" content="Solar Project Stories | Recent Installation Showcase" />
	<meta property="og:description" content="Discover recent solar panel installations across India through engaging project stories." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://solarvipani.com/stories" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main class={darkMode ? 'dark' : 'light'}>
	<div class="stories-container">
		<h1>Solar Project Stories</h1>
		<p class="subtitle">Recent solar installations across India</p>

		{#if !data.success}
			<div class="error-message" role="alert">
				<p>Error: {data.error || 'Failed to load stories'}</p>
			</div>
		{:else if projects.length === 0}
			<div class="warning-message" role="alert">
				<p>No stories available at the moment.</p>
			</div>
		{:else}
			<!-- Loading message while stories start -->
			{#if !isViewerOpen && !showViewAll}
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Loading stories...</p>
				</div>
			{/if}

			<!-- View All Projects after stories finish -->
			{#if showViewAll}
				<div class="view-all-container">
					<h2>You've seen all our latest solar stories!</h2>
					<a href="/recent-solar-installation-projects" class="view-all-btn">
						View All Solar Projects →
					</a>
					<button class="replay-btn" onclick={() => { showViewAll = false; openStory(0); }}>
						▶️ Replay Stories
					</button>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Story Viewer Modal -->
	{#if isViewerOpen && projects[currentStoryIndex]}
		<div class="story-viewer" role="button" tabindex="0" onclick={closeStory} onkeydown={handleBackdropKeydown}>
			<div class="story-content" role="presentation" onclick={(e) => e.stopPropagation()}>
				<!-- Progress Indicators -->
				<div class="progress-container">
					{#each projects as _, index}
						<div class="progress-bar">
							<div 
								class="progress-fill"
								class:completed={index < currentStoryIndex}
								class:active={index === currentStoryIndex}
								style={index === currentStoryIndex ? `width: ${storyProgress}%` : ''}
							></div>
						</div>
					{/each}
				</div>

				<!-- Story Header -->
				<div class="story-header">
					<div class="story-info">
						<div class="installer-avatar">
							<span>{formatBusinessName(projects[currentStoryIndex].business_slug).charAt(0)}</span>
						</div>
						<div class="installer-details">
							<h3>
								<a
									href="/solar-panel-installer/{projects[currentStoryIndex].business_slug}"
									class="installer-link"
									onclick={(e) => e.stopPropagation()}
								>
									{formatBusinessName(projects[currentStoryIndex].business_slug)}
								</a>
							</h3>
						</div>
					</div>
					<button class="close-btn" onclick={closeStory} aria-label="Close story">✕</button>
				</div>

				<!-- Story Image -->
				<div class="story-image-container">
					{#if getImageUrl(projects[currentStoryIndex])}
						<img
							src={getImageUrl(projects[currentStoryIndex], 'w_800,h_800')}
							alt={projects[currentStoryIndex].title}
							class="story-main-image"
						/>
					{:else}
						<div class="story-no-image">
							<span>📸</span>
							<p>No image available</p>
						</div>
					{/if}
				</div>

				<!-- Story Details Overlay -->
				<div class="story-details">
					<h2>{projects[currentStoryIndex].title}</h2>
					<div class="project-info">
						<div class="info-item">
							<span class="info-label">📍 Location:</span>
							<span class="info-value">{projects[currentStoryIndex].pincode || 'N/A'}</span>
						</div>
						<div class="info-item">
							<span class="info-label">📅 Completed:</span>
							<span class="info-value">{formatDate(projects[currentStoryIndex].project_date)}</span>
						</div>
					</div>
				</div>

				<!-- Navigation Areas -->
				<button
					class="nav-area nav-left"
					onclick={(e) => handleStoryClick(e, 'left')}
					disabled={currentStoryIndex === 0}
					aria-label="Previous story"
				></button>
				<button
					class="nav-area nav-right"
					onclick={(e) => handleStoryClick(e, 'right')}
					aria-label="Next story"
				></button>
			</div>
		</div>
	{/if}
</main>

<style>
	:root {
		--primary-color: hsl(var(--primary));
		--primary-hover: hsl(var(--primary) / 0.9);
		--primary-light: hsl(var(--accent-muted));
		--secondary-color: hsl(var(--success));
		--accent-color: hsl(var(--accent));
		--text-dark: var(--color-text-primary);
		--text-medium: var(--color-text-secondary);
		--text-light: var(--color-text-muted);
		--light-bg-color: hsl(var(--background));
		--dark-bg-color: hsl(var(--background));
		--light-card-bg: hsl(var(--card));
		--dark-card-bg: hsl(var(--card));
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-sm: var(--shadow-sm);
		--shadow-md: var(--shadow-md);
		--shadow-lg: var(--shadow-lg);
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		min-height: 100vh;
		padding: 2rem 1rem;
		transition: background-color 0.3s ease, color 0.3s ease;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--text-light);
	}

	.stories-container {
		max-width: 600px;
		width: 100%;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--primary-color);
	}

	.dark h1 {
		color: var(--primary-light);
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--text-medium);
		margin-bottom: 3rem;
	}

	.dark .subtitle {
		color: var(--color-text-secondary);
	}

	/* Loading Animation */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 3rem;
	}

	.loading-spinner {
		width: 50px;
		height: 50px;
		border: 4px solid hsl(var(--border) / 0.3);
		border-left-color: var(--primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.dark .loading-spinner {
		border-color: hsl(var(--border) / 0.3);
		border-left-color: var(--primary-light);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		color: var(--text-medium);
		font-size: 1.1rem;
	}

	.dark .loading-container p {
		color: var(--color-text-secondary);
	}

	/* View All Container */
	.view-all-container {
		text-align: center;
		padding: 2rem;
	}

	.view-all-container h2 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: var(--primary-color);
	}

	.dark .view-all-container h2 {
		color: var(--primary-light);
	}

	.view-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background-color: var(--primary-color);
		color: hsl(var(--foreground));
		text-decoration: none;
		border-radius: var(--border-radius-md);
		font-weight: 500;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-sm);
		margin: 0.5rem;
	}

	.view-all-btn:hover {
		background-color: var(--primary-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.replay-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background-color: var(--secondary-color);
		color: hsl(var(--foreground));
		border: none;
		border-radius: var(--border-radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-sm);
		margin: 0.5rem;
	}

	.replay-btn:hover {
		background-color: hsl(var(--success) / 0.85);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	/* Story Viewer */
	.story-viewer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: hsl(var(--destructive) / 0.95);
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		padding: 0;
	}

	.story-content {
		position: relative;
		width: 100%;
		max-width: 400px;
		height: 100%;
		max-height: 700px;
		background: linear-gradient(135deg, hsl(var(--destructive) / 0.9), hsl(var(--destructive) / 0.5));
		border-radius: var(--border-radius-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* Progress Indicators */
	.progress-container {
		display: flex;
		gap: 2px;
		padding: 1rem;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
	}

	.progress-bar {
		flex: 1;
		height: 3px;
		background: hsl(var(--foreground) / 0.3);
		border-radius: 1.5px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: hsl(var(--foreground));
		width: 0%;
		transition: width 0.1s linear;
	}

	.progress-fill.completed {
		width: 100% !important;
	}

	.progress-fill.active {
		background: hsl(var(--foreground));
	}

	/* Story Header */
	.story-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 3.5rem 1rem 1rem;
		position: relative;
		z-index: 10;
	}

	.story-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.installer-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--primary-color);
		display: flex;
		align-items: center;
		justify-content: center;
		color: hsl(var(--foreground));
		font-weight: 600;
		font-size: 1.1rem;
	}

	.installer-details h3 {
		color: hsl(var(--foreground));
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.installer-link {
		color: hsl(var(--foreground));
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.installer-link:hover {
		color: hsl(var(--accent));
		text-decoration: underline;
	}

	.close-btn {
		width: 32px;
		height: 32px;
		border: none;
		background: hsl(var(--foreground) / 0.2);
		color: hsl(var(--foreground));
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		transition: background 0.2s ease;
	}

	.close-btn:hover {
		background: hsl(var(--foreground) / 0.3);
	}

	/* Story Image */
	.story-image-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: hsl(var(--destructive) / 0.3);
		min-height: 0; /* Allow container to shrink */
		flex-grow: 1;
	}

	.story-main-image {
		width: 100%;
		height: auto; /* Use natural aspect ratio */
		object-fit: contain;
		margin-top: 1rem; /* Only top margin */
		max-height: 70vh; /* Limit height to leave space for text, but allow natural ratio */
	}

	.story-no-image {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: hsl(var(--foreground) / 0.8);
		font-size: 3rem;
	}

	/* Story Details */
	.story-details {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, hsl(var(--destructive) / 0.95));
		padding: 3rem 1rem 1.5rem;
		color: hsl(var(--foreground));
		z-index: 10;
	}

	.story-details h2 {
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.project-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.info-label {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.info-value {
		font-weight: 500;
		font-size: 0.9rem;
	}

	/* Navigation Areas */
	.nav-area {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 5;
	}

	.nav-left {
		left: 0;
	}

	.nav-right {
		right: 0;
	}

	.nav-area:disabled {
		cursor: not-allowed;
	}

	/* Error/Warning Messages */
	.error-message,
	.warning-message {
		padding: 1rem;
		border-radius: var(--border-radius-md);
		margin-bottom: 1.5rem;
	}

	.error-message {
		background-color: hsl(var(--destructive-muted));
		border: 1px solid hsl(var(--destructive));
		color: hsl(var(--destructive-foreground));
	}

	.dark .error-message {
		background-color: hsl(var(--destructive) / 0.15);
		border-color: hsl(var(--destructive));
		color: hsl(var(--destructive-foreground) / 0.9);
	}

	.warning-message {
		background-color: hsl(var(--warning-muted));
		border: 1px solid hsl(var(--warning));
		color: hsl(var(--warning-foreground));
	}

	.dark .warning-message {
		background-color: hsl(var(--warning) / 0.15);
		border-color: hsl(var(--warning));
		color: hsl(var(--warning-foreground) / 0.9);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		main {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		.story-content {
			max-width: 350px;
			max-height: 600px;
		}

		.story-details h2 {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 480px) {
		.story-content {
			width: 100%;
			height: 100%;
			max-width: none;
			max-height: none;
			border-radius: 0;
		}
	}
</style>