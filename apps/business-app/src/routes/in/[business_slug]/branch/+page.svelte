<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import ShowEditProfile from '$lib/in/ShowEditProfile.svelte';
	import AddBranch from '$lib/in/AddBranch.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, branches = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// State for edit modal (specific to this page)
	let showEditProfile = false;
	let selectedBranch = null;

	// State for add branch modal
	let showAddBranch = false;

	// Function to open edit profile modal
	const openEditProfile = (branch) => {
		selectedBranch = branch;
		showEditProfile = true;
	};

	// Handle branch updated event
	function handleBranchUpdated(event) {
		window.location.reload();
	}

	// Handle branch added event
	function handleBranchAdded(event) {
		showAddBranch = false;
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

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<div class="header-content">
			<div>
				<h1>Branch Offices</h1>
				<p>Manage your business branches across different locations</p>
			</div>
			<button class="btn add-branch-btn" on:click={() => (showAddBranch = true)}>
				➕ Add Branch
			</button>
		</div>
	</header>

	<!-- Branches Section -->
	<section id="branches-section">
		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{:else}
			<div class="branches-grid">
				<!-- Main Branch Tile -->
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
							<p><strong>Location:</strong> {mainBusiness.city}, {mainBusiness.district}, {mainBusiness.state}</p>
						</div>
						<div class="branch-actions">
							<a
								href="https://solarvipani.com/in/solar-panel-installer/{mainBusiness.slug}"
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
									href="https://solarvipani.com/in/solar-panel-installer/{branch.slug}"
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
</div>

<!-- Edit Profile Modal (specific to this page) -->
{#if showEditProfile && selectedBranch}
	<ShowEditProfile
		show={showEditProfile}
		businessInfo={selectedBranch}
		businessSlug={selectedBranch.slug}
		on:close={() => (showEditProfile = false)}
		on:updated={handleBranchUpdated}
	/>
{/if}

<!-- Add Branch Modal -->
{#if showAddBranch && mainBusiness}
	<AddBranch
		show={showAddBranch}
		businessId={mainBusiness.id}
		{businessSlug}
		on:close={() => (showAddBranch = false)}
		on:branchAdded={handleBranchAdded}
	/>
{/if}

<style>
	/* Root variables */
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
	}

	/* Page Content */
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

	/* Header */
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

	.header-content > div:first-child {
		flex: 1;
	}

	.header-content > button {
		flex: 0 0 auto;
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
		font-size: 1rem;
		opacity: 0.8;
	}

	.add-branch-btn {
		background: var(--accent-color);
		color: white;
		white-space: nowrap;
		padding: 0.5rem 1rem;
		font-weight: 500;
		font-size: 0.9rem;
		flex-shrink: 0;
		width: auto;
	}

	.add-branch-btn:hover {
		background: var(--accent-hover);
	}

	.dark .add-branch-btn {
		background: #66b2ff;
		color: #1a1a1a;
	}

	.dark .add-branch-btn:hover {
		background: #5aa3ff;
	}

	/* Branches Grid */
	.branches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	/* Branch Tile */
	.branch-tile {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: box-shadow 0.3s ease;
	}

	.branch-tile:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.dark .branch-tile {
		background: #2a2a2a;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.dark .branch-tile:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.main-branch {
		border: 2px solid var(--success-color);
	}

	/* Branch Header */
	.branch-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.branch-header h2 {
		font-size: 1.25rem;
		margin: 0;
		flex: 1;
	}

	/* Branch Tags */
	.branch-tag {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.main-tag {
		background: var(--success-color);
		color: white;
	}

	.branch-tag-secondary {
		background: var(--accent-color);
		color: white;
	}

	/* Branch Details */
	.branch-details {
		flex: 1;
	}

	.branch-details p {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	/* Branch Actions */
	.branch-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.3s ease;
		text-decoration: none;
		display: inline-block;
		text-align: center;
		flex: 1;
		min-width: 120px;
	}

	.profile-btn {
		background: var(--accent-color);
		color: white;
	}

	.profile-btn:hover {
		background: var(--accent-hover);
	}

	.edit-btn {
		background: var(--success-color);
		color: white;
	}

	.edit-btn:hover {
		background: var(--success-hover);
	}

	/* No branches message */
	.no-branches {
		text-align: center;
		padding: 3rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-branches {
		background: #2a2a2a;
	}

	.no-branches p {
		margin: 0;
		font-size: 1.1rem;
		opacity: 0.7;
	}

	/* Error message */
	.error-message {
		color: red;
		font-weight: bold;
		padding: 1rem;
		background: #ffebee;
		border-radius: 4px;
		margin-bottom: 1rem;
		text-align: center;
	}

	.dark .error-message {
		background: #541e1e;
		color: #ef9a9a;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.page-content {
			padding: 1rem;
		}

		.branches-grid {
			grid-template-columns: 1fr;
		}

		header h1 {
			font-size: 1.5rem;
		}

		.header-content {
			flex-direction: column;
			align-items: stretch;
		}

		.add-branch-btn {
			width: 100%;
		}

		.branch-actions {
			flex-direction: column;
		}

		.btn {
			min-width: auto;
		}
	}
</style>
