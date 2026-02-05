<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'; // Import the page store to access the URL

	let name = $state('');
	let phone = $state('');
	let message = $state('');
	let pincode = $state(''); // New pincode variable
	let isSubmitting = $state(false); // Track the submission state
	let urlParam = $state('');

	let errors = $state({
		name: '',
		phone: '',
		message: '',
		pincode: '' // New pincode error
	});

	// Get the path from the current page's URL
	$effect(() => {
		urlParam = $page.url.pathname; // Capture the current path (e.g., '/about-us')
	});

	function validateForm() {
		// Reset errors before validation
		errors = {
			name: '',
			phone: '',
			message: '',
			pincode: '' // Reset pincode error
		};

		let isValid = true;

		// Validation for Name
		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}

		// Validation for Phone Number
		if (!/^\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits';
			isValid = false;
		}

		// Validation for Message
		if (message.trim() === '') {
			errors.message = 'Message is required';
			isValid = false;
		}

		// Validation for Pincode
		if (!/^\d{6}$/.test(pincode)) {
			errors.pincode = 'Pincode must be a 6-digit number';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true; // Disable the submit button
			try {
				const response = await fetch('/us/api/submitQuery', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, message, pincode, urlParam }) // Include pincode in the request body
				});

				const result = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
					isSubmitting = false; // Re-enable the submit button if submission failed
				}
			} catch (error) {
				console.error('Error submitting form:', error);
				isSubmitting = false; // Re-enable the submit button in case of error
			}
		}
	}
</script>

<form onsubmit={handleSubmit}>
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

	<!-- Pincode Input -->
	<div>
		<label for="pincode">Pincode:</label>
		<input id="pincode" type="text" bind:value={pincode} placeholder="6-digit Pincode" />
		{#if errors.pincode}
			<p class="error">{errors.pincode}</p>
		{/if}
	</div>

	<!-- Message Input -->
	<div>
		<label for="message">Message:</label>
		<textarea id="message" bind:value={message} placeholder="Your requirement"></textarea>
		{#if errors.message}
			<p class="error">{errors.message}</p>
		{/if}
	</div>

	<!-- Submit Button -->
	<button type="submit" disabled={isSubmitting}>
		{#if isSubmitting}
			<span>Submitting...</span>
		{:else}
			<span>Submit</span>
		{/if}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 450px;
		margin: auto;
		padding-bottom: 1em;
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
		background-color: #999;
		cursor: not-allowed;
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}
</style>
