<script>
	import { isDarkMode } from '$lib/themeStore'; // Import the dark mode store

	let totalCost = 500000; // Initial Total Cost in Rupees
	let downPayment = 100000; // Initial Down Payment in Rupees
	let loanTerm = 5; // Initial Loan Term in Years
	let interestRate = 10; // Initial Interest Rate in Percentage
	let emi = null;
	let darkMode = false; // Local variable to hold the dark mode state

	// Subscribe to the dark mode store
	$: darkMode = $isDarkMode;

	// Calculate EMI whenever any of the input values change
	$: calculateEMI();

	function calculateEMI() {
		const loanAmount = totalCost - downPayment;
		const monthlyInterestRate = interestRate / 12 / 100;
		const totalMonths = loanTerm * 12;
		emi = (
			(loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
			(Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
		).toFixed(2);
	}

	// Toggle dark mode state
	function toggleDarkMode() {
		isDarkMode.update((value) => !value);
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="calculator">
		<h2>EMI Calculator for Solar System Installation</h2>
		<div class="input-group">
			<label for="totalCost">Total Cost of Solar System Installation (in Rupees):</label>
			<input
				type="number"
				id="totalCost"
				min="100000"
				bind:value={totalCost}
				placeholder="Enter total cost in Rupees"
			/>
		</div>

		<div class="input-group">
			<label for="downPayment">Down Payment (in Rupees):</label>
			<input
				type="number"
				id="downPayment"
				min="0"
				max={totalCost - 10000}
				bind:value={downPayment}
				placeholder="Enter down payment in Rupees"
			/>
		</div>

		<div class="input-group">
			<label for="loanTerm">Loan Term (in years):</label>
			<input
				type="number"
				id="loanTerm"
				min="1"
				max="20"
				bind:value={loanTerm}
				placeholder="Enter loan term in years"
			/>
		</div>

		<div class="input-group">
			<label for="interestRate">Interest Rate (in %):</label>
			<input
				type="number"
				id="interestRate"
				min="1"
				max="20"
				step="0.1"
				bind:value={interestRate}
				placeholder="Enter interest rate in percentage"
			/>
		</div>

		<div class="result">
			<p><strong>Monthly EMI:</strong> {emi} ₹</p>
		</div>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--accent-color: #0056b3; /* Accent color */
		--light-form-bg: white; /* Form background in light mode */
		--dark-form-bg: #333; /* Form background in dark mode */
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	/* Main container to cover the whole page */
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
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

	/* Calculator box styling */
	.calculator {
		max-width: 600px;
		margin: 20px;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		background-color: var(--light-form-bg);
		color: var(--light-primary-text-color);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	/* Dark mode for calculator */
	.dark .calculator {
		background-color: var(--dark-form-bg);
		color: var(--dark-primary-text-color);
	}

	/* Input group styling */
	.input-group {
		margin-bottom: 20px;
	}

	.input-group label {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
	}

	input[type='number'] {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	/* Result text styling */
	.result {
		margin-top: 20px;
		font-size: 1.2em;
	}
</style>
