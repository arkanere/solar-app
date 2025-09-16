<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import AddBranch from '$lib/AddBranch.svelte';
	import ShowEditProfile from '$lib/ShowEditProfile.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, branches = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// State for add branch modal
	let showAddBranch = false;

	// State for edit profile modal
	let showEditProfile = false;
	let selectedBranch = null;

	// Function to toggle the add branch modal
	const toggleAddBranch = () => {
		showAddBranch = !showAddBranch;
	};

	// Function to open edit profile modal
	const openEditProfile = (branch) => {
		selectedBranch = branch;
		showEditProfile = true;
	};

	// Handle branch added event
	function handleBranchAdded(event) {
		// Refresh the page to show the new branch
		window.location.reload();
	}

	// Handle branch updated event
	function handleBranchUpdated(event) {
		// Refresh the page to show the updated branch
		window.location.reload();
	}

	// Format address for display
	function formatAddress(branch) {
		const parts = [];
		if (branch.address) parts.push(branch.address);
		if (branch.city) parts.push(branch.city);
		if (branch.district) parts.push(branch.district);
		if (branch.state) parts.push(branch.state);

		return parts.join(', ');
	}

	// Determine if a branch is the main branch
	function isMainBranch(branch) {
		return mainBusiness && branch.id === mainBusiness.id;
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<!-- Navigation Bar -->
	<nav>
		<ul class="nav-list">
			<li><button on:click={toggleAddBranch}>Add Branch</button></li>
			<li>
				<button onclick="window.location.href='/{businessSlug}'">Back to Dashboard</button>
			</li>
		</ul>
	</nav>

	<header>
		<h1>Branch Offices</h1>
		<p>Manage your business branches across different locations</p>
	</header>

	<!-- Branches Section -->
	<section id="branches-section">
		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{:else}
			<div class="branches-grid">
				<!-- Main Branch Tile (Always show first) -->
				{#if mainBusiness}
					<div class="branch-tile main-branch">
						<div class="branch-header">
							<h2>{mainBusiness.businessname}</h2>
							<span class="branch-tag main-tag">Main Office</span>
						</div>
						<div class="branch-details">
							<p><strong>Address:</strong> {formatAddress(mainBusiness)}</p>
							{#if mainBusiness.phonenumber}
								<p><strong>Phone:</strong> {mainBusiness.phonenumber}</p>
							{/if}
							{#if mainBusiness.email}
								<p><strong>Email:</strong> {mainBusiness.email}</p>
							{/if}
						</div>
						<div class="branch-actions">
							<a
								href="/solar-panel-installer/{mainBusiness.slug}"
								target="_blank"
								class="btn profile-btn">Profile Page</a
							>
							<button class="btn edit-btn" on:click={() => openEditProfile(mainBusiness)}
								>Edit Details</button
							>
						</div>
					</div>
				{/if}

				<!-- Branch Offices Tiles -->
				{#each branches as branch}
					{#if !isMainBranch(branch)}
						<div class="branch-tile">
							<div class="branch-header">
								<h2>{branch.businessname}</h2>
								<span class="branch-tag branch-tag-secondary">Branch Office</span>
							</div>
							<div class="branch-details">
								<p><strong>Address:</strong> {formatAddress(branch)}</p>
								{#if branch.phonenumber}
									<p><strong>Phone:</strong> {branch.phonenumber}</p>
								{/if}
								{#if branch.email}
									<p><strong>Email:</strong> {branch.email}</p>
								{/if}
								<p><strong>Location:</strong> {branch.city}, {branch.district}, {branch.state}</p>
							</div>
							<div class="branch-actions">
								<a
									href="/solar-panel-installer/{branch.slug}"
									target="_blank"
									class="btn profile-btn">Profile Page</a
								>
								<button class="btn edit-btn" on:click={() => openEditProfile(branch)}
									>Edit Details</button
								>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<!-- No branches message -->
		{#if branches.length === 0 && !errorMessage && mainBusiness}
			<div class="no-branches">
				<p>You don't have any branch offices yet.</p>
			</div>
		{/if}
	</section>
</main>

<!-- Add Branch Modal -->
{#if showAddBranch}
	<AddBranch
		show={showAddBranch}
		businessId={mainBusiness?.id}
		{businessSlug}
		on:close={() => (showAddBranch = false)}
		on:branchAdded={handleBranchAdded}
	/>
{/if}

<!-- Edit Profile Modal -->
{#if showEditProfile && selectedBranch}
	<ShowEditProfile
		show={showEditProfile}
		businessInfo={selectedBranch}
		businessSlug={selectedBranch.slug}
		on:close={() => (showEditProfile = false)}
		on:updated={handleBranchUpdated}
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

		/* New tag colors */
		--main-tag-color: #28a745;
		--branch-tag-color: #6c757d;

		/* New button colors */
		--profile-btn-color: #4285f4;
		--profile-btn-hover: #3367d6;
		--edit-btn-color: #f1f1f1;
		--edit-btn-hover: #e3e3e3;
		--edit-btn-text: #333;
		--edit-btn-border: #ccc;
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

	/* Branches grid */
	.branches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		width: 100%;
	}

	/* Branch tile styling */
	.branch-tile {
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

	.dark .branch-tile {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.branch-tile:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.dark .branch-tile:hover {
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
	}

	.main-branch {
		border-left: 5px solid var(--success-color);
	}

	.branch-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--border-color-light);
		padding-bottom: 0.75rem;
	}

	.dark .branch-header {
		border-bottom: 1px solid var(--border-color-dark);
	}

	.branch-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.branch-tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-weight: bold;
		color: white;
	}

	.main-tag {
		background-color: var(--main-tag-color);
	}

	.branch-tag-secondary {
		background-color: var(--branch-tag-color);
	}

	.branch-details {
		margin-bottom: 1rem;
		flex-grow: 1;
	}

	.branch-details p {
		margin: 0.5rem 0;
	}

	/* Add branch tile */
	.add-branch-tile {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px dashed var(--border-color-light);
		background-color: var(--light-bg-color);
		cursor: pointer;
		min-height: 200px;
	}

	.dark .add-branch-tile {
		border: 2px dashed var(--border-color-dark);
		background-color: #222;
	}

	.add-branch-content {
		text-align: center;
	}

	.add-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 0.5rem;
		color: var(--success-color);
	}

	.add-branch-tile:hover {
		border-color: var(--success-color);
	}

	.dark .add-branch-tile:hover {
		border-color: var(--success-color);
	}

	/* No branches message */
	.no-branches {
		text-align: center;
		padding: 3rem;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-branches {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.no-branches p {
		margin-bottom: 1rem;
		font-size: 1.1rem;
		color: var(--light-secondary-text-color);
	}

	.dark .no-branches p {
		color: var(--dark-secondary-text-color);
	}

	.no-branches button {
		background-color: var(--success-color);
	}

	.no-branches button:hover {
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

	/* Branch actions and buttons */
	.branch-actions {
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

	.profile-btn {
		background-color: var(--profile-btn-color);
		color: white;
		border: none;
		display: inline-block;
	}

	.edit-btn {
		background-color: var(--edit-btn-color);
		border: 1px solid var(--edit-btn-border);
		color: var(--edit-btn-text);
	}

	.profile-btn:hover {
		background-color: var(--profile-btn-hover);
	}

	.edit-btn:hover {
		background-color: var(--edit-btn-hover);
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 600px) {
		.nav-list {
			justify-content: center;
		}

		.nav-list li {
			margin-bottom: 0.5rem;
		}

		.branches-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
