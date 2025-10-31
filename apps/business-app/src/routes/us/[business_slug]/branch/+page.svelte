<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/us/themeStore';
	import AddBranch from '$lib/us/AddBranch.svelte';
	import ShowEditProfile from '$lib/us/ShowEditProfile.svelte';
	import ShowSupport from '$lib/us/ShowSupport.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ mainBusiness, branches = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Computed business info
	$: businessInfo = mainBusiness
		? {
				businessname: mainBusiness.businessname
			}
		: {};

	// State for modals
	let showAddBranch = false;
	let showEditProfile = false;
	let showSupport = false;
	let mobileMenuOpen = false;
	let selectedBranch = null;

	// Function to toggle modals
	const toggleAddBranch = () => {
		showAddBranch = !showAddBranch;
	};

	const toggleSupport = () => {
		showSupport = !showSupport;
	};

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
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

<!-- TOP NAVIGATION -->
<nav class="top-nav {darkMode ? 'dark' : 'light'}">
	<div class="nav-brand">
		<a href="/us/{businessSlug}">
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
		<li><button on:click={toggleAddBranch}>Add Branch</button></li>
		<li><button on:click={toggleSupport}>Support</button></li>
		<li>
			<form method="POST" action={`/us/${businessSlug}/logout`}>
				<button type="submit">Logout</button>
			</form>
		</li>
	</ul>
</nav>

<main class={darkMode ? 'dark' : 'light'}>

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
								href="/us/solar-panel-installer/{mainBusiness.slug}"
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
									href="/us/solar-panel-installer/{branch.slug}"
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

<!-- Modals -->
{#if showAddBranch}
	<AddBranch
		show={showAddBranch}
		businessId={mainBusiness?.id}
		{businessSlug}
		on:close={() => (showAddBranch = false)}
		on:branchAdded={handleBranchAdded}
	/>
{/if}

{#if showEditProfile && selectedBranch}
	<ShowEditProfile
		show={showEditProfile}
		businessInfo={selectedBranch}
		businessSlug={selectedBranch.slug}
		on:close={() => (showEditProfile = false)}
		on:updated={handleBranchUpdated}
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

		.branches-grid {
			grid-template-columns: 1fr;
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
