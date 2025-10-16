<script>
	let solarPanelSize = 5; // Initial Solar Panel Size in kW
	let currentBill = 2000; // Initial Current Electricity Bill in Rupees
	let installationCostPerKW = 50000; // Initial Cost of Installation per kW in Rupees
	let paybackPeriod = null;
	let roi = null;

	// Reactive statement to calculate Payback Period and ROI whenever inputs change
	$: {
		if (solarPanelSize && currentBill && installationCostPerKW) {
			calculatePaybackAndROI();
		}
	}

	function calculatePaybackAndROI() {
		// Annual savings from the solar system (current bill times 12 months)
		const annualSavings = currentBill * 12;

		// Total installation cost
		const totalCost = solarPanelSize * installationCostPerKW;

		// Payback period calculation
		paybackPeriod = (totalCost / annualSavings).toFixed(2);

		// ROI calculation
		roi = (((annualSavings * paybackPeriod - totalCost) / totalCost) * 100).toFixed(2);
	}
</script>

<div class="calculator">
	<h2>Payback Period and ROI Calculator</h2>
	<div class="input-group">
		<label for="solarPanelSize">Solar Panel Size (in kW):</label>
		<input
			type="number"
			id="solarPanelSize"
			min="1"
			bind:value={solarPanelSize}
			placeholder="Enter size of solar panel in kW"
		/>
	</div>

	<div class="input-group">
		<label for="currentBill">Current Electricity Bill (in Rupees):</label>
		<input
			type="number"
			id="currentBill"
			min="500"
			bind:value={currentBill}
			placeholder="Enter your current electricity bill"
		/>
	</div>

	<div class="input-group">
		<label for="installationCostPerKW">Total Installation Cost per kW (in Rupees):</label>
		<input
			type="number"
			id="installationCostPerKW"
			min="10000"
			bind:value={installationCostPerKW}
			placeholder="Enter cost of installation per kW"
		/>
	</div>

	<div class="result">
		<p><strong>Payback Period:</strong> {paybackPeriod} years</p>
		<p><strong>Return on Investment (ROI):</strong> {roi}%</p>
	</div>
</div>

<style>
	.calculator {
		max-width: 600px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		background-color: white;
		transition: background-color 0.3s ease;
	}

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

	.result {
		margin-top: 20px;
		font-size: 1.2em;
		color: #333;
	}

	.result p {
		margin: 10px 0;
	}
</style>
