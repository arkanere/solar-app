<script>
	// Data for blogs list

	import { isDarkMode } from '$lib/us/themeStore'; // Import from store if globally managed

	// Initialize dark mode state

	// Use the global theme store
	let darkMode = $derived($isDarkMode);

	const blogs = [
		{
			title: 'Zero Cost EMI Schemes for Solar Panels: Complete Guide 2025',
			excerpt:
				'Complete guide to Zero Cost EMI schemes for solar panels. Learn about no-cost EMI options, eligibility, banks offering solar loans, and how to finance your solar installation without upfront payment.',
			link: '/us/blogs/zero-cost-emi-schemes-solar'
		},
		{
			title: '1kW On-Grid Solar System: Complete Guide 2025',
			excerpt:
				'Complete guide to 1kW on-grid solar system. Learn about cost, installation, electricity generation, components, subsidy, and benefits for small homes and apartments.',
			link: '/us/blogs/1kw-ongrid-solar-system'
		},
		{
			title: '3kW On-Grid Solar System: Complete Guide 2025',
			excerpt:
				'Complete guide to 3kW on-grid solar system. Learn about cost, installation, electricity generation, components, government incentives, and benefits for residential properties.',
			link: '/us/blogs/3kw-ongrid-solar-system'
		},
		{
			title: '5kW On-Grid Solar System: Complete Guide 2025',
			excerpt:
				'Complete guide to 5kW on-grid solar system. Learn about cost, installation, electricity generation, components, tax credits, and benefits for medium to large homes.',
			link: '/us/blogs/5kw-ongrid-solar-system'
		},
		{
			title: 'Why Hiring a Verified Solar Installer Is Essential for Your Home or Business',
			excerpt:
				'Learn about the importance of professional workmanship, safety compliance, maximizing system efficiency, leveraging industry knowledge, and ensuring long-term support.',
			link: '/us/blogs/hiring-verified-solar-installer-in-usa-is-essential'
		}
	];
</script>

<svelte:head>
	<!-- Page Title -->
	<title>Solar Vipani Blog - Solar Energy Guides & Resources</title>
	<meta
		name="description"
		content="Explore comprehensive guides on solar panel systems, financing options, and installation tips. Learn about 1kW, 3kW, and 5kW solar systems, zero-cost EMI schemes, and more."
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://solarvipani.com/us/blogs" />
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
	<!-- Pagination removed as we only have 5 blog posts on a single page -->
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
</style>
