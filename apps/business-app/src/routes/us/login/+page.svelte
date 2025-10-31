<script>
	import { isDarkMode } from '$lib/us/themeStore'; // Import dark mode state
	import { enhance } from '$app/forms';
	
	export let form = null;

	$: darkMode = $isDarkMode; // Watch for changes in dark mode state
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Business Login</h1>
	<form method="POST" use:enhance>
		<label for="email">Email:</label>
		<input type="email" id="email" name="email" required />

		<label for="password">Password:</label>
		<input type="password" id="password" name="password" required />

		{#if form?.errors?.message}
			<p>{form.errors.message}</p>
		{/if}

		<button type="submit">Login</button>
	</form>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--error-color: #d9534f;
		--error-color-dark: #ff6f6f;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--light-form-bg: #fff;
		--dark-form-bg: #333;
		--border-light: #ddd;
		--border-dark: #444;
	}

	/* Ensure the entire page has the correct background color */
	:global(body) {
		margin: 0;
		padding: 0;
	}

	/* Main page layout */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		min-height: 100vh; /* Ensure main fills at least the viewport height */
		width: 100%;
		box-sizing: border-box;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Form layout and input styling */
	form {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		width: 300px;
		transition: background-color 0.3s ease;
	}

	/* Light mode form */
	.light form {
		background-color: var(--light-form-bg);
	}

	/* Dark mode form */
	.dark form {
		background-color: var(--dark-form-bg);
	}

	label {
		font-size: 1rem;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input {
		font-size: 1rem;
		padding: 0.8rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		font-family: var(--font-family);
		border: 1px solid var(--border-light);
		transition:
			border 0.2s,
			background-color 0.3s ease;
	}

	input:focus {
		border: 1px solid var(--accent-color);
		outline: none;
	}

	/* Button styling */
	button {
		font-size: 1rem;
		padding: 0.8rem;
		background-color: var(--accent-color);
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: darken(var(--accent-color), 10%);
	}

	/* Error message styling */
	p {
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.light p {
		color: var(--error-color);
	}

	.dark p {
		color: var(--error-color-dark);
	}

	/* Heading styling */
	h1 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
	}

	.light h1 {
		color: var(--light-primary-text-color);
	}

	.dark h1 {
		color: var(--dark-primary-text-color);
	}
</style>