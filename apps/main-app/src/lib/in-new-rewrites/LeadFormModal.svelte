<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { validateLeadForm } from '$lib/constants/formValidation';

	let { businessName = '', businessSlug = '' } = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');
	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	const consultationTypes = [
		'Residential - Independent Home',
		'Residential - Apartments/Housing societies',
		'Business/Commercial'
	];

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const { isValid, errors: newErrors } = validateLeadForm(
			name,
			phone,
			pinCode,
			email,
			type,
			comment
		);

		errors = newErrors;

		if (isValid) {
			isSubmitting = true;

			try {
				const response = await fetch('/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						phone,
						pinCode,
						type,
						comment,
						email,
						urlParam: `/solar-panel-installer/${businessSlug}`,
						businessName
					})
				});

				const result: { success: boolean; error?: string } = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false;
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4 max-w-sm mx-auto p-4">
	<!-- Name -->
	<div class="space-y-2">
		<Label for="name">Name</Label>
		<Input id="name" type="text" bind:value={name} placeholder="Enter your name" />
		{#if errors.name}
			<p class="text-sm text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Phone Number -->
	<div class="space-y-2">
		<Label for="phone">Phone Number</Label>
		<Input
			id="phone"
			type="text"
			bind:value={phone}
			placeholder="Enter your phone number"
		/>
		{#if errors.phone}
			<p class="text-sm text-destructive">{errors.phone}</p>
		{/if}
	</div>

	<!-- Pin Code -->
	<div class="space-y-2">
		<Label for="pincode">Pin Code</Label>
		<Input
			id="pincode"
			type="text"
			bind:value={pinCode}
			placeholder="Enter your 6-digit pin code"
		/>
		{#if errors.pinCode}
			<p class="text-sm text-destructive">{errors.pinCode}</p>
		{/if}
	</div>

	<!-- Email -->
	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" bind:value={email} placeholder="Enter your email" />
		{#if errors.email}
			<p class="text-sm text-destructive">{errors.email}</p>
		{/if}
	</div>

	<!-- Type of Consultation -->
	<div class="space-y-2">
		<Label for="type">Type of Consultation</Label>
		<Select.Root type="single" bind:value={type}>
			<Select.Trigger id="type">
				{type || 'Select type of consultation'}
			</Select.Trigger>
			<Select.Content>
				{#each consultationTypes as consultType}
					<Select.Item value={consultType}>
						{consultType}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		{#if errors.type}
			<p class="text-sm text-destructive">{errors.type}</p>
		{/if}
	</div>

	<!-- Comment -->
	<div class="space-y-2">
		<Label for="comment">Comment</Label>
		<Textarea
			id="comment"
			bind:value={comment}
			placeholder="Tell us more about your requirement"
			class="resize-none"
		/>
		{#if errors.comment}
			<p class="text-sm text-destructive">{errors.comment}</p>
		{/if}
	</div>

	<!-- Submit Button -->
	<Button type="submit" disabled={isSubmitting} class="w-full">
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</Button>
</form>
