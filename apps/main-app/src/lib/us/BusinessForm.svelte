<script>
	import { goto } from '$app/navigation';

	let businessName = $state('');
	let address = $state('');
	let plusCode = $state('');
	let phoneNumber = $state('');
	let whatsappNumber = $state('');
	let email = $state('');
	let login_email = $state('');
	let website = $state('');
	let state = $state('');
	let county = $state('');
	let city = $state('');
	let counties = $state([]);
	let cities = $state([]);
	let isCountyLoading = $state(false); // Add loading state for counties
	let isCityLoading = $state(false); // Add loading state for cities
	let isSubmitting = $state(false); // Track form submission state

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

	let errors = $state({
		phoneNumber: '',
		whatsappNumber: ''
	});

	// Fetch counties dynamically when the state changes
	$effect(() => {
		if (state) {
			updateCounties(state);
		}
	});

	async function updateCounties(selectedState) {
		isCountyLoading = true; // Set loading state
		try {
			// Send POST request to fetch counties for the selected state
			const res = await fetch('/us/api/getCounties', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: selectedState })
			});
			const data = await res.json();
			counties = data.counties || data.districts || []; // Backend returns both keys for compatibility
			county = ''; // Reset county when state changes
		} catch (error) {
			console.error('Error fetching counties:', error);
		} finally {
			isCountyLoading = false; // Remove loading state after counties are fetched
		}
	}

	// Fetch cities dynamically when the county changes
	$effect(() => {
		if (county) {
			updateCitiesForCounty(county);
		}
	});

	async function updateCitiesForCounty(selectedCounty) {
		isCityLoading = true; // Set loading state
		try {
			// Send POST request to fetch cities for the selected county
			const res = await fetch('/us/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ county: selectedCounty })
			});
			const data = await res.json();
			cities = data.cities || [];
			city = ''; // Reset city when county changes
		} catch (error) {
			console.error('Error fetching cities:', error);
		} finally {
			isCityLoading = false; // Remove loading state after cities are fetched
		}
	}

	function validatePhoneNumber() {
		if (!/^\d{10,16}$/.test(phoneNumber)) {
			errors.phoneNumber = 'Phone number must be between 10 and 16 digits';
			return false;
		} else {
			errors.phoneNumber = '';
			return true;
		}
	}

	function validateWhatsappNumber() {
		if (whatsappNumber && !/^\d{10,16}$/.test(whatsappNumber)) {
			errors.whatsappNumber = 'WhatsApp number must be between 10 and 16 digits';
			return false;
		} else {
			errors.whatsappNumber = '';
			return true;
		}
	}

	function scrollToFirstError() {
		const errorFields = document.querySelectorAll('.error');
		if (errorFields.length > 0) {
			errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validatePhoneNumber() && validateWhatsappNumber()) {
			isSubmitting = true;
			try {
				const response = await fetch('/us/api/submitBusiness', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						businessName,
						address,
						plusCode,
						phoneNumber,
						whatsappNumber,
						email,
						login_email,
						website,
						state,
						county,
						city
					})
				});

				const result = await response.json();

				if (result.success) {
					goto('/us/thank-you-business');
				} else {
					alert(`Submission failed: ${result.error}`);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
				alert(`Error submitting form: ${error.message}`);
			} finally {
				isSubmitting = false;
			}
		} else {
			scrollToFirstError(); // Move to the first error field
		}
	}

	function isFormValid() {
		return Object.values(errors).every((error) => error === '');
	}
</script>

