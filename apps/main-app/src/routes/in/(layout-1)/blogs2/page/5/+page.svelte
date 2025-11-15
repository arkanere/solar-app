<script>
	// Data for blogs list

	import { isDarkMode } from '$lib/in/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;

	// Current page number (defaults to 1 for /blogs/+page.svelte)
	export let pageNumber = 5;

	const blogs = [
		{
			title:
				'Managing High Electricity Bills: Strategies and Solar Solutions for Indian Homes and Businesses',
			excerpt:
				'Explore effective ways to tackle high electricity bills in India, from quick-efficiency fixes to long-term strategies and solar solutions, perfect for homeowners, apartments, and businesses seeking sustainable energy options.',
			link: '/blogs/managing-high-electricity-bills-india'
		},
		{
			title: 'Green Solutions for a Greener Tomorrow: Empowering Indian Homes and Businesses',
			excerpt:
				'Explore a range of eco-friendly strategies, from rooftop solar to waste reduction, that help homeowners, apartments, and businesses in India reduce costs and environmental impact, leading to a greener future for all.',
			link: '/blogs/green-solutions-for-greener-tomorrow'
		},
		{
			title: 'Why a Solar Rooftop System Is a Smart Investment in 2025',
			excerpt:
				'Discover how advancements in technology, cost reductions, and supportive policies make solar rooftop systems a compelling choice for Indian homes and businesses looking toward 2025 and beyond.',
			link: '/blogs/why-solar-rooftop-system-is-good-investment-2025'
		},
		{
			title: 'Industrial Solar Installations in India: Powering Growth with Clean Energy',
			excerpt:
				'Discover how large-scale solar projects reduce operational costs, enhance sustainability, and benefit local communities, making industrial solar installations a compelling choice for Indian industries and beyond.',
			link: '/blogs/industrial-solar-installation-india'
		},
		{
			title: 'The Rapid Growth of Photovoltaics: Empowering Indian Homes and Businesses',
			excerpt:
				'Learn about the evolution of solar power, key drivers of global PV adoption, and why homeowners, apartments, and businesses in India stand to benefit significantly from the rise of photovoltaics.',
			link: '/blogs/growth-of-photovoltaics'
		},
		{
			title:
				'Comparing the Cost of Electricity by Source: Insights for Indian Homes and Businesses',
			excerpt:
				'Explore how coal, gas, nuclear, hydropower, and solar stack up in terms of costs and reliability, and learn why solar power is leading the charge toward affordable, sustainable energy in India.',
			link: '/blogs/cost-of-electricity-by-source-india'
		},
		{
			title: 'Feed-in Tariffs in India: Empowering the Solar Revolution',
			excerpt:
				'Explore how feed-in tariffs can accelerate solar adoption across Indian homes and businesses, offering financial certainty, stable revenue, and a cleaner energy future.',
			link: '/blogs/feed-in-electricity-tariff-policy-instrument'
		},
		{
			title: 'Solar Subsidies in India: Empowering Clean Energy Investments',
			excerpt:
				"Explore how government subsidies reduce the upfront costs of solar installations, accelerating adoption among homeowners, apartment communities, and businesses, all while boosting India's renewable energy sector.",
			link: '/blogs/solar-subsidy-policy-instrument'
		},
		{
			title: 'Key Considerations in Solar Panel Manufacturing: Ensuring Quality and Efficiency',
			excerpt:
				'Discover the critical aspects of solar panel manufacturing, from raw material selection to quality control, and learn how these factors influence performance for homes, apartments, and businesses in India.',
			link: '/blogs/key-considerations-solar-panel-manufacturing'
		},
		{
			title: 'Flexible Solar Panels and Their Applications: A Versatile Approach to Clean Energy',
			excerpt:
				'Explore how flexible solar panels are redefining possibilities for curved roofs, portable electronics, and aesthetically challenging spaces, offering practical and eco-friendly solutions for Indian homes, apartments, and businesses.',
			link: '/blogs/flexible-solar-panels-applications'
		}
		// {
		//   title: "Solar Pumps in India: A Sustainable Solution for Water Management",
		//   excerpt: "Discover how solar pumps harness India's abundant sunlight to provide reliable, eco-friendly water solutions for homeowners, apartments, and businesses, reducing costs and enhancing energy independence.",
		//   link: "/blogs/solar-pump-and-its-applications"
		// },
		// {
		//   title: "Types of Solar Panels and Their Characteristics: Choosing the Right Fit for Indian Homes and Businesses",
		//   excerpt: "Explore monocrystalline, polycrystalline, thin-film, and bifacial solar panels, learning their advantages, limitations, and suitable applications for homes, apartments, and businesses in India.",
		//   link: "/blogs/types-of-solar-panel-and-their-characteristics"
		// }
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
