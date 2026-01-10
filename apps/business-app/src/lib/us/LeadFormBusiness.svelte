<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let name = $state('');
	let phone = $state('');
	let zipCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');

	let isSubmitting = $state(false);

	let errors = $state({
		name: '',
		phone: '',
		zipCode: '',
		type: '',
		email: '',
		comment: ''
	});

	// ✅ Set the URL dynamically based on the current page
	let urlParam = $derived($page.url.pathname);

	// ✅ Phone Number Validation (10-16 digits with optional + prefix)
	function validatePhoneNumber() {
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			return false;
		} else {
			errors.phone = '';
			return true;
		}
	}

	// ✅ Email Validation (Standard Format)
	function validateEmail() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Invalid email address';
			return false;
		} else {
			errors.email = '';
			return true;
		}
	}

	// ✅ Zip Code Validation (5 or 9 digits)
	function validateZipCode() {
		if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
			errors.zipCode = 'Zip code must be 5 digits (e.g., 12345) or 9 digits (e.g., 12345-6789)';
			return false;
		} else {
			errors.zipCode = '';
			return true;
		}
	}

	// ✅ Form Validation
	function validateForm() {
		errors = { name: '', phone: '', zipCode: '', type: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validateZipCode()) isValid = false;
		if (type.trim() === '') {
			errors.type = 'Type is required';
			isValid = false;
		}
		if (!validateEmail()) isValid = false;
		if (comment.trim() === '') {
			errors.comment = 'Comment is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;

			try {
				const response = await fetch('/api/us/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, phone, zipCode, type, comment, email, urlParam })
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
				isSubmitting = false;
			}
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<!-- Name Input -->
	<div>
		<label for="name">Name:</label>
		<input id="name" type="text" bind:value={name} required />
		{#if errors.name}
			<p class="error">{errors.name}</p>
		{/if}
	</div>

	<!-- Phone Number Input -->
	<div>
		<label for="phone">Phone Number:</label>
		<input id="phone" type="text" bind:value={phone} required on:blur={validatePhoneNumber} />
		{#if errors.phone}
			<p class="error">{errors.phone}</p>
		{/if}
	</div>

	<!-- Zip Code Input -->
	<div>
		<label for="zipCode">Zip Code:</label>
		<input id="zipCode" type="text" bind:value={zipCode} required on:blur={validateZipCode} />
		{#if errors.zipCode}
			<p class="error">{errors.zipCode}</p>
		{/if}
	</div>

	<!-- Email Input -->
	<div>
		<label for="email">Email:</label>
		<input id="email" type="email" bind:value={email} required on:blur={validateEmail} />
		{#if errors.email}
			<p class="error">{errors.email}</p>
		{/if}
	</div>

	<!-- Type Input -->
	<div>
		<label for="type">Type of Consultation:</label>
		<select id="type" bind:value={type} required>
			<option value="" disabled selected>Select type of consultation</option>
			<option value="Bungalow with terrace">Bungalow with terrace</option>
			<option value="Common area requirement for Apartments/Housing societies"
				>Common area requirement for Apartments/Housing societies</option
			>
			<option value="Business/Commercial">Business/Commercial</option>
		</select>
		{#if errors.type}
			<p class="error">{errors.type}</p>
		{/if}
	</div>

	<!-- Comment Input -->
	<div>
		<label for="comment">Comment :</label>
		<textarea
			id="comment"
			bind:value={comment}
			placeholder="Tell us more about your requirement"
			required
		></textarea>
		{#if errors.comment}
			<p class="error">{errors.comment}</p>
		{/if}
	</div>

	<!-- Submit Button -->
	<button type="submit" disabled={isSubmitting}>
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
		padding-top: 1em;
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
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}
</style>
