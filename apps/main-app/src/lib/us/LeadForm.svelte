<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'; // Import the page store to access the URL

	let name = '';
	let phone = '';
	let zipCode = '';
	let type = '';
	let comment = '';
	let consent = false;
	let urlParam = ''; // New variable to capture the path from the URL

	let errors = {
		name: '',
		phone: '',
		zipCode: '',
		type: ''
	};

	// State to track form submission
	let isSubmitting = false;

	// Get the path from the current page's URL
	$effect(() => {
		urlParam = $page.url.pathname; // Capture the current path (e.g., '/about-us')
	});

	function validateForm() {
		errors = {
			name: '',
			phone: '',
			zipCode: '',
			type: ''
		};

		let isValid = true;

		// Validation for Name
		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}

		// Validation for Phone Number - Updated to allow '+' at the beginning
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			isValid = false;
		}

		if (!/^\d{5}$/.test(zipCode)) {
			errors.zipCode = 'Zip code must be exactly 5 digits';
			isValid = false;
		}

		// Validation for Type
		if (type.trim() === '') {
			errors.type = 'Type is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validateForm() && consent) {
			isSubmitting = true; // Lock the button before submission

			try {
				const response = await fetch('/us/api/submitLead', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, zipCode, type, comment, urlParam, marketing_consent: consent })
				});

				const result = await response.json();

				if (result.success) {
					goto('/us/thank-you');
				} else {
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false; // Unlock the button after submission
			}
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<h2>Book Free Consultation To Get A Quote</h2>

	<!-- Name Input -->
	<div>
		<label for="name">Name:</label>
		<input id="name" type="text" bind:value={name} placeholder="Your Name" />
		{#if errors.name}
			<p class="error">{errors.name}</p>
		{/if}
	</div>

	<!-- Phone Number Input -->
	<div>
		<label for="phone">Phone Number:</label>
		<input id="phone" type="text" bind:value={phone} placeholder="Phone Number" />
		{#if errors.phone}
			<p class="error">{errors.phone}</p>
		{/if}
	</div>

	<!-- Zip Code Input -->
	<div>
		<label for="zipCode">Zip Code:</label>
		<input id="zipCode" type="text" bind:value={zipCode} placeholder="Zip Code" />
		{#if errors.zipCode}
			<p class="error">{errors.zipCode}</p>
		{/if}
	</div>

	<!-- Type Input -->
	<div>
		<label for="type">Type of Consultation:</label>
		<select id="type" bind:value={type}>
			<option value="" disabled selected>Select type of consultation</option>
			<option value="Residential - Independent Home">Residential - Independent Home</option>
			<option value="Residential - Apartments/Housing societies"
				>Residential - Apartments/Housing societies</option
			>
			<option value="Business/Commercial">Business/Commercial</option>
		</select>
		{#if errors.type}
			<p class="error">{errors.type}</p>
		{/if}
	</div>

	<!-- Comment Input (Optional) -->
	<div>
		<label for="comment">Comment (Optional):</label>
		<textarea id="comment" bind:value={comment} placeholder="Any additional comments"></textarea>
	</div>

	<!-- Consent Checkbox -->
	<div class="consent">
		<label>
			<input type="checkbox" bind:checked={consent} />
			I consent to Solar Vipani sharing my contact details with solar installers
			in my area to follow up on my inquiry.
		</label>
	</div>

	<!-- Submit Button -->
	<button type="submit" disabled={isSubmitting || !consent}>
		{#if isSubmitting}Submitting...{/if}
		{#if !isSubmitting}Submit{/if}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 400px;
		margin: auto;
	}

	div {
		margin-bottom: 1em;
	}

	h2 {
		font-size: 1.3rem;
		margin-bottom: 1em;
	}

	label {
		display: block;
		margin-bottom: 0.5em;
		font-weight: bold;
		text-align: left;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.5em;
		font-size: 1rem;
	}

	button {
		padding: 0.75em;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:disabled {
		background-color: #9ca3af; /* Grey background when button is disabled */
		cursor: not-allowed; /* Show not-allowed cursor when disabled */
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}

	.consent label {
		display: flex;
		align-items: flex-start;
		gap: 0.5em;
		font-weight: normal;
		font-size: 0.9rem;
		text-align: left;
		cursor: pointer;
	}

	.consent input {
		width: auto;
		margin-top: 0.2em;
		flex-shrink: 0;
	}
</style>
