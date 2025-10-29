<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { isDarkMode } from '$lib/us/themeStore'; // Import dark mode state from your store

	let newPassword = '';
	let confirmPassword = '';
	let errorMessage = '';
	let isLoading = false; // Loading state to lock the button

	let business_slug = $page.params.business_slug;
	let token = $page.params.token;

	// Initialize dark mode state
	let darkMode;
	$: darkMode = $isDarkMode;

	async function handleSubmit(event) {
		event.preventDefault();

		// Clear any existing error messages
		errorMessage = '';

		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		isLoading = true; // Lock the button and change its color

		try {
			const response = await fetch(`/us/api/resetPassword`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ business_slug, token, newPassword })
			});

			const result = await response.json();

			if (response.ok && result.success) {
				alert('Password has been reset successfully');
				goto(`/us/login`); // Redirect after successful reset
			} else {
				errorMessage = result.error || 'Failed to reset password. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Error resetting password. Please try again later.';
			console.error(error);
		} finally {
			isLoading = false; // Unlock the button after the process is complete
		}
	}
</script>

<svelte:head>
	<title>Reset Password | Solar Vipani</title>
	<meta
		name="description"
		content="Reset your password to access your Solar Vipani business account."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Reset Your Password</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="new-password">New Password</label>
			<input id="new-password" type="password" bind:value={newPassword} required />
		</div>

		<div class="form-group">
			<label for="confirm-password">Confirm Password</label>
			<input id="confirm-password" type="password" bind:value={confirmPassword} required />
		</div>

		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}

		<button type="submit" disabled={isLoading} class:is-loading={isLoading}>
			{#if isLoading}
				Resetting...
			{/if}
			{#if !isLoading}
				Reset Password
			{/if}
		</button>
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
		--disabled-button-color: #ccc; /* Grey color for disabled buttons */
		--disabled-button-bg: #e0e0e0; /* Grey background for disabled buttons */
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
		min-height: 100vh; /* Ensure the content fills the viewport height */
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
		max-width: 500px;
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

	input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: var(--font-family);
	}

	.dark input {
		background-color: #2a2a2a;
		color: var(--dark-primary-text-color);
		border: 1px solid #555;
	}

	input::placeholder {
		color: #aaa;
	}

	.dark input::placeholder {
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

	.is-loading {
		background-color: var(--disabled-button-bg);
		cursor: not-allowed;
	}

	button:disabled {
		background-color: var(--disabled-button-bg);
		color: var(--disabled-button-color);
		cursor: not-allowed;
	}

	.error-message {
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
</style>
