<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';

	let newPassword = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	let passwordIndicator = $state<any>(null);
	let isLinkInvalid = $state(false);

	let business_slug = $derived($page.params.business_slug);
	let token = $derived($page.params.token);

	// Check if password meets all requirements
	let isPasswordValid = $derived(passwordIndicator?.allRequirementsMet ?? false);

	async function handleSubmit(event) {
		event.preventDefault();

		// Clear any existing error messages
		errorMessage = '';

		if (!isPasswordValid) {
			errorMessage = 'Please meet all password requirements';
			return;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch(`/in/api/resetPassword`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ business_slug, token, newPassword })
			});

			const result = await response.json();

			if (response.ok && result.success) {
				toast.success('Password has been reset successfully');
				goto(`/in/login`);
			} else {
				errorMessage = result.error || 'Failed to reset password. Please try again.';

				// Check if link is invalid, expired, or already used
				if (
					errorMessage.includes('Invalid or expired') ||
					errorMessage.includes('already been used')
				) {
					isLinkInvalid = true;
				}
			}
		} catch (error) {
			errorMessage = 'Error resetting password. Please try again later.';
			console.error(error);
		} finally {
			isLoading = false;
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

<main
	class="flex flex-col items-center justify-center min-h-screen p-12 md:p-6 bg-background text-foreground transition-colors duration-300"
>
	<h1 class="text-3xl md:text-2xl font-semibold mb-8 text-center">Reset Your Password</h1>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit(e);
		}}
		class="w-full max-w-[500px] bg-card p-8 md:p-6 rounded-lg border border-border shadow-md transition-colors"
	>
		<div class="mb-4 text-left">
			<Label for="new-password" class="block mb-2 font-bold">New Password</Label>
			<Input id="new-password" type="password" bind:value={newPassword} required />
			{#if newPassword}
				<PasswordStrengthIndicator bind:this={passwordIndicator} password={newPassword} />
			{/if}
		</div>

		<div class="mb-6 text-left">
			<Label for="confirm-password" class="block mb-2 font-bold">Confirm Password</Label>
			<Input id="confirm-password" type="password" bind:value={confirmPassword} required />
		</div>

		{#if errorMessage}
			<div class="error-container mb-4">
				<p class="text-destructive text-sm mb-2">{errorMessage}</p>
				{#if isLinkInvalid}
					<div class="help-text text-sm p-3 rounded-md bg-muted border border-border">
						<p class="mb-2">Please contact us to request a new password reset link:</p>
						<a
							href="mailto:admin@solarvipani.com"
							class="text-primary hover:underline font-semibold"
						>
							admin@solarvipani.com
						</a>
					</div>
				{/if}
			</div>
		{/if}

		<Button type="submit" disabled={isLoading || !isPasswordValid || !confirmPassword || isLinkInvalid} class="w-full mt-4">
			{isLoading ? 'Resetting...' : 'Reset Password'}
		</Button>
	</form>
</main>
