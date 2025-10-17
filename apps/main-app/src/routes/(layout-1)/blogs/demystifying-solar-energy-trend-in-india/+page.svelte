<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<h1>Demystifying Solar in India: Why Everyone Is Talking About Solar Panels</h1>

		<!-- Introduction -->
		<p>
			India is experiencing a massive solar boom, and it’s not just large corporations jumping on
			board. Homeowners, apartment complexes, and businesses nationwide are discovering solar’s
			potential to cut electricity bills and reduce carbon footprints. Yet many wonder what the
			“solar buzz” is truly about. From how panels work to whether they’re affordable—even in
			overcast conditions— there’s a lot to unpack. This concise guide will clarify why solar power
			has become a mainstream option, explaining financial incentives, technology essentials, and
			common myths along the way.
		</p>

		<!-- Section 1: The Surge in India’s Solar Adoption -->
		<h2>1. The Surge in India’s Solar Adoption</h2>
		<p>
			Solar energy in India has soared, thanks to policy support, declining panel costs, and growing
			public awareness:
		</p>
		<ul>
			<li>
				<strong>Government Targets:</strong> Programs under the
				<a href="https://mnre.gov.in/en/solar-overview/" target="_blank" rel="noopener"
					>National Solar Mission</a
				> push for rapid capacity expansion, encouraging households and businesses alike.
			</li>
			<li>
				<strong>Cost Competitiveness:</strong> Advances in manufacturing and economies of scale help
				solar rates compete with, or beat, traditional electricity costs.
			</li>
			<li>
				<strong>Widespread Visibility:</strong> Success stories on social media and in the news have
				boosted acceptance.
			</li>
			<li>
				<strong>Corporate Interest:</strong> Businesses looking to save on operations and meet green
				goals also drive solar’s expansion, influencing consumer perceptions.
			</li>
		</ul>

		<!-- Section 2: Financial and Environmental Upsides -->
		<h2>2. Financial and Environmental Upsides</h2>
		<p>Two key factors power solar’s popularity: savings and sustainability:</p>
		<ul>
			<li>
				<strong>Electricity Bill Reduction:</strong> For homes or commercial units, solar cuts monthly
				bills significantly over its 20–25 year lifespan.
			</li>
			<li>
				<strong>ROI and Net Metering:</strong> Many systems pay for themselves within 3-5 years years,
				especially where net metering rewards surplus power.
			</li>
			<li>
				<strong>Eco-Friendly Advantages:</strong> Solar reduces reliance on fossil fuels, lowering greenhouse
				gas emissions.
			</li>
			<li>
				<strong>Energy Independence:</strong> Solar safeguards you from rising electricity prices and
				frequent power cuts.
			</li>
		</ul>

		<!-- Section 3: How Solar Panels Work -->
		<h2>3. How Solar Panels Work</h2>
		<p>Solar’s core technology is surprisingly straightforward:</p>
		<ul>
			<li>
				<strong>Photovoltaic (PV) Effect:</strong> Semiconductor cells (often silicon) convert sunlight
				into direct current (DC).
			</li>
			<li>
				<strong>Inverter Conversion:</strong> The inverter changes DC into AC, which most appliances
				use.
			</li>
			<li>
				<strong>Grid Interaction:</strong> On-grid setups send excess power to the grid; off-grid or
				hybrid systems store surplus in batteries.
			</li>
			<li>
				<strong>Performance Factors:</strong> Efficiency depends on panel quality, installation angles,
				and local weather.
			</li>
		</ul>

		<!-- Section 4: Tailored Solar Solutions -->
		<h2>4. Tailored Solar Solutions</h2>
		<p>Solar’s flexibility suits different property types:</p>
		<ul>
			<li>
				<strong>Homes:</strong> Rooftop installations with net metering are common, requiring basic structural
				checks.
			</li>
			<li>
				<strong>Apartments:</strong> Housing societies can share costs and benefits by placing panels
				on communal rooftops or canopies.
			</li>
			<li>
				<strong>Businesses:</strong> Larger, high-capacity arrays reduce operational costs; warehouses
				often benefit from wide rooftop spaces.
			</li>
			<li>
				<strong>Hybrid Systems:</strong> Areas with grid instability can add batteries for backup and
				continuous power, albeit at a higher upfront cost.
			</li>
		</ul>

		<!-- Section 5: Government Incentives and Support -->
		<h2>5. Government Incentives and Support</h2>
		<p>Policies significantly boost solar’s appeal in India:</p>
		<ul>
			<li>
				<strong>Subsidies:</strong> Various MNRE-backed programs reduce initial costs for residential
				installations.
			</li>
			<li>
				<strong>Net Metering:</strong> Sell surplus electricity to the grid, lowering payback times.
			</li>
			<li>
				<strong>Simplified Procedures:</strong> Many states offer online portals, making approvals faster
				and less cumbersome.
			</li>
			<li>
				<strong>Targeted Schemes:</strong> Initiatives like
				<a href="/blogs/pm-surya-ghar-yojana" target="_blank" rel="noopener">PM Surya Ghar Yojana</a
				> further reduce costs for specific groups or building types.
			</li>
		</ul>

		<!-- Section 6: Common Myths and Misconceptions -->
		<h2>6. Common Myths and Misconceptions</h2>
		<ul>
			<li>
				<strong>“No Sun, No Power”:</strong> Cloudy days reduce output but don’t halt it; India’s overall
				sunshine remains high year-round.
			</li>
			<li>
				<strong>“Too Expensive”:</strong> Dropping component prices, subsidies, and long-term savings
				narrow the affordability gap.
			</li>
			<li>
				<strong>“High Maintenance”:</strong> Panels need occasional cleaning and inspections; many installers
				offer maintenance packages.
			</li>
			<li>
				<strong>“Roof Damage”:</strong> Proper mounting techniques protect roof integrity and can even
				shield it from harsh sunlight.
			</li>
		</ul>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			Solar panels have captured India’s attention for good reason: they offer a potent mix of
			financial savings, environmental gains, and energy independence. From single-family homes to
			bustling commercial buildings and high-rise apartments, virtually anyone can benefit from a
			well-planned solar setup. By leveraging supportive policies, understanding the basic
			technology, and dispelling common misconceptions, more Indians are opting for solar than ever
			before. Curious about reducing electricity bills while boosting sustainability? Now is an
			excellent time to explore how solar can transform your energy usage.
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

	/* List styling */
	ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	ul li {
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
		h2 {
			font-size: 2rem;
		}

		p,
		ul li {
			font-size: 1rem;
		}
	}
</style>