<form onsubmit={handleSubmit}>
	<h1>Get listed by filling the form below</h1>
	<p>It takes 90 seconds to fill this form</p>

	<!-- Business Name Input -->
	<div>
		<label for="businessName">Business Name:</label>
		<input
			id="businessName"
			type="text"
			bind:value={businessName}
			placeholder="Business Name"
			required
		/>
	</div>

	<!-- Address Input -->
	<div>
		<label for="address">Address:(Complete address helps in finding your business)</label>
		<input id="address" type="text" bind:value={address} placeholder="Business Address" required />
	</div>

	<!-- Plus Code Input -->
	<div>
		<label for="plusCode">Plus Code:(For navigation on google maps)</label>
		<input id="plusCode" type="text" bind:value={plusCode} placeholder="Plus Code" />
	</div>

	<!-- Phone Number Input -->
	<div>
		<label for="phoneNumber">Phone Number:</label>
		<input
			id="phoneNumber"
			type="text"
			bind:value={phoneNumber}
			placeholder="Phone Number"
			onblur={validatePhoneNumber}
			required
		/>
		{#if errors.phoneNumber}
			<p class="error">{errors.phoneNumber}</p>
		{/if}
	</div>

	<!-- WhatsApp Number Input -->
	<div>
		<label for="whatsappNumber">WhatsApp Number:</label>
		<input
			id="whatsappNumber"
			type="text"
			bind:value={whatsappNumber}
			placeholder="eg +12025551234"
			onblur={validateWhatsappNumber}
		/>
		{#if errors.whatsappNumber}
			<p class="error">{errors.whatsappNumber}</p>
		{/if}
	</div>

	<!-- Email Input -->
	<div>
		<label for="email">Business Email:(Will be displayed on the business profile page)</label>
		<input id="email" type="email" bind:value={email} placeholder="Email Address" required />
	</div>

	<!-- Login_email Input -->
	<div>
		<label for="login_email">Login Email: (You will receive login instructions here)</label>
		<input
			id="login_email"
			type="email"
			bind:value={login_email}
			placeholder="Email Address"
			required
		/>
	</div>

	<!-- Website Input -->
	<div>
		<label for="website">Website:</label>
		<input id="website" type="text" bind:value={website} placeholder="Business Website" />
	</div>

	<!-- State Dropdown -->
	<div>
		<label for="state">State:</label>
		<select id="state" bind:value={state} required>
			<option value="">Select a state</option>
			{#each states as state}
				<option value={state}>{state}</option>
			{/each}
		</select>
	</div>

	<!-- County Dropdown -->
	<div>
		<label for="county">County:</label>
		<select id="county" bind:value={county} required disabled={!state || isCountyLoading}>
			<option value="">Select a county</option>
			{#if isCountyLoading}
				<option value="" disabled>Loading counties...</option>
			{/if}
			{#each counties as countyOption}
				<option value={countyOption}>{countyOption}</option>
			{/each}
		</select>
	</div>

	<!-- City Dropdown -->
	<div>
		<label for="city">City:</label>
		<select id="city" bind:value={city} required disabled={!county || isCityLoading}>
			<option value="">Select a city</option>
			{#if isCityLoading}
				<option value="" disabled>Loading cities...</option>
			{/if}
			{#each cities as cityOption}
				<option value={cityOption}>{cityOption}</option>
			{/each}
		</select>
	</div>

	<!-- Submit Button -->
	<button type="submit" disabled={!isFormValid()}
		>{isSubmitting ? 'Submitting...' : 'Submit'}</button
	>

	<p class="submission-note">
		You will be redirected after submission. Ensure the next page confirms your submission.
	</p>
	<p>
		In case of any issue, mail it to <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a
		>
	</p>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 600px;
		margin: auto;
	}

	div {
		margin-bottom: 1em;
	}

	label {
		display: block;
		margin-bottom: 0.5em;
		font-weight: bold;
		text-align: left;
	}

	input,
	select {
		width: 100%;
		padding: 0.5em;
		font-size: 1rem;
		margin-bottom: 0.5em;
	}

	button {
		padding: 0.75em;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #45a049;
	}

	/* Disabled Submit Button */
	button:disabled {
		background-color: #ccc; /* Gray when disabled */
		color: #666; /* Light gray text */
		cursor: not-allowed; /* Indicate it's inactive */
	}

	.error {
		color: red;
		font-size: 0.9rem;
		margin-top: -0.5em;
		margin-bottom: 1em;
	}

	p {
		margin-top: 1em;
	}

	h1 {
		margin-bottom: 1em;
	}
</style>
