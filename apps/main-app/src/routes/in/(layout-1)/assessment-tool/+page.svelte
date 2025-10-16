<script>
	import { onMount } from 'svelte';

	// Initialize component state
	let currentStep = 0;
	let userResponses = {
		propertyType: '',
		location: '',
		roofType: '',
		monthlyBill: '',
		shadingIssues: '',
		installationTimeframe: '',
		financingPreference: '',
		name: '',
		email: '',
		phone: '',
		contactConsent: false
	};
	let showResults = false;
	let submitted = false;
	let formErrors = {};

	// Questions for the assessment
	const questions = [
		{
			id: 'propertyType',
			question: 'What type of property do you have?',
			options: [
				'Residential - Independant Bunglow with Terrace',
				'Residential - Apartment Building Independent Flat',
				'Residential - Group Housing Society/ Resident Welfare Association',
				'Business/Commercial',
				'Agricultural'
			]
		},

		{
			id: 'roofType',
			question: 'What type of roof do you have?',
			options: ['Flat Roof', 'Sloped Roof', 'Metal Roof', 'Tile Roof', 'Not Sure']
		},

		{
			id: 'shadingIssues',
			question: 'Does your roof have any significant shading issues?',
			options: ['No Shading', 'Partial Shading', 'Heavy Shading', 'Not Sure']
		},
		{
			id: 'monthlyBill',
			question: 'What is your average monthly electricity bill?',
			options: ['Less than ₹2,000', '₹2,000 - ₹5,000', '₹5,000 - ₹10,000', 'More than ₹10,000']
		},
		{
			id: 'installationTimeframe',
			question: 'When are you looking to install solar panels?',
			options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Just researching']
		},
		{
			id: 'financingPreference',
			question: 'What is your preferred financing option?',
			options: ['Full Purchase', 'Loan/EMI', 'Interested in both options']
		}
	];

	// Calculate system size based on monthly bill
	function calculateSystemSize(monthlyBill) {
		switch (monthlyBill) {
			case 'Less than ₹2,000':
				return '2-3 kW';
			case '₹2,000 - ₹5,000':
				return '3-5 kW';
			case '₹5,000 - ₹10,000':
				return '5-8 kW';
			case 'More than ₹10,000':
				return '8+ kW';
			default:
				return '3-5 kW';
		}
	}

	// Calculate estimated savings
	function calculateSavings(monthlyBill) {
		switch (monthlyBill) {
			case 'Less than ₹2,000':
				return '₹20,000 - ₹30,000 annually';
			case '₹2,000 - ₹5,000':
				return '₹30,000 - ₹60,000 annually';
			case '₹5,000 - ₹10,000':
				return '₹60,000 - ₹120,000 annually';
			case 'More than ₹10,000':
				return '₹120,000+ annually';
			default:
				return '₹50,000 annually';
		}
	}

	// Calculate ROI period
	function calculateROI(monthlyBill, financingPreference) {
		let baseYears = 0;

		switch (monthlyBill) {
			case 'Less than ₹2,000':
				baseYears = 6;
				break;
			case '₹2,000 - ₹5,000':
				baseYears = 5;
				break;
			case '₹5,000 - ₹10,000':
				baseYears = 4;
				break;
			case 'More than ₹10,000':
				baseYears = 3.5;
				break;
			default:
				baseYears = 5;
		}

		// Adjust based on financing
		if (financingPreference === 'Loan/EMI') {
			baseYears += 0.5;
		} else if (financingPreference === 'Solar Lease') {
			baseYears += 1;
		}

		return `${baseYears} - ${baseYears + 1} years`;
	}

	// Handle option selection
	function handleOptionSelect(option) {
		const currentQuestion = questions[currentStep];
		userResponses[currentQuestion.id] = option;

		if (currentStep < questions.length - 1) {
			currentStep += 1;
		} else {
			showResults = true;
		}
	}

	// Handle input change for form fields
	function handleInputChange(e) {
		const { name, value, type, checked } = e.target;
		userResponses[name] = type === 'checkbox' ? checked : value;

		// Clear error for this field if it exists
		if (formErrors[name]) {
			formErrors[name] = null;
		}
	}

	// Validate the contact form
	function validateForm() {
		const errors = {};

		if (!userResponses.name) errors.name = 'Name is required';
		if (!userResponses.email) {
			errors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(userResponses.email)) {
			errors.email = 'Email is invalid';
		}
		if (!userResponses.phone) {
			errors.phone = 'Phone number is required';
		}
		if (!userResponses.contactConsent) {
			errors.contactConsent = 'You must agree to be contacted';
		}

		return errors;
	}

	// Handle form submission
	function handleSubmit() {
		const errors = validateForm();

		if (Object.keys(errors).length === 0) {
			// Here you would typically send the data to your backend
			console.log('Lead generated:', userResponses);
			submitted = true;
		} else {
			formErrors = errors;
		}
	}

	// Go back to previous question
	function handleBack() {
		if (currentStep > 0) {
			currentStep -= 1;
		} else if (showResults) {
			showResults = false;
			currentStep = questions.length - 1;
		}
	}

	// Restart the assessment
	function handleRestart() {
		currentStep = 0;
		userResponses = {
			propertyType: '',
			location: '',
			roofType: '',
			monthlyBill: '',
			shadingIssues: '',
			installationTimeframe: '',
			financingPreference: '',
			name: '',
			email: '',
			phone: '',
			contactConsent: false
		};
		showResults = false;
		submitted = false;
		formErrors = {};
	}
