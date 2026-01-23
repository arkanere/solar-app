<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Card, CardContent } from '$lib/components/ui/card';

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

<div class="flex items-center justify-center min-h-screen bg-background p-[theme(--container-padding)]">
	<Card class="w-full max-w-[theme(--max-width-sm)] text-center">
		<CardContent class="pt-[theme(--card-padding-y)] px-[theme(--card-padding-y)]">
			{#if isConfirming}
				<h1 class="text-[theme(--font-size-2xl)] font-display mb-[theme(--spacing-2xl)] text-primary">
					Confirm Unsubscription
				</h1>

				<p class="text-[theme(--font-size-base)] leading-[theme(--font-size-base--line-height)] text-secondary mb-[theme(--spacing-2xl)]">
					Please confirm that you want to unsubscribe<br />
					<strong>{email}</strong> from our email list.
				</p>

				{#if errorMessage}
					<Alert variant="destructive" class="my-[theme(--spacing-lg)]">
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				{/if}

				<div class="mt-[theme(--spacing-2xl)]">
					<Button
						variant="success"
						onclick={handleConfirm}
						disabled={isLoading || !email}
						class="w-full"
					>
						{isLoading ? 'Processing...' : 'Confirm Unsubscription'}
					</Button>
				</div>
			{:else if isSuccess}
				<div class="w-[theme(--icon-size-xl)] h-[theme(--icon-size-xl)] mx-auto mb-[theme(--spacing-2xl)] text-success flex justify-center">
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

				<h1 class="text-[theme(--font-size-2xl)] font-display mb-[theme(--spacing-2xl)] text-primary">
					Unsubscription was successful!
				</h1>

				<p class="text-[theme(--font-size-base)] leading-[theme(--font-size-base--line-height)] text-secondary mb-[theme(--spacing-2xl)]">
					We have informed the sender of this email that<br />
					you don't want to receive more email from<br />
					them.
				</p>
			{/if}
		</CardContent>
	</Card>
</div>
