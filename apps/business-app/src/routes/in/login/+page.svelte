<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { form = null } = $props();
</script>

<main class="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-background text-foreground transition-colors duration-300">
	<h1 class="text-2xl font-semibold mb-4 text-foreground">Business Login</h1>

	<form
		method="POST"
		use:enhance
		class="flex flex-col w-[300px] p-8 bg-card text-card-foreground rounded-lg border border-border shadow-md transition-colors duration-300"
	>
		<Label for="email" class="mb-2 font-medium">Email:</Label>
		<Input
			type="email"
			id="email"
			name="email"
			required
			class="mb-6"
		/>

		<Label for="password" class="mb-2 font-medium">Password:</Label>
		<Input
			type="password"
			id="password"
			name="password"
			required
			class="mb-6"
		/>

		{#if form?.errors?.message}
			<p class="text-destructive text-sm mb-4">{form.errors.message}</p>
		{/if}

		<Button type="submit">Login</Button>
	</form>
</main>
