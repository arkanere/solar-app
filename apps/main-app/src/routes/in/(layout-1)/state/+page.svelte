<script>
	import { isDarkMode } from '$lib/in/themeStore';

	// States array defined directly in the component
	const states = [
		'Andaman and Nicobar Islands',
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chandigarh',
		'Chhattisgarh',
		'Dadra and Nagar Haveli and Daman and Diu',
		'Delhi',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Ladakh',
		'Lakshadweep',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Puducherry',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttar Pradesh',
		'Uttarakhand',
		'West Bengal'
	];

	let darkMode = $derived($isDarkMode);

	// Function to format state name for URL
	function formatStateSlug(state) {
		return `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, '-')}`;
	}
</script>

<svelte:head>
	<title>Solar Panel Installers by State - Find solar installers across India - Solar Vipani</title>
	<meta
		name="description"
		content="Find the best solar panel installers across India. Browse by state to find top solar companies in your area."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<section id="state-list">
		<h1>Solar Panel Installers by State</h1>

		<p class="intro-text">
			Browse solar panel installers by state. We have listings in {states.length} states across India.
		</p>

		<ul class="states-grid">
			{#each states as state}
				<li>
					<a href={`/state/${formatStateSlug(state)}`} class="state-card">
						<h2>{state}</h2>
						<p>Find solar installers in {state}</p>
						<div class="view-more">
							<span>View districts</span>
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
				</li>
			{/each}
		</ul>
	</section>

	<section id="services">
		<h2>Services Provided by Solar Panel Installers</h2>
		<ul>
			<li>
				<strong>Solar panel installations at Homes, Apartments, and Businesses</strong>
				<p>
					Professional installation of solar panels tailored to residential, commercial, and
					industrial needs. Commonly used systems for independant homes and bunglows are <strong
						>1kW ongrid solar system, 3kW ongrid solar system,</strong
					>
					and <strong> 5kW ongrid solar system.</strong>
				</p>
			</li>
			<li>
				<strong>Solar Modules and Inverters</strong>
				<p>
					Supply and installation of high-quality solar modules and inverters to ensure efficient
					energy generation.
				</p>
			</li>
			<li>
				<strong
					>Documentation and Permissions for Subsidy under <a
						href="/blogs/pm-surya-ghar-yojana"
						target="_blank"
					>
						PM Surya Ghar Yojana
					</a>
				</strong>
				<p>
					Assistance with the necessary paperwork and approvals to avail government solar subsidies
					and benefits.
				</p>
			</li>
			<li>
				<strong>Net Metering</strong>
				<p>
					Setup of net metering systems to help you save on electricity bills by feeding surplus
					power back into the grid.
				</p>
			</li>
			<li>
				<strong>Solar Financing through Banks and NBFCs</strong>
				<p>
					Guidance on financing options, loans, and schemes offered by banks and non-banking
					financial companies. Nowadays <strong> Zero cost EMI schemes </strong>have become popular.
				</p>
			</li>
			<li>
				<strong>Routine Maintenance and Cleaning</strong>
				<p>
					Regular maintenance and cleaning services to keep your solar system running efficiently.
				</p>
			</li>
		</ul>
	</section>

	<section id="people-also-ask">
		<h2>Frequently Asked Questions</h2>
		<ul>
			<li>
				<strong>How much does it cost to install solar panels in India?</strong>
				<p>
					The cost of installing solar panels in India varies based on system size and components.
					For instance, a 3kW system typically ranges from ₹1.5 lakhs to ₹2.5 lakhs, including
					installation and related expenses.
				</p>
			</li>
			<li>
				<strong>How much should I budget for solar panel installation?</strong>
				<p>
					Budgeting for solar panel installation depends on your energy needs and system size. On
					average, residential installations can cost between ₹65,000 to ₹95,000 per kW, covering
					installation, transportation, and related expenses.
				</p>
			</li>
			<li>
				<strong>How much solar panel is required for a 1.5-ton AC?</strong>
				<p>
					To run a 1.5-ton air conditioner, you would need a solar system capable of generating
					approximately 3kW of power. This typically involves installing around 10-12 solar panels
					of 250 watts each.
				</p>
			</li>
			<li>
				<strong>What are the benefits of solar panels in India?</strong>
				<p>
					Installing solar panels in India offers multiple benefits, including reduced electricity
					bills, government subsidies through schemes like PM Surya Ghar Yojana, energy
					independence, and contributing to a greener environment with reduced carbon footprint.
				</p>
			</li>
			<li>
				<strong>How much money will I save if I install solar panels?</strong>
				<p>
					If you install solar panels with net metering, you'll save approximately ₹5.5 to ₹6.5 per
					unit compared to the ₹8-₹9 per unit cost from the DISCOM. Over 25 years, this translates
					to substantial savings, making solar energy a cost-effective and sustainable choice.
				</p>
			</li>
		</ul>
	</section>

	<!-- About Solarvipani section -->
	<section class="additional-info-solarvipani">
		<h2>About Solarvipani</h2>

		<div class="about-container">
			<!-- Logo on the left -->
			<img src="/logo.webp" alt="Solarvipani Logo" class="about-logo" width="200" height="100" loading="lazy" />

			<!-- Text on the right -->
			<div class="about-text">
				<p>
					We are your premier marketplace aggregator dedicated to connecting residential and
					business customers with <strong>
						<a href="/blogs/hiring-verified-solar-installer-in-india-is-essential" target="_blank">
							Best Local Solar Panel Installation
						</a>
					</strong> companies, ensuring that you make smart decisions backed by credible information
					and have a hassle-free experience.
				</p>
			</div>
		</div>

		<!-- Social Media Links -->
		<div class="social-media">
			<h4>Follow us on:</h4>
			<a
				href="https://www.facebook.com/p/Solar-Vipani-61556033262509/"
				target="_blank"
				aria-label="Facebook">Facebook</a
			>
			<a href="https://x.com/Solarvipani" target="_blank" aria-label="Twitter">Twitter</a>
			<a href="https://www.linkedin.com/company/solar-vipani/" target="_blank" aria-label="LinkedIn"
				>LinkedIn</a
			>
			<a href="https://www.instagram.com/solar.vipani/" target="_blank" aria-label="Instagram"
				>Instagram</a
			>
			<a href="https://wa.me/918983066701" target="_blank" aria-label="Whatsapp">Whatsapp</a>
		</div>
	</section>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--light-secondary-text-color: #666;
		--dark-secondary-text-color: #ccc;
		--accent-color: #ffc107;
		--border-color-light: #ddd;
		--border-color-dark: #444;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	main > * {
		max-width: 600px;
		width: 100%;
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

	/* SECTION - STATE-LIST */
	#state-list h1 {
		font-size: 2.2rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: center;
	}

	.light #state-list h1 {
		color: var(--light-primary-text-color);
	}

	.dark #state-list h1 {
		color: var(--dark-primary-text-color);
	}

	.intro-text {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	/* States grid */
	.states-grid {
		list-style-type: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		width: 100%;
		margin-bottom: 2rem;
	}

	/* State card styling */
	.state-card {
		display: block;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		text-decoration: none;
		height: 100%;
	}

	.light .state-card {
		background-color: #fff;
		border: 1px solid var(--border-color-light);
		color: var(--light-primary-text-color);
	}

	.dark .state-card {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
		color: var(--dark-primary-text-color);
	}

	.state-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.light .state-card:hover {
		background-color: #f8f9fa;
	}

	.dark .state-card:hover {
		background-color: #444;
	}

	.state-card h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.state-card p {
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.light .state-card p {
		color: var(--light-secondary-text-color);
	}

	.dark .state-card p {
		color: var(--dark-secondary-text-color);
	}

	.view-more {
		display: flex;
		align-items: center;
		font-size: 1rem;
		font-weight: 500;
		color: var(--accent-color);
		margin-top: auto;
	}

	.arrow-icon {
		width: 20px;
		height: 20px;
		margin-left: 0.5rem;
	}

	/* SECTION - PEOPLE-ALSO-ASK  */
	#people-also-ask h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.light #people-also-ask h2,
	.dark #people-also-ask h2 {
		color: var(--accent-color);
	}

	/* List styling */
	#people-also-ask ul {
		list-style-type: none;
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		width: 100%;
		border: 1px solid var(--border-color-light);
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	/* List item styling */
	#people-also-ask li {
		padding: 0.5rem;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	/* Light Mode List Item */
	.light #people-also-ask ul {
		background-color: #fff;
	}

	/* Dark Mode List Item */
	.dark #people-also-ask ul {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	#services {
		margin-bottom: 1.5rem;
	}

	#services h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.light #services h2,
	.dark #services h2 {
		color: var(--accent-color);
	}

	/* Services section styling */
	#services ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
	}

	#services li {
		margin-bottom: 1rem;
		padding: 1rem;
		border-radius: 8px;
		transition: background-color 0.3s ease;
	}

	.light #services li {
		background-color: #fff;
		border: 1px solid var(--border-color-light);
	}

	.dark #services li {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	#services strong {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	#services p {
		margin: 0;
		font-size: 1rem;
	}

	/* Additional info solarvipani section styling  */
	.additional-info-solarvipani {
		max-width: 650px;
		width: 100%;
		text-align: center;
		padding: 1.5rem;
		margin-bottom: 2rem;
		background-color: transparent;
		border-radius: 0;
		box-shadow: none;
	}

	.additional-info-solarvipani h2 {
		font-size: 2rem;
		text-align: left;
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
		text-align: left;
	}

	/* Dark mode for additional info solarvipani */
	.dark .additional-info-solarvipani {
		background-color: transparent;
		color: var(--dark-primary-text-color);
	}

	/* Social media section styling */
	.social-media {
		margin-top: 1.5rem;
		text-align: left;
	}

	.social-media a {
		display: inline-block;
		margin-right: 1rem;
		color: var(--accent-color);
		font-weight: bold;
		text-decoration: none;
		font-size: 1.2rem;
	}

	.social-media a:hover {
		text-decoration: underline;
	}

	/* Dark mode for social media links */
	.dark .social-media a {
		color: var(--dark-primary-text-color);
	}

	.about-container {
		display: flex;
		align-items: center;
		gap: 15px; /* Space between logo and text */
	}

	.about-logo {
		width: 200px; /* Adjust size */
		height: auto;
	}

	.about-text {
		flex: 1;
		font-size: 16px;
		line-height: 1.6;
	}

	/* 📱 Responsive Design for Mobile */
	@media (max-width: 768px) {
		.states-grid {
			grid-template-columns: 1fr; /* Single column on mobile */
		}

		.about-container {
			flex-direction: column; /* Stack logo and text vertically */
			align-items: center; /* Center align on mobile */
			text-align: center;
		}

		.about-logo {
			width: 200px; /* Slightly larger logo for better visibility */
			margin-top: 5px;
			margin-bottom: 5px; /* Space between logo and text */
		}

		.about-text {
			text-align: center;
		}
	}
</style>
