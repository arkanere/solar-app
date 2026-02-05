<script>
	import { isDarkMode } from '$lib/us/themeStore'; // Assuming this store is globally managed

	let currentBill = $state(1500); // Initial value for current electricity bill in Rupees
	let ratePerUnit = $state(9); // Initial value for electricity rate per unit in Rupees
	let solarSystemSize = $state(null);

	// Dark mode state from the store
	let darkMode = $derived($isDarkMode);

	// Recalculate solar system size whenever input values change
	$effect(() => {
		if (currentBill && ratePerUnit) {
			calculateSolarSystemSize();
		}
	});

	function calculateSolarSystemSize() {
		const monthlyConsumption = currentBill / ratePerUnit;
		const avgSunlightHours = 5; // Average sunlight hours per day
		const daysInMonth = 30;
		const efficiencyFactor = 1.15; // Accounting for losses in the system

		// Calculate the required solar panel size in kW
		const solarSystemSizeKW = monthlyConsumption / 100;

		solarSystemSize = solarSystemSizeKW.toFixed(2);
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="solar-calculator">
		<h2>Solar Calculator</h2>
		<p>Calculate the size of the solar system required.</p>

		<div class="slider-group">
			<div class="slider-label">
				<label for="currentBill">Monthly Electricity Bill :</label>
				<span><strong>{currentBill} ₹</strong></span>
			</div>
			<input
				type="range"
				id="currentBill"
				min="500"
				max="5000"
				step="100"
				bind:value={currentBill}
			/>
		</div>

		<div class="slider-group">
			<div class="slider-label">
				<label for="ratePerUnit">Electricity Rate per Unit :</label>
				<span><strong>{ratePerUnit} ₹</strong> </span>
			</div>
			<input type="range" id="ratePerUnit" min="3" max="15" step="0.5" bind:value={ratePerUnit} />
		</div>

		{#if solarSystemSize !== null}
			<div class="result">
				<p>
					The estimated size of the solar panel system required is: <strong
						>{solarSystemSize} kW</strong
					>
				</p>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--accent-color: #ffc107; /* Accent color */
		--light-form-bg: white; /* Form background in light mode */
		--dark-form-bg: #333; /* Form background in dark mode */
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.75rem;
		font-family: var(--font-family);
		text-align: center;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		margin-top: 2em;
	}

	/* Light mode styles */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode styles */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Solar Calculator Container */
	.solar-calculator {
		width: 100%;
		max-width: 600px;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	/* Light mode for solar-calculator container */
	.light .solar-calculator {
		background-color: var(--light-form-bg);
	}

	/* Dark mode for solar-calculator container */
	.dark .solar-calculator {
		background-color: var(--dark-form-bg);
	}

	/* Slider group container */
	.slider-group {
		margin-bottom: 20px;
	}

	/* Label styling */
	.slider-label {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2px;
	}

	/* Slider styling */
	input[type='range'] {
		width: 100%;
		margin: 8px 0;
	}

	/* Result container */
	.result {
		margin-top: 20px;
		font-size: 1.2em;
		color: var(--light-primary-text-color);
	}

	/* Dark mode for result container */
	.dark .result {
		color: var(--dark-primary-text-color);
	}
	strong {
		font-size: 1.5em;
	}
	p {
		margin-top: 1em;
		margin-bottom: 1em;
	}
</style>
