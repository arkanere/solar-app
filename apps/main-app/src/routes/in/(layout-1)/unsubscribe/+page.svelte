<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let email = $state('');
	let isConfirming = $state(true);
	let isLoading = $state(false);
	let isSuccess = $state(false);
	let errorMessage = $state('');

	// Derive page URL for reactive access
	const pageUrl = $derived($page.url);

	onMount(() => {
		// Get email from URL query parameter
		const params = new URLSearchParams(pageUrl.search);
		email = params.get('unsubscribe') || '';
	});

	async function handleConfirm() {
		if (!email) {
			errorMessage = 'No email address found';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/in/unsubscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const result = await response.json();

			if (result.success) {
				isConfirming = false;
				isSuccess = true;
			} else {
				errorMessage = result.error || 'Failed to unsubscribe';
			}
		} catch (error) {
			errorMessage = 'An error occurred. Please try again.';
			console.error('Unsubscribe error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="unsubscribe-container">
	<div class="unsubscribe-card">
		{#if isConfirming}
			<h1>Confirm Unsubscription</h1>

			<p>
				Please confirm that you want to unsubscribe<br />
				<strong>{email}</strong> from our email list.
			</p>

			{#if errorMessage}
				<div class="error-message">{errorMessage}</div>
			{/if}

			<div class="button-group">
				<button class="confirm-button" onclick={handleConfirm} disabled={isLoading || !email}>
					{isLoading ? 'Processing...' : 'Confirm Unsubscription'}
				</button>
			</div>
		{:else if isSuccess}
			<div class="check-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
			</div>

			<h1>Unsubscription was successful!</h1>

			<p>
				We have informed the sender of this email that<br />
				you don't want to receive more email from<br />
				them.
			</p>
		{/if}
	</div>
</div>

<style>
	.unsubscribe-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: hsl(var(--background));
		padding: 1rem;
	}

	.unsubscribe-card {
		background: hsl(var(--card));
		border-radius: 12px;
		box-shadow: var(--shadow-md);
		padding: 3rem 2rem;
		text-align: center;
		max-width: 450px;
		width: 100%;
	}

	.check-circle {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		color: hsl(var(--success));
	}

	h1 {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		color: var(--color-text-primary);
	}

	p {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.button-group {
		margin-top: 2rem;
	}

	.confirm-button {
		background-color: hsl(var(--success));
		color: hsl(var(--success-foreground));
		border: none;
		border-radius: 6px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.confirm-button:hover {
		background-color: hsl(var(--success) / 0.85);
	}

	.confirm-button:disabled {
		background-color: hsl(var(--muted));
		cursor: not-allowed;
	}

	.error-message {
		color: hsl(var(--destructive-foreground));
		margin: 1rem 0;
		padding: 0.5rem;
		background-color: hsl(var(--destructive-muted));
		border-radius: 4px;
	}
</style>
