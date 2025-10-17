<script>
	import { isDarkMode } from '$lib/in/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2024-08-01';
	const lastUpdatedDisplay = 'August 1, 2024';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2024-08-01';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/in/blogs/research-institutes-solar-energy-india';

	// Create your JSON-LD object for this article
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Leading the Charge: Top Research Institutes for Solar Energy in India',
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
			'Discover the top research institutes for solar energy in India, their contributions to the industry, and how they foster innovation and sustainability.'
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
			<h1>Leading the Charge: Top Research Institutes for Solar Energy in India</h1>

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
			India is rapidly advancing in the adoption of solar energy, driven by the need for sustainable
			power and reducing carbon emissions. Central to this progress are the numerous research
			institutes dedicated to innovating and optimizing solar technologies. For homeowners,
			apartment complexes, and businesses looking to invest in solar energy, understanding the
			landscape of these research institutions can provide valuable insights into the latest
			advancements and support available. This blog highlights the top research institutes for solar
			energy in India, showcasing their contributions to the industry and how they foster a
			brighter, greener future.
		</p>

		<!-- Section 1: Indian Institute of Technology (IIT) Delhi -->
		<h2>1. Indian Institute of Technology (IIT) Delhi</h2>
		<p>
			IIT Delhi stands at the forefront of solar energy research in India. The institute's Renewable
			Energy and Environment Centre (REEC) focuses on developing cutting-edge photovoltaic
			technologies and energy storage solutions. Their research encompasses improving solar panel
			efficiency, reducing manufacturing costs, and integrating solar energy into the national grid.
			Collaborations with industry partners and government bodies enable IIT Delhi to translate
			theoretical research into practical applications, benefiting both the academic community and
			the solar energy sector at large.
		</p>

		<!-- Section 2: National Institute of Solar Energy (NISE), Gurugram -->
		<h2>2. National Institute of Solar Energy (NISE), Gurugram</h2>
		<p>
			As part of the Ministry of New and Renewable Energy (MNRE), NISE Gurugram is dedicated
			exclusively to solar energy research and development. The institute conducts comprehensive
			studies on solar resource assessment, system design, and performance evaluation. NISE plays a
			pivotal role in formulating national solar policies and standards, ensuring that India's solar
			infrastructure is robust and scalable. Their initiatives include training programs for solar
			professionals and public awareness campaigns, fostering a knowledgeable and skilled workforce
			for the solar industry.
		</p>

		<!-- Section 3: Council of Scientific & Industrial Research (CSIR) - Central Electrochemical Research Institute (CECRI) -->
		<h2>
			3. Council of Scientific & Industrial Research (CSIR) - Central Electrochemical Research
			Institute (CECRI)
		</h2>
		<p>
			CSIR's CECRI is renowned for its research in materials science, particularly in the
			development of advanced materials for solar cells. Their work on thin-film solar technologies
			and transparent conducting oxides has significantly contributed to enhancing the efficiency
			and durability of solar panels. CECRI's interdisciplinary approach combines chemistry,
			physics, and engineering to innovate sustainable solutions that address the challenges of
			solar energy storage and grid integration, making solar power more reliable and accessible.
		</p>

		<!-- Section 4: Tata Institute of Fundamental Research (TIFR), Mumbai -->
		<h2>4. Tata Institute of Fundamental Research (TIFR), Mumbai</h2>
		<p>
			TIFR Mumbai is a leading research institution focusing on the fundamental aspects of solar
			energy. Their research includes the study of photovoltaic materials, nanotechnology
			applications in solar cells, and the development of novel light-harvesting systems. TIFR's
			collaborations with international research bodies and its state-of-the-art laboratories enable
			groundbreaking discoveries that push the boundaries of solar energy technology. Their
			contributions are instrumental in paving the way for next-generation solar solutions that are
			more efficient and cost-effective.
		</p>

		<!-- Section 5: Indian Renewable Energy Development Agency (IREDA) -->
		<h2>5. Indian Renewable Energy Development Agency (IREDA)</h2>
		<p>
			IREDA is instrumental in financing and supporting solar energy projects across India. While
			primarily a financial institution, IREDA collaborates closely with research institutes to fund
			innovative solar projects and pilot programs. Their support accelerates the commercialization
			of research findings, bridging the gap between laboratory innovations and market-ready solar
			technologies. IREDA's initiatives include promoting solar rooftops, large-scale solar farms,
			and hybrid energy systems, thereby expanding the reach of solar energy to diverse sectors.
		</p>

		<!-- Section 6: Bharti Institute of Science and Technology (BIST), Delhi -->
		<h2>6. Bharti Institute of Science and Technology (BIST), Delhi</h2>
		<p>
			BIST is dedicated to advancing solar energy research through its Department of Renewable
			Energy. The institute focuses on the development of high-efficiency solar cells, solar thermal
			systems, and hybrid renewable energy solutions. BIST's emphasis on sustainable practices and
			eco-friendly technologies ensures that their research aligns with global environmental
			standards. Their projects often involve community-based solar initiatives, making solar energy
			more inclusive and accessible to underrepresented populations.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			India’s commitment to solar energy is bolstered by the significant contributions of its top
			research institutes. From pioneering photovoltaic technologies at IIT Delhi to shaping
			national policies at NISE Gurugram, these institutions play a crucial role in driving
			innovation and sustainability in the solar sector. For homeowners, apartment complexes, and
			businesses, staying informed about the advancements from these research bodies can enhance
			their solar investments and support a transition towards a greener, more resilient energy
			future. Collaborating with or leveraging the findings of these institutes ensures that solar
			energy adoption in India remains efficient, cost-effective, and environmentally beneficial.
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
