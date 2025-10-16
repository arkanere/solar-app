<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2024-02-18';
	const lastUpdatedDisplay = 'February 18, 2024';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2024-02-18';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/blogs/zero-upfront-solar-scheme-for-apartments';

	// Create your JSON-LD object
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline:
			'Zero-Upfront Solar Scheme for Apartments: Save Big Now, Enjoy Free Electricity Later',
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
			'Learn how apartments and housing societies in India can benefit from a zero-upfront solar scheme, lock in reduced per-unit rates, and gain ownership for years of near-free electricity.'
	};

	// Convert JSON-LD object to a string
	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<!-- Use {@html ...} to inject your script directly without Svelte scoping -->
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
			<h1>Zero-Upfront Solar Scheme for Apartments: Save Big Now, Enjoy Free Electricity Later</h1>

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
			India’s push for renewable energy has spurred a unique solar offer: apartment complexes and
			housing societies can install rooftop solar at zero upfront cost, lock in lower electricity
			rates for 12 years, and then assume full ownership of the system. Since a typical solar plant
			lasts 25 years, societies effectively enjoy around 13 years of nearly free power after their
			12-year contract. This blog highlights how the scheme works, why it’s an excellent fit for
			multi-unit buildings, and how it can unlock substantial financial and environmental benefits.
		</p>

		<!-- Section 1: Understanding the Zero-Upfront Model -->
		<h2>1. Understanding the Zero-Upfront Model</h2>
		<p>
			The scheme removes the biggest hurdle to going solar—capital expenditure. A third-party solar
			provider handles procurement, installation, and maintenance at zero initial cost. In exchange,
			the apartment society signs a Power Purchase Agreement (PPA) to buy electricity from the
			system at an agreed-upon rate (lower than the utility’s). This means:
		</p>
		<ul>
			<li>
				<strong>No Lump-Sum Investment:</strong> The provider installs panels, inverters, and mounting
				structures without any payment from the society upfront.
			</li>
			<li>
				<strong>Seamless Integration:</strong> The system directly powers common areas (elevators, lighting),
				reducing grid dependency.
			</li>
			<li>
				<strong>Professional Management:</strong> The provider oversees design, permits, and technical
				setup.
			</li>
		</ul>

		<!-- Section 2: The Rs. 12/Unit Rate -->
		<h2>2. The Rs. 12/Unit Rate</h2>
		<p>
			A key draw is the locked-in per-unit price of Rs. 12, notably cheaper than the Rs. 20/unit
			some DISCOMs charge:
		</p>
		<ul>
			<li>
				<strong>Immediate Savings:</strong> Societies instantly lower monthly bills by paying Rs. 12
				instead of higher grid tariffs.
			</li>
			<li>
				<strong>Price Stability:</strong> While grid rates may rise over time, the PPA rate remains fixed
				for 12 years, aiding long-term budgeting.
			</li>
			<li>
				<strong>Fair Billing:</strong> A dedicated meter measures how much solar energy is consumed.
				The society only pays for actual usage, ensuring transparency.
			</li>
			<li>
				<strong>Predictable Cash Flow:</strong> Freed-up funds can be allocated to other community improvements,
				from landscaping to security enhancements.
			</li>
		</ul>

		<!-- Section 3: Ownership Transfer and Free Electricity Thereafter -->
		<h2>3. Ownership Transfer and Free Electricity Thereafter</h2>
		<p>When the 12-year PPA ends, the solar system transfers to the society at no extra cost:</p>
		<ul>
			<li>
				<strong>Zero Buyout:</strong> Post-contract, there’s no lump-sum fee to assume ownership.
			</li>
			<li>
				<strong>Extended Lifespan:</strong> Solar panels typically function for 25 years, leaving around
				13 years of free power generation.
			</li>
			<li>
				<strong>High ROI:</strong> By avoiding any upfront expense yet gaining ownership later, the total
				savings often surpass what a self-purchased system might yield.
			</li>
			<li>
				<strong>Minimal Maintenance:</strong> While the society will oversee upkeep after year 12, solar
				panels and inverters require only periodic cleaning or minor checks to maintain efficiency.
			</li>
		</ul>

		<!-- Section 4: Implementation Steps -->
		<h2>4. Implementation Steps</h2>
		<p>Shifting to this solar model involves a straightforward, professionally guided process:</p>
		<ul>
			<li>
				<strong>Site Survey:</strong> The solar provider evaluates rooftop space, structural stability,
				and energy consumption patterns.
			</li>
			<li>
				<strong>Proposal and PPA:</strong> A customized agreement outlines the Rs. 12/unit rate, contract
				duration (12 years), and ownership transfer terms.
			</li>
			<li>
				<strong>Installation:</strong> Expert teams handle panel mounting, wiring, and system integration,
				often within a few weeks.
			</li>
			<li>
				<strong>Commissioning:</strong> Thorough testing confirms output levels, and net metering paperwork
				is managed for any surplus power.
			</li>
			<li>
				<strong>Billing and Monitoring:</strong> The society receives monthly invoices at the fixed rate,
				while the provider tracks performance in real time.
			</li>
		</ul>

		<!-- Section 5: Environmental and Community Impact -->
		<h2>5. Environmental and Community Impact</h2>
		<p>Beyond cost savings, adopting solar yields meaningful societal benefits:</p>
		<ul>
			<li>
				<strong>Reduced Carbon Footprint:</strong> Relying on solar rather than grid-based power cuts
				carbon emissions linked to fossil fuels.
			</li>
			<li>
				<strong>Healthier Air Quality:</strong> Lower coal-derived electricity usage reduces pollutants
				like sulfur dioxide and particulate matter.
			</li>
			<li>
				<strong>Grid Relief:</strong> During peak daylight hours, the society’s consumption switches
				to solar, easing pressure on the local electricity distribution network.
			</li>
			<li>
				<strong>Eco-Conscious Culture:</strong> Implementing green initiatives fosters community pride
				and can inspire residents to explore other sustainability efforts.
			</li>
		</ul>

		<!-- Section 6: Common Questions and Concerns -->
		<h2>6. Common Questions and Concerns</h2>
		<ul>
			<li>
				<strong>System Underperformance:</strong> Reputable providers usually include performance guarantees;
				if generation dips below expectations, they’ll fix the issue.
			</li>
			<li>
				<strong>Approvals and Permits:</strong> The solar developer typically manages net metering and
				local clearances.
			</li>
			<li>
				<strong>Potential Roof Damage:</strong> Proper structural assessments and professional mounting
				techniques protect the rooftop.
			</li>
			<li>
				<strong>Maintenance Costs:</strong> For the first 12 years, most upkeep is handled by the provider;
				afterward, basic cleaning or occasional part replacements remain minimal.
			</li>
			<li>
				<strong>Panel Technology Updates:</strong> While solar tech advances, standard panels retain
				strong output over decades, making them a safe, long-term investment.
			</li>
		</ul>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			This zero-upfront solar scheme offers an appealing route for apartment complexes and housing
			societies to embrace green energy without incurring the traditional capital costs. By locking
			in a Rs. 12/unit rate for 12 years and then inheriting the plant ownership free of charge,
			communities can secure reliable, low-cost power for over two decades. Coupled with reduced
			environmental impact and professional project management, it’s a game-changing solution that
			combines economic efficiency with sustainability—ultimately helping both the planet and the
			pocketbook.
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
	h2,
	h3 {
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

	/* List styling */
	ul,
	ol {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	ul li,
	ol li {
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	strong {
		font-weight: 600;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		h1,
		h2,
		h3 {
			font-size: 2rem;
		}

		p,
		ul li,
		ol li {
			font-size: 1rem;
		}
	}
</style>
