<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2024-02-20';
	const lastUpdatedDisplay = 'February 20, 2024';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2024-02-20';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/blogs/history-of-solar-photovoltaics';

	// Create your JSON-LD object for this article
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'From Light to Electricity: A Concise History of Solar Photovoltaics',
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
			'Discover the key milestones in solar photovoltaics—from 19th-century lab experiments to today’s modern panels—tailored for homeowners, apartments, and businesses in India.'
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
			<h1>From Light to Electricity: A Concise History of Solar Photovoltaics</h1>

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
			Solar photovoltaics (PV) may seem like a modern marvel, but the idea of converting sunlight
			into electricity traces back nearly two centuries. Early lab experiments revealed that certain
			materials generated small electric currents under light exposure, foreshadowing today’s
			high-efficiency panels. In India—where solar adoption is booming—understanding PV’s origins
			provides context for how and why this technology took off. This blog distills key milestones,
			from the 19th-century spark of the photovoltaic effect to the large-scale deployments shaping
			a cleaner, more affordable energy future.
		</p>

		<!-- Section 1: Early Observations and Scientific Roots -->
		<h2>1. Early Observations and Scientific Roots</h2>
		<p>
			The journey began in 1839, when French physicist Edmond Becquerel discovered the photovoltaic
			effect: certain materials, bathed in light, produced tiny electric currents. Though
			rudimentary, it sparked deeper inquiries into how light interacts with matter. Subsequent work
			by scientists like James Clerk Maxwell and Max Planck clarified the nature of light, setting
			the stage for photoconductive breakthroughs. By the late 19th century, experiments with
			elements like selenium hinted that solar power wasn’t just a curiosity—it could someday be
			harnessed for real-world applications. This foundational era laid the groundwork for practical
			solar cells to emerge later.
		</p>

		<!-- Section 2: The First Practical Solar Cells -->
		<h2>2. The First Practical Solar Cells</h2>
		<p>
			Albert Einstein’s 1905 explanation of the photoelectric effect solidified the science behind
			photovoltaics. Early prototypes included selenium-based cells, such as Charles Fritts’s 1883
			design, but their efficiency was barely 1%. The real leap came in 1954, when Bell Laboratories
			unveiled the first viable silicon solar cell—about 6% efficient. Though costly, silicon’s
			superior electron transport opened the door for genuine electricity generation from sunlight.
			Initially reserved for specialized uses, like remote communication or off-grid research, these
			pioneering cells proved that the sun could be tapped to create consistent power, laying a firm
			foundation for solar’s future growth.
		</p>

		<!-- Section 3: Space Exploration and Early Commercial Uses -->
		<h2>3. Space Exploration and Early Commercial Uses</h2>
		<p>
			Solar’s breakthrough moment arrived in 1958 with the Vanguard 1 satellite, which used PV to
			power onboard instruments. Satellites and space missions adopted solar arrays for their
			reliability and lightweight design—high-profile successes that boosted research funding back
			on Earth. By the 1970s, small-scale terrestrial applications—like solar-powered
			calculators—showcased PV’s potential beyond aerospace. Though early panels remained expensive,
			these pilot projects nudged governments, scientists, and entrepreneurs to explore bigger grids
			and consumer markets, paving the way for broader acceptance in everyday life.
		</p>

		<!-- Section 4: Cost Reductions and Scaling Up -->
		<h2>4. Cost Reductions and Scaling Up</h2>
		<p>
			As microelectronics refined silicon manufacturing, solar cells became cheaper and more
			efficient. By the 1980s, commercial panels reached around 10–15% efficiency. Governments
			worldwide introduced subsidies, feed-in tariffs, and tax incentives, accelerating solar’s
			transition from niche to mainstream. Germany’s Energiewende policy in the early 2000s
			illustrated how robust financial support could rapidly scale a national solar market.
			Meanwhile, China’s manufacturing boom drove panel costs down dramatically. This synergy of
			policy and economy propelled solar into residential rooftops and utility-scale farms, turning
			once-experimental cells into a bankable energy source for households, apartment complexes, and
			businesses alike.
		</p>

		<!-- Section 5: Solar in India: A Local Perspective -->
		<h2>5. Solar in India: A Local Perspective</h2>
		<p>
			India’s interest in solar dates back to 1970s pilot projects, but it was the Jawaharlal Nehru
			National Solar Mission in 2010 that propelled the sector forward. Large desert-based solar
			parks, combined with rooftop incentives, helped slash electricity prices and expand PV usage
			in cities like Delhi and Mumbai. State-specific subsidies and net metering further lowered
			barriers, enticing homeowners and housing societies to adopt rooftop systems. With
			manufacturing also ramping up, India became a global force in solar deployment. Today, solar
			is one of India’s fastest-growing power sources, reshaping how communities—from remote
			villages to urban complexes—access clean energy.
		</p>

		<!-- Section 6: Future Directions and Emerging Innovations -->
		<h2>6. Future Directions and Emerging Innovations</h2>
		<p>Solar continues to evolve:</p>
		<ul>
			<li>
				<strong>Higher Efficiencies:</strong> Researchers pursue novel cell designs (e.g., perovskite-silicon
				tandems) aiming for 30%+ efficiency.
			</li>
			<li>
				<strong>Better Storage:</strong> Battery advancements integrate seamlessly with solar, ensuring
				round-the-clock power.
			</li>
			<li>
				<strong>Building-Integrated PV:</strong> Panels merge with roofs, windows, and facades to generate
				electricity while preserving aesthetics.
			</li>
			<li>
				<strong>Local Manufacturing:</strong> India’s thrust on “Atmanirbhar Bharat” could further lower
				costs and expand domestic production.
			</li>
			<li>
				<strong>Grid Evolution:</strong> Smart grids and microgrids will handle variable solar output,
				making renewables more dependable.
			</li>
		</ul>
		<p>
			These innovations promise to tighten solar’s grip as a mainstay of tomorrow’s clean and
			cost-effective energy systems.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			From Edmond Becquerel’s rudimentary experiments to modern gigawatt-scale solar plants,
			photovoltaics have undergone a remarkable metamorphosis. Early scientific curiosities grew
			into commercially viable solutions, propelled by dedicated research, governmental support, and
			manufacturing breakthroughs. India’s solar story—rooted in these global developments—continues
			to accelerate, promising a brighter, more sustainable future for homeowners, apartments, and
			businesses nationwide. By appreciating this technology’s historical arc, we can better
			navigate the path ahead, embracing solar as a key pillar in meeting ever-growing energy needs.
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
