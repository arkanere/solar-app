<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'; // Store to access route parameters
	import { isDarkMode } from '$lib/stores/theme.svelte';

	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let message = $state('');

	let errors = $state({
		name: '',
		phone: '',
		email: '',
		message: ''
	});

	// Get the business_slug from the URL
	let business_slug = $page.params.business_slug;

	// Initialize dark mode state
	let darkMode = $derived($isDarkMode);

	function validateForm() {
		errors = {
			name: '',
			phone: '',
			email: '',
			message: ''
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

		// Validation for Email
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			errors.email = 'Valid email is required';
			isValid = false;
		}

		// Validation for Message
		if (message.trim() === '') {
			errors.message = 'Message is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validateForm()) {
			try {
				const response = await fetch('/us/api/submitClaim', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, email, message, business_slug })
				});

				const result = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			}
		}
	}
</script>

<svelte:head>
	<title>Claim Your Business | Solar Vipani</title>
	<meta
		name="description"
		content="Claim your business listing on Solar Vipani to manage your profile and connect with customers."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="benefits">
		<h1>Claim Your Business</h1>
		<h2>Benefits:</h2>
		<p>Listing is FREE</p>
		<p>Add phone number on the profile page so that customer can call directly</p>
		<p>Get 'Verified Business' tag, rank above non-tagged businesses</p>
		<p>Add Recent Projects</p>
		<p>Update business details such as phone number, email, website address when they change</p>
	</div>

	<form onsubmit={handleSubmit}>
		<!-- Name Input -->
		<div class="form-group">
			<label for="name">Name:</label>
			<input id="name" type="text" bind:value={name} placeholder="Your Name" />
			{#if errors.name}
				<p class="error">{errors.name}</p>
			{/if}
		</div>

		<!-- Phone Number Input -->
		<div class="form-group">
			<label for="phone">Phone Number:</label>
			<input id="phone" type="text" bind:value={phone} placeholder="Phone Number" />
			{#if errors.phone}
				<p class="error">{errors.phone}</p>
			{/if}
		</div>

		<!-- Login Email Input -->
		<div class="form-group">
			<label for="email">Login Email:</label>
			<input id="email" type="email" bind:value={email} placeholder="Your Login Email" />
			{#if errors.email}
				<p class="error">{errors.email}</p>
			{/if}
		</div>

		<!-- Message Input -->
		<div class="form-group">
			<label for="message">Message:</label>
			<textarea id="message" bind:value={message} placeholder="Your message here"></textarea>
			{#if errors.message}
				<p class="error">{errors.message}</p>
			{/if}
		</div>

		<!-- Submit Button -->
		<button type="submit">Submit</button>
	</form>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--accent-color: #0056b3; /* Accent color similar to your home page */
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--light-form-bg: white; /* Form background in light mode */
		--dark-form-bg: #333; /* Form background in dark mode */
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	h1 {
		font-size: 2.2rem;
		margin-bottom: 2rem;
		font-weight: 600;
		text-align: center;
	}

	form {
		width: 100%;
		max-width: 600px;
		background-color: var(--light-form-bg);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		transition: background-color 0.3s ease;
	}

	.dark form {
		background-color: var(--dark-form-bg);
	}

	.form-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: var(--font-family);
	}

	.dark input,
	.dark textarea {
		background-color: #2a2a2a;
		color: var(--dark-primary-text-color);
		border: 1px solid #555;
	}

	input::placeholder,
	textarea::placeholder {
		color: #aaa;
	}

	.dark input::placeholder,
	.dark textarea::placeholder {
		color: #777;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		font-size: 1.1rem;
		background-color: var(--accent-color);
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
		margin-top: 1rem;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #00449e; /* Darker shade of accent color */
	}

	.error {
		color: red;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	/* Responsive styling for mobile */
	@media (max-width: 768px) {
		form {
			padding: 1.5rem;
		}
	}
	.benefits {
		margin-bottom: 1rem;
	}
</style>
