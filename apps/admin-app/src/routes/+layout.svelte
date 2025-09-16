<script>
	import { isDarkMode, toggleTheme, initializeTheme } from '$lib/themeStore';
	import { onMount } from 'svelte';

	// Initialize the theme when the component is mounted
	onMount(() => {
		initializeTheme();
	});

	let analyticsDropdownVisible = false;
	let controlTowerDropdownVisible = false;
</script>

<nav class={$isDarkMode ? 'dark' : 'light'}>
	<ul>
		<li><a href="/leaddata">View Lead Data</a></li>
		<li><a href="/leaddata-nonexclusive">View Nonexclusive Lead Data</a></li>
		<li><a href="/lead-claimsdata">View Lead Claims Data</a></li>
		<li><a href="/businesses">View Business Data</a></li>
		<li><a href="/queries">View queries</a></li>
		<li class="dropdown" 
			on:mouseenter={() => analyticsDropdownVisible = true} 
			on:mouseleave={() => analyticsDropdownVisible = false}>
			<a href="/analytics">View Analytics</a>
			{#if analyticsDropdownVisible}
				<div class="dropdown-content">
					<a href="/analytics/business-login" target="_blank">Business Login</a>
					<a href="/analytics/businesses" target="_blank">Businesses</a>
					<a href="/analytics/businesses-branches" target="_blank">Businesses Branches</a>
					<a href="/analytics/businesses-statewise" target="_blank">Businesses Statewise</a>
					<a href="/analytics/coverage" target="_blank">Coverage</a>
					<a href="/analytics/lead-generation" target="_blank">Lead Generation</a>
					<a href="/analytics/leads-claimed" target="_blank">Leads Claimed</a>
					<a href="/analytics/recent-projects" target="_blank">Recent Projects</a>
					<a href="/analytics/spread" target="_blank">Spread</a>
				</div>
			{/if}
		</li>
		<li class="dropdown" 
			on:mouseenter={() => controlTowerDropdownVisible = true} 
			on:mouseleave={() => controlTowerDropdownVisible = false}>
			<a href="/control-tower">Control Tower</a>
			{#if controlTowerDropdownVisible}
				<div class="dropdown-content">
					<a href="/control-tower/eligible-businesses" target="_blank">Eligible Businesses</a>
					<a href="/control-tower/eligible-leads" target="_blank">Eligible Leads</a>
				</div>
			{/if}
		</li>
	</ul>
	<!-- Shorter button text for mobile -->
	<button on:click={toggleTheme}>
		{$isDarkMode ? 'Light mode' : 'Dark mode'}
	</button>
</nav>

<slot></slot>

<style>
	:global(body) {
		font-family: 'Georgia', serif;
		margin: 0;
		padding: 0;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		flex-wrap: wrap;
		transition: background-color 0.3s ease;
	}

	nav ul {
		list-style-type: none;
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0;
	}

	nav ul li {
		margin: 0 1.5rem;
		position: relative;
	}

	nav ul li a {
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	/* Light Mode */
	.light {
		background-color: #fafafa;
		color: #333;
	}

	.light ul li a {
		color: #333;
	}

	.light ul li a:hover {
		color: #0077cc;
	}

	/* Dark Mode */
	.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.dark ul li a {
		color: #fff;
	}

	.dark ul li a:hover {
		color: #66b2ff;
	}

	/* Dropdown styles */
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 200px;
		z-index: 1000;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 0.5rem 0;
	}

	.dropdown-content a {
		display: block;
		padding: 0.5rem 1rem;
		text-decoration: none;
		font-size: 0.95rem;
		white-space: nowrap;
		transition: background-color 0.2s ease;
	}

	/* Light mode dropdown styles */
	.light .dropdown-content {
		background-color: #ffffff;
		border: 1px solid #e0e0e0;
	}

	.light .dropdown-content a {
		color: #333;
	}

	.light .dropdown-content a:hover {
		background-color: #f5f5f5;
		color: #0077cc;
	}

	/* Dark mode dropdown styles */
	.dark .dropdown-content {
		background-color: #2a2a2a;
		border: 1px solid #444;
	}

	.dark .dropdown-content a {
		color: #fff;
	}

	.dark .dropdown-content a:hover {
		background-color: #3a3a3a;
		color: #66b2ff;
	}

	/* Button style */
	button {
		background: none;
		border: 1px solid;
		padding: 0.25rem 0.5rem; /* Reduce padding to make button smaller */
		font-size: 0.9rem; /* Smaller font size */
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.light button {
		border-color: #333;
		color: #333;
	}

	.light button:hover {
		background-color: #333;
		color: white;
	}

	.dark button {
		border-color: #fff;
		color: #fff;
	}

	.dark button:hover {
		background-color: #fff;
		color: #333;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		nav {
			flex-direction: row; /* Keep items in a single row */
			justify-content: space-between;
		}

		nav ul {
			flex-direction: row; /* Align menu items horizontally */
			justify-content: flex-start; /* Align menu items to the left */
			width: auto; /* Don't take full width */
		}

		nav ul li {
			margin: 0 0.5rem; /* Reduce margin between navigation links */
		}

		button {
			margin: 0; /* Remove top margin on button */
			padding: 0.25rem 0.5rem; /* Smaller padding for the button */
			width: auto; /* Button should adjust to its content */
		}

		/* Decrease font sizes for smaller screen */
		nav ul li a {
			font-size: 0.9rem; /* Smaller font size for nav links */
		}
	}

	/* Prevent horizontal scrolling */
	body,
	html {
		overflow-x: hidden;
	}
</style>
