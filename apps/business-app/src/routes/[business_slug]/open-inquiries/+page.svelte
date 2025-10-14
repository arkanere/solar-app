<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import ShowSupport from '$lib/ShowSupport.svelte';

	const businessSlug = $page.params.business_slug;
	$: darkMode = $isDarkMode;
	$: ({ leads = [], business } = $page.data);

	// State variables
	let showSupport = false;
	let mobileMenuOpen = false;

	// UI toggle functions
	const toggleSupport = () => (showSupport = !showSupport);
	const toggleMobileMenu = () => (mobileMenuOpen = !mobileMenuOpen);

	// Computed business info
	$: businessInfo = business
		? {
				businessname: business.businessname
			}
		: {};

	// Function to calculate days ago
	function getDaysAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		
		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else {
			return `${diffInDays} days ago`;
		}
	}

	// Function to show instructions for getting the inquiry
	function showInquiryInstructions(lead) {
		alert(`To get this inquiry in ${lead.district}, ${lead.state}:\n\n1. Add a branch in any city within ${lead.district} district\n2. Once the branch is added, the lead will appear in your business dashboard home page. From there you can claim it\n\nClick on "Add Branch" in the navigation menu to get started.`);
	}
</script>

<svelte:head>
	<title>Open Inquiries - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<!-- TOP NAVIGATION -->
<nav class="top-nav {darkMode ? 'dark' : 'light'}">
	<div class="nav-brand">
		<a href="/{businessSlug}">
			<span class="brand-full">Solar Vipani Business Dashboard - {businessInfo.businessname || ''}</span>
			<span class="brand-mobile">{businessInfo.businessname || 'Business Dashboard'}</span>
		</a>
	</div>

	<div class="hamburger" on:click={toggleMobileMenu}>
		<span></span>
		<span></span>
		<span></span>
	</div>

	<ul class="nav-list {mobileMenuOpen ? 'open' : ''}">
		<li><button on:click={toggleSupport}>Support</button></li>
		<li>
			<form method="POST" action={`/${businessSlug}/logout`}>
				<button type="submit">Logout</button>
			</form>
		</li>
	</ul>
</nav>