</script>

<div class="container">
	<div class="assessment-card">
		<!-- Header -->
		<div class="header">
			<h1>Solar Vipani Assessment Tool</h1>
			<p>Let find how much you can save with solar!</p>
		</div>

		<!-- Progress bar -->
		{#if !showResults && !submitted}
			<div class="progress-container">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {(currentStep / questions.length) * 100}%"></div>
				</div>
				<p class="progress-text">
					Step {currentStep + 1} of {questions.length}
				</p>
			</div>
		{/if}

		<!-- Content -->
		<div class="content">
			<!-- Questions -->
			{#if !showResults && !submitted}
				<div class="question-container">
					<h2 class="question-title">
						{questions[currentStep].question}
					</h2>
					<div class="options-grid">
						{#each questions[currentStep].options as option, idx}
							<button
								key={idx}
								class="option-button {userResponses[questions[currentStep].id] === option
									? 'selected'
									: ''}"
								on:click={() => handleOptionSelect(option)}
							>
								{option}
							</button>
						{/each}
					</div>
					{#if currentStep > 0}
						<button on:click={handleBack} class="back-button"> ← Back </button>
					{/if}
				</div>
			{/if}

			<!-- Results -->
			{#if showResults && !submitted}
				<div class="results-container">
					<div class="results-header">
						<h2>Your Personalized Savings Potential</h2>
					</div>

					<div class="metrics-grid">
						<div class="metric-card system-size">
							<h3>Recommended System Size</h3>
							<p class="metric-value">{calculateSystemSize(userResponses.monthlyBill)}</p>
							<p class="metric-description">Based on your electricity consumption</p>
						</div>

						<div class="metric-card savings">
							<h3>Estimated Savings</h3>
							<p class="metric-value">{calculateSavings(userResponses.monthlyBill)}</p>
							<p class="metric-description">Potential savings after installation</p>
						</div>

						<div class="metric-card roi">
							<h3>Return on Investment</h3>
							<p class="metric-value">
								{calculateROI(userResponses.monthlyBill, userResponses.financingPreference)}
							</p>
							<p class="metric-description">Estimated time to recover investment</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Main container styles */
	.container {
		background: linear-gradient(to bottom right, #ebf5ff, #e6ffec);
		min-height: 100vh;
		padding: 1.5rem;
	}

	.assessment-card {
		max-width: 48rem;
		margin: 0 auto;
		background: white;
		border-radius: 0.75rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	/* Header styles */
	.header {
		background-color: #2563eb;
		color: white;
		padding: 1.5rem;
		text-align: center;
	}

	.header h1 {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.header p {
		margin-top: 0.5rem;
	}

	/* Progress bar styles */
	.progress-container {
		padding: 0 1.5rem;
		padding-top: 1rem;
	}

	.progress-bar {
		width: 100%;
		background-color: #e5e7eb;
		border-radius: 9999px;
		height: 0.625rem;
	}

	.progress-fill {
		background-color: #22c55e;
		height: 0.625rem;
		border-radius: 9999px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.875rem;
		color: #4b5563;
		text-align: right;
		margin-top: 0.25rem;
	}

	/* Content styles */
	.content {
		padding: 1.5rem;
	}

	/* Question styles */
	.question-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.question-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.options-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.options-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.option-button {
		padding: 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		background-color: white;
		transition: all 0.2s;
		text-align: left;
	}

	.option-button:hover {
		background-color: #ebf5ff;
	}

	.option-button.selected {
		background-color: #dbeafe;
		border-color: #3b82f6;
	}

	.back-button {
		color: #2563eb;
		font-weight: 500;
		align-self: flex-start;
	}

	.back-button:hover {
		color: #1d4ed8;
	}

	/* Results styles */
	.results-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.results-header h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.results-header p {
		color: #4b5563;
		margin-top: 0.5rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.metrics-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	.metric-card {
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.system-size {
		background-color: #ebf5ff;
	}

	.system-size h3 {
		color: #1e40af;
	}

	.savings {
		background-color: #ecfdf5;
	}

	.savings h3 {
		color: #047857;
	}

	.roi {
		background-color: #fffbeb;
	}

	.roi h3 {
		color: #92400e;
	}

	.metric-card h3 {
		font-weight: 600;
	}

	.metric-value {
		font-size: 1.25rem;
		font-weight: 700;
		margin-top: 0.5rem;
	}

	.metric-description {
		font-size: 0.875rem;
		color: #4b5563;
		margin-top: 0.25rem;
	}

	/* Contact form styles */
	.contact-form {
		background-color: #f9fafb;
		padding: 1.5rem;
		border-radius: 0.5rem;
	}

	.contact-form h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.contact-form > p {
		margin-top: 0.5rem;
		color: #4b5563;
	}

	.form-fields {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
