<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let name: string = '';
	let phone: string = '';
	let message: string = '';
	let pincode: string = '';
	let isSubmitting: boolean = false;
	let urlParam: string = '';

	let errors: Record<string, string> = {
		name: '',
		phone: '',
		message: '',
		pincode: ''
	};

	$: {
		urlParam = $page.url.pathname;
	}

	function validateForm(): boolean {
		errors = {
			name: '',
			phone: '',
			message: '',
			pincode: ''
		};

		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}

		if (!/^\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits';
			isValid = false;
		}

		if (message.trim() === '') {
			errors.message = 'Message is required';
			isValid = false;
		}

		if (!/^\d{6}$/.test(pincode)) {
			errors.pincode = 'Pincode must be a 6-digit number';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;
			try {
				const response = await fetch('/api/submitQuery', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, message, pincode, urlParam })
				});

				const result: { success: boolean; error?: string } = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
					isSubmitting = false;
				}
			} catch (error) {
				console.error('Error submitting form:', error);
				isSubmitting = false;
			}
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
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
