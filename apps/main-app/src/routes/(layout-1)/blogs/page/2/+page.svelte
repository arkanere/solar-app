<script>
	// Data for blogs list

	import { isDarkMode } from '$lib/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;

	// Current page number (defaults to 1 for /blogs/+page.svelte)
	export let pageNumber = 2;

	const blogs = [
		{
			title: 'Factors Determining the Cost of Manufacturing Solar Panels in India',
			excerpt:
				'Explore the key factors that influence the cost of manufacturing solar panels in India, including raw material expenses, labor efficiencies, research and development, and economies of scale.',
			link: '/blogs/factors-determining-cost-manufacturing-solar-panels-india'
		},
		{
			title: 'Research Institutes for Solar Energy in India',
			excerpt:
				'Discover the top research institutes in India dedicated to solar energy, their contributions to the industry, and how they drive innovation and sustainability in the renewable energy sector.',
			link: '/blogs/research-institutes-solar-energy-india'
		},
		{
			title: 'Electricity Sector in India: Navigating the Path to a Sustainable Future',
			excerpt:
				"Understand the current landscape, challenges, and government initiatives shaping India's electricity sector, and learn how renewable energy sources like solar power are integral to its sustainable future.",
			link: '/blogs/electricity-sector-india'
		},
		{
			title: "Emerging Trends in India's Electricity Sector: Shaping the Future of Energy",
			excerpt:
				"Stay ahead with insights into the latest trends in India's electricity sector, including renewable energy adoption, technological innovations, policy reforms, and the role of smart grids.",
			link: '/blogs/trends-electricity-sector-india'
		},
		{
			title: 'Smart Grid in India: Revolutionizing Electricity Management for a Sustainable Future',
			excerpt:
				"Explore how smart grid technology is transforming India's electricity management by enhancing efficiency, integrating renewable energy, and improving grid reliability for a sustainable future.",
			link: '/blogs/smart-grid-india'
		},
		{
			title: 'Smart Cities and Solar Energy in India: Pioneering Sustainable Urban Futures',
			excerpt:
				'Learn how the integration of solar energy is driving the development of smart cities in India, promoting sustainability, energy efficiency, and improved quality of life for residents.',
			link: '/blogs/smart-cities-solar-energy-india'
		},
		{
			title: "Pioneers of Solar Photovoltaics: Scientists Shaping India's Renewable Future",
			excerpt:
				"Meet the visionary Indian scientists whose groundbreaking research and innovations have significantly advanced the field of solar photovoltaics, driving India's renewable energy progress.",
			link: '/blogs/scientists-contributed-solar-photovoltaics'
		},
		{
			title: 'Trailblazers of Solar Photovoltaics: Indian Scientists Driving Renewable Energy',
			excerpt:
				"Discover the Indian scientists who have significantly contributed to the advancement of solar photovoltaics, driving innovation and efficiency in India's renewable energy sector.",
			link: '/blogs/indian-scientists-contributed-solar-photovoltaics'
		},
		{
			title: 'Australia’s Solar Surge: How a Sunburnt Nation Embraced Photovoltaics',
			excerpt:
				"Explore the key drivers, trends, and lessons behind Australia's rapid adoption of solar photovoltaics, and learn how the nation became a global leader in renewable energy.",
			link: '/blogs/adoption-of-solar-photovoltaics-in-australia'
		},
		{
			title: 'How the United States Embraced Solar: Key Drivers, Trends, and Lessons',
			excerpt:
				'Delve into the factors that propelled the United States to adopt solar photovoltaics extensively, highlighting the trends and lessons that shaped its solar energy landscape.',
			link: '/blogs/adoption-of-solar-photovoltaics-in-united-states'
		}
		// {
		//   title: "Germany’s Solar Revolution: Key Strategies, Policies, and Lessons",
		//   excerpt: "Discover the strategies and policies that fueled Germany's solar revolution, and learn the valuable lessons that other nations can adopt to advance their renewable energy initiatives.",
		//   link: "/blogs/adoption-of-solar-photovoltaics-in-germany"
		// },
		// {
		//   title: "Duck Curve Solar Energy India: Balancing Supply and Demand for a Sustainable Future",
		//   excerpt: "Understand the challenges of the duck curve in India's solar energy sector and explore innovative solutions to balance supply and demand for a sustainable energy future.",
		//   link: "/blogs/duck-curve-solar-energy-india"
		// },
		// {
		//   title: "Understanding Solar Panel Prices in India: Key Determining Factors",
		//   excerpt: "Gain insights into the factors that influence solar panel prices in India, including raw materials, manufacturing processes, and market dynamics.",
		//   link: "/blogs/factors-determining-solar-panel-prices-india"
		// },
		// {
		//   title: "From Light to Electricity: A Concise History of Solar Photovoltaics",
		//   excerpt: "Trace the evolution of solar photovoltaics from its early inception to the modern technologies that power today's renewable energy landscape.",
		//   link: "/blogs/history-of-solar-photovoltaics"
		// },
		// {
		//   title: "Specialised Financing for Solar Panel Power Plants: Empowering Clean Energy Growth",
		//   excerpt: "Learn about the specialised financing options available for solar panel power plants in India, and how they are empowering the growth of clean energy projects.",
		//   link: "/blogs/specialised-financing-for-solar-panel-power-plants"
		// },
		// {
		//   title: "Solar Panel Systems for Apartments and Housing Societies in India: A Comprehensive Guide",
		//   excerpt: "Learn about the benefits, installation considerations, financing options, and maintenance of solar panel systems tailored for apartments and housing societies in India.",
		//   link: "/blogs/solar-panel-systems-apartments-housing-societies-india"
		// },
		// {
		//   title: "Building-Integrated Photovoltaics in India: Enhancing Solar Integration for Homes and Businesses",
		//   excerpt: "Discover how Building-Integrated Photovoltaics (BIPV) can transform homes and businesses in India by seamlessly integrating solar energy into building designs, offering aesthetic and functional benefits.",
		//   link: "/blogs/building-integrated-photovoltaics-india"
		// },
		// {
		//   title: "Advanced Materials and Technologies in Photovoltaics in India: Powering the Future",
		//   excerpt: "Explore the latest advanced materials and cutting-edge technologies in photovoltaics in India, enhancing solar efficiency, durability, and accessibility for homes and businesses.",
		//   link: "/blogs/advanced-materials-technologies-photovoltaics-india"
		// },
		// {
		//   title: "Empowering Growth: The Use of Solar Energy by Small and Medium Enterprises in India",
		//   excerpt: "Explore how small and medium enterprises in India are leveraging solar energy to reduce costs, enhance sustainability, and drive growth, including benefits, implementation strategies, challenges, and financing options.",
		//   link: "/blogs/solar-energy-small-medium-enterprises-india"
		// },
		// {
		//   title: "Solar Potential in India: Unlocking the Nation's Renewable Energy Future",
		//   excerpt: "Explore India's vast solar potential, including geographical advantages, government initiatives, technological advancements, economic benefits, and future prospects to understand how solar energy can drive sustainable growth for homeowners, apartments, and businesses.",
		//   link: "/blogs/solar-potential-india"
		// },
		// {
		//   title: "Green Energy Corridors in India: Powering the Solar Revolution",
		//   excerpt: "Explore the role of Green Energy Corridors in India's solar revolution, including their definition, importance, key components, government initiatives, benefits for homeowners and businesses, and future prospects.",
		//   link: "/blogs/green-energy-corridors-india"
		// },
		// {
		//   title: "Energy Storage Systems in India: Empowering the Solar Future",
		//   excerpt: "Discover the role and benefits of Energy Storage Systems in India, including their types, government initiatives, advantages for homeowners, apartments, and businesses, and the challenges and future prospects shaping their integration into the nation's energy landscape.",
		//   link: "/blogs/energy-storage-systems-india"
		// },
		// {
		//   title: "Energy Storage Systems Peak Shaving in India: Empowering the Solar Future",
		//   excerpt: "Discover how Energy Storage Systems facilitate peak shaving in India, including understanding peak shaving, the role of ESS, implementation strategies, benefits for homeowners, apartments, and businesses, government policies, and future prospects.",
		//   link: "/blogs/energy-storage-systems-peak-shaving-india"
		// },
		// {
		//   title: "Subsidies for Solar Installations in India: A Comprehensive Guide for Homeowners, Apartments, and Businesses",
		//   excerpt: "Explore the various subsidies available for solar installations in India, including their types, eligibility criteria, application processes, benefits for homeowners, apartments, and businesses, and the challenges and future prospects shaping their adoption.",
		//   link: "/blogs/subsidy-for-solar-installations-india"
		// },
		// {
		//   title: "Community Solar Projects in India: Harnessing Collective Power for a Sustainable Future",
		//   excerpt: "Explore community solar projects in India, including their definition, benefits, implementation strategies, challenges, government support, and future prospects, providing valuable insights for homeowners, apartments, and businesses interested in renewable energy.",
		//   link: "/blogs/community-solar-projects-india"
		// },
		// {
		//   title: "Public-Private Partnerships in India's Solar Energy Sector: Driving Sustainable Growth",
		//   excerpt: "Explore Public-Private Partnerships in India's solar energy sector, including their definition, benefits, successful models, challenges, government support, and future prospects, providing valuable insights for homeowners, apartments, and businesses interested in renewable energy.",
		//   link: "/blogs/public-private-partnerships-solar-energy-india"
		// },
		// {
		//   title: "Smart Homes with Rooftop Solar: Revolutionizing Energy Efficiency in India",
		//   excerpt: "Discover how integrating rooftop solar systems with smart home technologies can revolutionize energy efficiency in India, including benefits, key components, implementation strategies, technological advancements, challenges, and future prospects for homeowners, apartments, and businesses.",
		//   link: "/blogs/smart-home-rooftop-solar-india"
		// },
		// {
		//   title: "Rooftop Solar in India: Empowering Homes and Businesses for a Sustainable Future",
		//   excerpt: "Explore the benefits, key considerations, financial aspects, and future outlook of rooftop solar installations in India, offering valuable insights for homeowners, apartments, and businesses.",
		//   link: "/blogs/rooftop-solar-in-india"
		// },
		// {
		//   title: "Solar Panel Prices in India: A Decade of Decline and Opportunity",
		//   excerpt: "Explore how solar panel prices in India have evolved over the past decade, the key factors driving this decline, and what the current and future landscape means for homeowners, apartments, and businesses seeking sustainable energy solutions.",
		//   link: "/blogs/trend-price-of-solar-panels-last-decade-india"
		// },
		// {
		//   title: "Turn Your Unused Roof into a Solar Asset: Maximizing Returns and Sustainability",
		//   excerpt: "Discover how leveraging unused rooftop space for solar installations can reduce electricity costs, boost property value, and promote environmental sustainability for homeowners, apartments, and businesses in India.",
		//   link: "/blogs/turn-unused-roof-into-solar-asset"
		// },
		// {
		//   title: "Managing High Electricity Bills: Strategies and Solar Solutions for Indian Homes and Businesses",
		//   excerpt: "Explore effective ways to tackle high electricity bills in India, from quick-efficiency fixes to long-term strategies and solar solutions, perfect for homeowners, apartments, and businesses seeking sustainable energy options.",
		//   link: "/blogs/managing-high-electricity-bills-india"
		// },
		// {
		//   title: "Green Solutions for a Greener Tomorrow: Empowering Indian Homes and Businesses",
		//   excerpt: "Explore a range of eco-friendly strategies, from rooftop solar to waste reduction, that help homeowners, apartments, and businesses in India reduce costs and environmental impact, leading to a greener future for all.",
		//   link: "/blogs/green-solutions-for-greener-tomorrow"
		// },
		// {
		//   title: "Why a Solar Rooftop System Is a Smart Investment in 2025",
		//   excerpt: "Discover how advancements in technology, cost reductions, and supportive policies make solar rooftop systems a compelling choice for Indian homes and businesses looking toward 2025 and beyond.",
		//   link: "/blogs/why-solar-rooftop-system-is-good-investment-2025"
		// },
		// {
		//   title: "Industrial Solar Installations in India: Powering Growth with Clean Energy",
		//   excerpt: "Discover how large-scale solar projects reduce operational costs, enhance sustainability, and benefit local communities, making industrial solar installations a compelling choice for Indian industries and beyond.",
		//   link: "/blogs/industrial-solar-installation-india"
		// },
		// {
		//   title: "The Rapid Growth of Photovoltaics: Empowering Indian Homes and Businesses",
		//   excerpt: "Learn about the evolution of solar power, key drivers of global PV adoption, and why homeowners, apartments, and businesses in India stand to benefit significantly from the rise of photovoltaics.",
		//   link: "/blogs/growth-of-photovoltaics"
		// },
		// {
		//   title: "Comparing the Cost of Electricity by Source: Insights for Indian Homes and Businesses",
		//   excerpt: "Explore how coal, gas, nuclear, hydropower, and solar stack up in terms of costs and reliability, and learn why solar power is leading the charge toward affordable, sustainable energy in India.",
		//   link: "/blogs/cost-of-electricity-by-source-india"
		// },
		// {
		//   title: "Feed-in Tariffs in India: Empowering the Solar Revolution",
		//   excerpt: "Explore how feed-in tariffs can accelerate solar adoption across Indian homes and businesses, offering financial certainty, stable revenue, and a cleaner energy future.",
		//   link: "/blogs/feed-in-electricity-tariff-policy-instrument"
		// },
		// {
		//   title: "Solar Subsidies in India: Empowering Clean Energy Investments",
		//   excerpt: "Explore how government subsidies reduce the upfront costs of solar installations, accelerating adoption among homeowners, apartment communities, and businesses, all while boosting India's renewable energy sector.",
		//   link: "/blogs/solar-subsidy-policy-instrument"
		// },
		// {
		//   title: "Key Considerations in Solar Panel Manufacturing: Ensuring Quality and Efficiency",
		//   excerpt: "Discover the critical aspects of solar panel manufacturing, from raw material selection to quality control, and learn how these factors influence performance for homes, apartments, and businesses in India.",
		//   link: "/blogs/key-considerations-solar-panel-manufacturing"
		// },
		// {
		//   title: "Flexible Solar Panels and Their Applications: A Versatile Approach to Clean Energy",
		//   excerpt: "Explore how flexible solar panels are redefining possibilities for curved roofs, portable electronics, and aesthetically challenging spaces, offering practical and eco-friendly solutions for Indian homes, apartments, and businesses.",
		//   link: "/blogs/flexible-solar-panels-applications"
		// },
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
