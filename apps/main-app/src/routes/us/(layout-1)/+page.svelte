<script>
	import { onMount } from 'svelte';
	import LeadFormBusiness from '$lib/us/LeadFormBusiness.svelte';
	import { isDarkMode } from '$lib/us/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode = $derived($isDarkMode);
	let ChatBotBox = $state();
	let AboutSolarVipani = $state();
	let shouldLoadChatBot = $state(false);
	let shouldLoadAbout = $state(false);

	// Lazy load non-critical components after initial page load
	onMount(async () => {
		// Load AboutSolarVipani component (bottom of page) with intersection observer
		const aboutObserver = new IntersectionObserver(
			async (entries) => {
				if (entries[0].isIntersecting) {
					const module = await import('$lib/us/AboutSolarVipani.svelte');
					AboutSolarVipani = module.default;
					shouldLoadAbout = true;
					aboutObserver.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);

		const aboutSection = document.querySelector('#about-section');
		if (aboutSection) {
			aboutObserver.observe(aboutSection);
		}

		// Delay chatbot loading to improve initial page performance
		setTimeout(async () => {
			const module = await import('$lib/us/ChatBotBox.svelte');
			ChatBotBox = module.default;
			shouldLoadChatBot = true;
		}, 2000); // Load after 2 seconds to allow critical content to load first
	});
</script>

<svelte:head>
	<title>Solar Vipani USA | Find Verified Solar Panel Installers | Get 30% Federal Tax Credit</title
	>
	<meta
		name="description"
		content="Find verified solar panel installers near you in the United States. Get 30% federal tax credit plus state incentives. Compare quotes, read reviews & save up to 90% on electricity bills. Free consultation available."
	/>

	<!-- Enhanced Keywords -->
	<meta
		name="keywords"
		content="solar panel installation USA, solar installers near me, federal tax credit, solar incentives USA, rooftop solar installation, solar panel cost, verified solar installers, solar energy America, solar panel quotes"
	/>

	<!-- Geographic targeting -->
	<meta name="geo.region" content="US" />
	<meta name="geo.country" content="United States" />

	<!-- Enhanced Open Graph -->
	<meta property="og:title" content="Solar Vipani USA | Find Verified Solar Panel Installers" />
	<meta
		property="og:description"
		content="Connect with verified solar installers across the United States. Get 30% federal tax credit plus state incentives. Save up to 90% on electricity bills. Free consultation & quotes."
	/>
	<meta property="og:image" content="https://solarvipani.com/logo512.png" />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:url" content="https://solarvipani.com/us" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Solar Vipani" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Solar Vipani USA | Find Verified Solar Panel Installers" />
	<meta
		name="twitter:description"
		content="Find verified solar installers near you. Get 30% federal tax credit & save up to 90% on electricity bills."
	/>
	<meta name="twitter:image" content="https://solarvipani.com/logo512.png" />

	<!-- Canonical URL -->
	<link rel="canonical" href="https://solarvipani.com/us" />

	<!-- Preload critical hero images for faster LCP -->
	<link
		rel="preload"
		as="image"
		href="/header/header.avif"
		media="(min-width: 769px)"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		as="image"
		href="/header/header.avif"
		media="(max-width: 768px)"
		fetchpriority="high"
	/>

	<!-- Preconnect to external domains for faster resource loading -->
	<link rel="preconnect" href="https://res.cloudinary.com" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

	<!-- JSON-LD Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Solar Vipani",
			"url": "https://solarvipani.com",
			"logo": "https://solarvipani.com/logo512.png",
			"description": "America's leading platform connecting customers with verified solar panel installers",
			"address": {
				"@type": "PostalAddress",
				"addressCountry": "US"
			},
			"sameAs": [
				"https://www.facebook.com/solarvipani",
				"https://www.linkedin.com/company/solarvipani"
			],
			"contactPoint": {
				"@type": "ContactPoint",
				"contactType": "customer service",
				"availableLanguage": ["English"]
			}
		}
	</script>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "Solar Vipani",
			"url": "https://solarvipani.com/us",
			"description": "Find verified solar panel installers across the United States",
			"potentialAction": {
				"@type": "SearchAction",
				"target": "https://solarvipani.com/us/solar?search={search_term_string}",
				"query-input": "required name=search_term_string"
			}
		}
	</script>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Service",
			"name": "Solar Panel Installation Directory",
			"description": "Connect with verified solar panel installers across the United States",
			"provider": {
				"@type": "Organization",
				"name": "Solar Vipani"
			},
			"areaServed": {
				"@type": "Country",
				"name": "United States"
			},
			"hasOfferCatalog": {
				"@type": "OfferCatalog",
				"name": "Solar Installation Services",
				"itemListElement": [
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "Service",
							"name": "Residential Solar Installation"
						}
					},
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "Service",
							"name": "Commercial Solar Installation"
						}
					},
					{
						"@type": "Offer",
						"itemOffered": {
							"@type": "Service",
							"name": "Agricultural Solar Installation"
						}
					}
				]
			}
		}
	</script>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<!-- Hero Banner Section -->
	<div class="hero-banner">
		<picture>
			<source media="(max-width: 768px)" srcset="/header/header.avif" type="image/avif" />
			<source media="(min-width: 769px)" srcset="/header/header.avif" type="image/avif" />
			<img
				class="hero-image"
				src="/header/header.avif"
				alt="Solar Panel Installation in India"
				width="1920"
				height="600"
				fetchpriority="high"
				decoding="async"
			/>
		</picture>
		<div class="overlay"></div>
		<div class="hero-content">
			<h1>Connect with Verified Solar Panel Installers Near You</h1>
			<h2>Get Free Quotes from 2-3 Verified Solar Installers in Your Area</h2>
			<p>
				Compare quotes, find trusted installers, and save up to 90% on electricity bills with 30%
				federal tax credit and state incentives.
			</p>
			<div class="hero-features">
				<span>✓ Free Consultation</span>
				<span>✓ Federal Tax Credit Support</span>
			</div>
		</div>
	</div>

	<div class="content">
		<!-- Benefits Section -->
		<section class="benefits-section">
			<div class="section-header">
				<h2>Why Choose Solar Panel Installation in the USA?</h2>
				<div class="section-divider">
					<span class="divider-accent"></span>
				</div>
				<p class="section-subtitle">
					Discover the amazing benefits of switching to solar power with federal and state
					incentives and verified installers
				</p>
			</div>

			<div class="benefits-grid">
				<div class="benefit-card highlight-card">
					<div class="benefit-icon">
						<span class="icon-emoji">⚡</span>
					</div>
					<div class="benefit-stat">Up to 90%</div>
					<h3>Electricity Bill Reduction</h3>
					<p>Dramatically reduce your monthly electricity costs with solar power</p>
				</div>

				<div class="benefit-card highlight-card">
					<div class="benefit-icon">
						<span class="icon-emoji">🌞</span>
					</div>
					<div class="benefit-stat">30%</div>
					<h3>Federal Tax Credit</h3>
					<p>Get 30% federal tax credit plus additional state and local incentives</p>
				</div>

				<div class="benefit-card highlight-card">
					<div class="benefit-icon">
						<span class="icon-emoji">🌱</span>
					</div>
					<div class="benefit-stat">Zero</div>
					<h3>Carbon Emissions</h3>
					<p>Reduce your carbon footprint and contribute to a cleaner, greener America</p>
				</div>
			</div>
		</section>

		<!-- ChatBot Section (Lazy Loaded) -->
		<!--
		<div id="chatbotbox">
			{#if shouldLoadChatBot && ChatBotBox}
				<svelte:component this={ChatBotBox} />
			{/if}
		</div>
		-->

		<!-- Lead Form Section -->
		<section id="lead-form-sv" class="lead-form-section">
			<div class="form-card">
				<div class="section-header">
					<h2>Book A Free Consultation</h2>
					<div class="section-divider">
						<span class="divider-accent"></span>
					</div>
					<p class="section-subtitle">Get personalized solar recommendations from our experts</p>
				</div>
				<LeadFormBusiness />
			</div>
		</section>
		<!-- About Section (Lazy Loaded) -->
		<div id="about-section">
			{#if shouldLoadAbout && AboutSolarVipani}
				<AboutSolarVipani />
			{/if}
		</div>
	</div>
</main>

<style>
	/* Root variables using custom properties from business page */
	:root {
		/* Colors */
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;
		--secondary-color: #4caf50;
		--accent-color: #ffc107;

		/* Text colors */
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--text-light: #ecf0f1;

		/* Theme colors */
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;

		/* UI elements */
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

		/* Typography */
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--heading-line-height: 1.2;
		--body-line-height: 1.6;

		/* Layout */
		--section-padding: 4rem 1.5rem;
		--container-width: 1140px;
		--grid-gap: 1.5rem;

		/* Transitions */
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
		--transition-slow: 0.5s ease;
	}

	/* Base styles */
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		line-height: var(--body-line-height);
		overflow-x: hidden;
		transition:
			background-color var(--transition-medium),
			color var(--transition-medium);
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--text-light);
	}

	/* Content container */
	.content {
		max-width: var(--container-width);
		margin: 0 auto;
		padding: 1rem;
	}

	/* Hero Banner */
	.hero-banner {
		position: relative;
		height: 600px;
		width: 100%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		overflow: hidden;
	}

	.hero-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 56, 146, 0.7));
		z-index: 1;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		max-width: 800px;
		padding: 0 1.5rem;
	}

	.hero-content h1 {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		letter-spacing: 1px;
	}

	.hero-content h2 {
		font-size: 1.8rem;
		font-weight: 500;
		margin-bottom: 1.5rem;
		color: var(--accent-color);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.hero-content p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
		opacity: 0.9;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-features {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}

	.hero-features span {
		background: rgba(255, 255, 255, 0.15);
		padding: 0.5rem 1rem;
		border-radius: 25px;
		font-size: 0.95rem;
		font-weight: 500;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	/* Section styling */
	section {
		padding: var(--section-padding);
		margin-bottom: 2rem;
		border-radius: var(--border-radius-lg);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-medium);
	}

	.dark section {
		background-color: var(--dark-card-bg);
	}

	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-header h2 {
		font-size: 2.2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
	}

	.dark .section-header h2 {
		color: var(--primary-light);
	}

	.section-divider {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem auto;
	}

	.divider-accent {
		width: 80px;
		height: 4px;
		background: var(--accent-color);
		border-radius: 2px;
	}

	.section-subtitle {
		font-size: 1.2rem;
		color: var(--text-medium);
		max-width: 700px;
		margin: 0 auto;
	}

	.dark .section-subtitle {
		color: #a0aec0;
	}

	/* Benefits Section */
	.benefits-section {
		background-color: var(--primary-light);
	}

	.dark .benefits-section {
		background-color: rgba(0, 86, 179, 0.15);
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--grid-gap);
		margin-bottom: 2rem;
	}

	.benefit-card {
		padding: 2rem 1.5rem;
		border-radius: var(--border-radius-md);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition:
			transform var(--transition-medium),
			box-shadow var(--transition-medium);
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.benefit-card:hover {
		transform: translateY(-10px);
		box-shadow: var(--shadow-lg);
	}

	.dark .benefit-card {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.highlight-card {
		border-top: 4px solid var(--accent-color);
	}

	.benefit-icon {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		border-radius: 50%;
		background-color: var(--primary-light);
		position: relative;
	}

	.dark .benefit-icon {
		background-color: rgba(0, 86, 179, 0.2);
	}

	.icon-emoji {
		font-size: 2.5rem;
		display: block;
	}

	.benefit-stat {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
		line-height: 1;
	}

	.dark .benefit-stat {
		color: #90caf9;
	}

	.benefit-card h3 {
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
	}

	.dark .benefit-card h3 {
		color: #90caf9;
	}

	.benefit-card p {
		font-size: 1rem;
		color: var(--text-medium);
		text-align: center;
	}

	.dark .benefit-card p {
		color: #cbd5e0;
	}

	/* Lead Form Section */
	.lead-form-section {
		padding: 0;
		box-shadow: none;
		background-color: transparent;
	}

	.form-card {
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
		padding: 3rem 2rem;
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-lg);
	}

	.form-card .section-header h2 {
		color: white;
	}

	.form-card .section-subtitle {
		color: rgba(255, 255, 255, 0.9);
	}

	.form-card .divider-accent {
		background: var(--accent-color);
	}

	/* Responsive Styling */
	@media (max-width: 992px) {
		.hero-content h1 {
			font-size: 2.5rem;
		}

		.hero-content h2 {
			font-size: 1.5rem;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.benefits-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.hero-banner {
			height: 500px;
			background-position: center center;
		}

		.hero-content {
			padding: 0 1rem;
		}

		.hero-content h1 {
			font-size: 2rem;
			line-height: 1.2;
		}

		.hero-content h2 {
			font-size: 1.3rem;
			line-height: 1.3;
		}

		.hero-content p {
			font-size: 1rem;
			line-height: 1.5;
		}

		.section-header h2 {
			font-size: 1.8rem;
		}

		.section-subtitle {
			font-size: 1rem;
		}

		.benefit-stat {
			font-size: 2rem;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.benefit-card {
			padding: 1.5rem 1rem;
		}

	}

	@media (max-width: 576px) {
		.hero-banner {
			height: 450px;
			min-height: 450px;
		}

		.hero-content {
			padding: 0 0.75rem;
		}

		.hero-content h1 {
			font-size: 1.6rem;
			line-height: 1.2;
			margin-bottom: 0.75rem;
		}

		.hero-content h2 {
			font-size: 1.1rem;
			line-height: 1.3;
			margin-bottom: 1rem;
		}

		.hero-content p {
			font-size: 0.95rem;
			line-height: 1.4;
			margin-bottom: 1rem;
		}

		.hero-features {
			gap: 1rem;
			margin-top: 1rem;
		}

		.hero-features span {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}

		.section-header h2 {
			font-size: 1.5rem;
		}

		.benefit-stat {
			font-size: 1.8rem;
		}

		.icon-emoji {
			font-size: 2rem;
		}

		.benefit-icon {
			width: 60px;
			height: 60px;
		}
	}
</style>
