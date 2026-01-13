<script lang="ts">
	import { goto } from '$app/navigation';

	let { businessName = '', businessSlug = '' } = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');
	let urlParam = $state('');
	let isSubmitting = $state(false);

	let errors = $state<Record<string, string>>({
		name: '',
		phone: '',
		pinCode: '',
		type: '',
		email: '',
		comment: ''
	});

	$effect(() => {
		urlParam = `/solar-panel-installer/${businessSlug}`;
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
		errors = { name: '', phone: '', pinCode: '', type: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validatePinCode()) isValid = false;
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

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;

			try {
				const response = await fetch('/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						phone,
						pinCode,
						type,
						comment,
						email,
						urlParam,
						businessName
					})
				});

				const result: { success: boolean; error?: string } = await response.json();

				if (result.success) {
					goto('/thank-you');
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

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
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
