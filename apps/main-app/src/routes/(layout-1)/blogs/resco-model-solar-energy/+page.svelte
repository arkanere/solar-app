<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme state

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example dates for demonstration
	const lastUpdated = '2024-08-06';
	const lastUpdatedDisplay = 'August 6, 2024';
	const datePublished = '2024-08-06';

	// Canonical URL
	const articleUrl = 'https://solarvipani.com/blogs/resco-model-solar-energy';

	// JSON-LD structured data for SEO
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'RESCO Model in Solar Energy: A Service-Oriented Path to Greener Power',
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
			"Explore how India's RESCO model enables homeowners, apartments, and businesses to adopt solar power with minimal upfront costs, reliable maintenance, and predictable tariffs—making green energy accessible and hassle-free."
	};

	// Convert to JSON string
	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<!-- SEO Title -->
	<title>RESCO Model in Solar Energy: A Service-Oriented Path to Greener Power</title>

	<!-- JSON-LD structured data injection -->
	{@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<header class="blog-header">
			<h1>RESCO Model in Solar Energy: A Service-Oriented Path to Greener Power</h1>
			<p>By <a href="/about-us">SolarVipani Admin</a></p>
			<p>Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time></p>
		</header>

		<!-- Introduction (50–100 words) -->
		<p>
			A RESCO (Renewable Energy Service Company) model is an increasingly popular way for Indian
			homeowners, apartment complexes, and businesses to adopt solar power with minimal financial
			risk. Under this model, a third-party provider owns, operates, and maintains the solar
			installation on your property, while you purchase the electricity generated at a predetermined
			rate. From reduced energy bills to hassle-free maintenance, the RESCO setup brings
			sustainability within reach for a wide range of users. This blog explores how the RESCO model
			works, highlights its unique benefits, and outlines practical considerations for those looking
			to embrace solar energy without incurring steep initial costs.
		</p>

		<h2>1. What Is the RESCO Model?</h2>
		<p>
			The RESCO model is a business arrangement in which a specialized Renewable Energy Service
			Company finances, installs, and manages a solar power system on the client’s property. In
			exchange, the client—be it a homeowner, apartment society, or commercial establishment—signs
			an agreement to pay for the electricity generated over a specified contract period, usually at
			a rate lower than or competitive with local utility prices. Unlike the CAPEX model, where the
			property owner invests capital to purchase the solar equipment outright, or OPEX/third-party
			PPA setups that focus solely on power sales, RESCO emphasizes full-service energy provision.
		</p>

		<h2>2. Key Benefits for Indian Homes and Businesses</h2>
		<p>
			1. <strong>Minimal Upfront Spending</strong>: Since the RESCO funds the solar infrastructure,
			property owners avoid the large capital outlay typically needed for installations. 2.
			<strong>Predictable Energy Costs</strong>: Contracts often lock in per-unit tariffs, offering
			price stability and shielding users from fluctuating grid rates. 3.
			<strong>Professional Maintenance</strong>: The RESCO’s expertise ensures optimal system
			performance, handling routine inspections, cleaning, and repairs without requiring your time
			or technical know-how. 4. <strong>Scalable Solutions</strong>: Whether you’re a standalone
			home or a sprawling commercial enterprise, the RESCO can tailor system sizes to fit your
			energy demands. 5. <strong>Reduced Carbon Footprint</strong>: By shifting a portion of power
			consumption to solar, you cut emissions, helping India progress toward national sustainability
			targets.
		</p>

		<h2>3. Common Applications and Real-World Impact</h2>
		<p>
			The RESCO model suits a variety of scenarios across India. In urban areas, high-rise apartment
			complexes often enlist RESCOs to install and manage rooftop solar, distributing lower-cost
			electricity to residents. Commercial buildings—such as offices, retail centers, or educational
			institutions—benefit from stable pricing, outsourced upkeep, and fewer disruptions in scaling
			operations. In more remote locales, RESCO-based solutions can address intermittent grid supply
			or diesel reliance, providing communities or small industries with cleaner energy at
			predictable rates. Some government-backed projects also adopt the RESCO approach to expedite
			solar rollouts on public infrastructures like train stations and school rooftops.
		</p>

		<h2>4. Essential Considerations Before Signing Up</h2>
		<p>
			1. <strong>Contract Length</strong>: RESCO agreements can span 10–25 years, so ensuring
			alignment with long-term property plans is crucial. 2. <strong>Tariff Escalations</strong>:
			The per-unit electricity rate may include annual escalation clauses, affecting overall
			savings. Compare these increments against projected utility rate hikes. 3.
			<strong>Site Suitability</strong>: Roof strength, orientation, and shading can affect system
			size and performance. A thorough feasibility analysis by the RESCO helps ensure realistic
			output estimates. 4. <strong>Performance Guarantees</strong>: Reputable RESCOs often provide
			generation or uptime guarantees. Confirm their approach to system monitoring and how they
			handle underperformance. 5. <strong>Stakeholder Buy-In</strong>: For multi-tenant buildings,
			ensuring majority consent among residents or boards can streamline project execution.
		</p>

		<h2>Conclusion</h2>
		<p>
			By making solar adoption nearly turnkey, the RESCO model holds enormous potential for Indian
			homeowners, apartment associations, and businesses aiming to reduce power costs and
			environmental impact without heavy capital requirements. With a dedicated renewable energy
			service company owning and maintaining the installation, users enjoy immediate savings,
			predictable tariffs, and professional oversight—critical in a rapidly evolving solar market.
			Still, due diligence on contract terms and site readiness is essential. Ultimately, signing on
			with a reliable RESCO can usher in a new era of low-carbon, cost-effective energy, aligning
			personal priorities with India’s broader transition to a sustainable future.
		</p>
	</div>
</main>

<style>
	/* Root variables for light/dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Layout styling */
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

	/* Header styling */
	.blog-header {
		margin-bottom: 2rem;
	}

	/* Headings */
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

	/* Paragraphs */
	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
	}

	strong {
		font-weight: 600;
	}

	/* Responsiveness */
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
