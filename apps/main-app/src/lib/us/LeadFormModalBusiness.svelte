<script>
	import { createEventDispatcher } from 'svelte';

	let { businessName = '', businessSlug = '' } = $props();

	const dispatch = createEventDispatcher();

	let name = '';
	let phone = '';
	let zipCode = '';
	let type = '';
	let comment = '';
	let email = '';
	let urlParam = '';

	let isSubmitting = false;
	let submitSuccess = false;
	let submitMessage = '';

	let errors = {
		name: '',
		phone: '',
		zipCode: '',
		type: '',
		email: '',
		comment: ''
	};

	// ✅ **Set the urlParam dynamically based on the businessSlug**
	$effect(() => {
		urlParam = `/solar-panel-installer/${businessSlug}`;
	});

	function validatePhoneNumber() {
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			return false;
		} else {
			errors.phone = '';
			return true;
		}
	}

	function validateEmail() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Invalid email address';
			return false;
		} else {
			errors.email = '';
			return true;
		}
	}

	function validateZipCode() {
		if (!/^\d{5}$/.test(zipCode)) {
			errors.zipCode = 'Zip code must be exactly 5 digits';
			return false;
		} else {
			errors.zipCode = '';
			return true;
		}
	}

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

	function resetForm() {
		name = '';
		phone = '';
		zipCode = '';
		type = '';
		comment = '';
		email = '';
		errors = { name: '', phone: '', zipCode: '', type: '', email: '', comment: '' };
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;
			submitSuccess = false;
			submitMessage = '';

			try {
				const response = await fetch('/us/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						phone,
						zipCode,
						type,
						comment,
						email,
						urlParam,
						businessName
					})
				});

				const result = await response.json();

				if (result.success) {
					submitSuccess = true;
					submitMessage = 'Lead added successfully!';
					resetForm();

					// Dispatch event to parent component
					dispatch('leadAdded', {
						name,
						phone,
						zipCode,
						type,
						comment,
						email
					});
				} else {
					submitMessage = 'Failed to add lead. Please try again.';
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				submitMessage = 'An error occurred. Please try again.';
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false;
			}
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<!-- Success/Error Message -->
	{#if submitMessage}
		<div class="message {submitSuccess ? 'success' : 'error'}">
			{submitMessage}
		</div>
	{/if}

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
		{#if isSubmitting}Adding Lead...{/if}
		{#if !isSubmitting}Add Lead{/if}
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
	h2 {
		margin-bottom: 1em;
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

	.message {
		padding: 0.75em;
		margin-bottom: 1em;
		border-radius: 4px;
		text-align: center;
		font-weight: bold;
	}

	.message.success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}
</style>
