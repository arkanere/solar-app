<script>
	// Data for blogs list

	import { isDarkMode } from '$lib/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;

	// Current page number (defaults to 1 for /blogs/+page.svelte)
	export let pageNumber = 6;

	const blogs = [
		{
			title: 'Solar Pumps in India: A Sustainable Solution for Water Management',
			excerpt:
				"Discover how solar pumps harness India's abundant sunlight to provide reliable, eco-friendly water solutions for homeowners, apartments, and businesses, reducing costs and enhancing energy independence.",
			link: '/blogs/solar-pump-and-its-applications'
		},
		{
			title:
				'Types of Solar Panels and Their Characteristics: Choosing the Right Fit for Indian Homes and Businesses',
			excerpt:
				'Explore monocrystalline, polycrystalline, thin-film, and bifacial solar panels, learning their advantages, limitations, and suitable applications for homes, apartments, and businesses in India.',
			link: '/blogs/types-of-solar-panel-and-their-characteristics'
		},
		{
			title: 'Integrated Solar Roof: The Future of Clean Energy for Indian Homes and Businesses',
			excerpt:
				'Discover how an integrated solar roof merges photovoltaic modules and roofing materials, delivering a sleek, efficient, and eco-friendly solution for Indian homeowners, apartments, and businesses.',
			link: '/blogs/integrated-solar-roof'
		},
		{
			title: 'Best Practices for Cleaning Solar Panels: Maximizing Efficiency and Longevity',
			excerpt:
				'Learn how to safely and effectively clean your solar panels, protect your investment, and boost energy output—essential for Indian homeowners, apartments, and businesses.',
			link: '/blogs/best-practices-clean-solar-panels'
		},
		{
			title: 'TOPCon Solar Panels: A High-Efficiency Choice for Indian Homes and Businesses',
			excerpt:
				'Explore how TOPCon (Tunnel Oxide Passivated Contact) technology delivers improved performance, reliability, and thermal behavior, making it an appealing investment for those seeking top-tier solar solutions in India.',
			link: '/blogs/topcon-solar-panel'
		},
		{
			title: 'Mono PERC Solar Panels: A High-Performance Option for Indian Homes and Businesses',
			excerpt:
				'Discover the advantages and practical considerations of mono PERC modules, a top-tier solar solution designed to deliver robust output and better returns on investment in India’s sunlight-rich environment.',
			link: '/blogs/mono-perc-solar-panel'
		},
		{
			title:
				'Power Purchase Agreements in India: Unlocking Low-Cost Solar for Homes and Businesses',
			excerpt:
				'Discover how PPAs let homeowners, apartment complexes, and businesses go solar without upfront costs, ensuring predictable tariffs, simplified maintenance, and a swift path to clean energy savings.',
			link: '/blogs/power-purchase-agreement'
		},
		{
			title: 'CAPEX Model in Solar Energy: Owning Your Solar Future',
			excerpt:
				'Explore how the CAPEX model lets you fully own your solar system, enjoy immediate utility bill savings, and capture all long-term benefits without leasing or third-party obligations—a popular choice across India’s growing solar market.',
			link: '/blogs/capex-model-solar-energy'
		},
		{
			title: 'OPEX Model in Solar Energy: A Zero-Investment Path to Clean Power',
			excerpt:
				'Learn how the OPEX model allows homeowners, apartment complexes, and businesses to benefit from solar power without upfront costs, ensuring predictable tariffs, outsourced maintenance, and effortless green energy adoption in India.',
			link: '/blogs/opex-model-solar-energy'
		},
		{
			title: 'RESCO Model in Solar Energy: A Service-Oriented Path to Greener Power',
			excerpt:
				"Explore how India's RESCO model enables homeowners, apartments, and businesses to adopt solar power with minimal upfront costs, reliable maintenance, and predictable tariffs—making green energy accessible and hassle-free.",
			link: '/blogs/resco-model-solar-energy'
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
