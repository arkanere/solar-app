<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let email = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	// The endpoint answers identically whether or not the address is
	// registered, so the page must not imply an account was found.
	let sentMessage = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		sentMessage = '';
		isLoading = true;

		try {
			const response = await fetch('/us/api/forgotPassword', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const result = await response.json();

			if (response.ok && result.success) {
				sentMessage = result.message;
			} else {
				errorMessage = result.error || 'Something went wrong. Please try again.';
			}
		} catch {
			errorMessage = 'Something went wrong. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Your Password - Solar Vipani</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	class="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-background text-foreground transition-colors duration-300"
>
	<h1 class="text-2xl font-semibold mb-4 text-foreground">Reset Your Password</h1>

	<form
		onsubmit={handleSubmit}
		class="flex flex-col w-[300px] p-8 bg-card text-card-foreground rounded-lg border border-border shadow-md transition-colors duration-300"
	>
		{#if sentMessage}
			<p class="text-sm mb-4">{sentMessage}</p>
			<p class="text-muted-foreground text-xs mb-4">
				The link expires in one hour and can be used once.
			</p>
		{:else}
			<p class="text-muted-foreground text-sm mb-6">
				Enter the email address you log in with and we'll send you a reset link.
			</p>

			<Label for="email" class="mb-2 font-medium">Email:</Label>
			<Input type="email" id="email" name="email" bind:value={email} required class="mb-6" />

			{#if errorMessage}
				<p class="text-destructive text-sm mb-4">{errorMessage}</p>
			{/if}

			<Button type="submit" disabled={isLoading}>
				{isLoading ? 'Sending…' : 'Send reset link'}
			</Button>
		{/if}

		<a href="/us/login" class="text-sm text-center mt-4 underline">Back to login</a>
	</form>
</main>
