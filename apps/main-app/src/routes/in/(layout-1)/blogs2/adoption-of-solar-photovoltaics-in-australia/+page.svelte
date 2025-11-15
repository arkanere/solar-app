<script>
	import { isDarkMode } from '$lib/in/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2024-03-10';
	const lastUpdatedDisplay = 'March 10, 2024';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2024-03-10';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/in/blogs/adoption-of-solar-photovoltaics-in-australia';

	// Create your JSON-LD object for this article
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Australia’s Solar Surge: How a Sunburnt Nation Embraced Photovoltaics',
		author: {
			'@type': 'Person',
			name: 'SolarVipani Admin',
			url: '/about-us'
		},
		datePublished: datePublished,
		dateModified: lastUpdated,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': articleUrl
		},
		publisher: {
			'@type': 'Organization',
			name: 'SolarVipani Admin'
		},
		description:
			'Explore how Australia leveraged abundant sunshine, supportive policies, and consumer demand to become a global solar powerhouse, offering insights for Indian homeowners, apartments, and businesses.'
	};

	// Convert JSON-LD object to a string
	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<!-- Inject JSON-LD in the document head without Svelte scoping -->
	{@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<header class="blog-header">
			<!-- Title -->
			<h1>Australia’s Solar Surge: How a Sunburnt Nation Embraced Photovoltaics</h1>

			<!-- Author and Last Updated Display (human-readable) -->
			<p>
				By
				<a href="/about-us"> SolarVipani Admin </a>
			</p>

			<p>
				Last updated:
				<time datetime={lastUpdated}>
					{lastUpdatedDisplay}
				</time>
			</p>
		</header>

		<!-- Introduction -->
		<p>
			Australia, blessed with abundant sunshine, has witnessed a remarkable transformation from
			reliance on fossil fuels to rapid solar adoption. Over the last two decades, government
			incentives, plunging panel prices, and growing consumer awareness have propelled rooftop
			systems and utility-scale farms alike. While geography and policy differ from India’s, the
			core drivers—affordability, supportive regulations, and public demand for reliable, green
			power—offer valuable insights. This concise post highlights how Aussies integrated solar into
			everyday life and how their experience may guide Indian homeowners, apartments, and businesses
			seeking clean energy solutions.
		</p>

		<!-- Section 1: Early Foundations and Rural Electrification -->
		<h2>1. Early Foundations and Rural Electrification</h2>
		<p>
			Australia’s solar journey began with remote off-grid setups, especially in the outback where
			diesel generators were costly and unreliable. Government grants and pilot projects helped
			early adopters—such as remote Aboriginal communities—benefit from PV’s stability. Over time,
			research agencies like the Australian Renewable Energy Agency (ARENA) funded deeper
			exploration, driving down costs. Environmental awareness campaigns also laid the groundwork,
			with many citizens supporting alternative energy to protect local ecosystems. By the early
			2000s, solar was primed for expansion from remote homesteads to mainstream suburban rooftops.
		</p>

		<!-- Section 2: Rooftop Renaissance and Consumer Adoption -->
		<h2>2. Rooftop Renaissance and Consumer Adoption</h2>
		<p>
			Residential rooftop solar soared as federal and state rebates offset installation costs. Net
			metering and premium feed-in tariffs sweetened the deal, guaranteeing homeowners a return on
			excess electricity fed back to the grid. As panel costs dropped further, families realized
			solar could significantly cut monthly bills. Media stories of energy self-sufficiency and
			boosted property values fueled word-of-mouth momentum. Suburban neighborhoods embraced solar
			en masse—catapulting Australia to one of the highest rooftop PV penetrations worldwide,
			showcasing the power of financial incentives plus consumer-driven economics.
		</p>

		<!-- Section 3: Utility-Scale Projects and Corporate Participation -->
		<h2>3. Utility-Scale Projects and Corporate Participation</h2>
		<p>
			While rooftops drew headlines, big solar farms also flourished. Expansive sun-baked tracts in
			Queensland and New South Wales hosted large-scale PV arrays, often funded through
			power-purchase agreements (PPAs) secured via competitive auctions. Corporations—from miners to
			tech firms—joined the trend, locking in stable, clean power. Community-backed solar farms
			emerged too, with local councils or co-ops pooling resources for mid-sized projects feeding
			regional grids. This range of developments—rural microgrids, communal ventures, and
			utility-scale farms—underscored Australia’s diverse approach to harnessing its solar bounty.
		</p>

		<!-- Section 4: Policy Shifts, Grid Challenges, and Storage Solutions -->
		<h2>4. Policy Shifts, Grid Challenges, and Storage Solutions</h2>
		<p>
			Rapid solar uptake strained utilities that grappled with midday generation peaks and evening
			demand surges—commonly called the “duck curve.” In response, some states revised feed-in rates
			or introduced time-of-use pricing. High-profile projects like Tesla’s Hornsdale battery proved
			how storage could smooth supply fluctuations. Meanwhile, policy fluctuations—such as reduced
			solar incentives—occasionally stirred uncertainty. Nonetheless, market-based auctions, local
			pilot programs, and a push for battery integration continued propelling solar forward,
			ensuring grid reliability and cost-effectiveness remained central to Australia’s renewable
			agenda.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			Australia’s success with solar PV showcases how abundant sunshine, favorable policies, and
			consumer will can transform a nation’s energy mix. From pioneering off-grid outback systems to
			widespread urban rooftops and sprawling desert solar farms, Aussies leveraged rebates, net
			metering, and advanced storage to embed solar in daily life. For Indian homeowners,
			apartments, and businesses—facing similar needs for reliable, eco-friendly power—Australia’s
			story underscores the role of targeted incentives, robust financing, and ongoing policy
			refinements. By adapting these lessons, India can likewise accelerate its own bright,
			solar-powered future.
		</p>
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
	}

	.blogpost {
		max-width: 650px;
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

	/* Blog header styling */
	.blog-header {
		margin-bottom: 2rem;
	}

	/* Heading styling */
	h1,
	h2 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	h1 {
		text-align: center;
	}

	/* Paragraph styling */
	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		h1,
		h2 {
			font-size: 2rem;
		}

		p {
			font-size: 1rem;
		}
	}
</style>
