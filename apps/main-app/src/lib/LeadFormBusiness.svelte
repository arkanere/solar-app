<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let comment = $state('');
	let email = $state('');
	let urlParam = $state('');
	let isSubmitting = $state(false);

	const commentPlaceholder: string = `Tell us about your requirement.
Eg. I want 3kW system for my Home or I want to install solar at my factory`;

	let errors = $state<Record<string, string>>({
		name: '',
		phone: '',
		pinCode: '',
		email: '',
		comment: ''
	});

	let pageData = $derived($page);

	$effect(() => {
		urlParam = pageData.url.pathname;
	});

	function validatePhoneNumber(): boolean {
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			return false;
		} else {
			errors.phone = '';
			return true;
		}
	}

	function validateEmail(): boolean {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Invalid email address';
			return false;
		} else {
			errors.email = '';
			return true;
		}
	}

	function validatePinCode(): boolean {
		if (!/^\d{6}$/.test(pinCode)) {
			errors.pinCode = 'Pin code must be exactly 6 digits';
			return false;
		} else {
			errors.pinCode = '';
			return true;
		}
	}

	function validateForm(): boolean {
		errors = { name: '', phone: '', pinCode: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validatePinCode()) isValid = false;
		if (!validateEmail()) isValid = false;
		if (comment.trim() === '') {
			errors.comment = 'Comment is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;

			try {
				const response = await fetch('/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, phone, pinCode, comment, email, urlParam })
				});

				const result: { success: boolean; reference_uuid?: string; error?: string } = await response.json();

				if (result.success) {
					goto(`/thank-you?ref=${result.reference_uuid}`);
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

<form onsubmit={handleSubmit}>
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
		<input id="phone" type="text" bind:value={phone} required onblur={validatePhoneNumber} />
		{#if errors.phone}
			<p class="error">{errors.phone}</p>
		{/if}
	</div>

	<!-- Pin Code Input -->
	<div>
		<label for="pinCode">Pin Code:</label>
		<input id="pinCode" type="text" bind:value={pinCode} required onblur={validatePinCode} />
		{#if errors.pinCode}
			<p class="error">{errors.pinCode}</p>
		{/if}
	</div>

	<!-- Email Input -->
	<div>
		<label for="email">Email:</label>
		<input id="email" type="email" bind:value={email} required onblur={validateEmail} />
		{#if errors.email}
			<p class="error">{errors.email}</p>
		{/if}
	</div>


	<!-- Comment Input -->
	<div>
		<label for="comment">Comment :</label>
		<textarea
			id="comment"
			bind:value={comment}
			placeholder={commentPlaceholder}
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
	textarea {
		width: 100%;
		padding: 0.5em;
		font-size: 1rem;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	textarea {
		height: 7.5em; /* 1.5x the default height */
		resize: vertical;
	}

	button {
		padding: 0.75em;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 4px;
		width: 100%;
		box-sizing: border-box;
	}

	button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}

	/* Mobile responsive adjustments */
	@media (max-width: 768px) {
		form {
			max-width: 100%;
			padding: 0;
		}

		input,
		textarea {
			font-size: 16px; /* Prevents zoom on iOS */
		}
	}

	@media (max-width: 576px) {
		div {
			margin-bottom: 0.75em;
		}

		input,
		textarea {
			padding: 0.6em 0.5em;
		}

		button {
			padding: 0.8em;
			font-size: 1rem;
		}
	}
</style>
