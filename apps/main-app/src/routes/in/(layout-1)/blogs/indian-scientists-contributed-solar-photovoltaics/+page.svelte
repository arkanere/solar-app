<script>
	import { isDarkMode } from '$lib/in/themeStore'; // If you have a global store for theme

	let darkMode;
	$: darkMode = $isDarkMode;

	// Example date for "lastUpdated"
	const lastUpdated = '2025-01-02';
	const lastUpdatedDisplay = 'January 2, 2025';

	// Usually you’d define or fetch the publish date too, here we match lastUpdated
	const datePublished = '2025-01-02';

	// The final URL of the blog post (canonical URL)
	const articleUrl = 'https://solarvipani.com/in/blogs/scientists-contributed-solar-photovoltaics';

	// Create your JSON-LD object for this article
	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Pioneers of Solar Photovoltaics: Indian Scientists Driving Renewable Energy',
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
			"Discover the Indian scientists who have significantly contributed to the advancement of solar photovoltaics, driving innovation and efficiency in India's renewable energy sector."
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
			<h1>Trailblazers of Solar Photovoltaics: Indian Scientists Driving Renewable Energy</h1>

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
			Solar photovoltaics (PV) have become a cornerstone of India's renewable energy strategy,
			powering millions of homes and businesses across the nation. Behind the advancements in solar
			technology are dedicated Indian scientists whose innovative research and breakthroughs have
			significantly enhanced the efficiency and affordability of solar energy. For homeowners,
			apartment complexes, and businesses keen on adopting solar power, understanding the
			contributions of these scientific pioneers offers valuable insights into the technology's
			evolution and its potential. This blog highlights some of the most influential Indian
			scientists who have made remarkable contributions to the field of solar photovoltaics.
		</p>

		<!-- Section 1: Dr. Chetan Singh Solanki: Advancing High-Efficiency Solar Cells -->
		<h2>1. Dr. Chetan Singh Solanki: Advancing High-Efficiency Solar Cells</h2>
		<p>
			Dr. Chetan Singh Solanki is a prominent figure in the field of solar photovoltaics in India.
			Renowned for his work on high-efficiency solar cells, Dr. Solanki has focused on developing
			advanced materials and fabrication techniques that push the boundaries of solar cell
			performance. His research on passivated emitter and rear cell (PERC) technology has been
			instrumental in increasing the efficiency of silicon-based solar cells, making them more
			viable for large-scale applications. Dr. Solanki's contributions have not only enhanced the
			technical aspects of solar PV but also played a crucial role in reducing the overall cost of
			solar energy, thereby accelerating its adoption across the country.
		</p>

		<!-- Section 2: Dr. Pradeep Sharma: Innovating Nanomaterials for Solar Applications -->
		<h2>2. Dr. Pradeep Sharma: Innovating Nanomaterials for Solar Applications</h2>
		<p>
			Dr. Pradeep Sharma is a distinguished scientist whose pioneering work in nanomaterials has
			revolutionized solar photovoltaics in India. At the Indian Institute of Technology (IIT), Dr.
			Sharma has led research projects focused on the synthesis and application of nanostructured
			materials to improve solar cell efficiency and stability. His development of quantum dot solar
			cells has opened new avenues for enhancing light absorption and charge carrier mobility,
			resulting in higher energy conversion rates. Dr. Sharma's innovative approaches have
			significantly contributed to the scalability and sustainability of solar energy systems,
			making clean energy more accessible to diverse sectors.
		</p>

		<!-- Section 3: Dr. M. Arun Kumar: Pioneering Thin-Film Solar Technologies -->
		<h2>3. Dr. M. Arun Kumar: Pioneering Thin-Film Solar Technologies</h2>
		<p>
			Dr. M. Arun Kumar is a leading expert in thin-film solar technologies, a key area for reducing
			the weight and cost of solar panels while maintaining high efficiency. His research at the
			National Institute of Solar Energy (NISE) has focused on developing flexible and lightweight
			solar cells using materials such as cadmium telluride (CdTe) and copper indium gallium
			selenide (CIGS). Dr. Kumar's work has been pivotal in creating durable and cost-effective
			solar solutions suitable for a wide range of applications, from residential rooftops to
			large-scale solar farms. His contributions have enhanced the versatility and adoption of solar
			energy in India's diverse climatic regions.
		</p>

		<!-- Section 4: Dr. V. K. D. Gupta: Enhancing Solar Cell Durability and Performance -->
		<h2>4. Dr. V. K. D. Gupta: Enhancing Solar Cell Durability and Performance</h2>
		<p>
			Dr. V. K. D. Gupta has made significant strides in improving the durability and performance of
			solar cells. As a senior researcher at the Central Electrochemical Research Institute (CECRI),
			Dr. Gupta has focused on the development of protective coatings and encapsulation techniques
			that extend the lifespan of solar panels. His work on anti-reflective coatings and thermal
			management systems has reduced energy losses and enhanced the overall efficiency of solar
			cells. By addressing the environmental challenges faced by solar installations, Dr. Gupta's
			research ensures that solar energy remains a reliable and sustainable power source for India's
			growing energy needs.
		</p>

		<!-- Section 5: Dr. Ramesh Agarwal: Integrating Renewable Energy into the Grid -->
		<h2>5. Dr. Ramesh Agarwal: Integrating Renewable Energy into the Grid</h2>
		<p>
			Dr. Ramesh Agarwal is renowned for his expertise in integrating renewable energy sources,
			particularly solar PV, into the national grid. At the Indian Institute of Science (IISc), Dr.
			Agarwal has developed sophisticated models and simulation tools that optimize the distribution
			and management of solar energy within the grid. His research addresses critical issues such as
			grid stability, load balancing, and energy storage, ensuring that the intermittent nature of
			solar power does not compromise the reliability of electricity supply. Dr. Agarwal's
			contributions are essential for scaling up solar energy infrastructure and achieving India's
			ambitious renewable energy targets.
		</p>

		<!-- Section 6: Dr. K. K. Raina: Pioneering Research in Solar Cell Manufacturing -->
		<h2>6. Dr. K. K. Raina: Pioneering Research in Solar Cell Manufacturing</h2>
		<p>
			Dr. K. K. Raina has been a trailblazer in the field of solar cell manufacturing, focusing on
			cost-effective production techniques that make solar energy more accessible. At the National
			Institute of Renewable Energy (NIRE), Dr. Raina has spearheaded initiatives to streamline the
			fabrication process of solar cells, reducing material waste and production costs. His
			innovations in roll-to-roll manufacturing and automated assembly lines have increased the
			scalability of solar panel production, enabling mass deployment across India. Dr. Raina's work
			has been instrumental in making solar energy a competitive alternative to traditional fossil
			fuels, promoting widespread adoption in both urban and rural areas.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			The advancements in solar photovoltaics that power India's homes, apartments, and businesses
			today are the result of relentless dedication and groundbreaking research by visionary Indian
			scientists. From enhancing solar cell efficiency and durability to integrating renewable
			energy into the national grid, these pioneers have played a crucial role in shaping the
			renewable energy landscape. For stakeholders in India's solar energy sector, understanding the
			contributions of these scientists not only honors their legacy but also underscores the
			potential of continued innovation in driving a sustainable and resilient energy future. As
			research progresses and new technologies emerge, the foundation laid by these Indian
			scientists will propel solar photovoltaics to even greater heights, ensuring a cleaner and
			more prosperous energy landscape for generations to come.
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
