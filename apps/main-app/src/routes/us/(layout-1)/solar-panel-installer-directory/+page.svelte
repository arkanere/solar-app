<script>
	import { isDarkMode } from '$lib/us/themeStore'; // Import the dark mode store
	import { goto } from '$app/navigation';
	import BusinessDirectory from '$lib/us/BusinessDirectory.svelte';

	let state = '';
	let district = '';
	let city = '';
	let districts = [];
	let cities = [];

	// Updated list of US states
	const states = [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'District of Columbia',
		'Florida',
		'Georgia',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming',
		'Puerto Rico'
	];

	// Fetch districts dynamically when the state changes
	$: if (state) {
		updateDistricts(state);
	}

	// Fetch cities dynamically when the district changes
	$: if (district) {
		updateCities(district);
	}

	async function updateDistricts(selectedState) {
		try {
			// Send POST request to fetch districts for the selected state
			const res = await fetch('/us/api/getDistricts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: selectedState })
			});
			const data = await res.json();
			districts = data.districts || [];
			district = ''; // Reset district when state changes
			city = ''; // Reset city when state changes
			cities = []; // Clear cities list
		} catch (error) {
			console.error('Error fetching districts:', error);
		}
	}

	async function updateCities(selectedDistrict) {
		try {
			// Send POST request to fetch cities for the selected district
			const res = await fetch('/us/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ district: selectedDistrict })
			});
			const data = await res.json();
			cities = data.cities || [];
			city = ''; // Reset city when district changes
		} catch (error) {
			console.error('Error fetching cities:', error);
		}
	}

	// Use the global theme store
	$: darkMode = $isDarkMode;

	// Function to format state name for URL
	function formatStateSlug(state) {
		return `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, '-')}`;
	}
</script>

<svelte:head>
	<title>Solar Panel Installer Directory | Find Trusted Local Installers - Solar Vipani</title>
	<meta
		name="description"
		content="Find trusted local solar panel installers with Solar Vipani's directory. Select your state, district, and city to connect with verified experts for hassle-free installations."
	/>
	<!-- Structured data for SEO -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "Solar Panel Installer Directory",
			"description": "Solar Vipani's directory connects you with verified solar panel installers across various states, districts, and cities, offering a hassle-free way to compare services and make informed decisions.",
			"url": "https://solarvipani.com/solar-panel-installer-directory",
			"publisher": {
				"@type": "Organization",
				"name": "Solar Vipani"
			}
		}
	</script>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="content">
		<!-- Hero Section -->
		<section class="hero-section">
			<div class="section-header">
				<h1>Solar Panel Installer Directory</h1>
				<div class="section-divider">
					<span class="divider-accent"></span>
				</div>
				<p class="section-subtitle">Find trusted local solar installers across the United States</p>
			</div>
		</section>

		<!-- Solar Panel Installers by State Section -->
		<section class="states-section">
			<div class="section-header">
				<h2>Solar Panel Installers by State</h2>
				<div class="section-divider">
					<span class="divider-accent"></span>
				</div>
				<p class="section-subtitle">
					Browse solar panel installers by state. We have listings in {states.length} states across the
					United States.
				</p>
			</div>

			<div class="states-grid">
				{#each states as state}
					<div class="state-card">
						<a href={`/us/state/${formatStateSlug(state)}`}>
							<h3>{state}</h3>
							<p>Find verified solar installers in {state}</p>
							<div class="view-more">
								<span>View Counties</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="arrow-icon"
								>
									<path
										fill-rule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	/* Root variables using patterns from other pages */
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

	/* Section Headers */
	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-header h1 {
		font-size: 2.8rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--primary-color);
		line-height: var(--heading-line-height);
	}

	.section-header h2 {
		font-size: 2.2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
		line-height: var(--heading-line-height);
	}

	.dark .section-header h1,
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

	/* Hero Section */
	.hero-section {
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
		margin-bottom: 0;
	}

	.hero-section .section-header h1,
	.hero-section .section-subtitle {
		color: white;
	}

	/* States Section */
	.states-section {
		background-color: var(--light-card-bg);
	}

	.dark .states-section {
		background-color: var(--dark-card-bg);
	}

	.states-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--grid-gap);
	}

	.state-card {
		height: 100%;
		transition:
			transform var(--transition-medium),
			box-shadow var(--transition-medium);
	}

	.state-card:hover {
		transform: translateY(-10px);
	}

	.state-card a {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 2rem 1.5rem;
		border-radius: var(--border-radius-md);
		background-color: var(--light-bg-color);
		border: 1px solid #e2e8f0;
		text-decoration: none;
		color: inherit;
		transition:
			border-color var(--transition-medium),
			box-shadow var(--transition-medium);
	}

	.state-card:hover a {
		border-color: var(--primary-color);
		box-shadow: var(--shadow-lg);
	}

	.dark .state-card a {
		background-color: rgba(255, 255, 255, 0.05);
		border-color: #4a5568;
	}

	.dark .state-card:hover a {
		border-color: var(--primary-light);
	}

	.state-card h3 {
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--primary-color);
		text-align: center;
	}

	.dark .state-card h3 {
		color: var(--primary-light);
	}

	.state-card p {
		font-size: 1rem;
		color: var(--text-medium);
		margin-bottom: 1.5rem;
		text-align: center;
		flex-grow: 1;
	}

	.dark .state-card p {
		color: #a0aec0;
	}

	.view-more {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 500;
		color: var(--primary-color);
		margin-top: auto;
	}

	.dark .view-more {
		color: var(--primary-light);
	}

	.arrow-icon {
		width: 20px;
		height: 20px;
		margin-left: 0.5rem;
		transition: transform var(--transition-fast);
	}

	.state-card:hover .arrow-icon {
		transform: translateX(5px);
	}

	/* Typography */
	p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	/* Responsive Styling */
	@media (max-width: 992px) {
		.section-header h1 {
			font-size: 2.5rem;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.states-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.section-header h1 {
			font-size: 2rem;
		}

		.section-header h2 {
			font-size: 1.8rem;
		}

		.states-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.state-card a {
			padding: 1.5rem 1rem;
		}
	}

	@media (max-width: 576px) {
		.section-header h1 {
			font-size: 1.8rem;
		}

		.section-header h2 {
			font-size: 1.5rem;
		}
	}
</style>