<!-- MAIN CONTENT -->
<main class={darkMode ? 'dark' : 'light'}>
	<div class="container">
		<header>
			<h1>Open Inquiries</h1>
			<p class="header-subtitle">Available inquiries that you can claim for free</p>
		</header>
		
		{#if leads.length > 0}
			<div class="table-container">
				<table class="inquiries-table">
					<thead>
						<tr>
							<th>Sr No.</th>
							<th>Name</th>
							<th>District</th>
							<th>State</th>
							<th>Received</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each leads as lead, index}
							<tr>
								<td>{index + 1}</td>
								<td class="name-cell">
									<div class="name-container">
										<span class="customer-name">{lead.name}</span>
										{#if lead.sv_comment_for_businesses}
											<div class="sv-comment-preview">
												<small>📝 {lead.sv_comment_for_businesses}</small>
											</div>
										{/if}
									</div>
								</td>
								<td>{lead.district}</td>
								<td>{lead.state}</td>
								<td class="received-cell">{getDaysAgo(lead.created_at)}</td>
								<td class="action-cell">
									<button 
										class="claim-btn" 
										on:click={() => showInquiryInstructions(lead)}
									>
										Get this Inquiry
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="no-inquiries">
				<div class="no-inquiries-card">
					<h2>🔍 No Open Inquiries Available</h2>
					<p>There are currently no inquiries available to claim. New inquiries will appear here as they become available.</p>
					<p>Check back later or visit your <a href="/{businessSlug}/crm">CRM section</a> to manage your existing leads.</p>
				</div>
			</div>
		{/if}
	</div>
</main>

<!-- Component Modals -->
{#if showSupport}
	<ShowSupport show={showSupport} on:close={() => (showSupport = false)} />
{/if}

<style>
	/* Reset margins and ensure full width */
	:global(body) {
		margin: 0;
		padding: 0;
	}
	
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
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		font-family: var(--font-family);
		min-height: calc(100vh - 70px);
		transition: background-color 0.3s ease, color 0.3s ease;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	.container {
		width: 100%;
		max-width: 1000px;
		padding: 2rem 1rem;
		margin: 0 auto;
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
		white-space: nowrap;
	}

	button:hover {
		background-color: var(--accent-hover);
	}

	button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	/* Navigation */
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

	/* Header */
	header h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		text-align: center;
		color: var(--accent-color);
	}

	.header-subtitle {
		text-align: center;
		font-size: 1.1rem;
		color: var(--light-secondary-text-color);
		margin: 0 0 2rem 0;
	}

	:global(.dark) .header-subtitle {
		color: var(--dark-secondary-text-color);
	}

	/* Table styles */
	.table-container {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		margin: 1rem 0;
	}

	:global(.dark) .table-container {
		background: #333;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.inquiries-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-family);
	}

	.inquiries-table th {
		background-color: var(--accent-color);
		color: white;
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.inquiries-table td {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color-light);
		vertical-align: top;
	}

	:global(.dark) .inquiries-table td {
		border-bottom-color: var(--border-color-dark);
		color: var(--dark-primary-text-color);
	}

	.inquiries-table tbody tr:hover {
		background-color: rgba(0, 86, 179, 0.05);
	}

	:global(.dark) .inquiries-table tbody tr:hover {
		background-color: rgba(100, 181, 246, 0.1);
	}

	.inquiries-table tbody tr:last-child td {
		border-bottom: none;
	}

	/* Table cell specific styles */
	.name-cell {
		min-width: 200px;
	}

	.name-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.customer-name {
		font-weight: 600;
		color: var(--accent-color);
	}

	.sv-comment-preview {
		font-style: italic;
		color: var(--light-secondary-text-color);
		background-color: rgba(0, 86, 179, 0.05);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border-left: 3px solid var(--accent-color);
	}

	:global(.dark) .sv-comment-preview {
		color: var(--dark-secondary-text-color);
		background-color: rgba(100, 181, 246, 0.1);
		border-left-color: #64b5f6;
	}

	.received-cell {
		white-space: nowrap;
		font-weight: 500;
	}

	.action-cell {
		text-align: center;
	}

	.claim-btn {
		background-color: #28a745;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.claim-btn:hover {
		background-color: #218838;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
	}

	.claim-btn:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* No inquiries state */
	.no-inquiries {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;
	}

	.no-inquiries-card {
		background: white;
		border-radius: 12px;
		padding: 3rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 600px;
		width: 100%;
	}

	:global(.dark) .no-inquiries-card {
		background: #333;
		color: var(--dark-primary-text-color);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.no-inquiries-card h2 {
		font-size: 2rem;
		margin: 0 0 1.5rem 0;
		color: var(--accent-color);
	}

	.no-inquiries-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0 0 1rem 0;
		color: var(--light-secondary-text-color);
	}

	:global(.dark) .no-inquiries-card p {
		color: var(--dark-secondary-text-color);
	}

	.no-inquiries-card a {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 600;
	}

	.no-inquiries-card a:hover {
		color: var(--accent-hover);
		text-decoration: underline;
	}

	/* Mobile responsiveness */
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

		.container {
			padding: 1rem;
		}

		header h1 {
			font-size: 2rem;
		}

		.table-container {
			overflow-x: auto;
		}

		.inquiries-table th,
		.inquiries-table td {
			padding: 0.75rem;
			font-size: 0.9rem;
		}

		.inquiries-table th {
			font-size: 0.8rem;
		}

		.name-cell {
			min-width: 180px;
		}

		.sv-comment-preview {
			font-size: 0.75rem;
		}

		.claim-btn {
			padding: 0.5rem 1rem;
			font-size: 0.8rem;
		}

		.no-inquiries-card {
			padding: 2rem 1.5rem;
		}

		.no-inquiries-card h2 {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0 0.5rem;
		}

		.brand-mobile {
			max-width: 140px;
			font-size: 0.8rem;
		}

		button {
			white-space: normal;
			word-break: break-word;
		}

		.header-subtitle {
			font-size: 1rem;
			padding: 0 1rem;
		}

		.inquiries-table {
			font-size: 0.8rem;
		}

		.inquiries-table th,
		.inquiries-table td {
			padding: 0.5rem;
		}

		.inquiries-table th {
			font-size: 0.7rem;
		}

		.name-cell {
			min-width: 150px;
		}

		.customer-name {
			font-size: 0.9rem;
		}

		.sv-comment-preview {
			font-size: 0.7rem;
			padding: 0.2rem 0.4rem;
		}

		.claim-btn {
			padding: 0.4rem 0.8rem;
			font-size: 0.7rem;
		}

		.no-inquiries-card {
			padding: 1.5rem 1rem;
		}

		.no-inquiries-card h2 {
			font-size: 1.3rem;
		}

		.no-inquiries-card p {
			font-size: 1rem;
		}
	}
</style>