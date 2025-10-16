<script>
	// Data for blogs list

	import { isDarkMode } from '$lib/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;

	// Current page number (defaults to 1 for /blogs/+page.svelte)
	export let pageNumber = 7;

	const blogs = [
		{
			title: 'On-Grid Solar Systems in India: Powering Homes and Businesses with Ease',
			excerpt:
				'Discover how on-grid solar solutions let you tap into clean energy, reduce monthly bills, and still enjoy reliable backup power from the grid—perfect for Indian homes, apartments, and businesses.',
			link: '/blogs/on-grid-solar-system'
		},
		{
			title: 'Off-Grid Solar Systems in India: Gaining Energy Independence',
			excerpt:
				'Explore how off-grid solar solutions, complete with battery storage, enable Indian homeowners, apartments, and businesses to break free from unreliable grids and control their clean energy journey.',
			link: '/blogs/off-grid-solar-system'
		},
		{
			title: 'How to Install Solar Pump in India: Complete Guide 2025',
			excerpt:
				'Complete guide to install solar pump in India. Learn about costs, government subsidies, installation process, types of solar pumps, and how to choose the right system for your needs.',
			link: '/blogs/install-solar-pump-in-india'
		},
		{
			title: '1kW On-Grid Solar System in India: Complete Guide 2025',
			excerpt:
				'Complete guide to 1kW on-grid solar system in India. Learn about cost, installation, electricity generation, components, subsidy, and benefits for small homes and apartments.',
			link: '/blogs/1kw-ongrid-solar-system'
		},
		{
			title: '3kW On-Grid Solar System in India: Complete Guide 2025',
			excerpt:
				'Complete guide to 3kW on-grid solar system in India. Learn about cost, installation, electricity generation, components, subsidy, and benefits for medium-sized homes.',
			link: '/blogs/3kw-ongrid-solar-system'
		},
		{
			title: '5kW On-Grid Solar System in India: Complete Guide 2025',
			excerpt:
				'Complete guide to 5kW on-grid solar system in India. Learn about cost, installation, electricity generation, components, subsidy, and benefits for large homes and small businesses.',
			link: '/blogs/5kw-ongrid-solar-system'
		},
		{
			title: 'Zero Cost EMI Schemes for Solar Panels in India: Complete Guide 2025',
			excerpt:
				'Complete guide to Zero Cost EMI schemes for solar panels in India. Learn about no-cost EMI options, eligibility, banks offering solar loans, and how to finance your solar installation without upfront payment.',
			link: '/blogs/zero-cost-emi-schemes-solar'
		},
		{
			title: 'Solar Net Metering in India: Complete Guide to How It Works 2025',
			excerpt:
				'Complete guide to solar net metering in India. Learn how net metering works, benefits, billing process, connection procedure, and regulations for rooftop solar systems.',
			link: '/blogs/solar-net-metering-how-it-works'
		},
		{
			title: 'Installing Solar Panels at Your New House Under Construction: Complete Guide 2025',
			excerpt:
				'Complete guide to installing solar panels during new house construction. Learn about planning, design integration, cost benefits, technical considerations, and best practices for solar-ready homes.',
			link: '/blogs/installing-solar-panels-new-house-construction'
		}
	];
</script>

<svelte:head>
	<!-- Page Title -->
	<title>Solar Vipani Blog</title>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogs-list">
		<h1>Blog Posts</h1>
		<ul>
			{#each blogs as blog}
				<li class="blog-item">
					<a href={blog.link}>
						<h2>{blog.title}</h2>
						<p>{blog.excerpt}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<!-- Pagination -->
	<div class="pagination">
		<a href="/blogs" class={pageNumber === 1 ? 'active' : ''}>1</a>
		<a href="/blogs/page/2" class={pageNumber === 2 ? 'active' : ''}>2</a>
		<a href="/blogs/page/3" class={pageNumber === 3 ? 'active' : ''}>3</a>
		<a href="/blogs/page/4" class={pageNumber === 4 ? 'active' : ''}>4</a>
		<a href="/blogs/page/5" class={pageNumber === 5 ? 'active' : ''}>5</a>
		<a href="/blogs/page/6" class={pageNumber === 6 ? 'active' : ''}>6</a>
		<a href="/blogs/page/7" class={pageNumber === 7 ? 'active' : ''}>7</a>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		min-height: 100vh; /* Ensure main fills at least the viewport height */
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Blog list styling */
	.blogs-list {
		max-width: 650px;
		width: 100%;
	}

	.blogs-list h1 {
		text-align: center;
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	.blog-item {
		margin-bottom: 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		transition: box-shadow 0.3s ease;
	}

	.blog-item a {
		text-decoration: none;
		color: inherit;
		display: block;
		padding: 1.5rem;
	}

	.blog-item a:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.blog-item h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.blog-item p {
		font-size: 1.1rem;
		line-height: 1.6;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		.blog-item h2 {
			font-size: 1.5rem;
		}

		.blog-item p {
			font-size: 1rem;
		}
	}

	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		gap: 1rem;
		font-size: 1.2rem;
	}

	.pagination a {
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid var(--accent-color);
		border-radius: 4px;
		color: var(--accent-color);
		font-weight: bold;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.pagination a:hover {
		background-color: var(--accent-color);
		color: white;
	}

	.pagination a.active {
		background-color: var(--accent-color);
		color: white;
	}
</style>
