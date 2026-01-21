<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
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

<form onsubmit={handleSubmit} style="display: flex; flex-direction: column; max-width: 448px; margin-left: auto; margin-right: auto; gap: var(--form-field-gap); padding-bottom: var(--form-field-gap);">
	<!-- Name Input -->
	<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
		<Label for="name">Name</Label>
		<Input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Your Name"
			class={errors.name ? 'border-destructive' : ''}
		/>
		{#if errors.name}
			<Alert.Root variant="destructive">
				<Alert.Description>{errors.name}</Alert.Description>
			</Alert.Root>
		{/if}
	</div>

	<!-- Phone Number Input -->
	<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
		<Label for="phone">Phone Number</Label>
		<Input
			id="phone"
			type="text"
			bind:value={phone}
			placeholder="Phone Number"
			class={errors.phone ? 'border-destructive' : ''}
		/>
		{#if errors.phone}
			<Alert.Root variant="destructive">
				<Alert.Description>{errors.phone}</Alert.Description>
			</Alert.Root>
		{/if}
	</div>

	<!-- Pincode Input -->
	<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
		<Label for="pincode">Pincode</Label>
		<Input
			id="pincode"
			type="text"
			bind:value={pincode}
			placeholder="6-digit Pincode"
			class={errors.pincode ? 'border-destructive' : ''}
		/>
		{#if errors.pincode}
			<Alert.Root variant="destructive">
				<Alert.Description>{errors.pincode}</Alert.Description>
			</Alert.Root>
		{/if}
	</div>

	<!-- Message Input -->
	<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
		<Label for="message">Message</Label>
		<Textarea
			id="message"
			bind:value={message}
			placeholder="Your requirement"
			class={errors.message ? 'border-destructive' : ''}
		/>
		{#if errors.message}
			<Alert.Root variant="destructive">
				<Alert.Description>{errors.message}</Alert.Description>
			</Alert.Root>
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
