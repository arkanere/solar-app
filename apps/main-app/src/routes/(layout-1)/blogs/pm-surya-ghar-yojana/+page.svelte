<script>
	import { isDarkMode } from '$lib/themeStore'; // Import from store if globally managed

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<h1>
			PM Surya Ghar Yojana: Your Guide to check eligibility and steps to benefit from the scheme
		</h1>

		<p>
			To help households benefit from the solar photovoltaic technology to generate green
			electricity at cheaper rates and save money, the government launched PM Surya Ghar Yojana on
			13th February 2024. Under the scheme, residential households and residential welfare
			associations are eligible for up to ₹78,000 installation subsidy. It is important to
			understand the eligibility criteria and steps to benefit from the scheme without delay.
		</p>

		<h2>Eligibility:</h2>
		<ul>
			<li>The applicant must be a citizen of India.</li>
			<li>The applicant must own a house that is suitable for installing solar panel systems.</li>
			<li>
				The household should have an active electricity connection with the electricity distribution
				company.
			</li>
			<li>The solar panel installation should be done by an Empanelled Vendor.</li>
		</ul>

		<h2>Benefits:</h2>
		<h3>For individual homeowners:</h3>
		<ul>
			<li>Government provides subsidies on installation of solar rooftop systems.</li>
			<li>Rs. 30,000/- per kW up to 2 kW</li>
			<li>Rs. 18,000/- per kW for additional capacity up to 3 kW</li>
			<li>Total Subsidy for systems larger than 3 kW capped at Rs 78,000</li>
		</ul>

		<h3>For Group Housing Society/ Resident Welfare Association (GHS/RWA):</h3>
		<ul>
			<li>
				Subsidy for Group Housing Society/ Resident Welfare Association (GHS/RWA): Rs. 18,000 per kW
				for common facilities, including EV charging, up to 500 kW capacity (@3 kW per house) with
				the upper limit being inclusive of individual rooftop plants installed by individual
				residents in the GHS/RWA.
			</li>
		</ul>
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

	div {
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

	h3 {
		font-size: 1.6rem;
		margin-top: 1.5rem;
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
