<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { validateQueryForm } from '$lib/constants/formValidation';

	let name = $state('');
	let phone = $state('');
	let message = $state('');
	let pincode = $state('');
	let isSubmitting = $state(false);

	let errors = $state({
		name: '',
		phone: '',
		message: '',
		pincode: ''
	});

	let pageData = $derived($page);

	let urlParam = $derived(pageData.url.pathname);

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const validation = validateQueryForm(name, phone, message, pincode);
		errors = validation.errors;

		if (validation.isValid) {
			isSubmitting = true;
			try {
				const response = await fetch('/api/submitQuery', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, message, pincode, urlParam })
				});

				const result: { success: boolean; error?: string } = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
					isSubmitting = false;
				}
			} catch (error) {
				console.error('Error submitting form:', error);
				isSubmitting = false;
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col max-w-md mx-auto gap-4 pb-4">
	<!-- Name Input -->
	<div class="space-y-1">
		<Label for="name">Name</Label>
		<Input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Your Name"
			class={errors.name ? 'border-red-500' : ''}
		/>
		{#if errors.name}
			<p class="text-red-500 text-sm">{errors.name}</p>
		{/if}
	</div>

	<!-- Phone Number Input -->
	<div class="space-y-1">
		<Label for="phone">Phone Number</Label>
		<Input
			id="phone"
			type="text"
			bind:value={phone}
			placeholder="Phone Number"
			class={errors.phone ? 'border-red-500' : ''}
		/>
		{#if errors.phone}
			<p class="text-red-500 text-sm">{errors.phone}</p>
		{/if}
	</div>

	<!-- Pincode Input -->
	<div class="space-y-1">
		<Label for="pincode">Pincode</Label>
		<Input
			id="pincode"
			type="text"
			bind:value={pincode}
			placeholder="6-digit Pincode"
			class={errors.pincode ? 'border-red-500' : ''}
		/>
		{#if errors.pincode}
			<p class="text-red-500 text-sm">{errors.pincode}</p>
		{/if}
	</div>

	<!-- Message Input -->
	<div class="space-y-1">
		<Label for="message">Message</Label>
		<Textarea
			id="message"
			bind:value={message}
			placeholder="Your requirement"
			class={errors.message ? 'border-red-500' : ''}
		/>
		{#if errors.message}
			<p class="text-red-500 text-sm">{errors.message}</p>
		{/if}
	</div>

	<!-- Submit Button -->
	<Button type="submit" disabled={isSubmitting} class="w-full">
		{#if isSubmitting}
			<span>Submitting...</span>
		{:else}
			<span>Submit</span>
		{/if}
	</Button>
</form>
