<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<h1>A Case Against DIY Solar Panel Installation in India: Why Going Pro Matters</h1>

		<!-- Introduction -->
		<p>
			India’s solar boom has sparked a surge in online guides and do-it-yourself (DIY) kits,
			suggesting anyone can install solar panels with ease. In reality, such an undertaking is far
			more complex: you must navigate regulatory hurdles, design intricacies, and electrical safety
			measures unique to India’s environment. Done incorrectly, a DIY install can lead to higher
			long-term costs, reduced performance, and even hazards. This blog unpacks why relying on
			professional installers is typically safer, more efficient, and more financially sound for
			homeowners, apartments, and businesses alike.
		</p>

		<!-- Section 1: The Complexity of Designing a Solar System -->
		<h2>1. The Complexity of Designing a Solar System</h2>
		<p>A solar setup demands more than just panels and an inverter:</p>
		<ul>
			<li>
				<strong>Load Calculation:</strong> Misjudging your daily energy needs can result in an undersized
				system (insufficient power) or an oversized setup (wasted investment).
			</li>
			<li>
				<strong>Quality Components:</strong> India’s huge solar market offers varying equipment grades;
				without expert insight, you might pick poor-quality panels or mismatched inverters.
			</li>
			<li>
				<strong>Shade Analysis:</strong> Shadows from buildings or trees can slash output significantly
				if not accounted for during design.
			</li>
			<li>
				<strong>Tilt and Orientation:</strong> Optimal angles depend on local latitude and climate, requiring
				specialized tools and training to calculate correctly.
			</li>
		</ul>
		<p>A well-engineered design ensures maximum savings and performance over decades.</p>

		<!-- Section 2: Navigating Regulatory and Utility Requirements -->
		<h2>2. Navigating Regulatory and Utility Requirements</h2>
		<p>India’s solar landscape is subject to multiple rules and permits:</p>
		<ul>
			<li>
				<strong>Permits:</strong> Your municipality or state may require no-objection certificates (NOCs)
				and building approvals.
			</li>
			<li>
				<strong>Net Metering:</strong> Earning credits for excess solar power is appealing, but application
				forms, diagrams, and inspections can be intricate.
			</li>
			<li>
				<strong>Subsidies:</strong> MNRE and state-level incentives can significantly lower costs, but
				typically apply only when certified installers handle the job.
			</li>
			<li>
				<strong>Local Codes:</strong> Proper grounding, adherence to wiring standards, and correct documentation
				are mandatory to avoid fines or forced removal.
			</li>
		</ul>
		<p>Skipping professional help risks lost benefits, legal entanglements, or system shutdowns.</p>

		<!-- Section 3: The Hidden Costs of DIY -->
		<h2>3. The Hidden Costs of DIY</h2>
		<p>
			At first glance, a DIY approach may appear cheaper, but unforeseen pitfalls often escalate
			expenses:
		</p>
		<ul>
			<li>
				<strong>Equipment Mistakes:</strong> Buying low-grade components or incompatible inverters can
				lead to poor output and early replacements.
			</li>
			<li>
				<strong>Installation Errors:</strong> Loose brackets or poor seals cause roof leaks and structural
				damage; inadequate wiring raises the risk of electrical fires.
			</li>
			<li>
				<strong>Warranty Issues:</strong> Most panels and inverters require professional installation
				for valid warranties—DIY attempts may void coverage.
			</li>
			<li>
				<strong>Time and Labor:</strong> Coordinating a solar install yourself is time-consuming, and
				every correction or overhaul adds to your budget.
			</li>
		</ul>
		<p>Small oversights can balloon into major costs, undermining the entire venture.</p>

		<!-- Section 4: Safety and Performance Risks -->
		<h2>4. Safety and Performance Risks</h2>
		<p>Improperly installed solar can be risky:</p>
		<ul>
			<li>
				<strong>Electrical Hazards:</strong> DIY installers unaccustomed to high-voltage DC could face
				shock dangers and potential fire hazards.
			</li>
			<li>
				<strong>Structural Failures:</strong> Panels under harsh winds or heavy rains need sturdy mounting—weak
				setups can damage roofs or injure passersby if they dislodge.
			</li>
			<li>
				<strong>Underperformance:</strong> Even high-end panels yield poor results if shaded or angled
				incorrectly.
			</li>
			<li>
				<strong>Maintenance Gaps:</strong> DIY setups often lack monitoring tools, delaying detection
				of minor issues that evolve into bigger problems.
			</li>
		</ul>
		<p>
			The stakes—safety, efficiency, and reliability—make professional oversight vital for optimal
			results.
		</p>

		<!-- Section 5: The Value of Professional Oversight -->
		<h2>5. The Value of Professional Oversight</h2>
		<p>Certified installers streamline the entire process:</p>
		<ul>
			<li>
				<strong>End-to-End Management:</strong> From site assessment and system design to installation
				and testing, professionals oversee each step.
			</li>
			<li>
				<strong>Better Equipment Access:</strong> Installer partnerships with reputable brands often
				mean superior warranties and performance guarantees.
			</li>
			<li>
				<strong>System Optimization:</strong> They calculate shading, orientation, and load requirements
				to maximize daily output.
			</li>
			<li>
				<strong>After-Sales Service:</strong> Prompt repairs, routine maintenance plans, and dedicated
				monitoring tools keep your system healthy over time.
			</li>
		</ul>
		<p>
			Investing in expert guidance ultimately saves money, improves safety, and boosts long-term
			solar gains.
		</p>

		<!-- Section 6: Who Benefits from Professional Installation in India? -->
		<h2>6. Who Benefits from Professional Installation in India?</h2>
		<p>All property types stand to gain:</p>
		<ul>
			<li>
				<strong>Homeowners:</strong> Professionally sized systems deliver consistent bill reductions
				while ensuring eligibility for subsidies and net metering.
			</li>
			<li>
				<strong>Apartment Complexes:</strong> Shared solar solutions for communal areas (elevators, lighting,
				water pumps) benefit from precise design and streamlined paperwork.
			</li>
			<li>
				<strong>Businesses:</strong> Large-scale or rooftop installations offset operational expenses—professionals
				minimize downtime by preventing technical or regulatory snags.
			</li>
			<li>
				<strong>Rural/Off-Grid Projects:</strong> Battery systems need expert planning for load management
				and reliability in power-scarce regions.
			</li>
		</ul>
		<p>
			In every scenario, professional input fosters better returns, compliance, and peace of mind.
		</p>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			While do-it-yourself guides may promise quick savings, India’s regulatory complexity, safety
			standards, and design nuances make solar anything but trivial. Skimping on professional
			expertise can lead to hidden costs, missed subsidies, and subpar system performance.
			Conversely, a certified installer handles essential details—from tailoring system size and
			securing permits to ongoing support—ensuring your solar investment yields robust, long-lasting
			dividends. For homeowners, apartments, and businesses ready to embrace clean energy,
			partnering with skilled professionals is the surest path to a secure, high-performing solar
			future.
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
