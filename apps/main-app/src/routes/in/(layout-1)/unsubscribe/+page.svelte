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

<div class="flex items-center justify-center min-h-screen bg-background p-4">
	<div class="w-full max-w-[450px] bg-card rounded-lg shadow-md px-8 py-12 text-center">
		{#if isConfirming}
			<h1 class="text-3xl mb-6 text-primary">Confirm Unsubscription</h1>

			<p class="text-base leading-6 text-secondary mb-6">
				Please confirm that you want to unsubscribe<br />
				<strong>{email}</strong> from our email list.
			</p>

			{#if errorMessage}
				<div class="bg-destructive-muted text-destructive-foreground my-4 p-2 rounded-sm">
					{errorMessage}
				</div>
			{/if}

			<div class="mt-8">
				<button
					class="bg-success text-success-foreground px-6 py-3 rounded-sm cursor-pointer transition-colors hover:bg-success/85 disabled:bg-muted disabled:cursor-not-allowed"
					onclick={handleConfirm}
					disabled={isLoading || !email}
				>
					{isLoading ? 'Processing...' : 'Confirm Unsubscription'}
				</button>
			</div>
		{:else if isSuccess}
			<div class="w-20 h-20 mx-auto mb-6 text-success">
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

			<h1 class="text-3xl mb-6 text-primary">Unsubscription was successful!</h1>

			<p class="text-base leading-6 text-secondary mb-6">
				We have informed the sender of this email that<br />
				you don't want to receive more email from<br />
				them.
			</p>
		{/if}
	</div>
</div>
