<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2024-12-01';
	const lastUpdatedDisplay = 'December 1, 2024';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2024-12-01';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/blogs/trend-price-of-solar-panels-last-decade-india';

	// Create your JSON-LD object for this article
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Solar Panel Prices in India: A Decade of Decline and Opportunity',
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
			'Explore how solar panel prices in India have evolved over the past decade, the key factors driving this decline, and what the current and future landscape means for homeowners, apartments, and businesses seeking sustainable energy solutions.'
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
			<h1>Solar Panel Prices in India: A Decade of Decline and Opportunity</h1>

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
			Over the past decade, solar panel prices in India have witnessed a remarkable downward
			trajectory, transforming renewable energy from a niche option to a mainstream solution for
			homeowners, apartment complexes, and businesses. This price decline is attributed to
			advancements in technology, policy support, and economies of scale in manufacturing.
			Understanding this trend is vital for those interested in adopting solar energy, as it sheds
			light on the economic feasibility and future outlook of the industry. This blog examines the
			key milestones, drivers, challenges, and opportunities that have shaped solar panel pricing in
			India over the last ten years.
		</p>

		<!-- Section 1: Early Years of Solar Adoption (2013–2015) -->
		<h2>1. Early Years of Solar Adoption (2013–2015)</h2>
		<p>
			In the early 2010s, solar energy in India was still in its infancy, marked by relatively high
			costs and limited consumer awareness. During this period (2013–2015), solar panel prices,
			though beginning to decline globally, remained a significant barrier for many Indian
			households and businesses. Most installations were driven by government-sponsored pilot
			projects, demonstration programs, and subsidies aimed at kickstarting the renewable energy
			sector. Domestic manufacturing was nascent, resulting in reliance on imported panels, which
			were subject to import duties and currency fluctuations. Despite these challenges, the stage
			was set for growth: falling global module prices, increasing public awareness, and supportive
			government policies laid the foundation for broader adoption and price reductions in the years
			to follow.
		</p>

		<!-- Section 2: Steep Decline and Market Growth (2016–2018) -->
		<h2>2. Steep Decline and Market Growth (2016–2018)</h2>
		<p>
			The period between 2016 and 2018 witnessed a rapid drop in solar panel prices, spurred by
			technological advancements, large-scale manufacturing in China, and improved supply chains.
			Economies of scale played a pivotal role, as global demand soared and manufacturers optimized
			their production processes. In India, this translated into competitive bidding for solar
			projects, with developers proposing historically low tariffs that captured international
			headlines. The government’s National Solar Mission gained momentum, and states introduced
			favorable net metering policies, further encouraging adoption among homeowners and businesses.
			During these years, the solar sector transformed from a high-cost alternative to a promising
			mainstream energy source, with panel prices becoming increasingly within reach for a broader
			range of consumers.
		</p>

		<!-- Section 3: Consolidation and Policy Refinements (2019–2021) -->
		<h2>3. Consolidation and Policy Refinements (2019–2021)</h2>
		<p>
			From 2019 to 2021, solar panel prices showed signs of stabilizing as the market matured and
			growth patterns became more predictable. During this phase, India introduced important policy
			refinements—such as the imposition of safeguard duties and anti-dumping measures—to support
			domestic manufacturing and reduce dependency on imports. While these measures aimed to foster
			local industries, they also introduced some price volatility. Concurrently, the market
			consolidated, with established players expanding their operations, and smaller companies
			merging or exiting the space. Technological improvements, particularly in panel efficiency and
			energy storage solutions, contributed to maintaining downward pressure on module costs.
			Despite short-term fluctuations, the overarching trend remained one of long-term affordability
			and accessibility for rooftop and large-scale solar projects alike.
		</p>

		<!-- Section 4: Current Landscape and Future Outlook (2022–2023) -->
		<h2>4. Current Landscape and Future Outlook (2022–2023)</h2>
		<p>
			In recent years, the solar industry in India has continued to evolve, shaped by global supply
			chain dynamics and ambitious national targets. While panel prices have largely remained low
			compared to a decade ago, minor price upticks have occurred due to global disruptions—such as
			rising raw material costs and logistical bottlenecks. Nonetheless, increased government focus
			on domestic manufacturing, through initiatives like the Production Linked Incentive (PLI)
			scheme, is poised to reinforce the downward price trend over the long term. Technological
			innovations, including half-cut cell technology and bifacial panels, are further enhancing
			performance without significantly inflating costs. As the rooftop solar market expands,
			homeowners, apartments, and businesses stand to benefit from sustained affordability, improved
			panel efficiency, and supportive government policies that promote widespread adoption.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			The decline in solar panel prices over the last decade has been a catalyst for India’s
			renewable energy revolution, transforming solar power into an economically viable option for
			homeowners, apartments, and businesses. While short-term fluctuations and global supply chain
			issues may occasionally affect pricing, the overall trend remains positive. Continued
			technological advancements, policy support, and strengthened domestic manufacturing are
			expected to keep prices competitive. For those considering a transition to solar energy,
			understanding these pricing trends can inform better investment decisions— ultimately
			contributing to a cleaner, more resilient, and cost-effective energy future for all.
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
